// import db from "../../database/index";
import { failureMessages } from "../../constants/messages.js";
import db from "../../database/index.js";
const { SPIN_PRIZE, SPIN_TRANSACTION, USERS } = db;

/**
 * Get active prizes from database
 */
const getActivePrizes = async () => {
  const prizes = await SPIN_PRIZE.findAll({
    where: { is_active: true },
    order: [["segment_index", "ASC"]],
  });
  return prizes;
};

/**
 * Select prize based on probability
 */
const selectPrize = async () => {
  const prizes = await getActivePrizes();

  const random = Math.random();
  let cumulative = 0;

  for (const prize of prizes) {
    cumulative += prize.probability;
    if (random < cumulative) {
      return prize;
    }
  }
  return prizes[prizes.length - 1];
};

/**
 * Calculate rotation angle to land on specific segment
 */
const calculateRotationAngle = (segmentIndex, totalSegments) => {
  const segmentAngle = 360 / totalSegments;
  const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
  const fullRotations = Math.floor(Math.random() * 5) + 8; // 8-12 rotations
  return fullRotations * 360 + targetAngle;
};

/**
 * Process spin and update user points
 */
export const processSpin = async (userId) => {

  const spinLimitInformation = await getSpinCount(userId);

  if (spinLimitInformation.usedSpins >= spinLimitInformation.allowedSpins) {
    throw new Error(failureMessages.SPIN_LIMIT_REACHED);
  };

  const transaction = await db.sequelize.transaction();

  try {
    // Get active prizes
    const prizes = await getActivePrizes();
    if (!prizes.length) {
      throw new Error(failureMessages.NO_ACTIVE_PRIZES);
    }

    // Select prize on backend
    const selectedPrize = await selectPrize();

    // Calculate rotation angle
    const rotationAngle = calculateRotationAngle(
      selectedPrize.segment_index,
      prizes.length,
    );

    // Create transaction record (NO user points update)
    await SPIN_TRANSACTION.create(
      {
        user_id: userId,
        prize_id: selectedPrize.id,
        rotation_angle: rotationAngle,
      },
      { transaction },
    );

    await transaction.commit();

    // Calculate total points from transactions
    const pointsResult = await db.sequelize.query(
      `SELECT COALESCE(SUM(sp.value), 0) as total_points
       FROM spin_transactions st
       JOIN spin_prizes sp ON st.prize_id = sp.id
       WHERE st.user_id = :userId`,
      {
        replacements: { userId },
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    return {
      prize: {
        name: selectedPrize.name,
        value: selectedPrize.value,
        color: selectedPrize.color,
      },
      rotationAngle: rotationAngle,
      pointsBalance: pointsResult[0]?.total_points || 0,
    };
  } catch (error) {
    console.log(error, "error");
    await transaction.rollback();
    throw error;
  }
};

export const getUserPoints = async (userId) => {
  const result = await db.sequelize.query(
    `SELECT COALESCE(SUM(sp.value), 0) as total_points
     FROM spin_transactions st
     JOIN spin_prizes sp ON st.prize_id = sp.id
     WHERE st.user_id = :userId`,
    {
      replacements: { userId },
      type: db.sequelize.QueryTypes.SELECT,
    },
  );

  return {
    points: result[0]?.total_points || 0,
  };
};

export const getSpinCount = async (userId) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await db.sequelize.query(
    `SELECT COUNT(*) as count
     FROM spin_transactions
     WHERE user_id = :userId
       AND created_at >= :today`,
    {
      replacements: { 
        userId, 
        today: today.toISOString() 
      },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );
  
  return {
    allowedSpins: process.env.SPIN_COUNT,
    usedSpins: parseInt(result[0]?.count || 0, 10),
  };
};

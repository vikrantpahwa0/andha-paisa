import db from "../database/index.js";
const { SURVEY } = db;

export const getSurveys = async (req, res) => {
  try {
    const surveys = await SURVEY.findAll({
      where: { active: true },
    });

    res.json(surveys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch surveys" });
  }
};

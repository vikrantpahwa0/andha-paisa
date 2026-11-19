// import cron from "node-cron";
// import { Op } from "sequelize";
// import db from "../database/index.js";
// import { renderTemplate, buildHtml } from "./render.service.js";
// import { sendMail } from "./mailer.service.js";

// const { TEMPLATES, APPLICATIONS } = db;

// export const startFollowUpCron = () => {
//   // Every hour at minute 0
//   cron.schedule("0 * * * *", async () => {
//     console.log("⏰ Running Follow-up Cron Job...");

//     const now = new Date();
//     const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
//     const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

//     try {
//       // ---------- FOLLOW-UP 1 (Day 2) ----------
//       const dueForFU1 = await APPLICATIONS.findAll({
//         where: {
//           stop_follow_up: false,
//           follow_up_1_sent_at: null,
//           sent_at: { [Op.lte]: twoDaysAgo, [Op.not]: null },
//         },
//         include: [{ model: TEMPLATES, as: "template" }],
//       });

//       for (const app of dueForFU1) {
//         const t = app.template;
//         if (!t || !t.follow_up_1_body) continue;

//         const subject = renderTemplate(
//           t.follow_up_1_subject || "",
//           app.variables || {},
//         );
//         const body = renderTemplate(t.follow_up_1_body, app.variables || {});

//         const emails = Array.isArray(app.to_emails) ? app.to_emails : [];
//         for (const email of emails) {
//           try {
//             await sendMail({
//               to: email,
//               subject,
//               html: buildHtml(body),
//               text: body,
//             });
//           } catch (err) {
//             console.error(`Failed to send FU1 to ${email}:`, err.message);
//           }
//         }

//         await app.update({ follow_up_1_sent_at: new Date() });
//         console.log(`✅ Sent Follow-up 1 for App ID: ${app.id}`);
//       }

//       // ---------- FOLLOW-UP 2 (Day 4) ----------
//       const dueForFU2 = await APPLICATIONS.findAll({
//         where: {
//           stop_follow_up: false,
//           follow_up_1_sent_at: { [Op.not]: null },
//           follow_up_2_sent_at: null,
//           sent_at: { [Op.lte]: fourDaysAgo, [Op.not]: null },
//         },
//         include: [{ model: TEMPLATES, as: "template" }],
//       });

//       for (const app of dueForFU2) {
//         const t = app.template;
//         if (!t || !t.follow_up_2_body) continue;

//         const subject = renderTemplate(
//           t.follow_up_2_subject || "",
//           app.variables || {},
//         );
//         const body = renderTemplate(t.follow_up_2_body, app.variables || {});

//         const emails = Array.isArray(app.to_emails) ? app.to_emails : [];
//         for (const email of emails) {
//           try {
//             await sendMail({
//               to: email,
//               subject,
//               html: buildHtml(body),
//               text: body,
//             });
//           } catch (err) {
//             console.error(`Failed to send FU2 to ${email}:`, err.message);
//           }
//         }

//         await app.update({ follow_up_2_sent_at: new Date() });
//         console.log(`✅ Sent Follow-up 2 for App ID: ${app.id}`);
//       }
//     } catch (error) {
//       console.error("❌ Cron Job Error:", error);
//     }
//   });

//   console.log("🕒 Follow-up cron scheduled (hourly).");
// };

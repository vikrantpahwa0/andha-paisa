// send-email-smtp.js
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { failureMessages } from '../constants/messages';

async function sendEmail(to, subject, text, html) {
    // Create SMTP transporter with your credentials
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_HOST, // Brevo SMTP server
        port: process.env.BREVO_PORT, // SMTP port (usually 587 for TLS)
        secure: false, // TLS required
        auth: {
            user: process.env.BREVO_EMAIL,  // Your SMTP login
            pass: process.env.BREVO_SMTP_KEY  // Your SMTP key (the one ending with qVp4t9)
        }
    });

    // Email content
    const mailOptions = {
        from: process.env.BREVO_SENDER_EMAIL,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return true
    } catch (error) {
        throw new Error(failureMessages.EMAIL_SENDING_FAILED)
    }
}

sendEmail();
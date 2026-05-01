// send-email-smtp.js
import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { failureMessages } from '../constants/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go back one folder to reach root (since this file is in /services/)
const ROOT_DIR = path.join(__dirname, '..');

async function sendEmail(to, subject, text, html) {
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        secure: false,
        auth: {
            user: process.env.BREVO_EMAIL,
            pass: process.env.BREVO_SMTP_KEY
        }
    });

    const mailOptions = {
        from: process.env.BREVO_SENDER_EMAIL,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email error:', error.message);
        throw new Error(failureMessages.EMAIL_SENDING_FAILED);
    }
}

async function sendOTPEmail(to, otp, expiryMinutes = 10) {
    try {
        // Template path: root/email-templates/send-otp.html
        const templatePath = path.join(ROOT_DIR, 'email-templates', 'send-otp.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace variables
        template = template.replace(/{{otp}}/g, otp);
        template = template.replace(/{{email}}/g, to);
        template = template.replace(/{{expiryMinutes}}/g, expiryMinutes);
        template = template.replace(/{{year}}/g, new Date().getFullYear());
        template = template.replace(/{{companyName}}/g, process.env.COMPANY_NAME || 'YourApp');
        
        // Remove any unused variables
        template = template.replace(/{{[^{}]+}}/g, '');
        
        const textContent = `Your verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.\n\nNever share this code with anyone.`;
        
        return await sendEmail(
            to,
            `Your Verification Code: ${otp}`,
            textContent,
            template
        );
    } catch (error) {
        console.error('Template error:', error.message);
        throw new Error('Failed to send OTP email');
    }
}

export { sendEmail, sendOTPEmail };
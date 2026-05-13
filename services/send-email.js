import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { failureMessages } from '../constants/messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function sendEmail(to, subject, text, html) {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
        throw new Error(failureMessages.EMAIL_SERVICE_MESSAGES.BREVO_API_KEY_NOT_CONFIGURED);
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: process.env.COMPANY_NAME || 'YourApp',
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
            textContent: text
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || failureMessages.EMAIL_SENDING_FAILED);
    }

    console.log('✅ Email sent:', data.messageId);
    return true;
}

async function sendOTPEmail(to, otp, expiryMinutes = 10) {
    try {
        const templatePath = path.join(ROOT_DIR, 'email-templates', 'send-otp.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        template = template.replace(/{{otp}}/g, otp);
        template = template.replace(/{{email}}/g, to);
        template = template.replace(/{{expiryMinutes}}/g, expiryMinutes);
        template = template.replace(/{{year}}/g, new Date().getFullYear());
        template = template.replace(/{{companyName}}/g, process.env.COMPANY_NAME || 'YourApp');
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

async function sendPasswordResetEmail(to, resetLink, expiryHours = 1) {
    try {
        const templatePath = path.join(ROOT_DIR, 'email-templates', 'reset-password.html');
        let template = fs.readFileSync(templatePath, 'utf8');
        
        template = template.replace(/{{resetLink}}/g, resetLink);
        template = template.replace(/{{email}}/g, to);
        template = template.replace(/{{expiryHours}}/g, expiryHours);
        template = template.replace(/{{year}}/g, new Date().getFullYear());
        template = template.replace(/{{companyName}}/g, process.env.COMPANY_NAME || 'YourApp');
        // Remove any leftover placeholders
        template = template.replace(/{{[^{}]+}}/g, '');
        
        const textContent = `Reset your password: ${resetLink}\n\nThis link expires in ${expiryHours} hour(s).\n\nIf you didn't request this, ignore this email.`;
        
        return await sendEmail(
            to,
            'Reset Your Password',
            textContent,
            template
        );
    } catch (error) {
        console.error('Reset password template error:', error.message);
        throw new Error('Failed to send reset password email');
    }
}

export { sendEmail, sendOTPEmail, sendPasswordResetEmail };
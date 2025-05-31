import { Twilio } from 'twilio';
import nodemailer from 'nodemailer';

// Initialize Twilio client only if credentials are available
let twilioClient: Twilio | null = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.error('Error initializing Twilio:', error);
  }
}

// Initialize email transporter only if credentials are available
let transporter: nodemailer.Transporter | null = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } catch (error) {
    console.error('Error initializing email transporter:', error);
  }
}

interface NotificationOptions {
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendNotification({ email, phone, subject, message }: NotificationOptions) {
  try {
    // Send email if transporter is available
    if (transporter && email) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject,
          text: message,
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    // Send SMS only if Twilio is configured and phone number is provided
    if (twilioClient && phone && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: message,
          to: phone,
          from: process.env.TWILIO_PHONE_NUMBER,
        });
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    }
  } catch (error) {
    console.error('Error in sendNotification:', error);
    // Don't throw error, just log it
  }
} 
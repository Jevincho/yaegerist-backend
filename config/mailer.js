import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"Ganesha Operation" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Password - Ganesha Operation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Reset Password</h2>
        <p>Kamu meminta reset password untuk akun Ganesha Operation kamu.</p>
        <p>Klik tombol di bawah untuk membuat password baru. Link ini berlaku selama <strong>15 menit</strong>.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ff6600; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p>Kalau kamu tidak meminta ini, abaikan saja email ini.</p>
        <p style="color: #888; font-size: 12px;">Link tidak bisa diklik? Copy paste URL ini: ${resetLink}</p>
      </div>
    `,
  });
};
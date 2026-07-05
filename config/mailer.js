import { Resend } from "resend";
import { config } from "dotenv";
config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  const { data, error } = await resend.emails.send({
    from: "Ganesha Operation <onboarding@resend.dev>",
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

  if (error) {
    throw new Error(error.message || "Gagal mengirim email");
  }

  return data;
};
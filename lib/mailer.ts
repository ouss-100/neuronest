import nodemailer from "nodemailer";

export async function sendOTP(email: string, otp: string) {
  // If running locally, just log OTP instead of sending email
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }

  // Production: send email using Gmail SMTP
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in production");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MindMap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Verify your account</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>It expires in 60 seconds.</p>
    `,
  });
}
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendOTPEmail = async (
  to: string,
  otp: string,
) => {
  await transporter.sendMail({
    from: `"NeuroNest" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>${otp}</p>
      <p>Or click below:</p>
    `,
  });
};

export const sendResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"NeuroNest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link expires in 3 minutes.</p>
    `,
  });
};




export const sendAdminPendingEmail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"NeuroNest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Admin Verification Pending",
    html: `
      <h2>Account Pending Admin Approval</h2>
      <p>Your account has been verified via OTP.</p>
      <p>An admin will review your information and approve your account within 72 hours.</p>
      <p>Thank you for your patience!</p>
    `,
  });
};
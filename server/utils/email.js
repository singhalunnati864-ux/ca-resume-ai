import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const brandHeader = `
  <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 40px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin:0; color:#fff; font-size:24px; font-weight:700; letter-spacing:-0.5px;">CA Resume AI</h1>
    <p style="margin:6px 0 0; color:rgba(255,255,255,0.7); font-size:13px;">Your Big 4 Career Partner</p>
  </div>
`;

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0; padding:20px; background:#0f0f15; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width:520px; margin:0 auto; background:#1a1a2e; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
    ${brandHeader}
    <div style="padding:40px;">
      ${content}
    </div>
    <div style="background:#111120; padding:20px 40px; text-align:center; border-top:1px solid rgba(255,255,255,0.06);">
      <p style="margin:0; color:#555; font-size:12px;">© 2026 CA Resume AI · Built for CA aspirants</p>
      <p style="margin:4px 0 0; color:#444; font-size:11px;">If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

export async function sendVerificationEmail(email, name, otp) {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#e2e8f0; margin:0 0 8px; font-size:22px;">Verify Your Email</h2>
    <p style="color:#94a3b8; margin:0 0 32px; font-size:15px;">Hi ${name}, welcome! Use the OTP below to verify your account.</p>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15)); border:1px solid rgba(99,102,241,0.3); border-radius:12px; padding:28px; text-align:center; margin-bottom:32px;">
      <p style="margin:0 0 8px; color:#94a3b8; font-size:12px; text-transform:uppercase; letter-spacing:2px;">Your OTP Code</p>
      <div style="font-size:42px; font-weight:800; letter-spacing:12px; color:#a78bfa; font-family:monospace;">${otp}</div>
      <p style="margin:12px 0 0; color:#64748b; font-size:12px;">Valid for 10 minutes</p>
    </div>
    <p style="color:#64748b; font-size:13px; margin:0;">Enter this code on the verification page to activate your CA Resume AI account.</p>
  `;
  
  await transporter.sendMail({
    from: `"CA Resume AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✦ Verify your CA Resume AI account',
    html: emailWrapper(content),
  });
}

export async function sendForgotPasswordEmail(email, name, otp) {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#e2e8f0; margin:0 0 8px; font-size:22px;">Reset Your Password</h2>
    <p style="color:#94a3b8; margin:0 0 32px; font-size:15px;">Hi ${name}, we received a request to reset your password.</p>
    <div style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.12)); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:28px; text-align:center; margin-bottom:32px;">
      <p style="margin:0 0 8px; color:#94a3b8; font-size:12px; text-transform:uppercase; letter-spacing:2px;">Reset OTP</p>
      <div style="font-size:42px; font-weight:800; letter-spacing:12px; color:#fbbf24; font-family:monospace;">${otp}</div>
      <p style="margin:12px 0 0; color:#64748b; font-size:12px;">Valid for 10 minutes · One-time use only</p>
    </div>
    <p style="color:#64748b; font-size:13px; margin:0 0 16px;">If you didn't request a password reset, your account is safe — just ignore this email.</p>
    <div style="background:rgba(239,68,68,0.08); border-left:3px solid #ef4444; padding:12px 16px; border-radius:4px;">
      <p style="margin:0; color:#fca5a5; font-size:12px;">⚠️ Never share this OTP with anyone.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"CA Resume AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your password reset OTP — CA Resume AI',
    html: emailWrapper(content),
  });
}

export async function sendWelcomeEmail(email, name) {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#e2e8f0; margin:0 0 8px; font-size:22px;">Welcome to CA Resume AI! 🎉</h2>
    <p style="color:#94a3b8; margin:0 0 24px; font-size:15px;">Hi ${name}, your account is verified and ready to go!</p>
    <div style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1)); border:1px solid rgba(99,102,241,0.2); border-radius:12px; padding:24px; margin-bottom:32px;">
      <p style="margin:0 0 12px; color:#c4b5fd; font-size:14px; font-weight:600;">What you can do with CA Resume AI:</p>
      <ul style="margin:0; padding:0 0 0 16px; color:#94a3b8; font-size:13px; line-height:2;">
        <li>🤖 AI-powered resume builder for Big 4 firms</li>
        <li>📊 ATS score analyzer</li>
        <li>🎯 Interview prep with 200+ CA-specific questions</li>
        <li>💼 Stipend estimator for articleship firms</li>
      </ul>
    </div>
    <p style="color:#64748b; font-size:13px; margin:0;">Start building your dream Big 4 resume today!</p>
  `;

  await transporter.sendMail({
    from: `"CA Resume AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to CA Resume AI — Account Activated!',
    html: emailWrapper(content),
  });
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

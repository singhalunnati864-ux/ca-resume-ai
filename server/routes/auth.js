import express from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { sendVerificationEmail, sendForgotPasswordEmail, sendWelcomeEmail, generateOTP } from '../utils/email.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const isProduction = process.env.NODE_ENV === 'production';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const otp = generateOTP();
    const user = new User({
      name,
      email,
      phone,
      passwordHash: password,
      isEmailVerified: false,
      emailOtp: otp,
      emailOtpExpiry: new Date(Date.now() + OTP_EXPIRY_MS),
    });
    await user.save();

    // Send verification email (non-blocking — don't fail registration if email fails)
    sendVerificationEmail(email, name, otp).catch(err =>
      console.error('[Email] Failed to send verification email:', err.message)
    );

    res.json({ success: true, requiresVerification: true, email });
  } catch (error) {
    next(error);
  }
});

// ─── VERIFY EMAIL OTP ────────────────────────────────────────────────────────
router.post('/verify-email', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ error: 'Email already verified' });

    if (!user.emailOtp || !user.emailOtpExpiry) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }
    if (new Date() > user.emailOtpExpiry) {
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }
    if (user.emailOtp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    // Send welcome email
    sendWelcomeEmail(email, user.name).catch(console.error);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
        isGoogleUser: !!user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── RESEND EMAIL OTP ────────────────────────────────────────────────────────
router.post('/resend-otp', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ error: 'Email already verified' });

    const otp = generateOTP();
    user.emailOtp = otp;
    user.emailOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save();

    sendVerificationEmail(email, user.name, otp).catch(err =>
      console.error('[Email] Resend OTP failed:', err.message)
    );

    res.json({ success: true, message: 'OTP resent to your email' });
  } catch (error) {
    next(error);
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Please log in with Google for this account' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // If email not verified, prompt verification (unless SKIP_EMAIL_VERIFICATION is true)
    if (!user.isEmailVerified && process.env.SKIP_EMAIL_VERIFICATION !== 'true') {
      // Resend a fresh OTP
      const otp = generateOTP();
      user.emailOtp = otp;
      user.emailOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
      await user.save();
      sendVerificationEmail(email, user.name, otp).catch(console.error);
      return res.status(403).json({
        error: 'Email not verified',
        requiresVerification: true,
        email,
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
        isGoogleUser: !!user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    // Don't reveal if email exists or not (security)
    if (!user || user.googleId) {
      return res.json({ success: true, message: 'If this email is registered, you will receive an OTP.' });
    }

    const otp = generateOTP();
    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save();

    sendForgotPasswordEmail(email, user.name, otp).catch(err =>
      console.error('[Email] Forgot password email failed:', err.message)
    );

    res.json({ success: true, message: 'OTP sent to your email address.' });
  } catch (error) {
    next(error);
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ error: 'No reset OTP found. Please request again.' });
    }
    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }
    if (user.resetOtp !== otp.trim()) {
      return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
    }

    user.passwordHash = newPassword; // pre-save hook will hash it
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// ─── GET CURRENT USER ────────────────────────────────────────────────────────
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      plan: user.plan,
      isGoogleUser: !!user.googleId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

// ─── UPDATE USER PROFILE ─────────────────────────────────────────────────────
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { name, phone, password, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (newPassword) {
      if (user.googleId) {
        return res.status(400).json({ error: 'Google accounts do not support manual password changes' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }
      const valid = await user.comparePassword(password);
      if (!valid) return res.status(401).json({ error: 'Incorrect current password' });
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
      }
      user.passwordHash = newPassword;
    }

    await user.save();
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        isGoogleUser: !!user.googleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: (process.env.CLIENT_URL || 'http://localhost:5173') + '/login?error=oauth_failed' }), 
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(res, token);
    res.redirect((process.env.CLIENT_URL || 'http://localhost:5173') + '?login=success');
  }
);

export default router;

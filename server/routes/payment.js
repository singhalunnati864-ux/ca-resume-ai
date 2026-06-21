import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', authenticateToken, async (req, res, next) => {
  try {
    const { type } = req.body;
    const amount = type === 'pro' ? 29900 : 5000;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: 'INR',
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', authenticateToken, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.plan = type; // 'pro' or 'tools'
        user.razorpayPaymentId = razorpay_payment_id;
        await user.save();

        const payment = new Payment({
          userId: user._id,
          email: user.email,
          plan: type,
          amount: type === 'pro' ? 299 : 50,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
        await payment.save();
      }
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
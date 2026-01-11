const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { USERS, TRANSACTIONS } = require('../data');
const Stripe = require('stripe');

// Initialize Stripe with a test key (or env var)
// WARNING: This is a placeholder test key. In production, use process.env.STRIPE_SECRET_KEY
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 

// Placeholder for Nexus Production App
router.get('/', (req, res) => {
  res.json({ message: 'Nexus API - Slot 1 Production' });
});

router.get('/status', (req, res) => {
  res.json({ status: 'online', version: '1.0.0' });
});

// Slot 4 Shared Auth Demo: Get Player Profile
router.get('/profile', authenticateToken, (req, res) => {
  // In a real DB, we would fetch fresh data here.
  // Since we are using in-memory mock data, we find the user again to get latest stats.
  const user = USERS.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return specific Nexus data
  res.json({
    username: user.username,
    level: user.nexus_level || 1,
    xp: user.nexus_xp || 0,
    shards: user.shard_balance || 0,
    isElite: user.is_elite || false
  });
});

router.get('/transactions', authenticateToken, (req, res) => {
  const userTransactions = TRANSACTIONS.filter(t => t.userId === req.user.id);
  res.json(userTransactions);
});

// Payment Intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: null, // For now we skip ephemeral key for simplicity or implement if needed
      customer: null, // We can create a stripe customer if needed
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Confirm Purchase (Simulated Webhook)
router.post('/confirm-purchase', authenticateToken, (req, res) => {
  const { amount, item } = req.body; // Amount in shards
  
  const user = USERS.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Update Balance
  user.shard_balance = (user.shard_balance || 0) + amount;

  // Log Transaction
  const newTx = {
    id: `tx-${Date.now()}`,
    userId: user.id,
    type: 'DEPOSIT',
    item: item || 'Shard Purchase',
    amount: amount,
    timestamp: new Date().toISOString()
  };
  TRANSACTIONS.unshift(newTx);

  res.json({ success: true, newBalance: user.shard_balance });
});

module.exports = router;

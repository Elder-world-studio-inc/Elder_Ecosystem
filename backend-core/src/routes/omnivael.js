const express = require('express');
const router = express.Router();

const { OMNIVAEL_LIBRARY, USERS, TRANSACTIONS } = require('../data');

// Placeholder for Omnivael Production App
router.get('/', (req, res) => {
  res.json({ message: 'Omnivael API - Slot 3 Production' });
});

router.post('/purchase', (req, res) => {
  const { userId, chapterId } = req.body;

  const user = USERS.find(u => u.id === userId);
  const chapter = OMNIVAEL_LIBRARY.find(c => c.id === chapterId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  // Check if already owned (in transactions)
  const existingTransaction = TRANSACTIONS.find(t => t.userId === userId && t.chapterId === chapterId);
  if (existingTransaction) {
    return res.status(400).json({ error: 'Chapter already owned' });
  }

  if (user.shard_balance < chapter.shards) {
    return res.status(402).json({ error: 'Insufficient shards', required: chapter.shards, balance: user.shard_balance });
  }

  // Process Transaction
  user.shard_balance -= chapter.shards;
  
  const transaction = {
    id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    chapterId,
    amount: chapter.shards,
    date: new Date().toISOString(),
    status: 'COMPLETED'
  };

  TRANSACTIONS.push(transaction);

  res.json({
    message: 'Purchase successful',
    transactionId: transaction.id,
    newBalance: user.shard_balance,
    chapterId: chapter.id
  });
});

router.get('/library', (req, res) => {
  const { type } = req.query;
  let results = OMNIVAEL_LIBRARY;

  if (type) {
    results = results.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  res.json({ 
    message: 'Omnivael Library Content', 
    count: results.length,
    items: results 
  });
});

module.exports = router;

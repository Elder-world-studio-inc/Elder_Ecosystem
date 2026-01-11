const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { USERS } = require('../data');
const { SECRET_KEY } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = USERS.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      divisionId: user.divisionId,
      // Include Nexus stats in token or just rely on DB fetch? 
      // For now, keeping token light, but frontend might need these in the response.
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  // Return full user profile (excluding sensitive hash) so Nexus/Omnivael know the stats
  const { passwordHash, ...userProfile } = user;
  res.json({ token, user: userProfile });
});

router.post('/signup', (req, res) => {
  const { username, password, email, fullName } = req.body;

  if (USERS.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: String(USERS.length + 1),
    username,
    email,
    fullName,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'user',
    divisionId: null,
    mfaEnabled: false
  };

  USERS.push(newUser);

  const token = jwt.sign(
    { 
      id: newUser.id, 
      username: newUser.username, 
      role: newUser.role, 
      divisionId: newUser.divisionId
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  const { passwordHash, ...userProfile } = newUser;
  res.json({ token, user: userProfile });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = USERS.find(u => u.email === email);
  
  if (!user) {
    return res.json({ message: 'If an account exists, a code has been sent.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[AUTH] Reset code for ${email}: ${code}`);
  
  res.json({ message: 'Reset code sent' });
});

module.exports = router;

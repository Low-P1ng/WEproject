const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// POST /api/auth/register — Register a new user
router.post('/register', register);

// POST /api/auth/login — Log in and receive JWT
router.post('/login', login);

// GET /api/auth/me — Get current user profile (protected)
router.get('/me', auth, getMe);

module.exports = router;

// plantpal-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    // ... (rest of signup logic) ...
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = await User.create({ email, password });
        res.status(201).json({ _id: user._id, email: user.email, token: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // ... (rest of login logic) ...
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({ _id: user._id, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
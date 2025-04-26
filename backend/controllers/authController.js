const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(201).json({ token: generateToken(user._id) });
  } catch (error) {
    res.status(400).json({ message: 'Signup failed', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = await user.comparePassword(password);
    if (!user || !isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user._id) });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};

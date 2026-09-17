const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email already exists.' });

    user = new User({ username, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(201).json({ token, user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    return res.status(500).json({
      msg: "Server error during registration.",
      error: err.message
    });
}
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ msg: 'Server authentication error.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found.' });
    return res.status(200).json({ user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error retrieving user context.' });
  }
};
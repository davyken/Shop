const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadProfile, cloudinary } = require('../config/cloudinary');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, username, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json({ user: { _id: user._id, username: user.username, name: user.name, email: user.email, profilePic: user.profilePic, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/profile/picture
router.post('/profile/picture', protect, uploadProfile.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Delete old picture from cloudinary if exists
    if (user.profilePicPublicId) {
      await cloudinary.uploader.destroy(user.profilePicPublicId).catch(() => {});
    }
    user.profilePic = req.file.path;
    user.profilePicPublicId = req.file.filename;
    await user.save();
    res.json({ profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

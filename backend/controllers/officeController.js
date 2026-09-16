const bcrypt = require('bcryptjs');
const User = require('../models/User');

// फक्त तुम्ही (admin) वापरणार — नवीन office login बनवण्यासाठी
// body: { name: "Solapur Office", username: "solapur_office", password: "...", officeName: "Solapur" }
const createOfficeUser = async (req, res) => {
  try {
    const { name, username, password, officeName } = req.body;

    if (!name || !username || !password || !officeName) {
      return res.status(400).json({ message: 'name, username, password, officeName सगळं गरजेचं आहे' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'हा username आधीच वापरलेला आहे' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officeUser = new User({
      name,
      username,
      email: `${username}@m2store-internal.local`, // fake email, कारण schema मध्ये required आहे
      mobile: '0000000000', // fake mobile, कारण schema मध्ये required आहे
      password: hashedPassword,
      role: 'office',
      officeName,
      isEmailVerified: true
    });

    await officeUser.save();

    res.status(201).json({
      message: `'${officeName}' office साठी login तयार झाला`,
      username,
      officeName
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// सगळे office users ची यादी (admin ला बघायला)
const getAllOfficeUsers = async (req, res) => {
  try {
    const offices = await User.find({ role: 'office' }).select('name username officeName createdAt');
    res.json(offices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOfficeUser, getAllOfficeUsers };
const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    const user = new User({
      email,
      password,
      name,
      isAdmin,
    });

    await user.save();

    return res.status(201).json({ message: 'User has been created successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { name, isAdmin } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.name = name;
    user.isAdmin = isAdmin;

    await user.save();

    return res.status(200).json({ message: 'User has been updated successfully.' });
  } catch (error) {
    return next(error);
  }
};

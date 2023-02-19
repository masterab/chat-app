const {signToken} = require('../middlewares/auth');
const User = require('../models/user');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Find the user in the users array based on the username and password
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Check if the password is correct
  const isPasswordCorrect = await user.isValidPassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  // Generate a JWT token for the user
  const token = await signToken(user.id, user.isAdmin);

  // Send the JWT token to the client
  res.json({ token:token, id:user.id, isAdmin:user.isAdmin });
};

exports.logout = (req, res) => {
  // invalidate or blacklist jwt token
  return res.status(200).json({ message: 'You have been logged out successfully.' });
};

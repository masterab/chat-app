const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';

const signToken = async (userId, isAdmin)=> {
  const payload = { sub: userId, isAdmin };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, SECRET_KEY, options);
};

const verifyToken = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, SECRET_KEY);

    // Attach the sub Object as user to the request object for use in subsequent middleware and routes
    req.user = decodedToken.sub;
    // Call the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const isAdmin = function (req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }
};

module.exports = {
  signToken,
  verifyToken,
  isAdmin
};
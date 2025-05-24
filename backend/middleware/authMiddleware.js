const jwt = require('jsonwebtoken');

// This checks if user is logged in
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in request
    next(); // Go to the next function (or route)
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// This checks the user's role (admin or learner)
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You are not allowed to access this route.' });
    }
    next(); // Allowed → go ahead
  };
};

module.exports = { protect, allowRoles };

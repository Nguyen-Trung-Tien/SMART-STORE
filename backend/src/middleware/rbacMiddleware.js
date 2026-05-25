const checkRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: You do not have permission to access this resource',
    });
  }

  next();
};

module.exports = { checkRole };

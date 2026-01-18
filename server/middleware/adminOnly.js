const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only section' });
  }

  next();
};

export default adminOnly;

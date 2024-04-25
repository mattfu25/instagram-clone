const requireAuth = (req, res, next) => {
  if (!req.session!.user) {
    next(new Error('Cannot logout when not logged in.'));
  } else {
    next();
  }
};

export default requireAuth;

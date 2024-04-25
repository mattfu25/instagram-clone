const requireAuth = (req, res, next) => {
  console.log('Checking authentication for', req.method, req.path);
  if (!req.session!.user) {
    next(new Error('Cannot logout when not logged in.'));
  } else {
    next();
  }
};

export default requireAuth;

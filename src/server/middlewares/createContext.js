export default (defaultContext) => (req, res, next) => {
  // don't reset context when retriggering the middleware manually
  req.context = req.context || {
    ...defaultContext,
    subdomain: req.subdomains.reverse().join('.'),
  };

  next();
};

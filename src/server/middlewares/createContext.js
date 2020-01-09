export default (defaultContext) => (req, res, next) => {
  req.context = {
    ...defaultContext,
    subdomain: req.subdomains.reverse().join('.'),
  };

  next();
};

// Because these headers might be set already, we want to unset them
// so that the express can handle setting them to defaults

const clearHeaders = (res) => {
  res.removeHeader('Content-Type');
  res.removeHeader('Content-Length');
};

export default ({ app, hasRenderer }) => (req, res, next) => {
  const defaultRenderError = (status, message) => {
    clearHeaders(res);
    res.status(status).send(message);
  };

  // If we are running the server in debug mode, renderer is not available.
  // Also, we don't want to render errors for non-get methods.
  // Also, don't allow multiple invokations of renderError
  if (hasRenderer && req.method === 'GET' && !res.renderError) {
    res.renderError = (status, message) => {
      clearHeaders(res);

      req.context = {
        ...req.context,
        error: {
          status: status,
          message: `${status} - ${message}`,
        },
      };

      app(req, res);
    };
  } else {
    res.renderError = defaultRenderError;
  }

  next();
};

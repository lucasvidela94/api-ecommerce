const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const headerToken = req.headers.token;
  if (headerToken) {
    const token = headerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(401).json("Token no valido");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Sin autentificacion");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json("No tenes permisos para realizar esta accion");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json("No tenes permisos para realizar esta accion");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

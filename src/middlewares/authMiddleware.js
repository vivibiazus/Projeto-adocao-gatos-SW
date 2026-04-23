const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('Token de autenticação não fornecido', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    // Repassa para o errorHandler tratar JsonWebTokenError / TokenExpiredError
    return next(err);
  }
}

module.exports = authMiddleware;

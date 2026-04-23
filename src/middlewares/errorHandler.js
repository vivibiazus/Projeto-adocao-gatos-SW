class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Erros customizados da aplicação
  if (err.name === 'ApiError') {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors.map((e) => e.message).join('; ');
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message,
    });
  }

  // Erros de FK do Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Referência inválida: recurso relacionado não encontrado',
    });
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido',
    });
  }

  // Fallback 500
  if (!isProduction) {
    console.error(err);
  }

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: isProduction ? 'Erro interno do servidor' : err.message,
  });
}

module.exports = { ApiError, errorHandler };

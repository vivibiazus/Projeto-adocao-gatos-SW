require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupSwagger } = require('./config/swagger');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
setupSwagger(app);

// Rotas da API
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Rota ${req.method} ${req.path} não encontrada`,
  });
});

// Error handler centralizado (deve ser o último middleware)
app.use(errorHandler);

module.exports = app;

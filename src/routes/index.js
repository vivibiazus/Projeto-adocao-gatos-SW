const express = require('express');
const router = express.Router();

const gatoRoutes = require('./gatos');
const authRoutes = require('./auth');
const pedidosAdocaoRoutes = require('./pedidosAdocao');

router.use('/gatos', gatoRoutes);
router.use('/auth', authRoutes);
router.use('/pedidos-adocao', pedidosAdocaoRoutes);

module.exports = router;

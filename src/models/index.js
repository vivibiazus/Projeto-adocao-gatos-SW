const sequelize = require('../config/database');
const Gato = require('./Gato');
const User = require('./User');
const PedidoAdocao = require('./PedidoAdocao');

// Associações
User.hasMany(PedidoAdocao, { foreignKey: 'adotante_id', as: 'pedidos' });
Gato.hasMany(PedidoAdocao, { foreignKey: 'gato_id', as: 'pedidos' });
PedidoAdocao.belongsTo(User, { foreignKey: 'adotante_id', as: 'Adotante' });
PedidoAdocao.belongsTo(Gato, { foreignKey: 'gato_id', as: 'Gato' });

module.exports = { sequelize, Gato, User, PedidoAdocao };

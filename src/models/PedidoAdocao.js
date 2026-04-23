const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PedidoAdocao = sequelize.define('PedidoAdocao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  adotante_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  gato_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'gatos', key: 'id' },
  },
  termos_aceitos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      isTrue(value) {
        if (value !== true) {
          throw new Error('Os termos de adoção devem ser aceitos');
        }
      },
    },
  },
  links_comprovantes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
  },
  status_pedido: {
    type: DataTypes.ENUM('Pendente', 'Aprovado', 'Rejeitado'),
    allowNull: false,
    defaultValue: 'Pendente',
  },
}, {
  tableName: 'pedidos_adocao',
  timestamps: true,
});

module.exports = PedidoAdocao;

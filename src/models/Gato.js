const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gato = sequelize.define('Gato', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do gato é obrigatório' },
    },
  },
  sexo: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: false,
    validate: {
      isIn: { args: [['M', 'F']], msg: 'Sexo deve ser M ou F' },
    },
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Idade deve ser um número inteiro' },
      min: { args: [0], msg: 'Idade não pode ser negativa' },
    },
  },
  status_fiv_felv: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status_adocao: {
    type: DataTypes.ENUM('Disponível', 'Em Análise', 'Adotado'),
    allowNull: false,
    defaultValue: 'Disponível',
  },
  foto_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'gatos',
  timestamps: true,
});

module.exports = Gato;

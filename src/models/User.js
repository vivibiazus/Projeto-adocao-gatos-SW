const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
      notEmpty: { msg: 'O nome é obrigatório' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'Este e-mail já está cadastrado' },
    validate: {
      isEmail: { msg: 'Formato de e-mail inválido' },
      notEmpty: { msg: 'O e-mail é obrigatório' },
    },
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['senha_hash'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['senha_hash'] },
    },
  },
});

module.exports = User;

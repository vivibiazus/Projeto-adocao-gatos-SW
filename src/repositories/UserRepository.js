const { User } = require('../models');

class UserRepository {
  async findById(id) {
    return User.findByPk(id);
  }

  async findByEmail(email) {
    // Inclui senha_hash para autenticação
    return User.scope('withPassword').findOne({ where: { email } });
  }

  async create(data) {
    return User.create(data);
  }
}

module.exports = new UserRepository();

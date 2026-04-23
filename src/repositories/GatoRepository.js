const { Gato } = require('../models');
const { Op } = require('sequelize');

class GatoRepository {
  async findAll(filters = {}) {
    const where = {};
    if (filters.status) {
      where.status_adocao = filters.status;
    }
    return Gato.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  async findById(id) {
    return Gato.findByPk(id);
  }

  async create(data) {
    return Gato.create(data);
  }

  async update(id, data) {
    const gato = await Gato.findByPk(id);
    if (!gato) return null;
    return gato.update(data);
  }

  async delete(id) {
    const gato = await Gato.findByPk(id);
    if (!gato) return null;
    await gato.destroy();
    return true;
  }

  async updateStatus(id, status_adocao) {
    return Gato.update({ status_adocao }, { where: { id } });
  }
}

module.exports = new GatoRepository();

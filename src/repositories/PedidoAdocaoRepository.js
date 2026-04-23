const { PedidoAdocao, User, Gato } = require('../models');

const includeAssociations = [
  { model: User, as: 'Adotante', attributes: ['id', 'nome', 'email'] },
  { model: Gato, as: 'Gato' },
];

class PedidoAdocaoRepository {
  async findAll() {
    return PedidoAdocao.findAll({
      include: includeAssociations,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByAdotante(adotante_id) {
    return PedidoAdocao.findAll({
      where: { adotante_id },
      include: includeAssociations,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id) {
    return PedidoAdocao.findByPk(id, { include: includeAssociations });
  }

  async findByAdotanteAndGato(adotante_id, gato_id) {
    return PedidoAdocao.findOne({ where: { adotante_id, gato_id } });
  }

  async create(data) {
    return PedidoAdocao.create(data);
  }

  async updateStatus(id, status_pedido) {
    const pedido = await PedidoAdocao.findByPk(id);
    if (!pedido) return null;
    return pedido.update({ status_pedido });
  }

  async rejectPendingByGato(gato_id, excludeId) {
    return PedidoAdocao.update(
      { status_pedido: 'Rejeitado' },
      {
        where: {
          gato_id,
          status_pedido: 'Pendente',
          id: { [require('sequelize').Op.ne]: excludeId },
        },
      }
    );
  }
}

module.exports = new PedidoAdocaoRepository();

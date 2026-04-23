const PedidoAdocaoService = require('../services/PedidoAdocaoService');

class PedidoAdocaoController {
  async criar(req, res, next) {
    try {
      const pedido = await PedidoAdocaoService.criarPedido(req.user.id, req.body);
      return res.status(201).json({ status: 'success', data: pedido });
    } catch (err) {
      return next(err);
    }
  }

  async listar(req, res, next) {
    try {
      const pedidos = await PedidoAdocaoService.listarPedidos();
      return res.status(200).json({
        status: 'success',
        total: pedidos.length,
        data: pedidos,
      });
    } catch (err) {
      return next(err);
    }
  }

  async listarMeus(req, res, next) {
    try {
      const pedidos = await PedidoAdocaoService.listarMeusPedidos(req.user.id);
      return res.status(200).json({
        status: 'success',
        total: pedidos.length,
        data: pedidos,
      });
    } catch (err) {
      return next(err);
    }
  }

  async atualizarStatus(req, res, next) {
    try {
      const pedido = await PedidoAdocaoService.atualizarStatusPedido(
        req.params.id,
        req.body.status_pedido
      );
      return res.status(200).json({ status: 'success', data: pedido });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new PedidoAdocaoController();

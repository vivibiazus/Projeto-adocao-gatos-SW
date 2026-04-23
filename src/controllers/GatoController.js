const GatoService = require('../services/GatoService');

class GatoController {
  async listar(req, res, next) {
    try {
      const gatos = await GatoService.listarGatos({ status: req.query.status });
      return res.status(200).json({
        status: 'success',
        total: gatos.length,
        data: gatos,
      });
    } catch (err) {
      return next(err);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const gato = await GatoService.buscarGatoPorId(req.params.id);
      return res.status(200).json({ status: 'success', data: gato });
    } catch (err) {
      return next(err);
    }
  }

  async cadastrar(req, res, next) {
    try {
      const { nome, sexo, idade, status_fiv_felv, foto_url } = req.body;

      if (!nome || !sexo || idade === undefined || status_fiv_felv === undefined) {
        const { ApiError } = require('../middlewares/errorHandler');
        throw new ApiError('nome, sexo, idade e status_fiv_felv são obrigatórios', 400);
      }

      const gato = await GatoService.cadastrarGato({ nome, sexo, idade, status_fiv_felv, foto_url });
      return res.status(201).json({ status: 'success', data: gato });
    } catch (err) {
      return next(err);
    }
  }

  async atualizar(req, res, next) {
    try {
      const gato = await GatoService.atualizarGato(req.params.id, req.body);
      return res.status(200).json({ status: 'success', data: gato });
    } catch (err) {
      return next(err);
    }
  }

  async remover(req, res, next) {
    try {
      await GatoService.removerGato(req.params.id);
      return res.status(200).json({ status: 'success', data: { message: 'Gato removido com sucesso' } });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new GatoController();

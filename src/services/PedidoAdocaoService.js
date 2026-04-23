const PedidoAdocaoRepository = require('../repositories/PedidoAdocaoRepository');
const GatoRepository = require('../repositories/GatoRepository');
const { ApiError } = require('../middlewares/errorHandler');

class PedidoAdocaoService {
  async criarPedido(adotante_id, data) {
    const { gato_id, termos_aceitos, links_comprovantes } = data;

    // Regra 2: termos_aceitos obrigatório e true
    if (termos_aceitos !== true) {
      throw new ApiError('Os termos de adoção devem ser aceitos (termos_aceitos: true)', 400);
    }

    if (!gato_id) {
      throw new ApiError('gato_id é obrigatório', 400);
    }

    // Regra 1: gato deve existir e estar disponível
    const gato = await GatoRepository.findById(gato_id);
    if (!gato) {
      throw new ApiError('Gato não encontrado', 404);
    }

    if (gato.status_adocao !== 'Disponível') {
      throw new ApiError(
        `Gato não está disponível para adoção (status atual: ${gato.status_adocao})`,
        409
      );
    }

    // Regra 5: adotante não pode abrir dois pedidos para o mesmo gato
    const pedidoExistente = await PedidoAdocaoRepository.findByAdotanteAndGato(adotante_id, gato_id);
    if (pedidoExistente) {
      throw new ApiError('Você já possui um pedido de adoção para este gato', 409);
    }

    // Regra 1: muda status do gato para Em Análise
    await GatoRepository.updateStatus(gato_id, 'Em Análise');

    const pedido = await PedidoAdocaoRepository.create({
      adotante_id,
      gato_id,
      termos_aceitos,
      links_comprovantes: links_comprovantes || [],
    });

    return PedidoAdocaoRepository.findById(pedido.id);
  }

  async listarPedidos() {
    return PedidoAdocaoRepository.findAll();
  }

  async listarMeusPedidos(adotante_id) {
    return PedidoAdocaoRepository.findByAdotante(adotante_id);
  }

  async atualizarStatusPedido(id, status_pedido) {
    const statusValidos = ['Pendente', 'Aprovado', 'Rejeitado'];
    if (!statusValidos.includes(status_pedido)) {
      throw new ApiError(`Status inválido. Use: ${statusValidos.join(', ')}`, 400);
    }

    const pedido = await PedidoAdocaoRepository.findById(id);
    if (!pedido) {
      throw new ApiError('Pedido de adoção não encontrado', 404);
    }

    if (pedido.status_pedido !== 'Pendente') {
      throw new ApiError(
        `Pedido já foi ${pedido.status_pedido.toLowerCase()} e não pode ser alterado`,
        409
      );
    }

    const pedidoAtualizado = await PedidoAdocaoRepository.updateStatus(id, status_pedido);

    // Regra 3: ao Aprovar — marcar gato como Adotado e rejeitar outros pedidos pendentes
    if (status_pedido === 'Aprovado') {
      await GatoRepository.updateStatus(pedido.gato_id, 'Adotado');
      await PedidoAdocaoRepository.rejectPendingByGato(pedido.gato_id, id);
    }

    // Ao Rejeitar — se não houver mais pedidos pendentes para o gato, voltar para Disponível
    if (status_pedido === 'Rejeitado') {
      const pedidosPendentes = await PedidoAdocaoRepository.findAll().then((todos) =>
        todos.filter(
          (p) =>
            p.gato_id === pedido.gato_id &&
            p.status_pedido === 'Pendente' &&
            p.id !== id
        )
      );

      if (pedidosPendentes.length === 0) {
        await GatoRepository.updateStatus(pedido.gato_id, 'Disponível');
      }
    }

    return PedidoAdocaoRepository.findById(id);
  }
}

module.exports = new PedidoAdocaoService();

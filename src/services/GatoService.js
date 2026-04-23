const GatoRepository = require('../repositories/GatoRepository');
const { ApiError } = require('../middlewares/errorHandler');

class GatoService {
  async listarGatos(filters) {
    const statusValidos = ['Disponível', 'Em Análise', 'Adotado'];
    if (filters.status && !statusValidos.includes(filters.status)) {
      throw new ApiError(
        `Status inválido. Use: ${statusValidos.join(', ')}`,
        400
      );
    }
    return GatoRepository.findAll(filters);
  }

  async buscarGatoPorId(id) {
    const gato = await GatoRepository.findById(id);
    if (!gato) throw new ApiError('Gato não encontrado', 404);
    return gato;
  }

  async cadastrarGato(data) {
    return GatoRepository.create(data);
  }

  async atualizarGato(id, data) {
    await this.buscarGatoPorId(id);
    const gato = await GatoRepository.update(id, data);
    return gato;
  }

  async removerGato(id) {
    await this.buscarGatoPorId(id);
    await GatoRepository.delete(id);
  }
}

module.exports = new GatoService();

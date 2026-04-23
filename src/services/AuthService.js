const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { ApiError } = require('../middlewares/errorHandler');

class AuthService {
  async register(data) {
    const { nome, email, senha } = data;

    if (!nome || !email || !senha) {
      throw new ApiError('nome, email e senha são obrigatórios', 400);
    }

    if (senha.length < 6) {
      throw new ApiError('A senha deve ter ao menos 6 caracteres', 400);
    }

    const existente = await UserRepository.findByEmail(email);
    if (existente) {
      throw new ApiError('Este e-mail já está cadastrado', 409);
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const user = await UserRepository.create({ nome, email, senha_hash });

    // Retorna sem senha_hash
    return { id: user.id, nome: user.nome, email: user.email, createdAt: user.createdAt };
  }

  async login(email, senha) {
    if (!email || !senha) {
      throw new ApiError('e-mail e senha são obrigatórios', 400);
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ApiError('Credenciais inválidas', 401);
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      throw new ApiError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    };
  }
}

module.exports = new AuthService();

const AuthService = require('../services/AuthService');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({ status: 'success', data: user });
    } catch (err) {
      return next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const result = await AuthService.login(email, senha);
      return res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();

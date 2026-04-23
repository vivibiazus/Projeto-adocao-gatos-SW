const express = require('express');
const router = express.Router();
const PedidoAdocaoController = require('../controllers/PedidoAdocaoController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Pedidos de Adoção
 *   description: Gerenciamento do processo de triagem de adoção
 */

/**
 * @swagger
 * /api/pedidos-adocao:
 *   post:
 *     summary: Cria um pedido de adoção
 *     tags: [Pedidos de Adoção]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoAdocaoInput'
 *           example:
 *             gato_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *             termos_aceitos: true
 *             links_comprovantes:
 *               - https://exemplo.com/foto-casa.jpg
 *               - https://exemplo.com/foto-quintal.jpg
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso. Status do gato alterado para Em Análise.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PedidoAdocao'
 *       400:
 *         description: Termos não aceitos ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Gato não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Gato não disponível ou pedido duplicado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authMiddleware, PedidoAdocaoController.criar.bind(PedidoAdocaoController));

/**
 * @swagger
 * /api/pedidos-adocao:
 *   get:
 *     summary: Lista todos os pedidos de adoção
 *     tags: [Pedidos de Adoção]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessListResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PedidoAdocao'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authMiddleware, PedidoAdocaoController.listar.bind(PedidoAdocaoController));

/**
 * @swagger
 * /api/pedidos-adocao/meus:
 *   get:
 *     summary: Lista os pedidos do usuário autenticado
 *     tags: [Pedidos de Adoção]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Pedidos do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessListResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PedidoAdocao'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/meus', authMiddleware, PedidoAdocaoController.listarMeus.bind(PedidoAdocaoController));

/**
 * @swagger
 * /api/pedidos-adocao/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido de adoção
 *     tags: [Pedidos de Adoção]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do pedido de adoção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchStatusInput'
 *           example:
 *             status_pedido: Aprovado
 *     responses:
 *       200:
 *         description: >
 *           Status atualizado. Se Aprovado: gato marcado como Adotado e outros pedidos pendentes
 *           para o mesmo gato são automaticamente Rejeitados.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PedidoAdocao'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Pedido já foi finalizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/status', authMiddleware, PedidoAdocaoController.atualizarStatus.bind(PedidoAdocaoController));

module.exports = router;

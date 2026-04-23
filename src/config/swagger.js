const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Plataforma de Adoção de Gatos',
      version: '1.0.0',
      description:
        'API RESTful para gerenciamento de catálogo de animais e processo de triagem de adoção. ' +
        'Desenvolvida para a disciplina de Serviços Web — IFSUL Campus Passo Fundo.',
      contact: {
        name: 'IFSUL - Serviços Web',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor local de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /api/auth/login',
        },
      },
      schemas: {
        Gato: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            nome: { type: 'string', example: 'Mingau' },
            sexo: { type: 'string', enum: ['M', 'F'], example: 'M' },
            idade: { type: 'integer', description: 'Idade em meses', example: 24 },
            status_fiv_felv: { type: 'boolean', example: false },
            status_adocao: {
              type: 'string',
              enum: ['Disponível', 'Em Análise', 'Adotado'],
              example: 'Disponível',
            },
            foto_url: { type: 'string', nullable: true, example: 'https://example.com/gato.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        GatoInput: {
          type: 'object',
          required: ['nome', 'sexo', 'idade', 'status_fiv_felv'],
          properties: {
            nome: { type: 'string', example: 'Mingau' },
            sexo: { type: 'string', enum: ['M', 'F'], example: 'M' },
            idade: { type: 'integer', example: 24 },
            status_fiv_felv: { type: 'boolean', example: false },
            foto_url: { type: 'string', nullable: true, example: 'https://example.com/gato.jpg' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            senha: { type: 'string', minLength: 6, example: 'senha123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', format: 'email', example: 'maria@email.com' },
            senha: { type: 'string', example: 'senha123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        PedidoAdocao: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            adotante_id: { type: 'string', format: 'uuid' },
            gato_id: { type: 'string', format: 'uuid' },
            termos_aceitos: { type: 'boolean', example: true },
            links_comprovantes: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://exemplo.com/foto-casa.jpg'],
            },
            status_pedido: {
              type: 'string',
              enum: ['Pendente', 'Aprovado', 'Rejeitado'],
              example: 'Pendente',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            Adotante: { $ref: '#/components/schemas/User' },
            Gato: { $ref: '#/components/schemas/Gato' },
          },
        },
        PedidoAdocaoInput: {
          type: 'object',
          required: ['gato_id', 'termos_aceitos'],
          properties: {
            gato_id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            termos_aceitos: { type: 'boolean', example: true },
            links_comprovantes: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://exemplo.com/foto-casa.jpg'],
            },
          },
        },
        PatchStatusInput: {
          type: 'object',
          required: ['status_pedido'],
          properties: {
            status_pedido: {
              type: 'string',
              enum: ['Pendente', 'Aprovado', 'Rejeitado'],
              example: 'Aprovado',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object' },
          },
        },
        SuccessListResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            total: { type: 'integer', example: 5 },
            data: { type: 'array', items: { type: 'object' } },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            statusCode: { type: 'integer', example: 404 },
            message: { type: 'string', example: 'Recurso não encontrado' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'API Adoção de Gatos - Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

module.exports = { setupSwagger };

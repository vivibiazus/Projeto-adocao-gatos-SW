# API Plataforma de Adoção de Gatos

API RESTful para gerenciamento de catálogo de animais e processo de triagem de adoção, desenvolvida para a disciplina de **Serviços Web** — IFSUL Campus Passo Fundo.

---

## Descrição do Domínio

Uma ONG de proteção animal precisa gerenciar um catálogo de gatos disponíveis para adoção e conduzir o processo de triagem dos adotantes. O sistema permite que qualquer pessoa visualize os gatos disponíveis; adotantes autenticados podem abrir pedidos de adoção; e a equipe da ONG pode aprovar ou rejeitar pedidos, com atualização automática do status dos animais.

---

## Pré-requisitos

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 13
- **npm** >= 9

---

## Passo a Passo para Execução

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd api-adocao-gatos
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adocao_gatos
DB_USER=postgres
DB_PASS=sua_senha_aqui
JWT_SECRET=troque_por_uma_chave_secreta_forte
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Criar o banco de dados

```bash
createdb adocao_gatos
```

Ou via psql:

```sql
CREATE DATABASE adocao_gatos;
```

### 4. Instalar dependências

```bash
npm install
```

### 5. Popular o banco com dados de exemplo

```bash
npm run seed
```

Cria **5 gatos** e **1 usuário padrão**:
- E-mail: `admin@adocao.com`
- Senha: `senha123`

### 6. Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento (hot-reload)
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Documentação Swagger UI

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

Para autenticar no Swagger:
1. Execute `POST /api/auth/login`
2. Copie o `token` retornado
3. Clique em **Authorize** (canto superior direito)
4. Cole o token no campo `BearerAuth`

---

## Tabela de Rotas

| Método | Rota | Auth | Descrição | Status Codes |
|--------|------|------|-----------|--------------|
| GET | `/api/gatos` | Não | Lista todos os gatos (suporta `?status=`) | 200, 400, 500 |
| GET | `/api/gatos/:id` | Não | Detalhes de um gato | 200, 404, 500 |
| POST | `/api/gatos` | Sim | Cadastra novo gato | 201, 400, 401, 500 |
| PUT | `/api/gatos/:id` | Sim | Atualiza dados de um gato | 200, 401, 404, 500 |
| DELETE | `/api/gatos/:id` | Sim | Remove um gato | 200, 401, 404, 500 |
| POST | `/api/auth/register` | Não | Cadastro de adotante | 201, 400, 409, 500 |
| POST | `/api/auth/login` | Não | Login — retorna JWT | 200, 400, 401, 500 |
| POST | `/api/pedidos-adocao` | Sim | Cria pedido de adoção | 201, 400, 401, 404, 409, 500 |
| GET | `/api/pedidos-adocao` | Sim | Lista todos os pedidos | 200, 401, 500 |
| GET | `/api/pedidos-adocao/meus` | Sim | Lista pedidos do usuário autenticado | 200, 401, 500 |
| PATCH | `/api/pedidos-adocao/:id/status` | Sim | Atualiza status do pedido | 200, 400, 401, 404, 409, 500 |

---

## Exemplo de Fluxo Completo

### 1. Cadastrar um adotante

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome": "Maria Silva", "email": "maria@email.com", "senha": "senha123"}'
```

### 2. Fazer login e obter o token JWT

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@email.com", "senha": "senha123"}'
```

Resposta:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "nome": "Maria Silva", "email": "maria@email.com" }
  }
}
```

### 3. Listar gatos disponíveis

```bash
curl http://localhost:3000/api/gatos?status=Disponível
```

### 4. Criar pedido de adoção

```bash
curl -X POST http://localhost:3000/api/pedidos-adocao \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "gato_id": "UUID_DO_GATO",
    "termos_aceitos": true,
    "links_comprovantes": ["https://drive.google.com/foto-casa"]
  }'
```

O status do gato muda automaticamente para **Em Análise**.

### 5. Aprovar o pedido (como gestor da ONG)

```bash
curl -X PATCH http://localhost:3000/api/pedidos-adocao/UUID_DO_PEDIDO/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"status_pedido": "Aprovado"}'
```

O status do gato muda para **Adotado** e todos os outros pedidos pendentes para este gato são automaticamente **Rejeitados**.

---

## Testes e Validação

### Ferramenta utilizada

**Postman** — cliente REST para criação e execução de requisições HTTP. Permite organizar endpoints em coleções, definir variáveis de ambiente (ex.: `baseUrl`, `token`) e visualizar respostas formatadas em JSON, facilitando a validação manual de todos os fluxos da API.

---

### Evidências de Teste

#### POST /api/auth/register — Registrar adotante

Register com campos obrigatórios ausentes
![Register faltando informações](docs/prints/register_faltando_info.png)

Register com e-mail já cadastrado
![Register e-mail duplicado](docs/prints/register_email_duplicado.png)

Register com sucesso
![Register com sucesso](docs/prints/register_success.png)

---

#### POST /api/auth/login — Login e obtenção do JWT

Login com credenciais inválidas
![Login com dados inválidos](docs/prints/login_invalido.png)

Login com sucesso retornando token JWT
![Login com sucesso](docs/prints/login_success.png)

---

#### GET /api/gatos — Listar gatos

Listagem sem filtro retornando todos os gatos
![Listar todos os gatos](docs/prints/gatos_listar_todos.png)

Listagem filtrada por `?status=Disponível`
![Listar gatos por status](docs/prints/gatos_listar_por_status.png)

---

#### GET /api/gatos/:id — Buscar gato por ID

Busca com ID inexistente retornando 404
![Gato não encontrado](docs/prints/gato_nao_encontrado.png)

Busca com sucesso retornando detalhes do gato
![Buscar gato por ID](docs/prints/gato_por_id.png)

---

#### POST /api/gatos — Cadastrar gato

Tentativa sem token retornando 401
![Cadastrar gato sem token](docs/prints/gato_sem_token.png)

Cadastro com sucesso
![Cadastrar gato com sucesso](docs/prints/gato_cadastrar.png)

---

#### PUT /api/gatos/:id — Atualizar gato

Atualização dos dados do gato pelo ID
![Atualizar gato](docs/prints/gato_atualizar.png)

---

#### DELETE /api/gatos/:id — Remover gato

Remoção do gato pelo ID
![Remover gato](docs/prints/gato_remover.png)

---

#### POST /api/pedidos-adocao — Criar pedido de adoção

Pedido com `termos_aceitos: false` retornando 400
![Pedido sem termos aceitos](docs/prints/pedido_termos_recusados.png)

Pedido para gato que não está disponível retornando 409
![Pedido gato indisponível](docs/prints/pedido_gato_indisponivel.png)

Pedido criado com sucesso — gato muda para `Em Análise`
![Criar pedido com sucesso](docs/prints/pedido_criar.png)

---

#### GET /api/pedidos-adocao — Listar todos os pedidos

Listagem sem token retornando 401
![Listar pedidos sem token](docs/prints/pedidos_sem_token.png)

Listagem com sucesso retornando pedidos com dados do adotante e do gato
![Listar todos os pedidos](docs/prints/pedidos_listar.png)

---

#### GET /api/pedidos-adocao/meus — Listar meus pedidos

Listagem dos pedidos do usuário autenticado
![Meus pedidos](docs/prints/pedidos_meus.png)

---

#### PATCH /api/pedidos-adocao/:id/status — Atualizar status do pedido

Atualização de pedido já finalizado retornando 409
![Pedido já finalizado](docs/prints/pedido_ja_finalizado.png)

Rejeição do pedido — gato volta para `Disponível`
![Rejeitar pedido](docs/prints/pedido_rejeitar.png)

Aprovação do pedido — gato muda para `Adotado` e demais pedidos pendentes são rejeitados automaticamente
![Aprovar pedido](docs/prints/pedido_aprovar.png)

---

## Regras de Negócio

1. Só é possível criar pedido para gato com `status_adocao = 'Disponível'`; ao criar, o status muda para `'Em Análise'`.
2. `termos_aceitos` deve ser `true` — pedidos com `false` ou campo ausente retornam 400.
3. Ao aprovar um pedido: gato → `'Adotado'`; demais pedidos pendentes para o mesmo gato → `'Rejeitado'`.
4. `senha_hash` nunca é retornada em nenhuma resposta da API.
5. Um adotante não pode abrir dois pedidos para o mesmo gato.

---

## Contextualização Tecnológica

### Por que Express.js?

O **Express** é o framework web mais utilizado para Node.js, com ecossistema maduro, documentação extensa e alto desempenho para APIs RESTful de médio porte. Sua filosofia minimalista permite controle granular sobre middlewares e roteamento.

**Alternativa considerada: Fastify** — mais performático (até 2× mais req/s em benchmarks), com validação de schema nativa via JSON Schema, ideal para microsserviços de alta carga. A curva de aprendizado é levemente maior.

### Por que Sequelize?

O **Sequelize** é um ORM maduro para Node.js com suporte a PostgreSQL, MySQL, SQLite e MSSQL. Oferece migrações, associações, validações e hooks, reduzindo drasticamente o SQL manual.

**Alternativa considerada: Prisma** — ORM moderno com type-safety nativa, auto-complete excepcional e uma DSL de schema declarativa. É a escolha preferida em novos projetos TypeScript, mas requer compilação e tem curva de adoção maior.

### Por que JWT?

O **JSON Web Token** é stateless — o servidor não precisa armazenar sessões. Ideal para APIs RESTful e arquiteturas distribuídas. O token carrega o payload criptografado, eliminando consulta ao banco a cada request autenticado.

**Alternativa considerada: OAuth2/OpenID Connect** — protocolo de autorização delegada, ideal quando há integração com provedores externos (Google, GitHub). Mais robusto para rotação de tokens e revogação, porém muito mais complexo de implementar do zero.

### Por que PostgreSQL?

O **PostgreSQL** é um banco relacional robusto, com suporte nativo a UUIDs, arrays (usado em `links_comprovantes`), ENUMs, JSONB e transações ACID. A consistência relacional é essencial para o modelo de dados com FKs entre Gato, User e PedidoAdocao.

**Alternativa considerada: MongoDB** — banco de documentos NoSQL, mais flexível para schemas dinâmicos e escalabilidade horizontal. Seria uma escolha válida se o domínio fosse menos relacional, mas o modelo de adoção tem relacionamentos fortes que se beneficiam da integridade referencial do SQL.

---

## Estrutura do Projeto

```
src/
├── config/
│   ├── database.js        # Configuração do Sequelize + PostgreSQL
│   └── swagger.js         # Configuração do Swagger UI
├── controllers/           # Entrada/saída HTTP, validação básica
│   ├── AuthController.js
│   ├── GatoController.js
│   └── PedidoAdocaoController.js
├── middlewares/
│   ├── authMiddleware.js  # Validação de Bearer JWT
│   └── errorHandler.js    # Handler centralizado + classe ApiError
├── models/                # Modelos Sequelize + associações
│   ├── index.js
│   ├── Gato.js
│   ├── User.js
│   └── PedidoAdocao.js
├── repositories/          # Acesso ao banco via Sequelize (DAO)
│   ├── GatoRepository.js
│   ├── UserRepository.js
│   └── PedidoAdocaoRepository.js
├── routes/                # Definição de endpoints
│   ├── index.js
│   ├── auth.js
│   ├── gatos.js
│   └── pedidosAdocao.js
├── seeders/
│   └── seed.js            # Dados iniciais de exemplo
├── services/              # Regras de negócio
│   ├── AuthService.js
│   ├── GatoService.js
│   └── PedidoAdocaoService.js
├── app.js                 # Configuração do Express
└── server.js              # Ponto de entrada
swagger/
└── openapi.yaml           # Documentação OpenAPI 3.0
```

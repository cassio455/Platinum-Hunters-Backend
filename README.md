# 🎮 Platinum Hunters - Backend

API RESTful para gerenciamento de biblioteca de jogos, com suporte a jogos customizados e tracking de conquistas.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação com JSON Web Tokens
- **Zod** - Validação de schemas
- **Swagger/OpenAPI** - Documentação interativa da API
- **Bcrypt** - Hash de senhas
- **ESLint** - Linter para qualidade de código

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- MongoDB

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/RuanPabloCR/Platinum-Hunters-Backend.git
cd Platinum-Hunters-Backend
```

2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
4. Faça o seed do banco de dados com jogos:
```bash
npm run seed:games
```
## 🏃 Executando

### Desenvolvimento (com hot-reload):
```bash
npm run dev
```

### Produção:
```bash
npm run build
npm start
```

## 📚 Documentação da API

Acesse a documentação interativa Swagger em:
```
http://localhost:3000/api-docs
```

## 🔑 Autenticação

A API usa JWT Bearer tokens. Para acessar rotas protegidas:

1. Registre um usuário em `POST /users/register`
2. Faça login em `POST /users/login` para receber o token
3. Use o token no header: `Authorization: Bearer {seu-token}`

## 📁 Estrutura do Projeto

```
src/
├── auth/           # Lógica de autenticação e tokens
├── data/           # Schemas do MongoDB
├── docs/           # Documentação OpenAPI/Swagger
├── exceptions/     # Classes de erro customizadas
├── middlewares/    # Middlewares Express
├── models/         # Modelos de domínio e schemas Zod
├── routes/         # Definição de rotas
├── scripts/        # Scripts utilitários
├── services/       # Lógica de negócio
└── utils/          # Funções auxiliares
```

## 🎯 Principais Endpoints

### Usuários
- `POST /users/register` - Registrar novo usuário
- `POST /users/login` - Autenticar usuário

### Jogos
- `GET /games` - Listar jogos
- `GET /games/:id` - Detalhes de um jogo
- `POST /games/filters` - Buscar com filtros

### Biblioteca
- `POST /library` - Adicionar jogo à biblioteca
- `GET /library` - Listar biblioteca do usuário
- `PATCH /library/:gameId` - Atualizar progresso
- `DELETE /library/:gameId` - Remover da biblioteca

### Jogos Customizados
- `POST /library/custom-games` - Criar jogo customizado
- `GET /library/custom-games` - Listar seus jogos
- `PATCH /library/custom-games/:id` - Atualizar jogo
- `DELETE /library/custom-games/:id` - Deletar jogo

## 👥 Autores


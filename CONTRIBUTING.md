# 📋 Padrões do Projeto - Guia para Contribuidores

## ⚠️ IMPORTANTE: Leia antes de criar Pull Requests

Este documento contém os padrões estabelecidos no projeto. **Siga-os rigorosamente** para evitar refatorações e retrabalho.

---

## 🔑 1. Identificadores (IDs)

### ✅ CORRETO
```typescript
// Sempre use UUID para validação de IDs
const schema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  gameId: z.string().uuid()
});
```

### ❌ INCORRETO
```typescript
// NUNCA use apenas string() para IDs
const schema = z.object({
  id: z.string(), // ❌ Permite qualquer string
  userId: z.string() // ❌ Sem validação de formato
});
```

**Motivo:** UUIDs garantem integridade e evitam injeção de dados maliciosos.

---

## 🗄️ 2. Estrutura de Dados e Normalização

### ✅ CORRETO
```typescript
// Separe dados em documents específicos
// UserDocument: dados básicos do usuário
// UserRankingDataDocument: dados de ranking/gamificação
// CompletedChallengeDocument: relacionamentos user-challenge
```

### ❌ INCORRETO
```typescript
// NUNCA coloque tudo num único documento
const UserSchema = new Schema({
  username: String,
  email: String,
  coins: Number, // ❌ Deveria estar em UserRankingDataDocument
  completedChallenges: [Number], // ❌ Deveria ser document separado
  ownedTitles: [String] // ❌ Deveria estar em UserRankingDataDocument
});
```

**Motivo:** Normalização previne duplicação de dados e facilita manutenção.

---

## 🔒 3. Validação de Dados

### ✅ CORRETO
```typescript
// 1. SEMPRE crie schema de validação Zod
export const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url().optional(),
  price: z.number().min(0)
});

// 2. Use middleware de validação
route.post('/items', 
  authMiddleware,
  validate(createItemSchema), // ✅ Validação antes do handler
  async (req, res) => { ... }
);

// 3. NO SERVICE: dados já validados pelo schema
export const createItemService = async (data: z.infer<typeof createItemSchema>) => {
  // ✅ Não aceite dados do body que não foram validados
  return await ItemModel.create(data);
};
```

### ❌ INCORRETO
```typescript
// NUNCA aceite dados sem validação
route.post('/items', async (req, res) => {
  const { name, price, randomField } = req.body; // ❌ Sem validação
  const item = await createItemService({ name, price, randomField }); // ❌ Falha de segurança
});

// NUNCA extraia campos não validados do req.body
const { name, profileImageUrl } = req.body; // ❌ profileImageUrl não está no schema
createUserService({ name, profileImageUrl }); // ❌ Dado não validado
```

**Motivo:** Previne injeção de dados maliciosos e garante integridade.

---

## 🎯 4. Segurança - Validação Server-Side

### ✅ CORRETO
```typescript
// SEMPRE busque valores críticos do servidor
route.post('/complete-challenge', async (req, res) => {
  const { challengeDay } = req.body; // ✅ Apenas o ID vem do cliente
  
  const challenge = await ChallengeModel.findOne({ day: challengeDay });
  const pointsToAward = challenge.points; // ✅ Pontos vêm do servidor
  
  await updateUserPoints(userId, pointsToAward);
});
```

### ❌ INCORRETO
```typescript
// NUNCA confie em valores críticos enviados pelo cliente
route.post('/complete-challenge', async (req, res) => {
  const { challengeDay, points } = req.body; // ❌ Cliente envia pontos
  await updateUserPoints(userId, points); // ❌ FALHA DE SEGURANÇA CRÍTICA
  // Cliente pode enviar points: 999999
});
```

**Motivo:** Cliente pode manipular qualquer dado enviado. Valores críticos (pontos, moedas, permissões) SEMPRE devem vir do servidor.

---

## 🌱 5. Seeds e Scripts

### ✅ CORRETO
```typescript
// 1. Seeds em src/scripts/ (não em src/data/)
// src/scripts/seedUsers.ts
// src/scripts/seedTitles.ts
// src/scripts/seedChallenges.ts

// 2. SEMPRE use services para criar dados
export const seedUsers = async () => {
  for (const userData of USERS) {
    await createUserService({ // ✅ Usa service com hash de senha
      username: userData.username,
      email: userData.email,
      password: userData.password // ✅ Service fará o hash
    });
  }
};

// 3. Script executável independentemente
const runSeed = async () => {
  await mongoose.connect(MONGODB_URI);
  await seedUsers();
  await mongoose.disconnect();
};
runSeed();

// 4. Adicione no package.json
"scripts": {
  "seed:users": "tsx src/scripts/seedUsers.ts"
}
```

### ❌ INCORRETO
```typescript
// NUNCA crie dados direto no Model sem passar por services
await UserModel.create({
  username: "test",
  passwordHash: "plain_password" // ❌ Senha sem hash = FALHA DE SEGURANÇA
});

// NUNCA coloque seeds em src/data/seeder.ts
// NUNCA rode seeds automaticamente no startup do servidor
```

**Motivo:** Services garantem validações, hashing de senhas e lógica de negócio consistente.

---

## 🔐 6. Autenticação e Autorização

### ✅ CORRETO
```typescript
// 1. NUNCA retorne roles no response de login
export const loginService = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  // ...validações
  
  const token = jwt.sign({ 
    userId: user.id, 
    roles: user.roles // ✅ Roles vão pro TOKEN
  }, SECRET);
  
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
      // ✅ SEM roles aqui
    }
  };
};

// 2. Roles vêm do token decodificado
route.post('/admin-action', 
  authMiddleware, // ✅ Decodifica token e adiciona req.user
  authorize(UserRole.ADMIN), // ✅ Verifica role do token
  async (req, res) => { ... }
);
```

### ❌ INCORRETO
```typescript
// NUNCA retorne roles no response
return {
  token,
  user: {
    id: user.id,
    roles: user.roles // ❌ FALHA DE SEGURANÇA
  }
};
// Cliente pode modificar roles localmente
```

**Motivo:** Roles devem vir apenas do token JWT, que é assinado e não pode ser alterado pelo cliente.

---

## 📚 7. Documentação Swagger/OpenAPI

### ✅ CORRETO
```typescript
// 1. Toda rota DEVE ter documentação em src/docs/paths/
// src/docs/paths/users.ts
// src/docs/paths/games.ts
// src/docs/paths/ranking.ts

// 2. Documente request body, responses, autenticação
registry.registerPath({
  method: 'post',
  path: '/users/login',
  summary: 'Login de usuário',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginSchema // ✅ Mesmo schema do Zod
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Login bem-sucedido',
      content: {
        'application/json': {
          schema: z.object({
            token: z.string(),
            user: z.object({ ... }) // ✅ Documenta response real
          })
        }
      }
    }
  }
});

// 3. Registre no src/docs/openapi.ts
import { usersDoc } from './paths/users.js';
```

### ❌ INCORRETO
```typescript
// NUNCA crie rotas sem documentação
route.post('/new-feature', async (req, res) => { ... }); // ❌ Sem docs

// NUNCA deixe documentação desatualizada
// Response real: { token, user, coins, rankingPoints }
// Documentação: { token, user } // ❌ Incompleta
```

---

## 📝 8. Schemas Zod

### ✅ CORRETO
```typescript
// 1. Um schema para cada operação em src/models/schemas/
export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  profileImageUrl: z.string().url().optional() // ✅ Valida se fornecido
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  profileImageUrl: z.string().url().optional()
});

// 2. Use .optional() para campos opcionais
// 3. Use validações apropriadas (.email(), .url(), .uuid(), .min(), .max())
```

### ❌ INCORRETO
```typescript
// NUNCA aceite campos não documentados
const schema = z.object({
  username: z.string()
  // email não está aqui
});

route.post('/users', validate(schema), async (req, res) => {
  const { username, email } = req.body; // ❌ email não foi validado
});
```

---

## 🏗️ 9. Arquitetura de Pastas

```
src/
├── data/
│   └── documents/          # ✅ Mongoose schemas/models
│       ├── userDocument.ts
│       ├── userRankingDataDocument.ts
│       └── completedChallengeDocument.ts
├── models/
│   └── schemas/            # ✅ Zod validation schemas
│       ├── user.ts
│       ├── game.ts
│       └── rankingSchemas.ts
├── services/               # ✅ Lógica de negócio
│   ├── user/
│   │   ├── createUserService.ts
│   │   └── loginService.ts
│   └── game/
├── routes/                 # ✅ Definição de rotas
│   ├── users.ts
│   ├── games.ts
│   └── ranking.ts
├── middlewares/            # ✅ Auth, validação, error handling
├── docs/                   # ✅ Documentação OpenAPI
│   ├── openapi.ts
│   └── paths/
│       ├── users.ts
│       └── games.ts
└── scripts/                # ✅ Seeds e scripts utilitários
    ├── seedUsers.ts
    ├── seedTitles.ts
    └── seedChallenges.ts
```

### ❌ NUNCA:
- Crie models fora de `data/documents/`
- Crie validações fora de `models/schemas/`
- Coloque lógica de negócio nas rotas
- Misture seeds com código de produção

---

## ✅ Checklist Antes de Criar Pull Request

- [ ] Todos os IDs são validados com `.uuid()`
- [ ] Schemas Zod criados para todos os endpoints
- [ ] Middleware `validate()` aplicado em todas as rotas
- [ ] Dados críticos (pontos, moedas) vêm do servidor, não do cliente
- [ ] Services usados para criar/atualizar dados (nunca Model direto)
- [ ] Senhas sempre com hash (via service)
- [ ] Roles NÃO retornadas em responses (apenas no token)
- [ ] Seeds em `src/scripts/` executáveis via `package.json`
- [ ] Documentação Swagger criada em `src/docs/paths/`
- [ ] Documentação registrada em `src/docs/openapi.ts`
- [ ] Dados normalizados (sem duplicação entre documents)
- [ ] Código segue estrutura de pastas do projeto

---

## 🚨 Violações Comuns que Causam Rejeição

1. ❌ Criar schemas de validação duplicados
2. ❌ Aceitar dados do `req.body` sem validação
3. ❌ Permitir cliente enviar valores críticos (pontos, moedas)
4. ❌ Salvar senhas sem hash
5. ❌ Retornar roles em responses
6. ❌ Criar dados diretamente no Model sem usar services
7. ❌ Seeds sem seguir o padrão de scripts
8. ❌ Rotas sem documentação Swagger
9. ❌ IDs validados como `string()` ao invés de `uuid()`
10. ❌ Dados desnormalizados (informações duplicadas)

---

## 📞 Dúvidas?

Antes de implementar algo novo:
1. Verifique exemplos existentes no código
2. Siga o padrão já estabelecido
3. Em caso de dúvida, pergunte ANTES de codificar

**Lembre-se:** Seguir esses padrões economiza tempo de todos e mantém o projeto sustentável! 🚀

// src/index.ts
import 'dotenv/config'
import express, { type Request, type Response } from "express"
import swaggerUi from "swagger-ui-express"
import doc from "./docs/openapi.js"
import cors from "cors"
import libraryRoutes from './routes/library.js'
import userRoutes from './routes/users.js'
import gameRoutes from './routes/games.js'; 
import { connectDB } from './data/database.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'

// REMOVIDO: import passport from './middlewares/passportConfig.js';

import rankingRoutes from './routes/ranking.js'
import trophiesRoutes from './routes/trophies.js';

const app = express()
const PORT = process.env.PORT || 3000

connectDB();

// Middlewares globais
app.use(express.json())
app.use(cors())

// REMOVIDO: app.use(passport.initialize());

// Rotas
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(doc))
app.use(userRoutes)
app.use(libraryRoutes)
app.use(gameRoutes); 
app.use(rankingRoutes);
app.use(trophiesRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

// Middleware para rotas não encontradas
app.use(notFoundHandler)

// Middleware de tratamento de erro (Zod + outros)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
  console.log(`Swagger: http://localhost:${PORT}/swagger`)
})
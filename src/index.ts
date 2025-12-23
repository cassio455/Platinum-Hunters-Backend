import 'dotenv/config'
import express, { type Request, type Response } from "express"
import swaggerUi from "swagger-ui-express"
import doc from "./docs/openapi.js"
import cors from "cors"
import libraryRoutes from './routes/library.js'
import userRoutes from './routes/users.js'
import gameRoutes from './routes/games.js';
import genreRoutes from './routes/genres.js';
import platformRoutes from './routes/platforms.js';
import { connectDB } from './data/database.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
import rankingRoutes from './routes/ranking.js'
import trophyRoutes from './routes/trophies.js';

const app = express()
const PORT = process.env.PORT || 3000

connectDB();

app.use(express.json())
app.use(cors())

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(doc));
app.use(userRoutes);
app.use(libraryRoutes);
app.use(rankingRoutes);
app.use(gameRoutes);
app.use(genreRoutes);
app.use(platformRoutes);
app.use(trophyRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`)
  console.log(`Swagger: http://localhost:${PORT}/swagger`)
})

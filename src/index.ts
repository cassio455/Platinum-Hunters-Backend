import express, { Router, type Request, type Response } from "express"

const app = express()

const route = Router()

app.use(route)

const PORT = 3000
app.use(express.json())

route.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!")
})
app.listen(PORT, () => `Server running on port ${PORT}`)


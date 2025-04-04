import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'node:path'

import routes from './routes/index.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.static(path.resolve('public')))

const API_VERSION = 'v1'

// ✅ Utilisation de for...of pour respecter biomelint
const currentRoutes = routes[API_VERSION]
for (const [routeName, router] of Object.entries(currentRoutes)) {
  app.use(`/api/${API_VERSION}/${routeName}`, router)
}

export default app
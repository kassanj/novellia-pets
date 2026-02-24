import express from 'express'
import cors from 'cors'
import petsRouter from './routes/pets'
import recordsRouter from './routes/records'
import dashboardRouter from './routes/dashboard'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/pets', petsRouter)
app.use('/api/pets/:petId/records', recordsRouter)
app.use('/api/dashboard', dashboardRouter)

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
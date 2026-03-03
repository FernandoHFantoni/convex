require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const platformRoutes = require('./routes/platforms')
const campaignRoutes = require('./routes/campaigns')
const aiRoutes = require('./routes/ai')
const { authenticate } = require('./middleware/authenticate')

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Rate limiting global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}))

// Rate limiting específico para auth
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: { error: 'Muitas tentativas. Aguarde 1 minuto.' }
})

// ── Rotas públicas ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date() }))
app.use('/auth', authLimiter, authRoutes)

// ── Rotas protegidas ─────────────────────────────────────────────────────────
app.use('/platforms', authenticate, platformRoutes)
app.use('/campaigns', authenticate, campaignRoutes)
app.use('/ai', authenticate, aiRoutes)

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Erro interno' })
})

app.listen(PORT, () => {
  console.log(`Convex API rodando na porta ${PORT}`)
})

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { PrismaClient } = require('@prisma/client')
const { z } = require('zod')

const prisma = new PrismaClient()

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = uuidv4()
  return { accessToken, refreshToken }
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
    })
    const { name, email, password } = schema.parse(req.body)

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(409).json({ error: 'Email já cadastrado' })

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    })

    // Criar org pessoal automaticamente
    const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
    const org = await prisma.organization.create({
      data: {
        name: `${name}'s Workspace`,
        slug: `${orgSlug}-${uuidv4().slice(0, 6)}`,
        ownerId: user.id,
        members: { create: { userId: user.id, role: 'owner' } }
      }
    })

    const { accessToken, refreshToken } = generateTokens(user.id)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      org: { id: org.id, name: org.name, slug: org.slug },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar conta' })
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Credenciais inválidas' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' })

    const { accessToken, refreshToken } = generateTokens(user.id)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Buscar org principal
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { org: true }
    })

    res.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      org: membership ? { id: membership.org.id, name: membership.org.name, slug: membership.org.slug } : null,
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
})

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token obrigatório' })

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado' })
    }

    // Rotation: delete old, create new
    await prisma.refreshToken.delete({ where: { id: stored.id } })

    const { accessToken, refreshToken: newRefresh } = generateTokens(stored.userId)
    await prisma.refreshToken.create({
      data: {
        userId: stored.userId,
        token: newRefresh,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.json({ accessToken, refreshToken: newRefresh })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao renovar token' })
  }
})

// POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Erro ao fazer logout' })
  }
})

// GET /auth/me
router.get('/me', require('../middleware/authenticate').authenticate, async (req, res) => {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: req.user.id },
    include: { org: true }
  })
  res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email, plan: req.user.plan },
    orgs: memberships.map(m => ({ ...m.org, role: m.role }))
  })
})

module.exports = router

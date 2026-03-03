const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

module.exports = { authenticate }

const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const { encrypt, decrypt } = require('../utils/crypto')

const prisma = new PrismaClient()

// GET /platforms — listar conexões da org
router.get('/', async (req, res) => {
  try {
    const orgId = req.query.orgId
    if (!orgId) return res.status(400).json({ error: 'orgId obrigatório' })

    const connections = await prisma.platformConnection.findMany({
      where: { orgId, isActive: true },
      select: {
        id: true, platform: true, accountId: true,
        accountName: true, lastSyncAt: true, scopes: true, createdAt: true
      }
    })
    res.json(connections)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar conexões' })
  }
})

// ── META ADS ─────────────────────────────────────────────────────────────────

// GET /platforms/meta/connect?orgId=xxx
router.get('/meta/connect', (req, res) => {
  const { orgId } = req.query
  if (!orgId) return res.status(400).json({ error: 'orgId obrigatório' })

  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    redirect_uri: `${process.env.API_URL}/platforms/meta/callback`,
    scope: 'ads_read,ads_management,business_management',
    state: orgId,
    response_type: 'code',
  })

  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`)
})

// GET /platforms/meta/callback
router.get('/meta/callback', async (req, res) => {
  try {
    const { code, state: orgId } = req.query
    if (!code) return res.status(400).json({ error: 'Código não recebido' })

    // Trocar code por access_token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: `${process.env.API_URL}/platforms/meta/callback`,
        code,
      })
    )
    const tokenData = await tokenRes.json()
    if (tokenData.error) throw new Error(tokenData.error.message)

    // Buscar info da conta
    const meRes = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${tokenData.access_token}`
    )
    const me = await meRes.json()

    // Salvar conexão no banco
    await prisma.platformConnection.upsert({
      where: { orgId_platform_accountId: { orgId, platform: 'meta', accountId: me.id } },
      create: {
        orgId, platform: 'meta',
        accountId: me.id,
        accountName: me.name,
        accessTokenEnc: encrypt(tokenData.access_token),
        scopes: ['ads_read', 'ads_management', 'business_management'],
        tokenExpiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      },
      update: {
        accessTokenEnc: encrypt(tokenData.access_token),
        accountName: me.name,
        isActive: true,
      }
    })

    res.redirect(`${process.env.FRONTEND_URL}/settings?connected=meta`)
  } catch (err) {
    console.error('Meta callback error:', err)
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=meta`)
  }
})

// GET /platforms/meta/campaigns?connectionId=xxx
router.get('/meta/campaigns', async (req, res) => {
  try {
    const { connectionId } = req.query
    const conn = await prisma.platformConnection.findUnique({ where: { id: connectionId } })
    if (!conn) return res.status(404).json({ error: 'Conexão não encontrada' })

    const token = decrypt(conn.accessTokenEnc)

    // Buscar Ad Accounts
    const accsRes = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${token}`
    )
    const accs = await accsRes.json()

    res.json(accs.data || [])
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campanhas Meta' })
  }
})

// GET /platforms/meta/insights?connectionId=xxx&adAccountId=act_xxx&since=YYYY-MM-DD&until=YYYY-MM-DD
router.get('/meta/insights', async (req, res) => {
  try {
    const { connectionId, adAccountId, since, until } = req.query
    const conn = await prisma.platformConnection.findUnique({ where: { id: connectionId } })
    if (!conn) return res.status(404).json({ error: 'Conexão não encontrada' })

    const token = decrypt(conn.accessTokenEnc)

    const params = new URLSearchParams({
      fields: 'campaign_id,campaign_name,impressions,clicks,conversions,spend,purchase_roas,reach',
      level: 'campaign',
      time_range: JSON.stringify({ since: since || '2025-01-01', until: until || new Date().toISOString().split('T')[0] }),
      access_token: token,
    })

    const insightsRes = await fetch(
      `https://graph.facebook.com/v18.0/${adAccountId}/insights?${params}`
    )
    const insights = await insightsRes.json()

    res.json(insights.data || [])
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar insights Meta' })
  }
})

// ── GOOGLE ADS ────────────────────────────────────────────────────────────────

router.get('/google/connect', (req, res) => {
  const { orgId } = req.query
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.API_URL}/platforms/google/callback`,
    scope: 'https://www.googleapis.com/auth/adwords',
    access_type: 'offline',
    response_type: 'code',
    state: orgId,
    prompt: 'consent',
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

router.get('/google/callback', async (req, res) => {
  try {
    const { code, state: orgId } = req.query

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.API_URL}/platforms/google/callback`,
        grant_type: 'authorization_code',
      })
    })
    const tokenData = await tokenRes.json()

    // Buscar info do usuário
    const meRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })
    const me = await meRes.json()

    await prisma.platformConnection.upsert({
      where: { orgId_platform_accountId: { orgId, platform: 'google', accountId: me.id } },
      create: {
        orgId, platform: 'google',
        accountId: me.id,
        accountName: me.email,
        accessTokenEnc: encrypt(tokenData.access_token),
        refreshTokenEnc: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
        scopes: ['https://www.googleapis.com/auth/adwords'],
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      update: {
        accessTokenEnc: encrypt(tokenData.access_token),
        refreshTokenEnc: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : undefined,
        isActive: true,
      }
    })

    res.redirect(`${process.env.FRONTEND_URL}/settings?connected=google`)
  } catch (err) {
    console.error('Google callback error:', err)
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=google`)
  }
})

// DELETE /platforms/:id — desconectar
router.delete('/:id', async (req, res) => {
  try {
    await prisma.platformConnection.update({
      where: { id: req.params.id },
      data: { isActive: false }
    })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Erro ao desconectar' })
  }
})

module.exports = router

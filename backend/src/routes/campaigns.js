const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// GET /campaigns?orgId=xxx&platform=meta&since=2025-01-01&until=2025-03-01
router.get('/', async (req, res) => {
  try {
    const { orgId, platform, since, until } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId obrigatório' })

    const connections = await prisma.platformConnection.findMany({
      where: {
        orgId,
        isActive: true,
        ...(platform ? { platform } : {})
      }
    })

    const connectionIds = connections.map(c => c.id)

    const campaigns = await prisma.campaign.findMany({
      where: { connectionId: { in: connectionIds } },
      include: {
        connection: { select: { platform: true, accountName: true } },
        metrics: {
          where: {
            ...(since || until ? {
              date: {
                ...(since ? { gte: new Date(since) } : {}),
                ...(until ? { lte: new Date(until) } : {}),
              }
            } : {})
          },
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Agregar métricas por campanha
    const result = campaigns.map(c => {
      const totals = c.metrics.reduce((acc, m) => ({
        impressions: acc.impressions + Number(m.impressions),
        clicks: acc.clicks + Number(m.clicks),
        conversions: acc.conversions + m.conversions,
        spend: acc.spend + Number(m.spend),
        revenue: acc.revenue + Number(m.revenue),
      }), { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 })

      return {
        id: c.id,
        externalId: c.externalId,
        name: c.name,
        status: c.status,
        platform: c.connection.platform,
        accountName: c.connection.accountName,
        budgetTotal: c.budgetTotal,
        startDate: c.startDate,
        endDate: c.endDate,
        ...totals,
        roas: totals.spend > 0 ? totals.revenue / totals.spend : 0,
        ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar campanhas' })
  }
})

// GET /campaigns/summary?orgId=xxx
router.get('/summary', async (req, res) => {
  try {
    const { orgId } = req.query
    if (!orgId) return res.status(400).json({ error: 'orgId obrigatório' })

    const connections = await prisma.platformConnection.findMany({
      where: { orgId, isActive: true }
    })

    const connectionIds = connections.map(c => c.id)

    const metrics = await prisma.campaignMetric.groupBy({
      by: ['connectionId'],
      where: { connectionId: { in: connectionIds } },
      _sum: { impressions: true, clicks: true, conversions: true, spend: true, revenue: true }
    })

    const summary = {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpend: 0,
      totalRevenue: 0,
      byPlatform: {}
    }

    for (const m of metrics) {
      const conn = connections.find(c => c.id === m.connectionId)
      const s = m._sum
      summary.totalImpressions += Number(s.impressions || 0)
      summary.totalClicks += Number(s.clicks || 0)
      summary.totalConversions += s.conversions || 0
      summary.totalSpend += Number(s.spend || 0)
      summary.totalRevenue += Number(s.revenue || 0)

      if (conn) {
        if (!summary.byPlatform[conn.platform]) {
          summary.byPlatform[conn.platform] = { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 }
        }
        const p = summary.byPlatform[conn.platform]
        p.impressions += Number(s.impressions || 0)
        p.clicks += Number(s.clicks || 0)
        p.conversions += s.conversions || 0
        p.spend += Number(s.spend || 0)
        p.revenue += Number(s.revenue || 0)
      }
    }

    summary.roas = summary.totalSpend > 0 ? summary.totalRevenue / summary.totalSpend : 0
    summary.ctr = summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions) * 100 : 0

    res.json(summary)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sumário' })
  }
})

module.exports = router

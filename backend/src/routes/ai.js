const router = require('express').Router()
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /ai/analyze-campaign
router.post('/analyze-campaign', async (req, res) => {
  try {
    const { campaign } = req.body
    if (!campaign) return res.status(400).json({ error: 'Dados da campanha obrigatórios' })

    const prompt = `Você é especialista em performance marketing. Analise em português brasileiro:

**CAMPANHA:** ${campaign.name}
**PLATAFORMA:** ${campaign.platform}
**STATUS:** ${campaign.status}
**INVESTIMENTO:** R$ ${campaign.spend?.toFixed(2)}
**RECEITA:** R$ ${campaign.revenue?.toFixed(2)}
**ROAS:** ${campaign.roas?.toFixed(2)}x
**CONVERSÕES:** ${campaign.conversions}
**CTR:** ${campaign.ctr?.toFixed(2)}%
**IMPRESSÕES:** ${campaign.impressions?.toLocaleString('pt-BR')}

Forneça:
1. Diagnóstico da performance
2. Top 3 ações recomendadas
3. Alertas de atenção (se houver)

Máximo 250 palavras. Seja direto e prático.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    res.json({ analysis: message.content[0].text })
  } catch (err) {
    console.error('AI error:', err)
    res.status(500).json({ error: 'Erro ao gerar análise de IA' })
  }
})

module.exports = router

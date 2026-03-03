import { useState, useEffect } from "react";

// ─── BREAKPOINT HOOK ─────────────────────────────────────────────────────────
const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1024, isDesktop: w >= 1024, w };
};

// ─── PLATFORMS ───────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "meta",         name: "Meta Ads",      icon: "◈", color: "#1877F2" },
  { id: "google",       name: "Google Ads",    icon: "◉", color: "#EA4335" },
  { id: "tiktok",       name: "TikTok Ads",    icon: "◆", color: "#FF004F" },
  { id: "mercadolivre", name: "Mercado Livre", icon: "◑", color: "#FFE600" },
  { id: "amazon",       name: "Amazon Ads",    icon: "◐", color: "#FF9900" },
];

// ─── PLATFORM METRICS ────────────────────────────────────────────────────────
const PM = {
  meta: {
    campaigns:8, impressions:4820000, clicks:142600, conversions:3810,
    revenue:287400, spend:48200, ctr:2.96, cpc:0.34, cpm:10.0,
    hookRate:38.2, frequency:3.4, reach:1420000, roas:5.96, videoViews:892000, thumbstopRate:31.4,
    breakdown:[{name:"Tráfego",spend:15200,conversions:820,revenue:68400},{name:"Conversão",spend:22400,conversions:2310,revenue:189200},{name:"Awareness",spend:10600,conversions:680,revenue:29800}],
  },
  google: {
    campaigns:12, impressions:6340000, clicks:198200, conversions:5240,
    revenue:412800, spend:67300, ctr:3.13, cpc:0.34, cpm:10.6,
    hookRate:null, frequency:null, reach:3200000, roas:6.13, qualityScore:7.4, impressionShare:62.3, searchTopIS:41.2,
    breakdown:[{name:"Search",spend:38200,conversions:3420,revenue:278400},{name:"Display",spend:12800,conversions:980,revenue:72600},{name:"Shopping",spend:16300,conversions:840,revenue:61800}],
  },
  tiktok: {
    campaigns:5, impressions:8920000, clicks:201400, conversions:2140,
    revenue:128400, spend:32100, ctr:2.26, cpc:0.16, cpm:3.6,
    hookRate:54.8, frequency:2.1, reach:4280000, roas:4.0, videoViews:3820000, avgWatchTime:8.4, completionRate:22.1,
    breakdown:[{name:"In-Feed Ads",spend:18200,conversions:1320,revenue:79200},{name:"TopView",spend:8400,conversions:520,revenue:31000},{name:"Branded Effect",spend:5500,conversions:300,revenue:18200}],
  },
  mercadolivre: {
    campaigns:6, impressions:2140000, clicks:89200, conversions:4820,
    revenue:384200, spend:28400, ctr:4.17, cpc:0.32, cpm:13.3,
    hookRate:null, frequency:null, reach:1820000, roas:13.53, productAds:4, displayAds:2, cartAbandon:28.4,
    breakdown:[{name:"Product Ads",spend:18200,conversions:3410,revenue:272400},{name:"Display",spend:10200,conversions:1410,revenue:111800}],
  },
  amazon: {
    campaigns:4, impressions:1820000, clicks:62400, conversions:3120,
    revenue:249600, spend:21800, ctr:3.43, cpc:0.35, cpm:12.0,
    hookRate:null, frequency:null, reach:1420000, roas:11.45, acos:8.74, tacos:12.3, organicSales:148200,
    breakdown:[{name:"Sponsored Products",spend:14200,conversions:2140,revenue:171200},{name:"Sponsored Brands",spend:7600,conversions:980,revenue:78400}],
  },
};

// ─── CREATIVE FORMATS PER PLATFORM ──────────────────────────────────────────
const CREATIVE_FORMATS = {
  meta:         ["Vídeo 9:16","Carrossel","Imagem Estática","Stories","Reels"],
  google:       ["Anúncio de Texto","Display Banner","Responsive Search","Shopping","Discovery"],
  tiktok:       ["Vídeo In-Feed","TopView","Branded Hashtag","Spark Ads","Collection"],
  mercadolivre: ["Product Listing","Display Banner","Sponsored Brand","Showcase"],
  amazon:       ["Sponsored Product","Sponsored Brand","Display","Video Ad","DSP"],
};

// ─── CAMPAIGN META-DATA (description + audience) ─────────────────────────────
const CAMPAIGN_META = {
  "Black Friday Retargeting": {
    description: "Campanha de remarketing para usuários que visitaram páginas de produto mas não finalizaram a compra nos últimos 30 dias. Foco em recuperação de carrinho abandonado com oferta de desconto exclusivo.",
    audience: "Visitantes do site (últimos 30d) + Abandonadores de carrinho. Faixa etária 25–45 anos, classes B/C, interesse em compras online e promoções sazonais.",
  },
  "Prospecção Fria - Lookalike": {
    description: "Campanha de aquisição voltada a novos públicos semelhantes à base de clientes convertidos. Utiliza audiências Lookalike 1–3% a partir dos top compradores dos últimos 90 dias.",
    audience: "Lookalike 1–3% dos compradores convertidos. Público novo, nunca interagiu com a marca. Perfil demográfico alinhado ao cliente ideal: 28–50 anos, renda média-alta.",
  },
  "Carnaval 2025": {
    description: "Campanha sazonal para o período de Carnaval com criativo temático e urgência temporal. Ofertas especiais por tempo limitado com contagem regressiva nos criativos.",
    audience: "Público amplo 18–40 anos, regiões Sul/Sudeste/Nordeste. Interesses em festas, música, moda e entretenimento. Excluídos clientes com compra nos últimos 7 dias.",
  },
  "Lançamento Produto X": {
    description: "Campanha de lançamento para novo produto da linha premium. Objetivo de gerar awareness e primeiras vendas com desconto especial de inauguração para early adopters.",
    audience: "Base de clientes VIP (compradores recorrentes) + Lookalike 1% de heavy buyers. Segmento premium, renda alta, early adopters de tecnologia e inovação.",
  },
  "Retenção Base Ativa": {
    description: "Campanha de CRM para reengajar clientes que compraram entre 60–120 dias atrás e não voltaram. Foco em cross-sell de categorias complementares com oferta de fidelidade.",
    audience: "Clientes com última compra entre 60–120 dias. Segmentação por categoria de produto mais comprada para mensagem personalizada por vertical.",
  },
  "Awareness Q1": {
    description: "Campanha de topo de funil para construção de marca no primeiro trimestre. Sem objetivo de conversão direta — foco em alcance, frequência e recall de marca.",
    audience: "Público amplo por interesse, sem restrição de compra anterior. 18–55 anos, alinhado ao ICP da marca. Exclusão de clientes ativos para evitar desperdício de budget.",
  },
  "Conversão Mid-Funnel": {
    description: "Campanha de meio de funil para usuários que engajaram com conteúdo mas ainda não compraram. Mensagem educativa mostrando benefícios e prova social com depoimentos.",
    audience: "Engajados com conteúdo (vídeo 50%+, curtidas, comentários, salvo) nos últimos 60 dias. Excluídos compradores. Perfil consideração de compra.",
  },
  "Shopping Performance Max": {
    description: "Campanha de Performance Max no Google Ads cobrindo todo o inventário disponível. Algoritmo automatizado com feed de produtos otimizado para maximizar conversões.",
    audience: "Targeting automático baseado em intenção de compra e histórico de conversão. Cobertura Search + Display + YouTube + Shopping + Gmail + Discovery.",
  },
  "Branding Institucional": {
    description: "Campanha institucional de branding para reforçar posicionamento de marca e diferencial competitivo. Conteúdo de valor, storytelling e construção de identidade.",
    audience: "Público amplo com segmentação por interesses alinhados ao posicionamento da marca. Faixa etária 22–50 anos, perfil aspiracional e decisores.",
  },
  "Lead Gen B2B": {
    description: "Campanha de geração de leads qualificados para o segmento B2B. Oferece material rico (e-book / webinar) em troca de contato. Lead entregue ao time comercial para follow-up.",
    audience: "Tomadores de decisão em empresas de médio/grande porte. Cargos: CEO, CMO, Diretor, Gerente. Segmentação por cargo no LinkedIn/Meta, empresas 50–500 funcionários.",
  },
  "Upsell Premium": {
    description: "Campanha de upsell direcionada a clientes que compraram o produto base e possuem perfil para upgrade ao plano premium. Oferta exclusiva para a base atual.",
    audience: "Clientes ativos do plano básico com pelo menos 1 compra nos últimos 90 dias e ticket médio acima de R$ 150. Excluídos já premium.",
  },
  "Re-engajamento 90d": {
    description: "Win-back campaign para clientes inativos entre 90–180 dias. Abordagem com oferta de reativação agressiva e pesquisa de motivo de inatividade para CRM.",
    audience: "Clientes com última compra entre 90–180 dias e sem interação recente. Segmentados por valor histórico (LTV) — maiores LTV recebem oferta mais generosa.",
  },
};

// ─── CREATIVE TEMPLATES PER CAMPAIGN ─────────────────────────────────────────
const makeCreatives = (platform, campaignName, idx) => {
  const fmts = CREATIVE_FORMATS[platform] || ["Banner","Vídeo"];
  const statuses = ["active","active","paused","active"];
  const ctrs = [2.1, 3.4, 1.8, 4.2, 2.9];
  const hooks = [42.1, 28.4, 55.6, 33.2, 61.0];
  const convRates = [1.2, 2.8, 0.9, 3.4, 1.7];

  return fmts.slice(0, Math.min(fmts.length, 3 + (idx % 2))).map((fmt, i) => ({
    id: `cr-${platform}-${idx}-${i}`,
    name: `${campaignName.split(" ")[0]} · ${fmt}`,
    format: fmt,
    status: statuses[(i + idx) % statuses.length],
    impressions: Math.floor(30000 + idx * 20000 + i * 15000),
    clicks: Math.floor(800 + idx * 500 + i * 300),
    conversions: Math.floor(30 + idx * 20 + i * 10),
    spend: Math.floor(800 + idx * 600 + i * 400),
    ctr: ctrs[(i + idx) % ctrs.length],
    hookRate: ["meta","tiktok"].includes(platform) ? hooks[(i + idx) % hooks.length] : null,
    convRate: convRates[(i + idx) % convRates.length],
    thumb: null,
  }));
};

// ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
const NAMES = ["Black Friday Retargeting","Prospecção Fria - Lookalike","Carnaval 2025","Lançamento Produto X","Retenção Base Ativa","Awareness Q1","Conversão Mid-Funnel","Shopping Performance Max","Branding Institucional","Lead Gen B2B","Upsell Premium","Re-engajamento 90d"];
const STATUSES = ["active","active","active","paused","scheduled","completed"];

const CAMPAIGNS = (() => {
  const list = [];
  PLATFORMS.forEach((p, pi) => {
    const count = (pi % 3) + 2;
    for (let i = 0; i < count; i++) {
      const startDay = (pi * 5 + i * 3 + 1) % 20 + 1;
      const endDay = Math.min(startDay + 10 + i * 3, 28);
      const status = STATUSES[(pi + i) % STATUSES.length];
      const budget = 3000 + pi * 2000 + i * 1500;
      const spent = status === "scheduled" ? 0 : Math.floor(budget * (0.3 + i * 0.15));
      const convs = Math.floor(spent / (20 + i * 5));
      const convGoal = Math.floor(convs * 1.3 + 10);
      const name = NAMES[(pi * 3 + i) % NAMES.length];
      list.push({
        id: `${p.id}-${i}`, platform: p.id, name, status,
        startDate: new Date(2025,1,startDay), endDate: new Date(2025,1,endDay),
        budgetTotal: budget, budgetSpent: spent,
        conversions: convs, conversionsGoal: convGoal,
        impressions: 50000 + pi * 80000 + i * 40000,
        clicks: 2000 + pi * 3000 + i * 1000,
        revenue: convs * (50 + pi * 15),
        creatives: makeCreatives(p.id, name, pi * 3 + i),
        meta: CAMPAIGN_META[name] || {
          description: "Campanha de performance para aquisição e conversão de clientes qualificados.",
          audience: "Público segmentado por interesse e comportamento de compra alinhado ao perfil de cliente ideal.",
        },
      });
    }
  });
  return list;
})();

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = (n, d=0) => n?.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}) ?? "—";
const fmtR = (n) => `R$ ${fmt(n)}`;
const fmtP = (n) => n != null ? `${n.toFixed(1)}%` : "—";
const SC = { active:"#10B981", paused:"#F59E0B", scheduled:"#818CF8", completed:"#555" };
const SL = { active:"● Ativo", paused:"⏸ Pausado", scheduled:"◷ Agendado", completed:"✓ Concluído" };

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{ background:"#0d0d14", border:"1px solid #1e1e2e", borderRadius:16, ...style }}>{children}</div>
);

const SecTitle = ({ children, color }) => (
  <div style={{ fontSize:10, color:color||"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:14, fontWeight:600 }}>{children}</div>
);

const MCard = ({ label, value, sub, color="#00FFD1", icon, sm }) => (
  <div
    style={{ background:"linear-gradient(135deg,#0d0d14,#12121e)", border:"1px solid #1e1e2e", borderRadius:12, padding:sm?"13px 15px":"19px 22px", position:"relative", overflow:"hidden", transition:"border-color .2s,transform .2s", cursor:"default" }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=color; e.currentTarget.style.transform="translateY(-2px)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor="#1e1e2e"; e.currentTarget.style.transform="translateY(0)"; }}
  >
    <div style={{ position:"absolute", top:0, right:0, width:56, height:56, background:color+"08", borderRadius:"0 12px 0 56px" }} />
    {icon && <div style={{ fontSize:sm?15:19, marginBottom:3 }}>{icon}</div>}
    <div style={{ fontSize:10, color:"#666", letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
    <div style={{ fontSize:sm?19:25, fontWeight:700, color, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:10, color:"#555", marginTop:4 }}>{sub}</div>}
  </div>
);

const PBadge = ({ platform, sm }) => {
  const p = PLATFORMS.find(x=>x.id===platform); if (!p) return null;
  return (
    <span style={{ background:p.color+"22", border:`1px solid ${p.color}44`, color:p.color, borderRadius:6, padding:sm?"2px 7px":"4px 11px", fontSize:sm?9:11, fontWeight:600, letterSpacing:.5, display:"inline-flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }}>
      {p.icon} {p.name}
    </span>
  );
};

const Bar = ({ pct, color, h=4 }) => (
  <div style={{ height:h, background:"#1a1a28", borderRadius:h }}>
    <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:color, borderRadius:h, transition:"width 1s ease" }} />
  </div>
);

const PH = ({ title, sub }) => {
  const { isMobile } = useBreakpoint();
  return (
    <div style={{ marginBottom:isMobile?18:26 }}>
      <h2 style={{ fontSize:isMobile?21:27, fontWeight:700, color:"#fff", margin:0 }}>{title}</h2>
      {sub && <p style={{ color:"#555", margin:"4px 0 0", fontSize:12 }}>{sub}</p>}
    </div>
  );
};

// ─── AI ANALYSIS COMPONENT ────────────────────────────────────────────────────
const AIAnalysis = ({ campaign }) => {
  const [aiText, setAiText]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const convPct = campaign.conversionsGoal ? (campaign.conversions / campaign.conversionsGoal * 100) : 100;
  const isBelowTarget = convPct < 75;
  const p = PLATFORMS.find(x=>x.id===campaign.platform);

  const topCreative = [...campaign.creatives].sort((a,b)=>b.ctr-a.ctr)[0];
  const worstCreative = [...campaign.creatives].sort((a,b)=>a.ctr-b.ctr)[0];

  const buildPrompt = () => `
Você é um especialista sênior em performance marketing com 15 anos de experiência em gestão de campanhas pagas.

Analise a seguinte campanha e forneça recomendações específicas e acionáveis em português brasileiro:

**CAMPANHA:** ${campaign.name}
**PLATAFORMA:** ${p?.name}
**STATUS:** ${campaign.status}

**MÉTRICAS ATUAIS:**
- Conversões: ${campaign.conversions} de ${campaign.conversionsGoal} (meta) → ${convPct.toFixed(0)}% da meta
- Budget gasto: R$ ${campaign.budgetSpent} de R$ ${campaign.budgetTotal} (${(campaign.budgetSpent/campaign.budgetTotal*100).toFixed(0)}%)
- Impressões: ${fmt(campaign.impressions)}
- Cliques: ${fmt(campaign.clicks)}
- Receita gerada: R$ ${fmt(campaign.revenue)}

**CRIATIVOS:**
${campaign.creatives.map(cr=>`- ${cr.name} (${cr.format}): CTR ${cr.ctr}%, Conv.Rate ${cr.convRate}%, ${cr.hookRate?`Hook Rate ${cr.hookRate}%,`:''} Status: ${cr.status}`).join("\n")}

**DESCRIÇÃO DA CAMPANHA:** ${campaign.meta.description}
**PÚBLICO-ALVO:** ${campaign.meta.audience}

${isBelowTarget ? `⚠️ ATENÇÃO: Esta campanha está com apenas ${convPct.toFixed(0)}% da meta de conversões atingida e precisa de intervenção urgente.` : `✅ A campanha está performando bem com ${convPct.toFixed(0)}% da meta.`}

Forneça:
1. **Diagnóstico** (2-3 frases): O que os dados indicam?
2. **Top 3 ações prioritárias** para ${isBelowTarget?"recuperar a performance":"escalar os resultados"} (seja específico por plataforma)
3. **Criativo destaque** (melhor CTR: ${topCreative?.name}) e **criativo problemático** (pior CTR: ${worstCreative?.name}): o que fazer com cada um?
4. **Ajuste de público** sugerido baseado nos dados

Seja direto, prático e use dados específicos da campanha nas suas recomendações. Máximo 350 palavras.`;

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text;
      if (text) setAiText(text);
      else setError("Não foi possível gerar a análise.");
    } catch (e) {
      setError("Erro ao conectar com a IA. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Parse bold **text** in AI response
  const renderAIText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={i} style={{ marginBottom:4 }}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j} style={{ color:"#e2e8f0" }}>{part.slice(2,-2)}</strong>
              : <span key={j} style={{ color:"#94a3b8" }}>{part}</span>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ marginTop:16, background:"#0a0a10", border:"1px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 18px", borderBottom:"1px solid #1a1a28", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, background:"linear-gradient(135deg,#7C3AED,#4F46E5)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✦</div>
          <div>
            <div style={{ fontSize:12, color:"#c4b5fd", fontWeight:600 }}>Análise de IA · Claude</div>
            <div style={{ fontSize:10, color:"#555", marginTop:1 }}>
              {isBelowTarget
                ? <span style={{ color:"#EF4444" }}>⚠ Abaixo da meta — análise de recuperação</span>
                : <span style={{ color:"#10B981" }}>✓ Performance ok — análise de escalonamento</span>
              }
            </div>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{
            background: loading ? "#2a2a3e" : "linear-gradient(135deg,#7C3AED,#4F46E5)",
            border:"none", color:"#fff", padding:"8px 16px", borderRadius:8,
            cursor: loading?"not-allowed":"pointer", fontSize:11, fontWeight:600,
            display:"flex", alignItems:"center", gap:6, opacity:loading?0.7:1,
          }}
        >
          {loading ? (
            <><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span> Analisando...</>
          ) : (
            <>{aiText ? "↺ Reanalisar" : "✦ Gerar Análise"}</>
          )}
        </button>
      </div>

      {/* Content */}
      {!aiText && !loading && !error && (
        <div style={{ padding:"20px 18px", textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:8, opacity:.3 }}>✦</div>
          <div style={{ fontSize:12, color:"#444", lineHeight:1.6 }}>
            Clique em "Gerar Análise" para que o Claude analise os dados desta campanha<br />
            e gere recomendações personalizadas de melhoria.
          </div>
        </div>
      )}

      {loading && (
        <div style={{ padding:"24px 18px", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#7C3AED", animation:"pulse 1s ease-in-out infinite" }} />
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#818CF8", animation:"pulse 1s ease-in-out infinite .2s" }} />
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#c4b5fd", animation:"pulse 1s ease-in-out infinite .4s" }} />
          <span style={{ fontSize:12, color:"#666", marginLeft:4 }}>Claude está analisando os dados...</span>
        </div>
      )}

      {error && (
        <div style={{ padding:"16px 18px", color:"#EF4444", fontSize:12 }}>⚠ {error}</div>
      )}

      {aiText && (
        <div style={{ padding:"16px 18px", fontSize:13, lineHeight:1.7 }}>
          {renderAIText(aiText)}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.3; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); } }
      `}</style>
    </div>
  );
};

// ─── CREATIVE CARD ────────────────────────────────────────────────────────────
const CreativeCard = ({ cr, platformColor, isMobile }) => {
  const isActive = cr.status === "active";
  return (
    <div style={{ background:"#0d0d14", border:`1px solid ${isActive?platformColor+"33":"#1e1e2e"}`, borderRadius:10, padding:"12px 14px", position:"relative", overflow:"hidden" }}>
      {/* Format badge */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:600, color:"#ddd", marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:isMobile?120:180 }}>{cr.name}</div>
          <span style={{ fontSize:9, background:"#1a1a28", border:"1px solid #2a2a3e", color:"#888", padding:"1px 7px", borderRadius:4 }}>{cr.format}</span>
        </div>
        <span style={{ fontSize:9, color:SC[cr.status], flexShrink:0 }}>
          {cr.status==="active"?"●":"○"} {cr.status==="active"?"Ativo":"Pausado"}
        </span>
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        <div>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>CTR</div>
          <div style={{ fontSize:13, fontWeight:700, color: cr.ctr >= 3 ? "#10B981" : cr.ctr >= 2 ? "#F59E0B" : "#EF4444", fontFamily:"monospace" }}>{fmtP(cr.ctr)}</div>
        </div>
        {cr.hookRate != null && (
          <div>
            <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Hook Rate</div>
            <div style={{ fontSize:13, fontWeight:700, color: cr.hookRate >= 40 ? "#10B981" : cr.hookRate >= 25 ? "#F59E0B" : "#EF4444", fontFamily:"monospace" }}>{fmtP(cr.hookRate)}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Conv. Rate</div>
          <div style={{ fontSize:13, fontWeight:700, color: cr.convRate >= 2.5 ? "#10B981" : cr.convRate >= 1.5 ? "#F59E0B" : "#EF4444", fontFamily:"monospace" }}>{fmtP(cr.convRate)}</div>
        </div>
        <div>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Impressões</div>
          <div style={{ fontSize:11, color:"#818CF8", fontFamily:"monospace" }}>{fmt(cr.impressions)}</div>
        </div>
        <div>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Cliques</div>
          <div style={{ fontSize:11, color:"#F472B6", fontFamily:"monospace" }}>{fmt(cr.clicks)}</div>
        </div>
        <div>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>Investido</div>
          <div style={{ fontSize:11, color:"#F59E0B", fontFamily:"monospace" }}>{fmtR(cr.spend)}</div>
        </div>
      </div>

      {/* Performance indicator bar */}
      <div style={{ marginTop:10 }}>
        <div style={{ height:2, background:"#1a1a28", borderRadius:1 }}>
          <div style={{ height:"100%", width:`${Math.min(cr.ctr/5*100,100)}%`, background:`linear-gradient(90deg,${platformColor},${platformColor}88)`, borderRadius:1 }} />
        </div>
      </div>
    </div>
  );
};

// ─── CREATIVE ANALYSIS PANEL ──────────────────────────────────────────────────
const CreativePanel = ({ campaign }) => {
  const { isMobile } = useBreakpoint();
  const p = PLATFORMS.find(x=>x.id===campaign.platform);
  const convPct = campaign.conversionsGoal ? (campaign.conversions / campaign.conversionsGoal * 100) : 100;
  const isBelowTarget = convPct < 75;
  const creativeGrid = isMobile ? "1fr" : "repeat(2,1fr)";

  return (
    <div style={{ marginTop:16, background:"#09090f", border:`1px solid ${p?.color}22`, borderRadius:14, padding:isMobile?14:20 }}>
      {/* Campaign intelligence header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #1a1a28" }}>
        <div style={{ fontSize:16 }}>🎯</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#ddd" }}>Análise de Criativos</div>
          <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{campaign.creatives.length} criativos · {campaign.creatives.filter(c=>c.status==="active").length} ativos</div>
        </div>
        {isBelowTarget && (
          <div style={{ background:"#EF444422", border:"1px solid #EF444444", color:"#EF4444", padding:"4px 10px", borderRadius:20, fontSize:10, whiteSpace:"nowrap" }}>
            ⚠ {convPct.toFixed(0)}% da meta
          </div>
        )}
      </div>

      {/* Description + Audience */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14, marginBottom:20 }}>
        <div style={{ background:"#0d0d14", border:"1px solid #1e1e2e", borderRadius:10, padding:"14px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>📋 Descrição da Campanha</div>
          <p style={{ fontSize:12, color:"#94a3b8", lineHeight:1.65, margin:0 }}>{campaign.meta.description}</p>
        </div>
        <div style={{ background:"#0d0d14", border:"1px solid #1e1e2e", borderRadius:10, padding:"14px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>👥 Público-Alvo</div>
          <p style={{ fontSize:12, color:"#94a3b8", lineHeight:1.65, margin:0 }}>{campaign.meta.audience}</p>
        </div>
      </div>

      {/* Creatives grid */}
      <div style={{ marginBottom:20 }}>
        <SecTitle>Criativos da Campanha</SecTitle>
        <div style={{ display:"grid", gridTemplateColumns:creativeGrid, gap:10 }}>
          {campaign.creatives.map(cr => (
            <CreativeCard key={cr.id} cr={cr} platformColor={p?.color} isMobile={isMobile} />
          ))}
        </div>
      </div>

      {/* Performance signals */}
      <div style={{ background:"#0d0d14", border:"1px solid #1e1e2e", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
        <SecTitle>Sinais de Performance</SecTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(() => {
            const sorted = [...campaign.creatives].sort((a,b)=>b.ctr-a.ctr);
            const best = sorted[0]; const worst = sorted[sorted.length-1];
            const signals = [];
            if (best && worst && best.id !== worst.id) {
              signals.push({ icon:"🏆", text:`Melhor criativo: "${best.name}" com CTR de ${fmtP(best.ctr)}`, color:"#10B981" });
              if (worst.ctr < 2) signals.push({ icon:"⚠", text:`Criativo fraco: "${worst.name}" com CTR de apenas ${fmtP(worst.ctr)} — considere pausar`, color:"#EF4444" });
            }
            const pausedCr = campaign.creatives.filter(c=>c.status==="paused");
            if (pausedCr.length > 0) signals.push({ icon:"⏸", text:`${pausedCr.length} criativo(s) pausado(s): ${pausedCr.map(c=>c.name).join(", ")}`, color:"#F59E0B" });
            if (isBelowTarget) signals.push({ icon:"📉", text:`Conversão ${convPct.toFixed(0)}% da meta — urgente revisar landing page e oferta`, color:"#EF4444" });
            const highHook = campaign.creatives.find(c=>c.hookRate&&c.hookRate>50);
            if (highHook) signals.push({ icon:"🎣", text:`Hook Rate acima de 50% em "${highHook.name}" — ampliar budget neste criativo`, color:"#7C3AED" });
            return signals.length > 0 ? signals : [{ icon:"✓", text:"Todos os criativos com performance dentro do esperado.", color:"#10B981" }];
          })().map((s, i) => (
            <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <span style={{ fontSize:13, flexShrink:0 }}>{s.icon}</span>
              <span style={{ fontSize:12, color:s.color, lineHeight:1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      <AIAnalysis campaign={campaign} />
    </div>
  );
};

// ─── CAMPAIGN ROW ─────────────────────────────────────────────────────────────
const CRow = ({ c, hidePlat }) => {
  const { isMobile } = useBreakpoint();
  const [st, setSt]           = useState(c.status);
  const [showB, setShowB]     = useState(false);
  const [showAnal, setShowAnal] = useState(false);
  const [bval, setBval]       = useState("");
  const p = PLATFORMS.find(x=>x.id===c.platform);
  const bp = c.budgetTotal ? (c.budgetSpent/c.budgetTotal*100) : 0;
  const cp = c.conversionsGoal ? Math.min(c.conversions/c.conversionsGoal*100,100) : 0;
  const isBelowTarget = cp < 75;

  return (
    <div style={{ borderTop:"1px solid #1a1a28", padding:"13px 0" }}>
      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:10 }}>
        <div style={{ minWidth:0, flex:1 }}>
          {!hidePlat && <div style={{ marginBottom:5 }}><PBadge platform={c.platform} sm /></div>}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:"#ddd", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
            {isBelowTarget && st === "active" && (
              <span style={{ fontSize:9, background:"#EF444422", border:"1px solid #EF444433", color:"#EF4444", padding:"1px 6px", borderRadius:4, whiteSpace:"nowrap" }}>abaixo da meta</span>
            )}
          </div>
          <div style={{ fontSize:9, color:SC[st] }}>{SL[st]}</div>
        </div>
        <div style={{ display:"flex", gap:5, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
          {st !== "completed" && (
            <>
              {st==="active" && <button onClick={()=>setSt("paused")} style={{ background:"#F59E0B22", border:"1px solid #F59E0B44", color:"#F59E0B", padding:isMobile?"5px 8px":"6px 11px", borderRadius:7, cursor:"pointer", fontSize:10 }}>{isMobile?"⏸":"⏸ Pausar"}</button>}
              {st==="paused" && <button onClick={()=>setSt("active")} style={{ background:"#10B98122", border:"1px solid #10B98144", color:"#10B981", padding:isMobile?"5px 8px":"6px 11px", borderRadius:7, cursor:"pointer", fontSize:10 }}>{isMobile?"▶":"▶ Retomar"}</button>}
              <button onClick={()=>setShowB(!showB)} style={{ background:"#818CF822", border:"1px solid #818CF844", color:"#818CF8", padding:isMobile?"5px 8px":"6px 11px", borderRadius:7, cursor:"pointer", fontSize:10 }}>{isMobile?"$":"$ Budget"}</button>
            </>
          )}
          <button
            onClick={()=>setShowAnal(!showAnal)}
            style={{
              background: showAnal ? "#7C3AED22" : "transparent",
              border:`1px solid ${showAnal?"#7C3AED":"#2a2a3e"}`,
              color: showAnal?"#c4b5fd":"#666",
              padding:isMobile?"5px 8px":"6px 11px", borderRadius:7, cursor:"pointer", fontSize:10,
              display:"flex", alignItems:"center", gap:4,
            }}
          >
            {isMobile ? "✦" : <>{showAnal?"▲":"▼"} Criativos</>}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:8, marginBottom:9 }}>
        {[{l:"Orçado",v:fmtR(c.budgetTotal),col:"#888"},{l:"Realizado",v:fmtR(c.budgetSpent),col:"#F59E0B"},{l:"Conv.",v:`${c.conversions}/${c.conversionsGoal}`,col:"#10B981"},{l:"Receita",v:fmtR(c.revenue),col:"#00FFD1"}].map(it=>(
          <div key={it.l}>
            <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>{it.l}</div>
            <div style={{ fontSize:11, color:it.col, fontFamily:"monospace" }}>{it.v}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1, marginBottom:3 }}>BUDGET {bp.toFixed(0)}%</div>
          <Bar pct={bp} color={bp>90?"#EF4444":(p?.color||"#00FFD1")} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:8, color:"#444", letterSpacing:1, marginBottom:3 }}>CONV. {cp.toFixed(0)}%</div>
          <Bar pct={cp} color={isBelowTarget?"#EF4444":"#10B981"} />
        </div>
      </div>

      {/* Budget edit */}
      {showB && (
        <div style={{ marginTop:11, background:"#12121e", border:"1px solid #1e1e2e", borderRadius:9, padding:13, display:"flex", flexWrap:"wrap", gap:7, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#888" }}>Novo budget:</span>
          <input type="number" value={bval} onChange={e=>setBval(e.target.value)} placeholder={String(c.budgetTotal)} style={{ background:"#0d0d14", border:"1px solid #2a2a3e", borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:11, width:120 }} />
          <button onClick={()=>{ alert(`Budget: R$ ${bval||c.budgetTotal}`); setShowB(false); }} style={{ background:"#7C3AED", border:"none", color:"#fff", padding:"6px 13px", borderRadius:7, cursor:"pointer", fontSize:11 }}>Confirmar</button>
          <button onClick={()=>setShowB(false)} style={{ background:"transparent", border:"1px solid #2a2a3e", color:"#666", padding:"6px 9px", borderRadius:7, cursor:"pointer", fontSize:11 }}>✕</button>
        </div>
      )}

      {/* Creative Analysis Panel */}
      {showAnal && <CreativePanel campaign={c} />}
    </div>
  );
};

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
const OverviewPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const g2 = isMobile ? "1fr 1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)";

  const tot = Object.values(PM).reduce((a,m)=>({
    impressions:a.impressions+m.impressions, clicks:a.clicks+m.clicks, conversions:a.conversions+m.conversions,
    revenue:a.revenue+m.revenue, spend:a.spend+m.spend, reach:a.reach+m.reach, campaigns:a.campaigns+m.campaigns,
  }), {impressions:0,clicks:0,conversions:0,revenue:0,spend:0,reach:0,campaigns:0});

  const roas   = (tot.revenue/tot.spend).toFixed(2);
  const avgCtr = (tot.clicks/tot.impressions*100).toFixed(2);
  const avgHook= ((PM.meta.hookRate*PM.meta.spend+PM.tiktok.hookRate*PM.tiktok.spend)/(PM.meta.spend+PM.tiktok.spend)).toFixed(1);

  return (
    <div>
      <PH title="Visão Geral" sub="Consolidado de todas as plataformas · Fev 2025" />
      <div style={{ display:"grid", gridTemplateColumns:g2, gap:12, marginBottom:12 }}>
        <MCard icon="◎" label="Alcance Total"  value={fmt(tot.reach)}       sub={`${tot.campaigns} campanhas`} color="#00FFD1" sm={isMobile} />
        <MCard icon="⊕" label="Conversões"     value={fmt(tot.conversions)}  sub="Todas as plataformas"        color="#7C3AED" sm={isMobile} />
        <MCard icon="◈" label="Receita Total"  value={fmtR(tot.revenue)}     sub={`ROAS ${roas}x`}            color="#10B981" sm={isMobile} />
        <MCard icon="◉" label="Investimento"   value={fmtR(tot.spend)}       sub={`Retorno ${fmtR(tot.revenue-tot.spend)}`} color="#F59E0B" sm={isMobile} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:g2, gap:12, marginBottom:22 }}>
        <MCard icon="⊗" label="Impressões"  value={`${(tot.impressions/1e6).toFixed(1)}M`} color="#818CF8" sm={isMobile} />
        <MCard icon="◇" label="Cliques"     value={fmt(tot.clicks)}          color="#F472B6" sm={isMobile} />
        <MCard icon="◑" label="CTR Médio"   value={fmtP(parseFloat(avgCtr))} color="#34D399" sm={isMobile} />
        <MCard icon="◆" label="Hook Rate"   value={fmtP(parseFloat(avgHook))} sub="Meta+TikTok" color="#FB7185" sm={isMobile} />
      </div>
      <Card style={{ padding:isMobile?14:20 }}>
        <SecTitle>Desempenho por Plataforma</SecTitle>
        {isMobile ? (
          PLATFORMS.map(p=>{ const m=PM[p.id]; const r=(m.revenue/m.spend).toFixed(1);
            return (
              <div key={p.id} style={{ borderTop:"1px solid #1a1a28", padding:"11px 0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><PBadge platform={p.id} sm /><span style={{ color:"#00FFD1", fontFamily:"monospace", fontSize:12 }}>{r}x ROAS</span></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[{l:"Investido",v:fmtR(m.spend),col:"#F59E0B"},{l:"Receita",v:fmtR(m.revenue),col:"#10B981"},{l:"CTR",v:fmtP(m.ctr),col:"#818CF8"},{l:"Conv.",v:fmt(m.conversions),col:"#fff"}].map(it=>(
                    <div key={it.l}><div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:2 }}>{it.l}</div><div style={{ fontSize:11, color:it.col, fontFamily:"monospace" }}>{it.v}</div></div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr", gap:12, marginBottom:8 }}>
              {["Plataforma","Investimento","Receita","ROAS","CTR","Conversões"].map(h=><div key={h} style={{ fontSize:9, color:"#444", letterSpacing:1.5, textTransform:"uppercase" }}>{h}</div>)}
            </div>
            {PLATFORMS.map(p=>{ const m=PM[p.id]; const r=(m.revenue/m.spend).toFixed(2);
              return (
                <div key={p.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1fr", gap:12, padding:"12px 0", borderTop:"1px solid #1a1a28", alignItems:"center" }}>
                  <PBadge platform={p.id} sm />
                  <span style={{ color:"#F59E0B", fontFamily:"monospace", fontSize:12 }}>{fmtR(m.spend)}</span>
                  <span style={{ color:"#10B981", fontFamily:"monospace", fontSize:12 }}>{fmtR(m.revenue)}</span>
                  <span style={{ color:"#00FFD1", fontFamily:"monospace", fontSize:12 }}>{r}x</span>
                  <span style={{ color:"#818CF8", fontFamily:"monospace", fontSize:12 }}>{fmtP(m.ctr)}</span>
                  <span style={{ color:"#fff",    fontFamily:"monospace", fontSize:12 }}>{fmt(m.conversions)}</span>
                </div>
              );
            })}
          </>
        )}
      </Card>
    </div>
  );
};

// ─── PLATFORM PAGE ─────────────────────────────────────────────────────────────
const PlatformPage = ({ pid }) => {
  const { isMobile } = useBreakpoint();
  const p = PLATFORMS.find(x=>x.id===pid);
  const m = PM[pid];
  const roas=(m.revenue/m.spend).toFixed(2); const cpa=(m.spend/m.conversions).toFixed(2);
  const g2 = isMobile ? "1fr 1fr" : "repeat(4,1fr)";

  const specMap = {
    meta:         [{l:"Hook Rate",v:fmtP(m.hookRate),icon:"◆"},{l:"Frequência",v:m.frequency?.toFixed(1),icon:"◉"},{l:"Thumb-stop",v:fmtP(m.thumbstopRate),icon:"◑"},{l:"Video Views",v:fmt(m.videoViews),icon:"▶"}],
    google:       [{l:"Quality Score",v:m.qualityScore?.toFixed(1),icon:"◈"},{l:"Impr. Share",v:fmtP(m.impressionShare),icon:"◎"},{l:"Top IS",v:fmtP(m.searchTopIS),icon:"◇"}],
    tiktok:       [{l:"Hook Rate",v:fmtP(m.hookRate),icon:"◆"},{l:"Completion",v:fmtP(m.completionRate),icon:"◉"},{l:"Avg Watch",v:`${m.avgWatchTime}s`,icon:"▶"},{l:"Video Views",v:fmt(m.videoViews),icon:"◑"}],
    mercadolivre: [{l:"Cart Abandon",v:fmtP(m.cartAbandon),icon:"◐"},{l:"Product Ads",v:m.productAds,icon:"◈"}],
    amazon:       [{l:"ACoS",v:fmtP(m.acos),icon:"◆"},{l:"TACoS",v:fmtP(m.tacos),icon:"◉"},{l:"Organic Sales",v:fmtR(m.organicSales),icon:"◎"}],
  };
  const spec=specMap[pid]||[]; const sg=isMobile?"1fr 1fr":`repeat(${spec.length},1fr)`;
  const platCamps=CAMPAIGNS.filter(c=>c.platform===pid);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <div style={{ width:42, height:42, background:p.color+"22", border:`2px solid ${p.color}`, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{p.icon}</div>
        <div>
          <h2 style={{ fontSize:isMobile?19:25, fontWeight:700, color:"#fff", margin:0 }}>{p.name}</h2>
          <p style={{ color:"#555", margin:0, fontSize:11 }}>{m.campaigns} campanhas · Fev 2025</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:g2, gap:11, marginBottom:11 }}>
        <MCard icon="◎" label="Alcance"      value={fmt(m.reach)}       color={p.color} sm={isMobile} />
        <MCard icon="⊕" label="Conversões"   value={fmt(m.conversions)}  color="#7C3AED" sm={isMobile} />
        <MCard icon="◈" label="Receita"      value={fmtR(m.revenue)}     color="#10B981" sm={isMobile} />
        <MCard icon="◉" label="Investimento" value={fmtR(m.spend)}       color="#F59E0B" sm={isMobile} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:g2, gap:11, marginBottom:11 }}>
        <MCard icon="◇" label="ROAS"  value={`${roas}x`}                 color="#00FFD1" sm={isMobile} />
        <MCard icon="◑" label="CTR"   value={fmtP(m.ctr)}                color="#818CF8" sm={isMobile} />
        <MCard icon="⊗" label="CPA"   value={fmtR(parseFloat(cpa))}      color="#F472B6" sm={isMobile} />
        <MCard icon="◆" label="CPC"   value={`R$ ${m.cpc?.toFixed(2)}`}  color="#FB923C" sm={isMobile} />
      </div>
      {spec.length>0&&<div style={{ display:"grid", gridTemplateColumns:sg, gap:11, marginBottom:18 }}>{spec.map(s=><MCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={p.color} sm={isMobile} />)}</div>}
      <Card style={{ padding:isMobile?14:20, marginBottom:14 }}>
        <SecTitle>Breakdown por Tipo</SecTitle>
        {m.breakdown.map((b,i)=>{ const pct=(b.spend/m.spend*100); const r=(b.revenue/b.spend).toFixed(1);
          return (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, flexWrap:"wrap", gap:4 }}>
                <span style={{ color:"#ccc", fontSize:12 }}>{b.name}</span>
                <div style={{ display:"flex", gap:10 }}>
                  <span style={{ color:"#F59E0B", fontSize:10, fontFamily:"monospace" }}>{fmtR(b.spend)}</span>
                  <span style={{ color:"#10B981", fontSize:10, fontFamily:"monospace" }}>{fmtR(b.revenue)}</span>
                  <span style={{ color:"#00FFD1", fontSize:10, fontFamily:"monospace" }}>{r}x</span>
                </div>
              </div>
              <Bar pct={pct} color={p.color} h={5} />
            </div>
          );
        })}
      </Card>
      <Card style={{ padding:isMobile?14:20 }}>
        <SecTitle>Campanhas</SecTitle>
        {platCamps.map(c=><CRow key={c.id} c={c} hidePlat />)}
      </Card>
    </div>
  );
};

// ─── CAMPAIGNS PAGE ─────────────────────────────────────────────────────────
const CampaignsPage = () => {
  const { isMobile } = useBreakpoint();
  const [sf, setSf] = useState("all");
  const [pf, setPf] = useState("all");
  const filtered = CAMPAIGNS.filter(c=>(sf==="all"||c.status===sf)&&(pf==="all"||c.platform===pf));
  return (
    <div>
      <PH title="Campanhas" sub={`${filtered.length} de ${CAMPAIGNS.length}`} />
      <div style={{ display:"flex", gap:5, marginBottom:10, flexWrap:"wrap" }}>
        {[["all","Todos"],["active","Ativos"],["paused","Pausados"],["scheduled","Agendados"],["completed","Concluídos"]].map(([s,l])=>(
          <button key={s} onClick={()=>setSf(s)} style={{ background:sf===s?"#7C3AED":"#1a1a28", border:`1px solid ${sf===s?"#7C3AED":"#2a2a3e"}`, color:sf===s?"#fff":"#666", padding:isMobile?"5px 9px":"5px 13px", borderRadius:7, cursor:"pointer", fontSize:10 }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:5, marginBottom:18, flexWrap:"wrap" }}>
        <button onClick={()=>setPf("all")} style={{ background:pf==="all"?"#1e1e2e":"transparent", border:"1px solid #2a2a3e", color:pf==="all"?"#fff":"#555", padding:"4px 11px", borderRadius:20, cursor:"pointer", fontSize:10 }}>Todas</button>
        {PLATFORMS.map(p=>(
          <button key={p.id} onClick={()=>setPf(p.id)} style={{ background:pf===p.id?p.color+"22":"transparent", border:`1px solid ${pf===p.id?p.color:"#2a2a3e"}`, color:pf===p.id?p.color:"#555", padding:"4px 11px", borderRadius:20, cursor:"pointer", fontSize:10 }}>
            {p.icon} {isMobile?p.name.split(" ")[0]:p.name}
          </button>
        ))}
      </div>
      <Card style={{ padding:isMobile?14:20 }}>
        {filtered.length ? filtered.map(c=><CRow key={c.id} c={c} />) : (
          <p style={{ color:"#444", textAlign:"center", padding:40, margin:0 }}>Nenhuma campanha encontrada.</p>
        )}
      </Card>
    </div>
  );
};

// ─── CALENDAR PAGE ─────────────────────────────────────────────────────────────
const CalendarPage = () => {
  const { isMobile } = useBreakpoint();
  const [selDay, setSelDay] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const firstDOW = new Date(2025,1,1).getDay();
  const dn = isMobile ? ["D","S","T","Q","Q","S","S"] : ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const getDC = (day) => CAMPAIGNS.filter(c=>c.startDate.getDate()<=day&&c.endDate.getDate()>=day);
  const handleClick = (day) => { setSelDay(day===selDay?null:day); if (isMobile) setSheetOpen(true); };
  const dayCamps = selDay ? getDC(selDay) : [];

  return (
    <div>
      <PH title="Calendário" sub="Fevereiro 2025" />
      <div style={{ display:isMobile?"block":"flex", gap:18 }}>
        <Card style={{ padding:isMobile?12:18, flex:1, marginBottom:isMobile?14:0 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:isMobile?2:3, marginBottom:5 }}>
            {dn.map(d=><div key={d} style={{ textAlign:"center", fontSize:9, color:"#444", padding:"2px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:isMobile?2:3 }}>
            {Array.from({length:firstDOW}).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:28}).map((_,i)=>{
              const day=i+1; const camps=getDC(day); const isT=day===18; const isSel=day===selDay;
              return (
                <div key={day} onClick={()=>handleClick(day)} style={{ minHeight:isMobile?40:68, background:isSel?"#1a1a2e":isT?"#0f0f22":"#0a0a12", border:`1px solid ${isSel?"#7C3AED":isT?"#333":"#1a1a28"}`, borderRadius:7, padding:isMobile?"3px":"5px", cursor:"pointer", transition:"all .15s" }}>
                  <div style={{ fontSize:isMobile?9:11, fontWeight:isT?700:400, color:isT?"#00FFD1":isSel?"#818CF8":"#666", marginBottom:2 }}>{day}</div>
                  {isMobile ? (
                    <div style={{ display:"flex", gap:2, flexWrap:"wrap" }}>{camps.slice(0,5).map((c,idx)=><div key={idx} style={{ width:4,height:4,borderRadius:"50%",background:SC[c.status] }}/>)}</div>
                  ) : (
                    <>{camps.slice(0,3).map((c,idx)=>{ const pp=PLATFORMS.find(x=>x.id===c.platform); return <div key={idx} style={{ fontSize:8,background:SC[c.status]+"22",borderLeft:`2px solid ${SC[c.status]}`,color:SC[c.status],padding:"1px 3px",borderRadius:"0 2px 2px 0",marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{pp?.icon} {c.name.split(" ")[0]}</div>; })}
                    {camps.length>3&&<div style={{ fontSize:7,color:"#444" }}>+{camps.length-3}</div>}</>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        {!isMobile && (
          <div style={{ width:280, flexShrink:0 }}>
            <Card style={{ padding:14, marginBottom:14 }}>
              <SecTitle>Legenda</SecTitle>
              {[["active","Ativo"],["paused","Pausado"],["scheduled","Agendado"],["completed","Concluído"]].map(([s,l])=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                  <div style={{ width:9,height:9,background:SC[s],borderRadius:2 }}/><span style={{ fontSize:11,color:"#888",flex:1 }}>{l}</span><span style={{ fontSize:10,color:"#555" }}>{CAMPAIGNS.filter(c=>c.status===s).length}</span>
                </div>
              ))}
            </Card>
            {selDay && (
              <Card style={{ padding:14 }}>
                <div style={{ fontSize:13,color:"#fff",fontWeight:600,marginBottom:12 }}>Dia {selDay} · {dayCamps.length} camp.</div>
                {dayCamps.length===0 && <p style={{ color:"#444",fontSize:12 }}>Sem campanhas.</p>}
                {dayCamps.map(c=><DPC key={c.id} c={c} />)}
              </Card>
            )}
          </div>
        )}
      </div>
      {isMobile && sheetOpen && selDay && (
        <div style={{ position:"fixed",bottom:64,left:0,right:0,background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:"14px 14px 0 0",maxHeight:"62vh",overflowY:"auto",zIndex:50,padding:18 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <span style={{ fontSize:13,color:"#fff",fontWeight:600 }}>Dia {selDay} · {dayCamps.length} campanha{dayCamps.length!==1?"s":""}</span>
            <button onClick={()=>setSheetOpen(false)} style={{ background:"transparent",border:"none",color:"#666",fontSize:16,cursor:"pointer" }}>✕</button>
          </div>
          {dayCamps.length===0 && <p style={{ color:"#444",fontSize:12 }}>Sem campanhas neste dia.</p>}
          {dayCamps.map(c=><DPC key={c.id} c={c} />)}
        </div>
      )}
    </div>
  );
};

const DPC = ({ c }) => {
  const [st, setSt] = useState(c.status);
  const p = PLATFORMS.find(x=>x.id===c.platform);
  const bp = (c.budgetSpent/c.budgetTotal*100).toFixed(0);
  return (
    <div style={{ borderTop:"1px solid #1a1a28", padding:"11px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:11,color:"#ddd",fontWeight:600,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:190 }}>{c.name}</div>
          <PBadge platform={c.platform} sm />
        </div>
        <span style={{ fontSize:9,color:SC[st] }}>{SL[st]}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:7, fontSize:10 }}>
        <div><span style={{color:"#555"}}>Orçado:</span> <span style={{color:"#F59E0B",fontFamily:"monospace"}}>{fmtR(c.budgetTotal)}</span></div>
        <div><span style={{color:"#555"}}>Gasto:</span>  <span style={{color:"#F59E0B",fontFamily:"monospace"}}>{fmtR(c.budgetSpent)}</span></div>
        <div><span style={{color:"#555"}}>Conv.:</span>  <span style={{color:"#10B981",fontFamily:"monospace"}}>{c.conversions}</span></div>
        <div><span style={{color:"#555"}}>Meta:</span>   <span style={{color:"#10B981",fontFamily:"monospace"}}>{c.conversionsGoal}</span></div>
      </div>
      <Bar pct={parseFloat(bp)} color={p?.color} h={3} />
      {st!=="completed" && (
        <div style={{ display:"flex",gap:5,marginTop:8 }}>
          {st==="active" && <button onClick={()=>setSt("paused")} style={{ flex:1,background:"#F59E0B22",border:"1px solid #F59E0B44",color:"#F59E0B",padding:"4px 0",borderRadius:5,cursor:"pointer",fontSize:9 }}>⏸ Pausar</button>}
          {st==="paused" && <button onClick={()=>setSt("active")} style={{ flex:1,background:"#10B98122",border:"1px solid #10B98144",color:"#10B981",padding:"4px 0",borderRadius:5,cursor:"pointer",fontSize:9 }}>▶ Retomar</button>}
          <button onClick={()=>{ const nb=prompt("Novo budget:",c.budgetTotal); if(nb) alert(`R$ ${nb}`); }} style={{ flex:1,background:"#818CF822",border:"1px solid #818CF844",color:"#818CF8",padding:"4px 0",borderRadius:5,cursor:"pointer",fontSize:9 }}>$ Budget</button>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { isMobile } = useBreakpoint();
  const [conn, setConn] = useState({ meta:true, google:true, tiktok:false, mercadolivre:true, amazon:false });
  const [exp, setExp]   = useState(null);
  const cfg = {
    meta:         ["App ID","App Secret","Access Token","Ad Account ID"],
    google:       ["Client ID","Client Secret","Refresh Token","Customer ID"],
    tiktok:       ["App ID","App Secret","Access Token","Advertiser ID"],
    mercadolivre: ["Client ID","Client Secret","Access Token","User ID"],
    amazon:       ["Client ID","Client Secret","Refresh Token","Profile ID","Region"],
  };
  return (
    <div>
      <PH title="Integrações" sub="Credenciais por plataforma" />
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {PLATFORMS.map(p=>{ const isC=conn[p.id]; const isE=exp===p.id;
          return (
            <Card key={p.id} style={{ padding:isMobile?16:20, border:`1px solid ${isC?p.color+"44":"#1e1e2e"}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:38,height:38,background:p.color+"22",border:`2px solid ${p.color}44`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize:13,color:"#fff",fontWeight:600 }}>{p.name}</div>
                    <div style={{ fontSize:10,marginTop:2,color:isC?"#10B981":"#EF4444" }}>{isC?"● Conectado":"○ Desconectado"}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:7 }}>
                  <button onClick={()=>setExp(isE?null:p.id)} style={{ background:"#1a1a28",border:"1px solid #2a2a3e",color:"#888",padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:10 }}>⚙ Config</button>
                  <button onClick={()=>setConn(prev=>({...prev,[p.id]:!prev[p.id]}))} style={{ background:isC?"#EF444422":"#10B98122", border:`1px solid ${isC?"#EF444444":"#10B98144"}`, color:isC?"#EF4444":"#10B981", padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:10 }}>{isC?"Desconectar":"Conectar"}</button>
                </div>
              </div>
              {isE && (
                <div style={{ marginTop:16,paddingTop:16,borderTop:"1px solid #1a1a28" }}>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:11 }}>
                    {cfg[p.id].map(f=>(
                      <div key={f}>
                        <div style={{ fontSize:9,color:"#555",letterSpacing:1,marginBottom:5,textTransform:"uppercase" }}>{f}</div>
                        <input type={f.toLowerCase().includes("secret")||f.toLowerCase().includes("token")?"password":"text"} placeholder={`Insira ${f}`} style={{ width:"100%",background:"#0a0a10",border:"1px solid #2a2a3e",borderRadius:7,padding:"8px 11px",color:"#ccc",fontSize:11,boxSizing:"border-box" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:13,display:"flex",gap:7,flexWrap:"wrap" }}>
                    <button onClick={()=>{ setConn(prev=>({...prev,[p.id]:true})); setExp(null); }} style={{ background:p.color,border:"none",color:"#000",padding:"8px 18px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700 }}>Salvar & Testar</button>
                    <button onClick={()=>setExp(null)} style={{ background:"transparent",border:"1px solid #2a2a3e",color:"#555",padding:"8px 12px",borderRadius:7,cursor:"pointer",fontSize:11 }}>Cancelar</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── FORECAST / PROJEÇÕES PAGE ───────────────────────────────────────────────
const ForecastPage = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const TODAY_DAY = 18; // Feb 18 (current day in simulation)
  const WINDOWS = [
    { days:1,  label:"Amanhã" },
    { days:3,  label:"+3d" },
    { days:5,  label:"+5d" },
    { days:7,  label:"+7d" },
    { days:10, label:"+10d" },
    { days:15, label:"+15d" },
    { days:30, label:"+30d" },
  ];
  const [selWin, setSelWin] = useState(7);
  const [tab, setTab] = useState("overview"); // overview | campaigns | platforms

  const getForecast = (c) => {
    if (c.status === "scheduled" || c.status === "completed") return null;
    const startDay = c.startDate.getDate();
    const endDay   = c.endDate.getDate();
    const daysElapsed   = Math.max(TODAY_DAY - startDay, 1);
    const daysRemaining = Math.max(endDay - TODAY_DAY, 0);
    const dailySpend  = c.budgetSpent / daysElapsed;
    const dailyCv     = c.conversions / daysElapsed;
    const dailyRev    = c.revenue / daysElapsed;
    const budgetLeft  = c.budgetTotal - c.budgetSpent;
    const daysOfBudget = dailySpend > 0 ? budgetLeft / dailySpend : 999;

    const projections = {};
    WINDOWS.forEach(w => {
      const eff = Math.min(w.days, daysOfBudget);
      const spendProj = Math.min(c.budgetSpent + dailySpend * w.days, c.budgetTotal);
      const cvProj    = Math.floor(c.conversions + dailyCv * eff);
      const revProj   = c.revenue + dailyRev * eff;
      projections[w.days] = {
        spend: spendProj, conversions: cvProj, revenue: revProj,
        roas: spendProj > 0 ? revProj / spendProj : 0,
        deltaConv: cvProj - c.conversions,
        deltaRev: revProj - c.revenue,
      };
    });

    const projAtEnd = c.conversions + dailyCv * daysRemaining;
    const paceVsGoal = c.conversionsGoal > 0 ? (projAtEnd / c.conversionsGoal) * 100 : 100;
    const paceStatus = paceVsGoal >= 95 ? "on-track" : paceVsGoal >= 70 ? "at-risk" : "behind";
    const burnRate = c.budgetTotal > 0 ? (c.budgetSpent / c.budgetTotal) * 100 : 0;
    const convRate = c.conversionsGoal > 0 ? (c.conversions / c.conversionsGoal) * 100 : 0;
    const paceDelta = convRate - burnRate; // positive = conversions ahead of spend

    return { daysElapsed, daysRemaining, dailySpend, dailyCv, dailyRev, projections, projAtEnd, paceVsGoal, paceStatus, burnRate, convRate, paceDelta, daysOfBudget };
  };

  const active = CAMPAIGNS.filter(c => c.status !== "completed" && c.status !== "scheduled");
  const withFC = active.map(c => ({ c, fc: getForecast(c) })).filter(x => x.fc);

  const aggNow = withFC.reduce((a, {c}) => ({ spend: a.spend+c.budgetSpent, conversions: a.conversions+c.conversions, revenue: a.revenue+c.revenue }), { spend:0, conversions:0, revenue:0 });

  const aggProj = (days) => withFC.reduce((a, {fc}) => {
    const p = fc.projections[days];
    return { spend: a.spend+p.spend, conversions: a.conversions+p.conversions, revenue: a.revenue+p.revenue };
  }, { spend:0, conversions:0, revenue:0 });

  const wp = aggProj(selWin);
  const paceCount = { onTrack: withFC.filter(x=>x.fc.paceStatus==="on-track").length, atRisk: withFC.filter(x=>x.fc.paceStatus==="at-risk").length, behind: withFC.filter(x=>x.fc.paceStatus==="behind").length };

  const paceColors = { "on-track":"#10B981", "at-risk":"#F59E0B", "behind":"#EF4444" };
  const paceLabels = { "on-track":"✓ No ritmo", "at-risk":"⚡ Em risco", "behind":"⚠ Abaixo" };

  const gridCols = isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(4,1fr)";

  return (
    <div>
      <PH title="Projeções de Pace" sub="Projeção baseada na taxa de conversão diária atual · Fev 2025" />

      {/* Window selector */}
      <div style={{ display:"flex", gap:5, marginBottom:18, flexWrap:"wrap" }}>
        <span style={{ fontSize:10, color:"#555", alignSelf:"center", marginRight:4, letterSpacing:1.5, textTransform:"uppercase" }}>Janela:</span>
        {WINDOWS.map(w => (
          <button key={w.days} onClick={()=>setSelWin(w.days)} style={{ background:selWin===w.days?"linear-gradient(135deg,#7C3AED,#4F46E5)":"#1a1a28", border:`1px solid ${selWin===w.days?"#7C3AED":"#2a2a3e"}`, color:selWin===w.days?"#fff":"#666", padding:"5px 12px", borderRadius:20, cursor:"pointer", fontSize:10, fontWeight:selWin===w.days?700:400, transition:"all .15s" }}>
            {w.label}
          </button>
        ))}
      </div>

      {/* Pace summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:gridCols, gap:10, marginBottom:14 }}>
        <div style={{ background:"#0d0d14", border:"1px solid #10B98144", borderRadius:12, padding:"15px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>✓ No Ritmo</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#10B981", fontFamily:"monospace" }}>{paceCount.onTrack}</div>
          <div style={{ fontSize:10, color:"#555", marginTop:3 }}>de {withFC.length} campanhas</div>
        </div>
        <div style={{ background:"#0d0d14", border:"1px solid #F59E0B44", borderRadius:12, padding:"15px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>⚡ Em Risco</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#F59E0B", fontFamily:"monospace" }}>{paceCount.atRisk}</div>
          <div style={{ fontSize:10, color:"#555", marginTop:3 }}>70–94% do ritmo esperado</div>
        </div>
        <div style={{ background:"#0d0d14", border:"1px solid #EF444444", borderRadius:12, padding:"15px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>⚠ Abaixo</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#EF4444", fontFamily:"monospace" }}>{paceCount.behind}</div>
          <div style={{ fontSize:10, color:"#555", marginTop:3 }}>abaixo de 70% do ritmo</div>
        </div>
        <div style={{ background:"linear-gradient(135deg,#0d0d14,#12121e)", border:"1px solid #7C3AED44", borderRadius:12, padding:"15px 16px" }}>
          <div style={{ fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>ROAS Projetado</div>
          <div style={{ fontSize:26, fontWeight:700, color:"#00FFD1", fontFamily:"monospace" }}>{(wp.revenue/wp.spend).toFixed(2)}x</div>
          <div style={{ fontSize:10, color:"#555", marginTop:3 }}>em {selWin} {selWin===1?"dia":"dias"}</div>
        </div>
      </div>

      {/* Projection summary for selected window */}
      <Card style={{ padding:isMobile?14:20, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <SecTitle style={{ marginBottom:0 }}>Projeção Consolidada — {WINDOWS.find(w=>w.days===selWin)?.label ?? `+${selWin}d`}</SecTitle>
          <div style={{ fontSize:10, color:"#555" }}>Todas as {withFC.length} campanhas ativas e pausadas</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:10, marginBottom:16 }}>
          {[
            { label:"Investimento Atual", now: fmtR(aggNow.spend), proj: fmtR(wp.spend), delta: fmtR(wp.spend - aggNow.spend), color:"#F59E0B" },
            { label:"Conversões", now: fmt(aggNow.conversions), proj: fmt(wp.conversions), delta:`+${fmt(wp.conversions - aggNow.conversions)}`, color:"#7C3AED" },
            { label:"Receita", now: fmtR(aggNow.revenue), proj: fmtR(wp.revenue), delta: fmtR(wp.revenue - aggNow.revenue), color:"#10B981" },
          ].map(item => (
            <div key={item.label} style={{ background:"#12121e", border:"1px solid #1e1e2e", borderRadius:10, padding:"14px 15px" }}>
              <div style={{ fontSize:9, color:"#555", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>{item.label}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
                <div style={{ fontSize:11, color:"#555" }}>Hoje: <span style={{ color:"#888", fontFamily:"monospace" }}>{item.now}</span></div>
                <div style={{ fontSize:9, color:"#555" }}>→</div>
                <div style={{ fontSize:14, fontWeight:700, color:item.color, fontFamily:"monospace" }}>{item.proj}</div>
              </div>
              <div style={{ fontSize:10, color:item.color, marginTop:4, opacity:.8 }}>+{item.delta} projetado</div>
            </div>
          ))}
        </div>

        {/* All windows table */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:520 }}>
            <thead>
              <tr>
                <th style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", padding:"6px 8px", textAlign:"left", fontWeight:600, borderBottom:"1px solid #1a1a28" }}>Métrica \ Janela</th>
                {WINDOWS.map(w => (
                  <th key={w.days} style={{ fontSize:8, color: selWin===w.days?"#7C3AED":"#444", letterSpacing:1.5, textTransform:"uppercase", padding:"6px 8px", textAlign:"right", fontWeight:600, borderBottom:"1px solid #1a1a28", background:selWin===w.days?"#7C3AED08":"transparent", cursor:"pointer" }} onClick={()=>setSelWin(w.days)}>
                    {w.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key:"conversions", label:"Conversões", fmt:(v)=>fmt(v), color:"#7C3AED" },
                { key:"revenue",     label:"Receita",    fmt:(v)=>fmtR(v), color:"#10B981" },
                { key:"spend",       label:"Investido",  fmt:(v)=>fmtR(v), color:"#F59E0B" },
                { key:"roas",        label:"ROAS",       fmt:(v)=>`${v.toFixed(2)}x`, color:"#00FFD1" },
              ].map(row => (
                <tr key={row.key}>
                  <td style={{ fontSize:10, color:"#888", padding:"7px 8px", fontWeight:600 }}>{row.label}</td>
                  {WINDOWS.map(w => {
                    const agg = aggProj(w.days);
                    const val = row.key === "roas" ? agg.revenue/agg.spend : agg[row.key];
                    return (
                      <td key={w.days} style={{ fontSize:10, color:selWin===w.days?row.color:"#666", fontFamily:"monospace", padding:"7px 8px", textAlign:"right", background:selWin===w.days?"#7C3AED08":"transparent", borderLeft:"1px solid #1a1a28", fontWeight:selWin===w.days?700:400 }}>
                        {row.fmt(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Per-campaign pace analysis */}
      <Card style={{ padding:isMobile?14:20 }}>
        <SecTitle>Pace por Campanha</SecTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {withFC
            .sort((a,b) => a.fc.paceVsGoal - b.fc.paceVsGoal) // worst first
            .map(({ c, fc }) => {
              const proj = fc.projections[selWin];
              const pCol = paceColors[fc.paceStatus];
              const barW = Math.min(fc.paceVsGoal, 150);
              const p = PLATFORMS.find(x=>x.id===c.platform);
              return (
                <div key={c.id} style={{ borderTop:"1px solid #1a1a28", padding:"14px 0" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, flexWrap:"wrap" }}>
                        <PBadge platform={c.platform} sm />
                        <span style={{ fontSize:11, color:"#ddd", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                      </div>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, color:"#555" }}>Ritmo: <span style={{ color:"#888", fontFamily:"monospace" }}>{fmt(fc.dailyCv,1)} conv/dia</span></span>
                        <span style={{ fontSize:10, color:"#555" }}>Dias: <span style={{ color:"#888" }}>{fc.daysElapsed}d corridos</span></span>
                        <span style={{ fontSize:10, color:"#555" }}>Restam: <span style={{ color:"#888" }}>{fc.daysRemaining}d</span></span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:10, color:pCol, fontWeight:700, marginBottom:2 }}>{paceLabels[fc.paceStatus]}</div>
                      <div style={{ fontSize:9, color:"#555" }}>Proj. ao fim: {fmt(Math.floor(fc.projAtEnd))} / {fmt(c.conversionsGoal)}</div>
                    </div>
                  </div>

                  {/* Pace bar */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase" }}>PACE VS META {fc.paceVsGoal.toFixed(0)}%</span>
                      <span style={{ fontSize:8, color:fc.paceDelta >= 0 ? "#10B981":"#EF4444" }}>{fc.paceDelta >= 0 ? "▲" : "▼"} Spend {fc.paceDelta >= 0 ? "ok" : "acima do pace"}</span>
                    </div>
                    <div style={{ height:5, background:"#1a1a28", borderRadius:3, position:"relative" }}>
                      <div style={{ height:"100%", width:`${Math.min(fc.paceVsGoal, 100)}%`, background:`linear-gradient(90deg,${pCol},${pCol}88)`, borderRadius:3, transition:"width 1s ease" }} />
                      {/* 100% marker */}
                      <div style={{ position:"absolute", top:"-2px", left:"100%", width:2, height:9, background:"#ffffff22", borderRadius:1 }} />
                    </div>
                  </div>

                  {/* Projections for selected window */}
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)", gap:8, background:"#0a0a10", border:"1px solid #1a1a28", borderRadius:9, padding:"10px 12px" }}>
                    <div>
                      <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Em {selWin}d — Conv.</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#7C3AED", fontFamily:"monospace" }}>{fmt(proj.conversions)}</div>
                      <div style={{ fontSize:9, color:"#555" }}>+{fmt(proj.deltaConv)} hoje</div>
                    </div>
                    <div>
                      <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Em {selWin}d — Receita</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#10B981", fontFamily:"monospace" }}>{fmtR(proj.revenue)}</div>
                      <div style={{ fontSize:9, color:"#555" }}>+{fmtR(proj.deltaRev)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Em {selWin}d — Invest.</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#F59E0B", fontFamily:"monospace" }}>{fmtR(proj.spend)}</div>
                      <div style={{ fontSize:9, color:"#555" }}>de {fmtR(c.budgetTotal)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:8, color:"#444", letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>Em {selWin}d — ROAS</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#00FFD1", fontFamily:"monospace" }}>{proj.roas.toFixed(2)}x</div>
                      <div style={{ fontSize:9, color:"#555" }}>ritmo: {fmtR(fc.dailyRev)}/dia</div>
                    </div>
                  </div>
                </div>
              );
          })}
        </div>
      </Card>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─── GOAL SEEK PAGE ───────────────────────────────────────────────────────────
const Speedometer = ({ pct, goal, current, projected }) => {
  // ── 270° classic gauge ────────────────────────────────────────────────────
  // Sweep: from 225° (SW, bottom-left = 0%) clockwise to 315° (SE, bottom-right = 100%)
  // Standard math angle for p%:  θ(p) = 225° − 270° × (p/100)
  // SVG point: x = CX + r·cos(θ),  y = CY − r·sin(θ)   [y-axis flipped]

  const W = 280, H = 240;
  const CX = 140, CY = 148;
  const R_OUT = 110, R_IN = 72;   // ring band thickness
  const R_NEEDLE = 100;
  const R_TICK_OUT = R_OUT + 12;
  const R_TICK_MID = R_OUT + 6;
  const R_LABEL = R_OUT + 26;

  const degToRad = (d) => (d * Math.PI) / 180;

  // Standard-math angle for a given percentage
  const pctToAngle = (p) => degToRad(225 - 2.7 * Math.min(Math.max(p, 0), 100));

  // Cartesian point from standard-math angle
  const pt = (a, r) => ({ x: +(CX + r * Math.cos(a)).toFixed(2), y: +(CY - r * Math.sin(a)).toFixed(2) });

  // Donut arc path for a p1→p2 segment (clockwise = decreasing angle)
  const donut = (p1, p2, rIn, rOut) => {
    const a1 = pctToAngle(p1), a2 = pctToAngle(p2);
    const o1 = pt(a1, rOut), o2 = pt(a2, rOut);
    const i1 = pt(a1, rIn),  i2 = pt(a2, rIn);
    const span = (p2 - p1) * 2.7;        // degrees of arc
    const lg = span > 180 ? 1 : 0;       // large-arc flag
    // outer arc: clockwise (sweep=1), inner arc: counter-clockwise (sweep=0)
    return [
      `M ${o1.x} ${o1.y}`,
      `A ${rOut} ${rOut} 0 ${lg} 1 ${o2.x} ${o2.y}`,
      `L ${i2.x} ${i2.y}`,
      `A ${rIn} ${rIn} 0 ${lg} 0 ${i1.x} ${i1.y}`,
      `Z`
    ].join(' ');
  };

  const clamped = Math.min(Math.max(pct, 0), 100);

  // ── Colored zone definitions ────────────────────────────────────────────────
  const zones = [
    { from: 0,  to: 20,  bg: '#4B0E0E', fill: '#EF4444', label: '' },
    { from: 20, to: 45,  bg: '#4B2A08', fill: '#F97316', label: '' },
    { from: 45, to: 70,  bg: '#4B3B08', fill: '#EAB308', label: '' },
    { from: 70, to: 100, bg: '#0E3B1F', fill: '#22C55E', label: '' },
  ];

  // Determine current zone color
  const activeZone = zones.find(z => clamped >= z.from && clamped <= z.to) || zones[zones.length - 1];
  const needleColor = activeZone.fill;

  // ── Tick positions ──────────────────────────────────────────────────────────
  const majorTicks = [0, 25, 50, 75, 100];
  const minorTicks = [10, 20, 30, 40, 60, 70, 80, 90];

  // ── Needle triangle ─────────────────────────────────────────────────────────
  const na = pctToAngle(clamped);
  const tip = pt(na, R_NEEDLE - 8);
  const perp = na + Math.PI / 2;
  const hw = 5; // half-width at base
  const b1 = { x: +(CX + hw * Math.cos(perp)).toFixed(2), y: +(CY - hw * Math.sin(perp)).toFixed(2) };
  const b2 = { x: +(CX - hw * Math.cos(perp)).toFixed(2), y: +(CY + hw * Math.sin(perp)).toFixed(2) };
  // small tail behind center
  const tail = pt(na + Math.PI, 18);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 320, display: 'block' }}>
        <defs>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3a3a5a" />
            <stop offset="100%" stopColor="#0d0d14" />
          </radialGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Outer bezel ring ── */}
        <circle cx={CX} cy={CY} r={R_OUT + 16} fill="#111118" stroke="#2a2a3e" strokeWidth={1.5} />

        {/* ── Zone backgrounds (dim) ── */}
        {zones.map(z => (
          <path key={`bg${z.from}`} d={donut(z.from, z.to, R_IN, R_OUT)} fill={z.bg} />
        ))}

        {/* ── Zone divider lines ── */}
        {[20, 45, 70].map(v => {
          const a = pctToAngle(v);
          const p1 = pt(a, R_IN - 2), p2 = pt(a, R_OUT + 2);
          return <line key={v} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#0d0d14" strokeWidth={3} />;
        })}

        {/* ── Lit zones (0 → clamped) ── */}
        {zones.map(z => {
          if (clamped <= z.from) return null;
          const to = Math.min(clamped, z.to);
          return (
            <path key={`lit${z.from}`}
              d={donut(z.from, to, R_IN, R_OUT)}
              fill={z.fill}
              filter="url(#softglow)"
              opacity={0.92}
            />
          );
        })}

        {/* ── Minor tick marks ── */}
        {minorTicks.map(v => {
          const a = pctToAngle(v);
          const p1 = pt(a, R_TICK_MID), p2 = pt(a, R_TICK_MID + 5);
          return <line key={`mt${v}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="#555" strokeWidth={1.5} strokeLinecap="round" />;
        })}

        {/* ── Major tick marks + labels ── */}
        {majorTicks.map(v => {
          const a = pctToAngle(v);
          const p1 = pt(a, R_OUT + 1), p2 = pt(a, R_TICK_OUT + 2);
          const lp = pt(a, R_LABEL);
          const isLit = v <= clamped;
          const zoneColor = zones.find(z => v >= z.from && v <= z.to)?.fill || '#888';
          const anchor = v === 0 ? 'end' : v === 100 ? 'start' : 'middle';
          return (
            <g key={`maj${v}`}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isLit ? zoneColor : '#444'} strokeWidth={2.5} strokeLinecap="round" />
              <text x={lp.x} y={+(lp.y + 4).toFixed(1)}
                textAnchor={anchor} fontSize={11} fontWeight={700}
                fill={isLit ? zoneColor : '#444'} fontFamily="monospace">{v}%</text>
            </g>
          );
        })}

        {/* ── Inner dark face ── */}
        <circle cx={CX} cy={CY} r={R_IN - 3} fill="#08080f" />

        {/* ── Center glow ring matching needle color ── */}
        <circle cx={CX} cy={CY} r={R_IN - 3} fill="none"
          stroke={needleColor} strokeWidth={1.5} opacity={0.25} />

        {/* ── Percentage value ── */}
        <text x={CX} y={CY - 22}
          textAnchor="middle" fontSize={38} fontWeight={800}
          fill={needleColor} fontFamily="monospace" letterSpacing={-2}
          filter="url(#softglow)"
        >{clamped.toFixed(1)}%</text>

        {/* ── "DA META" label ── */}
        <text x={CX} y={CY - 2}
          textAnchor="middle" fontSize={8} fill="#555"
          fontFamily="sans-serif" letterSpacing={3}>DA META</text>

        {/* ── Sub-label: current status ── */}
        <text x={CX} y={CY + 16}
          textAnchor="middle" fontSize={9} fill={needleColor} fontFamily="monospace" opacity={0.7}>
          {clamped < 50 ? '⚠ CRÍTICO' : clamped < 80 ? '◉ EM PROGRESSO' : '✓ NO ALVO'}
        </text>

        {/* ── Needle shadow ── */}
        <polygon
          points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${tail.x},${tail.y} ${b2.x},${b2.y}`}
          fill="#000" opacity={0.35}
          transform="translate(2,2)"
        />

        {/* ── Needle ── */}
        <polygon
          points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${tail.x},${tail.y} ${b2.x},${b2.y}`}
          fill={needleColor}
          filter="url(#glow)"
        />

        {/* ── Hub outer ring ── */}
        <circle cx={CX} cy={CY} r={16} fill="url(#hubGrad)" stroke={needleColor} strokeWidth={2} />
        {/* ── Hub inner dot ── */}
        <circle cx={CX} cy={CY} r={7} fill={needleColor} filter="url(#softglow)" />
        <circle cx={CX} cy={CY} r={3} fill="#fff" opacity={0.6} />

        {/* ── Bottom arc label strip (0% left → 100% right) ── */}
        <text x={pt(pctToAngle(0), R_OUT - 6).x - 4} y={pt(pctToAngle(0), R_OUT - 6).y + 4}
          textAnchor="end" fontSize={8} fill="#EF4444" fontFamily="monospace">0</text>
        <text x={pt(pctToAngle(100), R_OUT - 6).x + 4} y={pt(pctToAngle(100), R_OUT - 6).y + 4}
          textAnchor="start" fontSize={8} fill="#22C55E" fontFamily="monospace">100</text>

      </svg>

      {/* ── Stats row ── */}
      <div style={{ display: 'flex', gap: 28, marginTop: 4, justifyContent: 'center' }}>
        {[
          { label: 'Atual',      value: fmt(current),   color: '#888'    },
          { label: 'Projetado',  value: fmt(projected), color: '#00FFD1' },
          { label: 'Meta',       value: fmt(goal),      color: '#22C55E' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


const GoalSeekPage = () => {
  const { isMobile, isTablet } = useBreakpoint();

  // ── Goal inputs ─────────────────────────────────────────────────────────────
  const totalConvNow   = CAMPAIGNS.filter(c => c.status === "active").reduce((s, c) => s + c.conversions, 0);
  const totalRevNow    = CAMPAIGNS.filter(c => c.status === "active").reduce((s, c) => s + c.revenue, 0);
  const totalBudgetNow = CAMPAIGNS.filter(c => c.status === "active").reduce((s, c) => s + c.budgetSpent, 0);

  const [goalType,    setGoalType]    = useState("conversions"); // conversions | revenue
  const [goalValue,   setGoalValue]   = useState(goalType === "conversions" ? Math.round(totalConvNow * 1.4) : Math.round(totalRevNow * 1.4));
  const [extraBudget, setExtraBudget] = useState(50000);
  const [selected,    setSelected]    = useState(new Set());
  const [tab,         setTab]         = useState("recommended"); // recommended | manual

  // Re-sync goal default when type changes
  const handleGoalType = (type) => {
    setGoalType(type);
    setGoalValue(type === "conversions" ? Math.round(totalConvNow * 1.4) : Math.round(totalRevNow * 1.4));
    setSelected(new Set());
  };

  // ── Score each active campaign ───────────────────────────────────────────────
  const activeCampaigns = CAMPAIGNS.filter(c => c.status === "active");

  const scored = activeCampaigns.map(c => {
    const roas    = c.budgetSpent > 0 ? c.revenue / c.budgetSpent : 0;
    const convRate = c.budgetSpent > 0 ? c.conversions / c.budgetSpent : 0; // conv per R$
    const cvPct   = c.conversionsGoal > 0 ? c.conversions / c.conversionsGoal : 1;
    const headroom = Math.max(1 - cvPct, 0); // how much room to grow
    const daysLeft = Math.max(c.endDate.getDate() - 18, 1);
    const dailyConv = c.conversions / Math.max(18 - c.startDate.getDate(), 1);
    const dailyRev  = c.revenue     / Math.max(18 - c.startDate.getDate(), 1);
    // Efficiency score (0-100): rewards high ROAS, high conv rate, headroom
    const score = ((roas / 15) * 40 + (convRate * 1000) * 30 + headroom * 30);
    // Project how much extra value R$1000 of extra budget yields
    const extraPerK_conv = convRate * 1000;
    const extraPerK_rev  = roas * 1000;
    return { c, roas, convRate, headroom, daysLeft, dailyConv, dailyRev, score, extraPerK_conv, extraPerK_rev };
  }).sort((a, b) => b.score - a.score);

  // ── Budget allocation ────────────────────────────────────────────────────────
  const topN   = Math.min(3, scored.length);
  const recommended = scored.slice(0, topN);

  // Distribute extra budget proportionally to score among selected
  const selArr  = scored.filter(s => selected.has(s.c.id));
  const totalScore = selArr.reduce((sum, s) => sum + s.score, 0);

  const allocations = selArr.map(s => {
    const share   = totalScore > 0 ? s.score / totalScore : 1 / selArr.length;
    const budget  = extraBudget * share;
    const addConv = goalType === "conversions" ? s.c.conversions / Math.max(s.c.budgetSpent, 1) * budget : 0;
    const addRev  = s.c.revenue  / Math.max(s.c.budgetSpent, 1) * budget;
    return { ...s, share, budget, addConv, addRev };
  });

  const projectedConv = totalConvNow + allocations.reduce((s, a) => s + a.addConv, 0);
  const projectedRev  = totalRevNow  + allocations.reduce((s, a) => s + a.addRev,  0);

  const currentVal  = goalType === "conversions" ? totalConvNow  : totalRevNow;
  const projVal     = goalType === "conversions" ? projectedConv  : projectedRev;
  const pct         = goalValue > 0 ? (projVal / goalValue) * 100 : 0;
  const currentPct  = goalValue > 0 ? (currentVal / goalValue) * 100 : 0;
  const delta       = pct - currentPct;

  const toggleCampaign = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const applyRecommended = () => setSelected(new Set(recommended.map(r => r.c.id)));
  const clearAll = () => setSelected(new Set());

  const paceColors = { good: "#10B981", mid: "#F59E0B", bad: "#EF4444" };
  const scoreColor = (score) => score > 60 ? "#10B981" : score > 30 ? "#F59E0B" : "#EF4444";

  return (
    <div>
      <PH title="Goal Seek" sub="Simule o efeito de alocar budget extra nas melhores campanhas para bater a meta" />

      {/* ── Goal config ── */}
      <Card style={{ padding: isMobile ? 14 : 20, marginBottom: 14 }}>
        <SecTitle>Configurar Meta</SecTitle>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
          {/* Goal type */}
          <div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Tipo de Meta</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["conversions", "◆ Conversões"], ["revenue", "$ Receita"]].map(([val, label]) => (
                <button key={val} onClick={() => handleGoalType(val)} style={{ flex: 1, background: goalType === val ? "linear-gradient(135deg,#7C3AED,#4F46E5)" : "#1a1a28", border: `1px solid ${goalType === val ? "#7C3AED" : "#2a2a3e"}`, color: goalType === val ? "#fff" : "#666", padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: goalType === val ? 700 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* Goal value */}
          <div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
              Meta de {goalType === "conversions" ? "Conversões" : "Receita (R$)"}
            </div>
            <input
              type="number"
              value={goalValue}
              onChange={e => setGoalValue(Number(e.target.value))}
              style={{ width: "100%", background: "#0a0a10", border: "1px solid #7C3AED44", borderRadius: 8, padding: "9px 12px", color: "#c4b5fd", fontSize: 14, fontWeight: 700, boxSizing: "border-box", fontFamily: "monospace" }}
            />
            <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>
              Atual: {goalType === "conversions" ? fmt(totalConvNow) : fmtR(totalRevNow)} · gap: {goalType === "conversions" ? fmt(goalValue - totalConvNow) : fmtR(goalValue - totalRevNow)}
            </div>
          </div>
          {/* Extra budget */}
          <div>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Budget Extra Disponível (R$)</div>
            <input
              type="number"
              value={extraBudget}
              onChange={e => setExtraBudget(Number(e.target.value))}
              style={{ width: "100%", background: "#0a0a10", border: "1px solid #F59E0B44", borderRadius: 8, padding: "9px 12px", color: "#F59E0B", fontSize: 14, fontWeight: 700, boxSizing: "border-box", fontFamily: "monospace" }}
            />
            <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>Distribuído entre as campanhas selecionadas</div>
          </div>
        </div>
      </Card>

      {/* ── Tab selector ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["recommended", "✦ Recomendadas pela IA"], ["manual", "⚙ Seleção Manual"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#1e1e2e" : "transparent", border: `1px solid ${tab === t ? "#7C3AED" : "#2a2a3e"}`, color: tab === t ? "#c4b5fd" : "#555", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: tab === t ? 600 : 400 }}>
            {l}
          </button>
        ))}
        {selected.size > 0 && (
          <button onClick={clearAll} style={{ background: "transparent", border: "1px solid #EF444444", color: "#EF4444", padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 10, marginLeft: "auto" }}>
            ✕ Limpar seleção ({selected.size})
          </button>
        )}
      </div>

      {/* ── Recommended tab ── */}
      {tab === "recommended" && (
        <Card style={{ padding: isMobile ? 14 : 20, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <SecTitle style={{ marginBottom: 2 }}>Top Campanhas para Escalar</SecTitle>
              <div style={{ fontSize: 10, color: "#555" }}>Rankeadas por eficiência: ROAS + taxa de conversão + espaço de crescimento</div>
            </div>
            <button onClick={applyRecommended} style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
              ✦ Aplicar Top {topN}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scored.map((s, rank) => {
              const isSel = selected.has(s.c.id);
              const alloc = allocations.find(a => a.c.id === s.c.id);
              const isTop = rank < topN;
              const p = PLATFORMS.find(x => x.id === s.c.platform);
              return (
                <div key={s.c.id} onClick={() => toggleCampaign(s.c.id)} style={{ background: isSel ? "#12121e" : "#0a0a10", border: `1px solid ${isSel ? "#7C3AED" : isTop ? p?.color + "33" : "#1e1e2e"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all .15s", position: "relative", overflow: "hidden" }}>
                  {/* Rank badge */}
                  <div style={{ position: "absolute", top: 12, right: 14, fontSize: 10, color: rank === 0 ? "#F59E0B" : rank === 1 ? "#888" : rank === 2 ? "#CD7F32" : "#333", fontWeight: 700 }}>
                    {rank === 0 ? "🥇 #1" : rank === 1 ? "🥈 #2" : rank === 2 ? "🥉 #3" : `#${rank + 1}`}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: isSel ? "linear-gradient(135deg,#7C3AED,#4F46E5)" : "#1a1a28", border: `1px solid ${isSel ? "#7C3AED" : "#2a2a3e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11 }}>
                      {isSel ? "✓" : "○"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                        <PBadge platform={s.c.platform} sm />
                        <span style={{ fontSize: 11, color: "#ddd", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.c.name}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 8 }}>
                        {[
                          { l: "ROAS", v: `${s.roas.toFixed(2)}x`, col: "#00FFD1" },
                          { l: "Conv/R$1k", v: `+${s.extraPerK_conv.toFixed(1)}`, col: "#7C3AED" },
                          { l: "Eficiência", v: `${s.score.toFixed(0)}pts`, col: scoreColor(s.score) },
                          { l: "Headroom", v: fmtP((1 - (s.c.conversions / Math.max(s.c.conversionsGoal, 1))) * 100), col: "#818CF8" },
                        ].map(m => (
                          <div key={m.l}>
                            <div style={{ fontSize: 8, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>{m.l}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: m.col, fontFamily: "monospace" }}>{m.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div style={{ height: 3, background: "#1a1a28", borderRadius: 2, marginBottom: isSel && alloc ? 10 : 0 }}>
                    <div style={{ height: "100%", width: `${Math.min(s.score, 100)}%`, background: `linear-gradient(90deg,${scoreColor(s.score)},${scoreColor(s.score)}88)`, borderRadius: 2, transition: "width .8s ease" }} />
                  </div>
                  {/* Allocation preview if selected */}
                  {isSel && alloc && (
                    <div style={{ background: "#0d0d1e", border: "1px solid #7C3AED33", borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: "#7C3AED", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>✦ Alocação Sugerida</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 8, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Budget Extra</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", fontFamily: "monospace" }}>{fmtR(alloc.budget)}</div>
                          <div style={{ fontSize: 9, color: "#555" }}>{(alloc.share * 100).toFixed(0)}% do extra</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 8, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>+Conv. Esperadas</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", fontFamily: "monospace" }}>+{fmt(Math.floor(alloc.addConv))}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 8, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>+Receita</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", fontFamily: "monospace" }}>+{fmtR(Math.floor(alloc.addRev))}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Manual tab ── */}
      {tab === "manual" && (
        <Card style={{ padding: isMobile ? 14 : 20, marginBottom: 14 }}>
          <SecTitle>Selecione as Campanhas</SecTitle>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 14 }}>Clique para selecionar/desmarcar. O budget extra será distribuído proporcionalmente à eficiência de cada campanha selecionada.</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 8 }}>
            {scored.map(s => {
              const isSel = selected.has(s.c.id);
              const alloc = allocations.find(a => a.c.id === s.c.id);
              const p = PLATFORMS.find(x => x.id === s.c.platform);
              return (
                <div key={s.c.id} onClick={() => toggleCampaign(s.c.id)} style={{ background: isSel ? "#12121e" : "#0a0a10", border: `1px solid ${isSel ? "#7C3AED" : "#1e1e2e"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: isSel ? "#7C3AED" : "#1a1a28", border: `1px solid ${isSel ? "#7C3AED" : "#2a2a3e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                      {isSel ? "✓" : ""}
                    </div>
                    <PBadge platform={s.c.platform} sm />
                    <span style={{ fontSize: 11, color: "#ddd", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{s.c.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                    {[
                      { l: "ROAS", v: `${s.roas.toFixed(1)}x`, col: "#00FFD1" },
                      { l: "Eficiência", v: `${s.score.toFixed(0)}pts`, col: scoreColor(s.score) },
                      { l: "Conv/dia", v: s.c.conversions > 0 ? fmt(s.c.conversions / Math.max(18 - s.c.startDate.getDate(), 1), 1) : "—", col: "#818CF8" },
                    ].map(m => (
                      <div key={m.l}>
                        <div style={{ fontSize: 7, color: "#444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 1 }}>{m.l}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: m.col, fontFamily: "monospace" }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                  {isSel && alloc && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #7C3AED22", display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 9, color: "#F59E0B" }}>+{fmtR(Math.floor(alloc.budget))} budget</span>
                      <span style={{ fontSize: 9, color: "#7C3AED" }}>+{fmt(Math.floor(alloc.addConv))} conv</span>
                      <span style={{ fontSize: 9, color: "#10B981" }}>+{fmtR(Math.floor(alloc.addRev))}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Speedometer ─────────────────────────────────────────────────────── */}
      <Card style={{ padding: isMobile ? 16 : 24 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <SecTitle>Velocímetro de Meta</SecTitle>
          <div style={{ fontSize: 10, color: "#555" }}>
            {selected.size === 0
              ? "Selecione campanhas acima para ver o impacto na meta"
              : `${selected.size} campanha${selected.size > 1 ? "s" : ""} selecionada${selected.size > 1 ? "s" : ""} · R$ ${fmt(extraBudget)} extra alocados`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: 30, justifyContent: "center" }}>
          {/* Speedometer SVG */}
          <Speedometer
            pct={pct}
            goal={goalValue}
            current={Math.round(currentVal)}
            projected={goalType === "conversions" ? Math.round(projectedConv) : Math.round(projectedRev)}
            isMobile={isMobile}
          />

          {/* Impact breakdown */}
          <div style={{ flex: 1, maxWidth: 360, minWidth: isMobile ? "100%" : 280 }}>
            {/* Before vs after */}
            <div style={{ background: "#0a0a10", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Impacto da Alocação</div>
              {[
                { label: "Meta", val: goalType === "conversions" ? fmt(goalValue) : fmtR(goalValue), col: "#10B981" },
                { label: "Atual (sem extra)", val: goalType === "conversions" ? fmt(Math.round(currentVal)) : fmtR(Math.round(currentVal)), pctStr: `${currentPct.toFixed(1)}%`, col: "#888" },
                { label: `Projetado (+R$${fmt(extraBudget)})`, val: goalType === "conversions" ? fmt(Math.round(projVal)) : fmtR(Math.round(projVal)), pctStr: `${pct.toFixed(1)}%`, col: "#00FFD1" },
                { label: "Avanço com alocação", val: `+${delta.toFixed(1)} p.p.`, col: delta > 0 ? "#7C3AED" : "#EF4444" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 3 ? "1px solid #1a1a28" : "none" }}>
                  <span style={{ fontSize: 11, color: "#666" }}>{row.label}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: row.col, fontFamily: "monospace" }}>{row.val}</span>
                    {row.pctStr && <span style={{ fontSize: 9, color: "#555", marginLeft: 6 }}>{row.pctStr}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Per-campaign delta */}
            {allocations.length > 0 && (
              <div style={{ background: "#0a0a10", border: "1px solid #1e1e2e", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Contribuição por Campanha</div>
                {allocations.sort((a, b) => b.addConv - a.addConv).map(a => {
                  const contribPct = goalValue > 0 ? (goalType === "conversions" ? a.addConv : a.addRev) / goalValue * 100 : 0;
                  const p = PLATFORMS.find(x => x.id === a.c.platform);
                  return (
                    <div key={a.c.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 11, color: p?.color || "#888" }}>{p?.icon}</span>
                          <span style={{ fontSize: 10, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? 120 : 160 }}>{a.c.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <span style={{ fontSize: 10, color: "#7C3AED", fontFamily: "monospace" }}>+{fmt(Math.floor(a.addConv))} conv</span>
                          <span style={{ fontSize: 10, color: "#818CF8", fontFamily: "monospace" }}>+{contribPct.toFixed(1)}pp</span>
                        </div>
                      </div>
                      <div style={{ height: 4, background: "#1a1a28", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${Math.min(contribPct * 3, 100)}%`, background: `linear-gradient(90deg,${p?.color || "#7C3AED"},${p?.color || "#7C3AED"}88)`, borderRadius: 2, transition: "width .8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Warning if still below goal */}
            {pct < 100 && selected.size > 0 && (
              <div style={{ background: "#EF444411", border: "1px solid #EF444433", borderRadius: 10, padding: "10px 14px", marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, marginBottom: 3 }}>⚠ Meta ainda não atingida</div>
                <div style={{ fontSize: 10, color: "#888", lineHeight: 1.5 }}>
                  Faltam {goalType === "conversions" ? `${fmt(Math.round(goalValue - projVal))} conversões` : fmtR(Math.round(goalValue - projVal))} para bater a meta.{" "}
                  Budget extra necessário estimado: {fmtR(Math.round((goalValue - projVal) / (projVal - currentVal) * extraBudget))}
                </div>
              </div>
            )}
            {pct >= 100 && selected.size > 0 && (
              <div style={{ background: "#10B98111", border: "1px solid #10B98133", borderRadius: 10, padding: "10px 14px", marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600, marginBottom: 3 }}>✓ Meta atingida com folga!</div>
                <div style={{ fontSize: 10, color: "#888" }}>A alocação sugerida é suficiente para superar a meta definida.</div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const { isMobile, isTablet } = useBreakpoint();
  const [page, setPage]           = useState("overview");
  const [sideCollapsed, setSide]  = useState(false);
  const [brandMenu, setBrandMenu] = useState(false);

  const navItems = [
    { id:"overview",  label:"Visão Geral", icon:"◎" },
    { id:"campaigns", label:"Campanhas",   icon:"◇" },
    { id:"forecast",  label:"Projeções",   icon:"◐" },
    { id:"goalseek",  label:"Goal Seek",   icon:"◉" },
    { id:"calendar",  label:"Calendário",  icon:"◑" },
    { id:"__d1__", divider:true },
    ...PLATFORMS.map(p=>({ id:p.id, label:p.name, icon:p.icon, color:p.color })),
    { id:"__d2__", divider:true },
    { id:"settings", label:"Integrações", icon:"⚙" },
  ];
  const bottomNav = [
    { id:"overview",   label:"Geral",       icon:"◎" },
    { id:"goalseek",   label:"Goal Seek",   icon:"◉" },
    { id:"forecast",   label:"Projeções",   icon:"◐" },
    { id:"__brands__", label:"Plataformas", icon:"◈", menu:true },
    { id:"settings",   label:"Config",      icon:"⚙" },
  ];

  const renderPage = () => {
    if (page==="overview")  return <OverviewPage />;
    if (page==="campaigns") return <CampaignsPage />;
    if (page==="forecast")  return <ForecastPage />;
    if (page==="goalseek")  return <GoalSeekPage />;
    if (page==="calendar")  return <CalendarPage />;
    if (page==="settings")  return <SettingsPage />;
    if (PLATFORMS.find(p=>p.id===page)) return <PlatformPage pid={page} />;
    return null;
  };

  const activeColor = PLATFORMS.find(p=>p.id===page)?.color || "#00FFD1";

  // ── MOBILE ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:"#070710", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#fff" }}>
        <div style={{ height:50, background:"#0a0a14", borderBottom:"1px solid #1a1a28", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px", flexShrink:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:26,height:26,background:"linear-gradient(135deg,#7C3AED,#00FFD1)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>◈</div>
            <span style={{ fontSize:13,fontWeight:700,background:"linear-gradient(90deg,#00FFD1,#818CF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ConvIQ</span>
          </div>
          <div style={{ background:"#10B98122",border:"1px solid #10B98144",color:"#10B981",padding:"3px 9px",borderRadius:20,fontSize:9 }}>● {CAMPAIGNS.filter(c=>c.status==="active").length} ativas</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px 14px 76px" }}>{renderPage()}</div>
        {brandMenu && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:40 }} onClick={()=>setBrandMenu(false)}>
            <div style={{ position:"absolute",bottom:64,left:0,right:0,background:"#0d0d14",border:"1px solid #1e1e2e",borderRadius:"14px 14px 0 0",padding:18 }} onClick={e=>e.stopPropagation()}>
              <div style={{ fontSize:10,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:12 }}>Selecionar Plataforma</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
                {PLATFORMS.map(p=>(
                  <button key={p.id} onClick={()=>{ setPage(p.id); setBrandMenu(false); }} style={{ display:"flex",alignItems:"center",gap:7,background:page===p.id?p.color+"22":"#12121e",border:`1px solid ${page===p.id?p.color+"55":"#1e1e2e"}`,color:page===p.id?p.color:"#888",padding:"9px 12px",borderRadius:9,cursor:"pointer",fontSize:11 }}>
                    <span style={{ fontSize:17 }}>{p.icon}</span> {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div style={{ height:64,background:"#0a0a14",borderTop:"1px solid #1a1a28",display:"flex",alignItems:"stretch",flexShrink:0,zIndex:30 }}>
          {bottomNav.map(item=>{ const isA=item.menu?PLATFORMS.some(p=>p.id===page):page===item.id; const col=isA?(PLATFORMS.find(p=>p.id===page)?.color||"#00FFD1"):"#555";
            return (
              <button key={item.id} onClick={()=>{ if(item.menu) setBrandMenu(!brandMenu); else { setPage(item.id); setBrandMenu(false); } }} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,background:"transparent",border:"none",cursor:"pointer",borderTop:`2px solid ${isA?col:"transparent"}`,paddingTop:isA?0:2 }}>
                <span style={{ fontSize:17,color:col }}>{item.icon}</span>
                <span style={{ fontSize:8,color:col,letterSpacing:.4 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DESKTOP / TABLET ────────────────────────────────────────────────────────
  const sw = isTablet ? (sideCollapsed?54:196) : (sideCollapsed?62:236);
  return (
    <div style={{ display:"flex", height:"100vh", background:"#070710", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#fff", overflow:"hidden" }}>
      <div style={{ width:sw,minWidth:sw,background:"#0a0a14",borderRight:"1px solid #1a1a28",display:"flex",flexDirection:"column",transition:"width .3s ease",overflow:"hidden" }}>
        <div style={{ padding:"16px 14px 12px",borderBottom:"1px solid #1a1a28",display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:29,height:29,background:"linear-gradient(135deg,#7C3AED,#00FFD1)",borderRadius:7,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12 }}>◈</div>
          {!sideCollapsed && <span style={{ fontSize:13,fontWeight:700,background:"linear-gradient(90deg,#00FFD1,#818CF8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap" }}>ConvIQ</span>}
        </div>
        <nav style={{ flex:1,padding:"9px 5px",overflowY:"auto" }}>
          {navItems.map((item,i)=>{
            if (item.divider) return <div key={i} style={{ height:1,background:"#1a1a28",margin:"5px 0" }}/>;
            const isA=page===item.id; const col=item.color||(isA?activeColor:undefined);
            return (
              <button key={item.id} onClick={()=>setPage(item.id)} title={sideCollapsed?item.label:undefined} style={{ display:"flex",alignItems:"center",gap:7,width:"100%",padding:sideCollapsed?"8px 0":"8px 9px",justifyContent:sideCollapsed?"center":"flex-start",background:isA?(col?col+"18":"#7C3AED18"):"transparent",border:`1px solid ${isA?(col||"#7C3AED")+"44":"transparent"}`,borderRadius:8,cursor:"pointer",marginBottom:2,color:isA?(col||"#00FFD1"):"#555",transition:"all .15s" }}
                onMouseEnter={e=>{ if(!isA){e.currentTarget.style.background="#1a1a28";e.currentTarget.style.color="#999";} }}
                onMouseLeave={e=>{ if(!isA){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#555";} }}>
                <span style={{ fontSize:14,flexShrink:0 }}>{item.icon}</span>
                {!sideCollapsed && <span style={{ fontSize:11,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{item.label}</span>}
                {!sideCollapsed && isA && <div style={{ marginLeft:"auto",width:4,height:4,borderRadius:2,background:col||"#00FFD1" }}/>}
              </button>
            );
          })}
        </nav>
        <div style={{ borderTop:"1px solid #1a1a28",padding:"9px 9px 12px" }}>
          <button onClick={()=>setSide(!sideCollapsed)} style={{ display:"flex",alignItems:"center",gap:5,width:"100%",background:"transparent",border:"none",cursor:"pointer",color:"#444",fontSize:10,padding:"4px 2px",justifyContent:sideCollapsed?"center":"flex-start" }}>
            <span style={{ fontSize:13 }}>{sideCollapsed?"▷":"◁"}</span>{!sideCollapsed && "Recolher"}
          </button>
          {!sideCollapsed && (
            <div style={{ display:"flex",alignItems:"center",gap:7,marginTop:7,padding:"5px 2px" }}>
              <div style={{ width:27,height:27,borderRadius:7,background:"linear-gradient(135deg,#7C3AED,#00FFD1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0 }}>F</div>
              <div><div style={{ fontSize:11,color:"#ccc" }}>Fernando</div><div style={{ fontSize:9,color:"#444" }}>Admin</div></div>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <div style={{ height:50,borderBottom:"1px solid #1a1a28",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0,background:"#08080f" }}>
          <div style={{ fontSize:11,color:"#444" }}>ConvIQ <span style={{ color:"#2a2a3e" }}>·</span> <span style={{ color:"#666" }}>Fev 2025</span></div>
          <div style={{ display:"flex",gap:9,alignItems:"center" }}>
            <div style={{ background:"#10B98122",border:"1px solid #10B98144",color:"#10B981",padding:"4px 11px",borderRadius:20,fontSize:9 }}>● {CAMPAIGNS.filter(c=>c.status==="active").length} ativas</div>
            <button style={{ background:"#1a1a28",border:"1px solid #2a2a3e",color:"#666",padding:"4px 11px",borderRadius:20,fontSize:9,cursor:"pointer" }}>↻ Sincronizar</button>
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:isTablet?"22px":"30px" }}>{renderPage()}</div>
      </div>
    </div>
  );
}

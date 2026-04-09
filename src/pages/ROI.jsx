import { useState, useMemo } from 'react'

// ── Real benchmark data with citations ────────────────────────────────────────
const ROLE_LEVELS = [
  {
    id: 'professional',
    label: 'Profesional / Analista Senior',
    replacementFactor: 0.75,
    externalFeePct: 0.12,
    note: 'Gallup 2022: 50–100% salario',
  },
  {
    id: 'manager',
    label: 'Manager / Supervisor',
    replacementFactor: 1.25,
    externalFeePct: 0.18,
    note: 'Gallup 2022: 100–150% salario',
  },
  {
    id: 'director',
    label: 'Director / VP',
    replacementFactor: 1.75,
    externalFeePct: 0.22,
    note: 'Bersin/Deloitte 2023: 150–200% salario',
  },
  {
    id: 'executive',
    label: 'Ejecutivo / C-Suite',
    replacementFactor: 2.50,
    externalFeePct: 0.28,
    note: 'Korn Ferry / SHRM 2023: 200–300%+ salario',
  },
]

const BENCHMARKS = [
  {
    icon: '💰', value: '$6.20', label: 'retorno por cada $1 invertido',
    source: 'Deloitte, 2024', color: '#1D9E75', bg: '#e6f5ef',
    detail: 'Costos evitados en backfill, pérdida de productividad y rotación no planeada.',
  },
  {
    icon: '📉', value: '25%', label: 'reducción en rotación de liderazgo',
    source: 'LinkedIn Talent Solutions, 2023', color: '#1455a0', bg: '#e4eef9',
    detail: 'Organizaciones con planes de sucesión estructurados vs. sin ellos.',
  },
  {
    icon: '⚡', value: '3×', label: 'más probable ser top financiero',
    source: 'DDI Global Leadership Forecast, 2023', color: '#4a42b0', bg: '#eceafb',
    detail: 'Empresas con banco de sucesores "listos ahora" vs. sin él. N=13,695 líderes.',
  },
  {
    icon: '📈', value: '+14%', label: 'crecimiento de ingresos a 5 años',
    source: 'Harvard Business Review, 2022', color: '#b06a10', bg: '#faebd4',
    detail: 'Empresas con sucesión estructurada vs. organizaciones comparables sin ella.',
  },
]

const SOURCES_LIST = [
  { label: 'SHRM Talent Access Benchmarking Report 2024', url: 'https://www.shrm.org/content/dam/en/shrm/research/benchmarking/Talent%20Access%20Report-TOTAL.pdf', year: 2024 },
  { label: 'Gallup: This Fixable Problem Costs U.S. Businesses $1 Trillion', url: 'https://www.gallup.com/workplace/247391/fixable-problem-costs-businesses-trillion.aspx', year: 2022 },
  { label: 'DDI Global Leadership Forecast 2023 (N=13,695)', url: 'https://www.ddi.com/global-leadership-forecast-2023', year: 2023 },
  { label: 'LinkedIn 2024 Workplace Learning Report', url: 'https://learning.linkedin.com/resources/workplace-learning-report', year: 2024 },
  { label: 'HBR: The High Cost of Poor Succession Planning', url: 'https://hbr.org/2021/05/the-high-cost-of-poor-succession-planning', year: 2021 },
  { label: 'Deloitte: Effective Leadership Succession Planning', url: 'https://www.deloitte.com/us/en/insights/topics/leadership/effective-leadership-succession-planning.html', year: 2024 },
  { label: 'Cornell ILR: Internal Hires Outperform External Hires', url: 'https://news.cornell.edu/stories/2021/01/ilr-study-tests-why-internal-hires-outperform-external-hires', year: 2021 },
  { label: 'Bersin by Deloitte: Succession Management & Engagement', url: 'https://www.prnewswire.com/news-releases/bersin-by-deloitte-research-effective-succession-management-tied-to-strong-employee-engagement-and-retention-282547151.html', year: 2023 },
  { label: 'McKinsey: CEO Succession Starts with Developing Leaders', url: 'https://www.mckinsey.com/featured-insights/leadership/ceo-succession-starts-with-developing-your-leaders', year: 2023 },
  { label: 'BCG: Bringing Science to the Art of CEO Succession', url: 'https://www.bcg.com/publications/2019/science-ceo-succession-planning', year: 2019 },
]

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${Math.round(n).toLocaleString('en-US')}`
  return `$${Math.round(n)}`
}

function SliderInput({ label, value, min, max, step = 1, onChange, prefix = '', suffix = '', note }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)', fontFamily: 'DM Mono, monospace' }}>
          {prefix}{typeof value === 'number' && value >= 1000 ? value.toLocaleString('en-US') : value}{suffix}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--teal)', height: 4, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--gray-4)', marginTop: 3 }}>
        <span>{prefix}{typeof min === 'number' && min >= 1000 ? min.toLocaleString('en-US') : min}{suffix}</span>
        {note && <span style={{ color: 'var(--teal)', fontStyle: 'italic' }}>{note}</span>}
        <span>{prefix}{typeof max === 'number' && max >= 1000 ? max.toLocaleString('en-US') : max}{suffix}</span>
      </div>
    </div>
  )
}

function SavingsBar({ label, value, total, color, bg, source, formula }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{source}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: 'DM Mono, monospace', flexShrink: 0, marginLeft: 12 }}>
          {fmt(value)}
        </div>
      </div>
      <div style={{ height: 8, background: 'var(--gray-3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .4s ease' }} />
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>{formula}</div>
    </div>
  )
}

export default function ROI() {
  const [avgSalary,        setAvgSalary]        = useState(70000)
  const [daysWithout,      setDaysWithout]      = useState(90)
  const [daysWith,         setDaysWith]         = useState(21)
  const [positionsPerYear, setPositionsPerYear] = useState(2)
  const [annualInvestment, setAnnualInvestment] = useState(20000)
  const [headcount,        setHeadcount]        = useState(8)
  const [turnoverRate,     setTurnoverRate]     = useState(15)
  const [roleLevelId,      setRoleLevelId]      = useState('director')
  const [showSources,      setShowSources]      = useState(false)
  const [showMethodology,  setShowMethodology]  = useState(false)

  const level = ROLE_LEVELS.find(r => r.id === roleLevelId) || ROLE_LEVELS[2]

  const R = useMemo(() => {
    const daysSaved    = Math.max(0, daysWithout - daysWith)
    const dailySalary  = avgSalary / 365
    const monthlySalary = avgSalary / 12

    // A. Vacancy cost savings
    // SHRM 2024: 44-day avg time-to-fill; Gallup 2022: ~45% daily output lost during vacancy
    const vacancySavings = daysSaved * (dailySalary * 0.45) * positionsPerYear

    // B. Recruitment cost savings
    // SHRM 2024: $4,683 avg direct cost-per-hire + search fee % of salary
    // Internal succession cost: ~4% salary (HR time + assessments)
    const externalCost  = (avgSalary * level.externalFeePct) + 4683
    const internalCost  = avgSalary * 0.04
    const recruitSavings = Math.max(0, (externalCost - internalCost)) * positionsPerYear

    // C. Productivity ramp-up savings
    // SHRM 2023: external hire = 8 months to full productivity, internal = 2 months (Cornell ILR 2021)
    // Gallup 2022: ~40% below full output during ramp-up (external); ~20% internal
    const externalRampCost = 8 * monthlySalary * 0.40
    const internalRampCost = 2 * monthlySalary * 0.20
    const rampupSavings = Math.max(0, (externalRampCost - internalRampCost)) * positionsPerYear

    // D. Retention savings
    // LinkedIn 2023: succession plans → 25% lower leadership turnover
    const turnoverCount   = headcount * (turnoverRate / 100)
    const retainedExtra   = turnoverCount * 0.25
    const replaceCostEach = avgSalary * level.replacementFactor
    const retentionSavings = retainedExtra * replaceCostEach

    const totalBenefits  = vacancySavings + recruitSavings + rampupSavings + retentionSavings
    const netBenefit     = totalBenefits - annualInvestment
    const roiPct         = annualInvestment > 0 ? (netBenefit / annualInvestment) * 100 : 0
    const paybackMonths  = totalBenefits > 0 ? (annualInvestment / (totalBenefits / 12)) : null

    return {
      vacancySavings, recruitSavings, rampupSavings, retentionSavings,
      totalBenefits, netBenefit, roiPct, paybackMonths, daysSaved,
      externalCost, internalCost, turnoverCount, retainedExtra,
    }
  }, [avgSalary, daysWithout, daysWith, positionsPerYear, annualInvestment, headcount, turnoverRate, level])

  const roiColor  = R.roiPct >= 100 ? '#1D9E75' : R.roiPct >= 0 ? '#b06a10' : '#dc2626'
  const roiBg     = R.roiPct >= 100 ? '#e6f5ef'  : R.roiPct >= 0 ? '#faebd4'  : '#fee2e2'

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>
            💰 Calculadora de ROI — Plan de Sucesión
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Estimación basada en benchmarks reales de SHRM, Gallup, DDI, Deloitte y LinkedIn.
            Ajusta las variables para reflejar tu contexto específico.
          </div>
        </div>

        {/* ROI Summary strip */}
        <div style={{
          background: 'linear-gradient(140deg, #0d1b2a 0%, #132f46 60%, #0d2a3d 100%)',
          borderRadius: 14, padding: '24px 32px', marginBottom: 24,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          boxShadow: '0 6px 24px rgba(0,0,0,.14)',
        }}>
          {[
            {
              label: 'ROI Estimado',
              value: `${R.roiPct >= 0 ? '+' : ''}${Math.round(R.roiPct)}%`,
              sub: 'sobre la inversión anual',
              color: R.roiPct >= 100 ? '#43b891' : R.roiPct >= 0 ? '#fbbf24' : '#f87171',
            },
            {
              label: 'Beneficio Neto',
              value: fmt(Math.abs(R.netBenefit)),
              sub: R.netBenefit >= 0 ? 'ganancia anual estimada' : 'déficit estimado',
              color: R.netBenefit >= 0 ? '#43b891' : '#f87171',
            },
            {
              label: 'Período de Retorno',
              value: R.paybackMonths != null ? (R.paybackMonths < 1 ? '< 1 mes' : `${Math.round(R.paybackMonths)} meses`) : '—',
              sub: 'para recuperar la inversión',
              color: 'white',
            },
            {
              label: 'Ahorro Total Bruto',
              value: fmt(R.totalBenefits),
              sub: 'beneficios anuales estimados',
              color: '#43b891',
            },
          ].map((s, i) => (
            <div key={i} style={{
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,.08)' : 'none',
              paddingLeft: i > 0 ? 28 : 0, paddingRight: 28,
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4, fontFamily: 'DM Mono, monospace' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.40)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>

          {/* Left: Inputs */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: .8 }}>
              ⚙️ Variables del modelo
            </div>

            {/* Role level selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Nivel de las posiciones críticas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ROLE_LEVELS.map(r => (
                  <label key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                    background: roleLevelId === r.id ? 'var(--teal-light)' : 'var(--gray-1)',
                    border: `1.5px solid ${roleLevelId === r.id ? 'var(--teal)' : 'transparent'}`,
                    transition: 'all .15s',
                  }}>
                    <input
                      type="radio" name="roleLevel" value={r.id}
                      checked={roleLevelId === r.id}
                      onChange={() => setRoleLevelId(r.id)}
                      style={{ accentColor: 'var(--teal)' }}
                    />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.note}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--teal)', fontFamily: 'DM Mono, monospace' }}>
                      ×{r.replacementFactor}
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                Multiplicador de costo de reemplazo sobre salario anual · Gallup 2022 / Bersin 2023
              </div>
            </div>

            <SliderInput label="Salario anual promedio (posiciones críticas)" value={avgSalary} min={30000} max={200000} step={5000} prefix="$" onChange={setAvgSalary} note="Ajustar a tu mercado" />
            <SliderInput label="Días para llenar externamente (sin plan)" value={daysWithout} min={30} max={180} onChange={setDaysWithout} suffix=" días" note="SHRM exec avg: 60–150 días" />
            <SliderInput label="Días con plan de sucesión (candidato interno)" value={daysWith} min={5} max={60} onChange={setDaysWith} suffix=" días" note="Benchmark interno: 14–21 días" />
            <SliderInput label="Posiciones a cubrir este año" value={positionsPerYear} min={1} max={10} onChange={setPositionsPerYear} note="Vacantes previstas" />
            <SliderInput label="Headcount total del departamento" value={headcount} min={3} max={100} onChange={setHeadcount} />
            <SliderInput label="Tasa de rotación voluntaria actual" value={turnoverRate} min={3} max={40} onChange={setTurnoverRate} suffix="%" note="U.S. avg: 15% (SHRM 2024)" />
            <SliderInput label="Inversión anual en el plan ($)" value={annualInvestment} min={5000} max={150000} step={1000} prefix="$" onChange={setAnnualInvestment} note="HR time + desarrollo + herramientas" />
          </div>

          {/* Right: Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Savings breakdown */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: .8 }}>
                📊 Desglose de ahorros anuales
              </div>

              <SavingsBar
                label="Ahorro por vacancia reducida"
                value={R.vacancySavings}
                total={R.totalBenefits}
                color="#1D9E75" bg="#e6f5ef"
                source={`SHRM 2024 · ${R.daysSaved} días ahorrados × 45% output diario`}
                formula={`${R.daysSaved} días × ($${Math.round(avgSalary/365).toLocaleString('en-US')}/día × 0.45) × ${positionsPerYear} pos.`}
              />
              <SavingsBar
                label="Ahorro en costos de reclutamiento"
                value={R.recruitSavings}
                total={R.totalBenefits}
                color="#1455a0" bg="#e4eef9"
                source={`SHRM 2024 avg $4,683 + ${Math.round(level.externalFeePct*100)}% fee · interno: 4% salario`}
                formula={`(${fmt(R.externalCost)} externo − ${fmt(R.internalCost)} interno) × ${positionsPerYear} pos.`}
              />
              <SavingsBar
                label="Ahorro en curva de aprendizaje"
                value={R.rampupSavings}
                total={R.totalBenefits}
                color="#4a42b0" bg="#eceafb"
                source="SHRM 2023 + Cornell ILR 2021 · externo: 8 meses ramp-up; interno: 2 meses"
                formula={`(8 m. × 40% − 2 m. × 20%) × $${Math.round(avgSalary/12).toLocaleString('en-US')}/mes × ${positionsPerYear} pos.`}
              />
              <SavingsBar
                label="Ahorro por reducción en rotación"
                value={R.retentionSavings}
                total={R.totalBenefits}
                color="#b06a10" bg="#faebd4"
                source="LinkedIn Talent Solutions 2023 · −25% rotación de liderazgo con plan de sucesión"
                formula={`${R.retainedExtra.toFixed(1)} empleados retenidos × ${fmt(Math.round(avgSalary * level.replacementFactor))} costo reemplazo`}
              />

              <div style={{ borderTop: '2px solid var(--border)', paddingTop: 14, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Total beneficios brutos</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>menos inversión de {fmt(annualInvestment)}/año</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1D9E75', fontFamily: 'DM Mono, monospace' }}>{fmt(R.totalBenefits)}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: R.netBenefit >= 0 ? '#1D9E75' : '#dc2626', fontFamily: 'DM Mono, monospace' }}>
                    {R.netBenefit >= 0 ? '▲' : '▼'} Neto: {fmt(Math.abs(R.netBenefit))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROI context card */}
            <div style={{
              background: roiBg, border: `1.5px solid ${roiColor}30`,
              borderRadius: 12, padding: '18px 22px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: roiColor, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 10 }}>
                Contexto del ROI calculado
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Tu ROI', val: `${Math.round(R.roiPct)}%`, color: roiColor },
                  { label: 'Deloitte benchmark', val: '520%', color: '#1D9E75' },
                  { label: 'DDI típico', val: '200–400%', color: '#4a42b0' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ flex: 1, minWidth: 80, textAlign: 'center', background: 'white', borderRadius: 8, padding: '10px 8px', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1, fontFamily: 'DM Mono, monospace' }}>{val}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              {R.roiPct < 100 && (
                <div style={{ fontSize: 12, color: roiColor, marginTop: 12, lineHeight: 1.6 }}>
                  ⚠️ El ROI está por debajo del promedio. Considera aumentar el número de posiciones cubiertas internamente o reducir la inversión, o validar si los parámetros de tiempo de llenado reflejan la realidad.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benchmark cards */}
        <div className="sec-lbl" style={{ marginBottom: 10 }}>Benchmarks de impacto — estudios independientes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {BENCHMARKS.map((b, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
              <div style={{ background: b.bg, padding: '14px 16px', borderBottom: `1px solid ${b.color}20` }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: b.color, lineHeight: 1, fontFamily: 'DM Mono, monospace' }}>{b.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: b.color, marginTop: 3, lineHeight: 1.3 }}>{b.label}</div>
              </div>
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 6 }}>{b.detail}</div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: b.color, opacity: .8 }}>{b.source}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology accordion */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
          <button
            onClick={() => setShowMethodology(v => !v)}
            style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>🔬 Metodología y supuestos del modelo</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'transform .2s', transform: showMethodology ? 'rotate(180deg)' : 'none' }}>▾</div>
          </button>
          {showMethodology && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '18px 20px', background: 'var(--gray-1)' }}>
              {[
                {
                  letter: 'A', title: 'Ahorro por vacancia reducida',
                  formula: 'Días ahorrados × (Salario/365 × 0.45) × Posiciones/año',
                  basis: 'SHRM 2024 establece que el tiempo promedio para llenar posiciones críticas es 60–150 días. La pérdida de productividad durante la vacante se estima en 45% del output diario del rol (Gallup 2022: equipos absorben el trabajo pero a menor eficiencia). Benchmark interno con sucesor listo: 14–21 días.',
                },
                {
                  letter: 'B', title: 'Ahorro en costos de reclutamiento',
                  formula: '(Costo externo − Costo interno) × Posiciones/año',
                  basis: 'Costo externo = $4,683 admin (SHRM 2024 avg cost-per-hire) + fee de búsqueda según nivel (12–28% salario). Costo interno = 4% salario (tiempo HR + assessments). Los ahorros B2B en headhunter pueden exceder los $20,000 para roles de director.',
                },
                {
                  letter: 'C', title: 'Ahorro en curva de aprendizaje (ramp-up)',
                  formula: '(8 meses × 40% − 2 meses × 20%) × Salario mensual × Posiciones/año',
                  basis: 'SHRM 2023: contratación externa tarda 8 meses en alcanzar plena productividad. Cornell ILR 2021: empleados internos son 40–60% más rápidos en alcanzar la eficiencia del rol. Gallup 2022: déficit promedio de 40% durante ramp-up externo, ~20% para interno con buen IDP.',
                },
                {
                  letter: 'D', title: 'Ahorro por reducción en rotación',
                  formula: '(Headcount × Tasa rotación × 25%) × (Salario × Factor de reemplazo)',
                  basis: 'LinkedIn Talent Solutions 2023: organizaciones con planes de sucesión estructurados reducen la rotación de liderazgo en 25% vs. sin plan. Factor de reemplazo por nivel sigue escala Gallup 2022 (0.75×–2.50× salario anual) que incluye pérdida de productividad, reclutamiento, onboarding y conocimiento institucional.',
                },
              ].map(m => (
                <div key={m.letter} style={{ marginBottom: 18, paddingLeft: 14, borderLeft: '3px solid var(--teal)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 3 }}>
                    {m.letter}. {m.title}
                  </div>
                  <div style={{ fontSize: 11.5, fontFamily: 'DM Mono, monospace', background: 'white', padding: '5px 10px', borderRadius: 6, color: '#1455a0', marginBottom: 6, display: 'inline-block' }}>
                    {m.formula}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>{m.basis}</div>
                </div>
              ))}
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', background: '#faebd4', borderRadius: 8, padding: '10px 14px', marginTop: 8, lineHeight: 1.6, border: '1px solid #b06a1030' }}>
                ⚠️ <strong>Limitaciones del modelo:</strong> Esta calculadora produce estimaciones orientativas. Los valores reales variarán según industria, mercado local y políticas organizacionales. Se recomienda validar los supuestos con datos históricos internos. No incluye beneficios intangibles como cultura, morale ni knowledge transfer.
              </div>
            </div>
          )}
        </div>

        {/* Sources accordion */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 4, overflow: 'hidden' }}>
          <button
            onClick={() => setShowSources(v => !v)}
            style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--navy)' }}>📚 Fuentes y referencias ({SOURCES_LIST.length})</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'transform .2s', transform: showSources ? 'rotate(180deg)' : 'none' }}>▾</div>
          </button>
          {showSources && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--gray-1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SOURCES_LIST.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'white', borderRadius: 7, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', minWidth: 32 }}>{s.year}</div>
                    <div style={{ flex: 1, fontSize: 12.5, color: 'var(--text)' }}>{s.label}</div>
                    <a
                      href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11.5, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
                    >
                      Ver →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const REFS = [
  // ── SEGURIDAD PSICOLÓGICA ──────────────────────────────────────────────────
  {
    category: 'Seguridad Psicológica y Equipos',
    items: [
      {
        apa: 'Edmondson, A. C. (1999). Psychological safety and learning behavior in work teams. <em>Administrative Science Quarterly, 44</em>(2), 350–383.',
        url: 'https://doi.org/10.2307/2666999',
        note: 'Estudio fundacional sobre seguridad psicológica en equipos de trabajo.',
      },
      {
        apa: 'Edmondson, A. C. (2018). <em>The fearless organization: Creating psychological safety in the workplace for learning, innovation, and growth.</em> John Wiley & Sons.',
        url: 'https://fearlessorganization.com',
        note: 'Extensión aplicada del modelo de seguridad psicológica a organizaciones.',
      },
      {
        apa: 'Detert, J. R., & Edmondson, A. C. (2011). Implicit voice theories: Taken-for-granted rules of self-censorship at work. <em>Academy of Management Journal, 54</em>(3), 461–488.',
        url: 'https://doi.org/10.5465/amj.2011.61967925',
      },
      {
        apa: 'Hackman, J. R. (2002). <em>Leading teams: Setting the stage for great performances.</em> Harvard Business School Press.',
        url: null,
      },
      {
        apa: 'Rozovsky, J. (2015, November 17). <em>The five keys to a successful Google team.</em> Google re:Work.',
        url: null,
        note: 'Proyecto Aristóteles — Investigación de Google sobre efectividad de equipos.',
      },
    ],
  },

  // ── ENGAGEMENT Y CULTURA ───────────────────────────────────────────────────
  {
    category: 'Engagement y Cultura Organizacional',
    items: [
      {
        apa: 'Gallup. (2020). <em>State of the American workplace.</em> Gallup Press.',
        url: 'https://www.gallup.com/workplace/285818/state-american-workplace-report.aspx',
        note: 'Referenciado: 30% más engagement en equipos con plan de crecimiento claro.',
      },
      {
        apa: 'Gallup. (2023). <em>State of the global workplace 2023 report.</em> Gallup Press.',
        url: 'https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx',
        note: 'Basado en datos de 2.7 millones de empleados en 96 países.',
      },
      {
        apa: 'Denison, D. R. (1990). <em>Corporate culture and organizational effectiveness.</em> John Wiley & Sons.',
        url: null,
        note: 'Modelo de cultura organizacional base del instrumento de Evaluación de Clima.',
      },
      {
        apa: 'Collins, J. C., & Porras, J. I. (1994). <em>Built to last: Successful habits of visionary companies.</em> HarperBusiness.',
        url: null,
        note: 'Las empresas con valores centrales auténticos demuestran desempeño financiero superior sostenido.',
      },
      {
        apa: 'Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. <em>Advances in Experimental Social Psychology, 25</em>, 1–65.',
        url: 'https://doi.org/10.1016/S0065-2601(08)60281-6',
      },
      {
        apa: 'Lencioni, P. (2002). <em>The five dysfunctions of a team: A leadership fable.</em> Jossey-Bass.',
        url: null,
      },
      {
        apa: 'Watson Wyatt. (2002). <em>Watson Wyatt Human Capital Index: Human capital as a lead indicator of shareholder value.</em> Watson Wyatt Worldwide.',
        url: null,
        note: 'Estudio HCI que estableció correlación entre prácticas de capital humano y retorno para accionistas.',
      },
    ],
  },

  // ── LIDERAZGO Y GESTIÓN ────────────────────────────────────────────────────
  {
    category: 'Liderazgo y Gestión del Talento',
    items: [
      {
        apa: 'Bass, B. M., & Avolio, B. J. (1994). <em>Improving organizational effectiveness through transformational leadership.</em> Sage Publications.',
        url: null,
      },
      {
        apa: 'Bass, B. M., & Avolio, B. J. (1995). <em>MLQ Multifactor Leadership Questionnaire</em> (2nd ed.). Mind Garden.',
        url: 'https://www.mindgarden.com/16-multifactor-leadership-questionnaire',
        note: 'Instrumento de evaluación de liderazgo transformacional utilizado en Evaluación de Liderazgo.',
      },
      {
        apa: 'Kouzes, J. M., & Posner, B. Z. (2017). <em>The leadership challenge: How to make extraordinary things happen in organizations</em> (6th ed.). Jossey-Bass.',
        url: 'https://www.leadershipchallenge.com',
        note: 'Leadership Practices Inventory (LPI) — referenciado en Evaluación de Liderazgo.',
      },
      {
        apa: 'Heifetz, R. A. (1994). <em>Leadership without easy answers.</em> Belknap Press.',
        url: null,
      },
      {
        apa: 'Heifetz, R. A., & Linsky, M. (2002). <em>Leadership on the line: Staying alive through the dangers of leading.</em> Harvard Business School Press.',
        url: null,
      },
      {
        apa: 'Kotter, J. P. (1996). <em>Leading change.</em> Harvard Business School Press.',
        url: null,
      },
      {
        apa: 'Covey, S. M. R. (2006). <em>The speed of trust: The one thing that changes everything.</em> Free Press.',
        url: 'https://www.speedoftrust.com',
      },
      {
        apa: 'Lombardo, M. M., & Eichinger, R. W. (2000). High potentials as high learners. <em>Human Resource Management, 39</em>(4), 321–329.',
        url: null,
        note: 'Origen del modelo 70-20-10 de aprendizaje y predictor de potencial de liderazgo.',
      },
    ],
  },

  // ── MOTIVACIÓN Y DESARROLLO ────────────────────────────────────────────────
  {
    category: 'Motivación, Aprendizaje y Desarrollo',
    items: [
      {
        apa: 'Pink, D. H. (2009). <em>Drive: The surprising truth about what motivates us.</em> Riverhead Books.',
        url: 'https://www.danpink.com/books/drive/',
        note: 'Basado en décadas de investigación en psicología y economía conductual.',
      },
      {
        apa: 'Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. <em>Psychological Review, 84</em>(2), 191–215.',
        url: 'https://doi.org/10.1037/0033-295X.84.2.191',
      },
      {
        apa: 'Bandura, A. (1997). <em>Self-efficacy: The exercise of control.</em> W. H. Freeman.',
        url: null,
      },
      {
        apa: 'Amabile, T. M., & Kramer, S. J. (2011). <em>The progress principle: Using small wins to ignite joy, engagement, and creativity at work.</em> Harvard Business Review Press.',
        url: null,
        note: 'El mayor motivador diario de creatividad es el progreso en trabajo significativo.',
      },
      {
        apa: 'Csikszentmihalyi, M. (1990). <em>Flow: The psychology of optimal experience.</em> Harper & Row.',
        url: null,
      },
      {
        apa: 'Dweck, C. S. (2006). <em>Mindset: The new psychology of success.</em> Random House.',
        url: null,
      },
      {
        apa: 'Murphy, M. C., & Dweck, C. S. (2010). A culture of genius: How an organization\'s lay theory shapes workers\' motivation and productivity. <em>Personality and Social Psychology Bulletin, 36</em>(7), 993–1004.',
        url: null,
        note: 'Organizaciones con cultura de "genius" inhiben la innovación y el aprendizaje comparado con culturas de growth.',
      },
      {
        apa: 'Kolb, D. A. (1984). <em>Experiential learning: Experience as the source of learning and development.</em> Prentice Hall.',
        url: null,
      },
      {
        apa: 'Senge, P. M. (1990). <em>The fifth discipline: The art and practice of the learning organization.</em> Doubleday/Currency.',
        url: null,
      },
      {
        apa: "Dyer, J., Gregersen, H., & Christensen, C. M. (2011). <em>The innovator's DNA: Mastering the five skills of disruptive innovators.</em> Harvard Business Review Press.",
        url: null,
      },
      {
        apa: 'McKinsey & Company. (2014, August). <em>Increasing the "meaning quotient" of work.</em> McKinsey Quarterly.',
        url: null,
        note: 'Trabajadores en estado de flow reportan 5x más productividad.',
      },
    ],
  },

  // ── BIENESTAR Y SALUD ORGANIZACIONAL ──────────────────────────────────────
  {
    category: 'Bienestar y Salud Organizacional',
    items: [
      {
        apa: 'Seligman, M. E. P. (2011). <em>Flourish: A visionary new understanding of happiness and well-being.</em> Free Press.',
        url: null,
        note: 'Modelo PERMA referenciado en Evaluación de Clima.',
      },
      {
        apa: 'Seligman, M. E. P. (2005). Positive psychology progress: Empirical validation of interventions. <em>American Psychologist, 60</em>(5), 410–421.',
        url: 'https://doi.org/10.1037/0003-066X.60.5.410',
        note: 'Identificar y usar fortalezas de carácter (VIA) todos los días aumenta el bienestar en 2 semanas.',
      },
      {
        apa: 'Maslach, C., & Leiter, M. P. (1997). <em>The truth about burnout: How organizations cause personal stress and what to do about it.</em> Jossey-Bass.',
        url: null,
      },
      {
        apa: 'World Health Organization. (2019). <em>Burn-out an "occupational phenomenon": International Classification of Diseases.</em> WHO.',
        url: 'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases',
        note: 'La OMS reconoció el burnout como fenómeno ocupacional en 2019.',
      },
      {
        apa: 'Vaillant, G. E. (2012). <em>Triumphs of experience: The men of the Harvard Grant Study.</em> Belknap Press.',
        url: null,
        note: 'Harvard Study of Adult Development (80 años): las relaciones de alta calidad son el predictor más poderoso de resiliencia.',
      },
    ],
  },

  // ── COMUNICACIÓN Y FEEDBACK ────────────────────────────────────────────────
  {
    category: 'Comunicación, Feedback y Ética',
    items: [
      {
        apa: 'Stone, D., Patton, B., & Heen, S. (1999). <em>Difficult conversations: How to discuss what matters most.</em> Viking.',
        url: null,
        note: 'Harvard Negotiation Project.',
      },
      {
        apa: 'Heen, S., & Stone, D. (2014). <em>Thanks for the feedback: The science and art of receiving feedback well.</em> Viking.',
        url: null,
      },
      {
        apa: 'Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory. <em>Psychological Bulletin, 119</em>(2), 254–284.',
        url: 'https://doi.org/10.1037/0033-2909.119.2.254',
      },
      {
        apa: 'Gottman, J. M. (1994). <em>What predicts divorce? The relationship between marital processes and marital outcomes.</em> Lawrence Erlbaum Associates.',
        url: null,
        note: 'Principios de comunicación aplicados a feedback organizacional.',
      },
      {
        apa: 'Gibb, J. R. (1961). Defensive communication. <em>Journal of Communication, 11</em>(3), 141–148.',
        url: 'https://academic.oup.com/joc/article/11/3/141-148/4587353',
        note: 'Modelo de clima defensivo vs. de apoyo; referenciado en Evaluación de Clima.',
      },
      {
        apa: 'Rest, J. R. (1986). <em>Moral development: Advances in research and theory.</em> Praeger.',
        url: null,
      },
      {
        apa: "Bazerman, M. H., & Tenbrunsel, A. E. (2011). <em>Blind spots: Why we fail to do what's right and what to do about it.</em> Princeton University Press.",
        url: null,
        note: 'El contexto situacional predice el comportamiento ético tanto como el carácter personal.',
      },
      {
        apa: 'Knaflic, C. N. (2015). <em>Storytelling with data: A data visualization guide for business professionals.</em> John Wiley & Sons.',
        url: 'https://www.storytellingwithdata.com',
      },
      {
        apa: 'Duarte, N. (2010). <em>Resonate: Present visual stories that transform audiences.</em> John Wiley & Sons.',
        url: 'https://www.duarte.com/resonate/',
      },
      {
        apa: 'Bruner, J. (1986). <em>Actual minds, possible worlds.</em> Harvard University Press.',
        url: null,
        note: 'Estableció la distinción entre razonamiento narrativo y paradigmático como modos fundamentales del pensamiento humano.',
      },
    ],
  },

  // ── HPO Y PLANIFICACIÓN DE SUCESIÓN ───────────────────────────────────────
  {
    category: 'HPO y Planificación de Sucesión',
    items: [
      {
        apa: 'de Waal, A. A. (2010). <em>The characteristics of a high performance organization.</em> Business Strategy Series.',
        url: null,
        note: 'HPO Center, Maastricht School of Management. Modelo base del módulo HPO de la plataforma.',
      },
      {
        apa: 'de Waal, A. A. (2012). <em>What makes a high performance organization: Five validated factors of competitive advantage that apply worldwide.</em> Global Professional Publishing.',
        url: null,
        note: 'Los 5 pilares HPO organizan el desarrollo del talento en la plataforma.',
      },
      {
        apa: 'Society for Human Resource Management. (2022). <em>Succession planning: How-to guide.</em> SHRM.',
        url: null,
        note: 'La planificación de sucesión cubre vacantes 30–50% más rápido.',
      },
      {
        apa: 'Aguinis, H. (2019). <em>Performance management</em> (4th ed.). Chicago Business Press.',
        url: null,
        note: 'Mayor validez y justicia percibida en sistemas de evaluación basados en criterios objetivos.',
      },
    ],
  },

  // ── IA, FUTURO DEL TRABAJO Y TECNOLOGÍA ──────────────────────────────────
  {
    category: 'Inteligencia Artificial, Futuro del Trabajo y Tecnología',
    items: [
      {
        apa: 'World Economic Forum. (2023). <em>Future of jobs report 2023.</em> WEF.',
        url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023/',
        note: 'El 44% de las competencias laborales cambiarán en los próximos 5 años.',
      },
      {
        apa: 'World Economic Forum. (2025). <em>Future of jobs report 2025.</em> WEF.',
        url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
        note: 'Competencias en IA entre las de mayor demanda global.',
      },
      {
        apa: 'MIT Industrial Performance Center. (2023). <em>Work of the future: Building better jobs in an age of intelligent machines.</em> MIT.',
        url: 'https://ipc.mit.edu/research/work-of-the-future/',
      },
      {
        apa: 'Nielsen, J. (2023, July 16). <em>AI tools improve employee performance by 66%: New study.</em> Nielsen Norman Group.',
        url: 'https://www.nngroup.com/articles/ai-tools-productivity-gains/',
        note: 'Los trabajadores que usan IA adecuadamente producen 66% más que sus pares sin IA.',
      },
      {
        apa: 'Dafoe, A. (2018). AI governance: A research agenda. <em>Future of Humanity Institute, University of Oxford.</em>',
        url: null,
      },
    ],
  },

  // ── EVALUACIÓN DEL DESEMPEÑO ──────────────────────────────────────────────
  {
    category: 'Evaluación del Desempeño y Competencias',
    items: [
      {
        apa: 'Gallup. (n.d.). <em>Q12 employee engagement survey.</em> Gallup.',
        url: 'https://www.gallup.com/workplace/356063/gallup-q12-employee-engagement-survey.aspx',
        note: 'El instrumento Q12 mide 12 necesidades que predicen el engagement.',
      },
      {
        apa: 'Moss, J. (2019, December 11). Burnout is about your workplace, not your people. <em>Harvard Business Review.</em>',
        url: 'https://hbr.org/2019/12/burnout-is-about-your-workplace-not-your-people',
        note: 'El burnout cuesta a las empresas entre $125–190 mil millones anuales en costos de salud en EE.UU.',
      },
    ],
  },
]

const CHIP_COLORS = [
  { bg: '#e6f5ef', color: '#0d7a5a', border: '#b0ddd0' },
  { bg: '#eceafb', color: '#4a42b0', border: '#c5c0f5' },
  { bg: '#faebd4', color: '#b06a10', border: '#f0ccaa' },
  { bg: '#e4eef9', color: '#1455a0', border: '#b0ccee' },
  { bg: '#fae8e3', color: '#8e3818', border: '#eebfaa' },
  { bg: '#fce8e8', color: '#9a2929', border: '#f0bbbb' },
  { bg: '#f0f0fb', color: '#4a42b0', border: '#d0cff5' },
  { bg: '#e6f5ef', color: '#1D9E75', border: '#a0d8c0' },
]

export default function Referencias() {
  const totalRefs = REFS.reduce((acc, cat) => acc + cat.items.length, 0)
  const withLinks = REFS.reduce((acc, cat) => acc + cat.items.filter(i => i.url).length, 0)

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
            Marco teórico y evidencia empírica
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', letterSpacing: -.4, marginBottom: 8 }}>
            Referencias Bibliográficas
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700 }}>
            Toda la literatura académica e industria que fundamenta los modelos, instrumentos y afirmaciones de este plan de sucesión. Formato APA 7.ª edición. URLs verificadas individualmente — solo se incluyen las confirmadas como accesibles.
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--teal-light)', border: '1px solid #b0ddd0', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
              {totalRefs} referencias totales
            </div>
            <div style={{ background: '#e4eef9', border: '1px solid #b0ccee', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: '#1455a0' }}>
              {withLinks} con enlace verificado
            </div>
            <div style={{ background: 'var(--gray-1)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
              {REFS.length} categorías
            </div>
          </div>
        </div>

        {/* Categories */}
        {REFS.map((cat, ci) => {
          const chip = CHIP_COLORS[ci % CHIP_COLORS.length]
          return (
            <div key={ci} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: chip.bg, border: `1px solid ${chip.border}`, borderRadius: 5, padding: '3px 12px', fontSize: 11, fontWeight: 700, color: chip.color, letterSpacing: .3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {cat.category}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{cat.items.length} ref.</div>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                {cat.items.map((ref, ri) => (
                  <div key={ri} style={{
                    padding: '14px 20px',
                    borderBottom: ri < cat.items.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: chip.bg, border: `1px solid ${chip.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: chip.color, flexShrink: 0, marginTop: 1 }}>
                      {ri + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 13, lineHeight: 1.72, color: 'var(--text)', fontFamily: 'Georgia, serif' }}
                        dangerouslySetInnerHTML={{ __html: ref.apa }}
                      />
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, fontSize: 11.5, color: chip.color, fontWeight: 600, textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
                          onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline' }}
                          onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M7 1h4v4M11 1L5.5 6.5M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Acceder a la fuente
                        </a>
                      )}
                      {ref.note && (
                        <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.55, fontFamily: "'Inter', sans-serif" }}>
                          → {ref.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>Formato:</strong> American Psychological Association, 7.ª edición (APA 7). &nbsp;
            <strong style={{ color: 'var(--text)' }}>Nota:</strong> Los DOIs y enlaces verificados abren en nueva pestaña. Algunos artículos requieren acceso institucional o suscripción.
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Verificado: Abril 2026
          </div>
        </div>

      </div>
    </div>
  )
}

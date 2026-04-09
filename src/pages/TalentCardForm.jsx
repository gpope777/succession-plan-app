import { useState, useRef } from 'react'

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  fecha_revision: '', nombre: '', posicion: '', fecha_contratacion: '', localizacion: '',
  categoria: null, tiempo_puesto: null, tiempo_pns: null,
  educacion: [{ grado: null, area: '', institucion: '' }],
  certificaciones: [], certificaciones_notas: '',
  idiomas: { es_read: null, es_oral: null, es_write: null, en_read: null, en_oral: null, en_write: null },
  desempeno: { d1: null, d2: null, d3: null, d4: null, d5: null },
  desempeno_comentarios: '',
  potencial: { p1: null, p2: null, p3: null },
  fortalezas: [], fortalezas_comentarios: '',
  areas_desarrollo: [], areas_comentarios: '',
  riesgo: null, impacto: null, dificultad: null,
  roles_futuros: [],
  ninebox: null, readiness: null, comentarios: '',
}

const FORTALEZAS = [
  'Dominio técnico de Power BI', 'Calidad y precisión en análisis de datos',
  'Comunicación clara con stakeholders', 'Iniciativa y proactividad',
  'Trabajo en equipo y colaboración', 'Gestión del tiempo y priorización',
  'Pensamiento crítico y analítico', 'Adaptabilidad y aprendizaje rápido',
  'Documentación y cumplimiento de SOPs', 'Liderazgo informal del equipo',
  'Data governance y calidad de datos', 'Storytelling con datos y visualizaciones',
  'Orientación a resultados', 'Integridad y alineación a valores organizacionales',
  'Gestión de relaciones interdepartamentales', 'Mentoría de pares y analistas nuevos',
]

const AREAS_DEV = [
  'Liderazgo de personas y equipos', 'Comunicación y presentación ejecutiva',
  'SQL avanzado y modelado de datos', 'Python / R para analítica avanzada',
  'Gestión formal de proyectos (PMP / Agile)', 'Toma de decisiones bajo presión',
  'Manejo de conflictos interpersonales', 'Pensamiento estratégico y sistémico',
  'Gobernanza de datos avanzada', 'Delegación efectiva de tareas',
  'Inteligencia emocional y autogestión', 'Manejo de presupuesto y recursos',
  'Exposición interdepartamental', 'Coaching y desarrollo de talento',
  'Regulación HIPAA y cumplimiento FWA', 'Inglés técnico / comunicación en inglés',
]

const CERTS = [
  'Power BI Data Analyst Associate', 'Azure Data Fundamentals (DP-900)',
  'SQL Server / T-SQL Avanzado', 'Google Data Analytics Certificate',
  'Python para análisis de datos', 'Tableau Desktop Specialist',
  'Project Management Professional (PMP)', 'Scrum / Agile Certification',
  'HIPAA Compliance Certificate', 'FWA — Fraude, Mal Uso y Abuso',
  'Data Governance Essentials', 'Otra certificación relevante',
]

const ROLES_FUTUROS = [
  { label: 'Supervisor de Analistas de Datos', badge: 'Existe actualmente', color: 'teal' },
  { label: 'Director de Business Intelligence', badge: 'Existe actualmente', color: 'teal' },
  { label: 'Analista Senior', badge: 'Propuesto', color: 'gray' },
  { label: 'Líder Técnico BI', badge: 'Propuesto', color: 'gray' },
  { label: 'Arquitecto de Datos', badge: 'Propuesto', color: 'gray' },
  { label: 'Rol en otro departamento (movilidad lateral)', badge: 'Evaluar', color: 'amber' },
]

const NB_ROWS = [
  [
    { key: '3-1', name: 'Profesional enfocado', label: 'Alto pot. / Bajo desemp.' },
    { key: '3-2', name: 'Estrella futura', label: 'Alto pot. / Desemp. esperado' },
    { key: '3-3', name: 'Empleado 5 estrellas', label: 'Alto pot. / Alto desemp.' },
  ],
  [
    { key: '2-1', name: 'Futuro profesional', label: 'Pot. medio / Bajo desemp.' },
    { key: '2-2', name: 'Profesional confiable', label: 'Pot. medio / Esperado' },
    { key: '2-3', name: 'Estrella en desarrollo', label: 'Pot. medio / Alto desemp.' },
  ],
  [
    { key: '1-1', name: 'Nuevo en el puesto', label: 'Bajo pot. / Bajo desemp.' },
    { key: '1-2', name: 'Profesional eficaz', label: 'Bajo pot. / Esperado' },
    { key: '1-3', name: 'Diamante en bruto', label: 'Bajo pot. / Alto desemp.' },
  ],
]


// ── HELPERS ──────────────────────────────────────────────────────────────────
function calcDesemp(d) {
  if ([d.d1, d.d2, d.d3, d.d4, d.d5].some(v => v === null)) return null
  return Math.round((d.d1 * .30 + d.d2 * .20 + d.d3 * .20 + d.d4 * .15 + d.d5 * .15) * 100) / 100
}
function calcPot(p) {
  if ([p.p1, p.p2, p.p3].some(v => v === null)) return null
  return Math.round((p.p1 * .40 + p.p2 * .30 + p.p3 * .30) * 100) / 100
}
function score5to3(s) {
  if (s === null) return null
  if (s < 2.5) return 1
  if (s < 4.0) return 2
  return 3
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
function Pill({ label, selected, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: selected ? 'var(--teal-light)' : 'var(--gray-1)',
      border: `1.5px solid ${selected ? 'var(--teal)' : 'var(--border)'}`,
      borderRadius: 20, padding: '5px 12px', cursor: 'pointer', userSelect: 'none',
      fontSize: 13, fontWeight: selected ? 600 : 400,
      color: selected ? 'var(--accent)' : 'var(--text-muted)', transition: 'all .15s',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: 3, border: '1.5px solid currentColor',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {selected && <span style={{ fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      {label}
    </div>
  )
}

function ScoreBtn({ n, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 30, height: 30,
      border: `1.5px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: active ? 700 : 500,
      color: active ? 'white' : 'var(--text-muted)',
      background: active ? 'var(--teal)' : 'transparent',
      cursor: 'pointer', transition: 'all .12s', userSelect: 'none',
    }}>{n}</div>
  )
}

function Sec({ title, children }) {
  return (
    <div style={{ marginBottom: 20, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--border)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: .8, textTransform: 'uppercase', color: 'var(--navy)' }}>{title}</span>
      </div>
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  )
}

function CheckItem({ label, sub, checked, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px',
      borderRadius: 4, cursor: 'pointer', userSelect: 'none', transition: 'background .12s',
      background: checked ? 'var(--teal-light)' : 'transparent',
      border: `1px solid ${checked ? 'var(--teal)' : 'transparent'}`,
    }}>
      <div style={{
        width: 16, height: 16, flexShrink: 0, marginTop: 1,
        border: `1.5px solid ${checked ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: checked ? 'var(--teal)' : 'transparent',
      }}>
        {checked && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, color: checked ? 'var(--accent)' : 'var(--text)', fontWeight: checked ? 600 : 400 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function TalentCardForm({ data, updateCollaborator, addCollaborator }) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [loadResult, setLoadResult] = useState(null)
  const [linkedId, setLinkedId] = useState('')
  const [saveResult, setSaveResult] = useState(null)
  const jsonInputRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const desempScore = calcDesemp(form.desempeno)
  const potScore = calcPot(form.potencial)

  // ── JSON SAVE ──────────────────────────────────────────────────────────────
  const saveJSON = () => {
    const nombre = form.nombre?.replace(/\s+/g, '-').toLowerCase() || 'talent-card'
    const fecha = new Date().toISOString().slice(0, 10)
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `talent-card-${nombre}-${fecha}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── JSON LOAD ──────────────────────────────────────────────────────────────
  const loadJSON = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const d = JSON.parse(e.target.result)
        applyImportData(d)
        setLoadResult({ type: 'success', msg: `✓ "${file.name}" cargado. Revisa y actualiza lo que necesites.` })
        setTimeout(() => setLoadResult(null), 5000)
      } catch {
        setLoadResult({ type: 'error', msg: '✗ El archivo no es un JSON válido.' })
      }
    }
    reader.readAsText(file)
  }

  const applyImportData = (d) => {
    setForm({
      fecha_revision: d.fecha_revision || '',
      nombre: d.nombre || '',
      posicion: d.posicion || '',
      fecha_contratacion: d.fecha_contratacion || '',
      localizacion: d.localizacion || '',
      categoria: d.categoria || null,
      tiempo_puesto: d.tiempo_puesto || null,
      tiempo_pns: d.tiempo_pns || null,
      educacion: d.educacion?.length
        ? d.educacion.map(e => ({ grado: e.grado || null, area: e.area || '', institucion: e.institucion || '' }))
        : [{ grado: null, area: '', institucion: '' }],
      certificaciones: d.certificaciones || [],
      certificaciones_notas: d.certificaciones_notas || '',
      idiomas: { es_read: null, es_oral: null, es_write: null, en_read: null, en_oral: null, en_write: null, ...(d.idiomas || {}) },
      desempeno: { d1: null, d2: null, d3: null, d4: null, d5: null, ...(d.desempeno || {}) },
      desempeno_comentarios: d.desempeno_comentarios || '',
      potencial: { p1: null, p2: null, p3: null, ...(d.potencial || {}) },
      fortalezas: d.fortalezas || [],
      fortalezas_comentarios: d.fortalezas_comentarios || '',
      areas_desarrollo: d.areas_desarrollo || [],
      areas_comentarios: d.areas_comentarios || '',
      riesgo: null, impacto: null, dificultad: null,
      roles_futuros: d.roles_futuros || [],
      ninebox: d.ninebox || null,
      readiness: d.readiness || null,
      comentarios: d.comentarios || '',
    })
  }

  // ── SAVE TO PLAN ────────────────────────────────────────────────────────────
  const saveToPlan = () => {
    const statusMap = { ready: 'Listo ahora', soon: 'Listo pronto', future: 'Listo futuro' }
    const pctMap = { ready: 82, soon: 62, future: 35 }
    const timeMap = { ready: 'Inmediato', soon: '6–12 meses', future: '18–24 meses' }
    const perf3 = score5to3(desempScore)
    const pot3 = score5to3(potScore)

    const updates = {
      code: form.nombre || 'Nuevo colaborador',
      currentPosition: form.posicion || '',
      readinessStatus: statusMap[form.readiness] || 'Listo futuro',
      readinessPercentage: pctMap[form.readiness] || 35,
      timelineMonths: timeMap[form.readiness] || '18–24 meses',
      nineBox: { performance: perf3 || 2, potential: pot3 || 2 },
      strengths: form.fortalezas.slice(0, 6),
      gaps: form.areas_desarrollo.slice(0, 6).map(a => ({ name: a, detail: '', severity: 'Alta' })),
    }

    const existing = data.collaborators.find(c => c.id === linkedId)
    if (existing) {
      updateCollaborator(linkedId, updates)
      setSaveResult({ type: 'success', msg: `✓ ${existing.code} actualizado correctamente en el pipeline.` })
    } else if (addCollaborator) {
      const newId = 'C' + Date.now().toString().slice(-4)
      addCollaborator({
        id: newId, colorCode: 'blue', priority: (data.collaborators.length || 0) + 1,
        targetPosition: '', department: '', idp: [],
        ...updates,
      })
      setSaveResult({ type: 'success', msg: `✓ Nuevo colaborador añadido al pipeline.` })
    } else {
      setSaveResult({ type: 'error', msg: 'Selecciona un colaborador existente o contacta al administrador para añadir nuevos.' })
    }
    setTimeout(() => setSaveResult(null), 5000)
  }

  const radioPillSt = (selected, color) => ({
    flex: 1, textAlign: 'center', padding: '6px 8px',
    border: `1.5px solid ${selected ? (color === 'low' ? '#f59e0b' : color === 'mid' ? '#ea580c' : '#dc2626') : 'var(--border)'}`,
    borderRadius: 20, cursor: 'pointer', fontSize: 13, userSelect: 'none', transition: 'all .15s',
    background: !selected ? 'transparent' : color === 'low' ? '#fef3c7' : color === 'mid' ? '#fde8d8' : '#fee2e2',
    color: !selected ? 'var(--text-muted)' : color === 'low' ? '#92400e' : color === 'mid' ? '#9a3412' : '#991b1b',
    fontWeight: selected ? 600 : 400,
  })

  const badgeSt = (color) => {
    if (color === 'teal') return { bg: 'var(--teal-light)', color: 'var(--accent)', border: 'var(--teal)' }
    if (color === 'amber') return { bg: '#fef9ee', color: '#92400e', border: '#fcd34d' }
    return { bg: 'var(--gray-2)', color: 'var(--gray-5)', border: 'var(--gray-3)' }
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      <div className="page-inner">

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>Talent Card</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Departamento de Business Intelligence · Plan de Sucesión</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Fecha de revisión</div>
            <input
              type="text" placeholder="dd / mm / aaaa" value={form.fecha_revision}
              onChange={e => set('fecha_revision', e.target.value)}
              style={{ border: 'none', borderBottom: '2px solid var(--border)', padding: '4px 6px', fontSize: 13, fontFamily: 'DM Mono, monospace', outline: 'none', width: 160, textAlign: 'right', background: 'transparent', color: 'var(--navy)' }}
            />
            <div style={{ marginTop: 6 }}>
              <span style={{ background: 'rgba(29,158,117,.15)', color: 'var(--teal)', border: '1px solid rgba(29,158,117,.3)', borderRadius: 20, fontSize: 11, padding: '2px 10px', letterSpacing: .4 }}>
                Ciclo de evaluación trimestral
              </span>
            </div>
          </div>
        </div>

        {/* LOAD/SAVE JSON BANNER */}
        <div style={{ background: 'var(--gray-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>¿Tienes una evaluación anterior guardada?</span>
          <button
            onClick={() => jsonInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', color: 'var(--navy)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            📂 Cargar evaluación anterior (.json)
          </button>
          <input
            ref={jsonInputRef} type="file" accept=".json"
            onChange={e => { const f = e.target.files[0]; if (f) { loadJSON(f); e.target.value = '' } }}
            style={{ display: 'none' }} />
          {loadResult && (
            <div style={{ width: '100%', padding: '8px 12px', borderRadius: 6, fontSize: 13,
              background: loadResult.type === 'success' ? 'var(--teal-light)' : '#fee2e2',
              border: `1px solid ${loadResult.type === 'success' ? 'var(--teal-mid)' : '#fca5a5'}`,
              color: loadResult.type === 'success' ? 'var(--accent)' : '#991b1b' }}>
              {loadResult.msg}
            </div>
          )}
        </div>

        {/* ── FORM SECTIONS ─────────────────────────────────────────────────── */}

        {/* 1. INFORMACIÓN GENERAL */}
        <Sec title="Información general">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 16 }}>
            {[
              { label: 'Nombre completo', key: 'nombre', placeholder: 'Nombre Apellido' },
              { label: 'Posición / Puesto', key: 'posicion', placeholder: 'ej. Analista de Datos' },
              { label: 'Fecha de contratación', key: 'fecha_contratacion', placeholder: 'dd / mm / aaaa' },
              { label: 'Localización', key: 'localizacion', placeholder: 'ej. San Juan, PR' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: .5, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>{f.label}</div>
                <input type="text" placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '4px 2px', fontSize: 14, color: 'var(--text)', background: 'transparent', outline: 'none', width: '100%' }} />
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 8 }}>Categoría</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Exento', 'No exento'].map(opt => (
                  <Pill key={opt} label={opt} selected={form.categoria === opt} onToggle={() => set('categoria', form.categoria === opt ? null : opt)} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 8 }}>Tiempo en el puesto actual</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['< 6 meses', '6–12 meses', '1–2 años', '2–5 años', '5+ años'].map(opt => (
                  <Pill key={opt} label={opt} selected={form.tiempo_puesto === opt} onToggle={() => set('tiempo_puesto', form.tiempo_puesto === opt ? null : opt)} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)', marginBottom: 8 }}>Tiempo total en la organización</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['< 1 año', '1–2 años', '2–5 años', '5–10 años', '10+ años'].map(opt => (
                <Pill key={opt} label={opt} selected={form.tiempo_pns === opt} onToggle={() => set('tiempo_pns', form.tiempo_pns === opt ? null : opt)} />
              ))}
            </div>
          </div>
        </Sec>

        {/* 2. EDUCACIÓN */}
        <Sec title="Educación">
          {form.educacion.map((edu, idx) => (
            <div key={idx} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: idx < form.educacion.length - 1 ? '1px dashed var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Grado {idx + 1}</span>
                {form.educacion.length > 1 && (
                  <button onClick={() => set('educacion', form.educacion.filter((_, i) => i !== idx))}
                    style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 15, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {['Bachillerato', 'Maestría', 'Doctorado', 'Asociado', 'Técnico / Certificado'].map(g => (
                  <Pill key={g} label={g} selected={edu.grado === g}
                    onToggle={() => set('educacion', form.educacion.map((e, i) => i === idx ? { ...e, grado: e.grado === g ? null : g } : e))} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Área de estudio / Especialidad</div>
                  <input type="text" placeholder="ej. Ciencias de datos, Estadística" value={edu.area}
                    onChange={e => set('educacion', form.educacion.map((en, i) => i === idx ? { ...en, area: e.target.value } : en))}
                    style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '4px 2px', fontSize: 14, width: '100%', outline: 'none', background: 'transparent', color: 'var(--text)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Institución</div>
                  <input type="text" placeholder="ej. UPR, Inter, Albizu" value={edu.institucion}
                    onChange={e => set('educacion', form.educacion.map((en, i) => i === idx ? { ...en, institucion: e.target.value } : en))}
                    style={{ border: 'none', borderBottom: '1px solid var(--border)', padding: '4px 2px', fontSize: 14, width: '100%', outline: 'none', background: 'transparent', color: 'var(--text)' }} />
                </div>
              </div>
            </div>
          ))}
          {form.educacion.length < 5 && (
            <button onClick={() => set('educacion', [...form.educacion, { grado: null, area: '', institucion: '' }])}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--teal-light)', color: 'var(--accent)', border: '1.5px solid var(--teal)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>+</span> Añadir otra institución
            </button>
          )}
        </Sec>

        {/* 3. CERTIFICACIONES */}
        <Sec title="Licencias y certificaciones relevantes">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {CERTS.map(cert => (
              <CheckItem key={cert} label={cert} checked={form.certificaciones.includes(cert)}
                onToggle={() => set('certificaciones', form.certificaciones.includes(cert)
                  ? form.certificaciones.filter(c => c !== cert)
                  : [...form.certificaciones, cert])} />
            ))}
          </div>
          <textarea placeholder="Otras certificaciones, cursos completados o en progreso…" value={form.certificaciones_notas}
            rows={2} onChange={e => set('certificaciones_notas', e.target.value)}
            style={{ width: '100%', marginTop: 10, border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontSize: 13, background: 'var(--gray-1)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: 'var(--text)' }} />
        </Sec>

        {/* 4. IDIOMAS */}
        <Sec title="Competencias de idioma">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--border)' }}>
                {['Idioma', 'Comprensión lectora', 'Comunicación oral', 'Escritura'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { lang: 'Español', keys: ['es_read', 'es_oral', 'es_write'] },
                { lang: 'Inglés', keys: ['en_read', 'en_oral', 'en_write'] },
              ].map(row => (
                <tr key={row.lang} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: 'var(--text)' }}>{row.lang}</td>
                  {row.keys.map(k => (
                    <td key={k} style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {['B', 'I', 'A'].map(v => {
                          const sel = form.idiomas[k] === v
                          const selColor = v === 'B' ? { bg: 'var(--gray-2)', border: '#9ca3af', color: 'var(--gray-5)' }
                            : v === 'I' ? { bg: '#eff6ff', border: '#60a5fa', color: '#1d4ed8' }
                              : { bg: 'var(--teal-light)', border: 'var(--teal)', color: 'var(--accent)' }
                          return (
                            <div key={v}
                              onClick={() => setForm(f => ({ ...f, idiomas: { ...f.idiomas, [k]: f.idiomas[k] === v ? null : v } }))}
                              style={{ padding: '3px 10px', border: `1.5px solid ${sel ? selColor.border : 'var(--border)'}`, borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: sel ? 600 : 400, userSelect: 'none', background: sel ? selColor.bg : 'transparent', color: sel ? selColor.color : 'var(--text-muted)' }}>
                              {v}
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>B = Básico · I = Intermedio · A = Avanzado / Fluido</div>
        </Sec>

        {/* 5. DESEMPEÑO */}
        <Sec title="Evaluación de desempeño — 5 dimensiones">
          {[
            { n: 1, name: 'Liderazgo de personas', weight: 'Peso 30%', key: 'd1' },
            { n: 2, name: 'Gestión de proyectos y flujo operativo', weight: 'Peso 20%', key: 'd2' },
            { n: 3, name: 'Capacidad técnico-analítica (BI / Stats)', weight: 'Peso 20%', key: 'd3' },
            { n: 4, name: 'Comunicación e influencia', weight: 'Peso 15%', key: 'd4' },
            { n: 5, name: 'Cumplimiento y estandarización (SOPs)', weight: 'Peso 15%', key: 'd5' },
          ].map(dim => (
            <div key={dim.n} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 150px 55px', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-2)' }}>
              <div style={{ width: 26, height: 26, background: 'var(--gray-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{dim.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{dim.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dim.weight}</div>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <ScoreBtn key={v} n={v} active={form.desempeno[dim.key] === v}
                    onClick={() => setForm(f => ({ ...f, desempeno: { ...f.desempeno, [dim.key]: f.desempeno[dim.key] === v ? null : v } }))} />
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: form.desempeno[dim.key] ? 'var(--accent)' : 'var(--text-muted)', textAlign: 'right' }}>
                {form.desempeno[dim.key] ? `${form.desempeno[dim.key]} / 5` : '—'}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, background: 'var(--gray-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Puntuación total (Eje X)</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>{desempScore ?? '—'}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ 5.00</span>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {[{ pos: 'Analista', min: 3.0 }, { pos: 'Supervisor', min: 4.0 }, { pos: 'Director', min: 5.0 }].map(b => {
                const match = desempScore !== null && desempScore >= b.min
                return (
                  <div key={b.pos} style={{ textAlign: 'center', padding: '6px 12px', borderRadius: 4, border: `1px solid ${match ? 'var(--teal)' : 'var(--border)'}`, background: match ? 'var(--teal-light)' : 'transparent', minWidth: 80 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: match ? 'var(--accent)' : 'var(--text-muted)' }}>{b.pos}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: match ? 'var(--accent)' : 'var(--text)' }}>Mín: {b.min}</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: .6 }}>Comentarios sobre el desempeño</div>
            <textarea
              value={form.desempeno_comentarios}
              onChange={e => set('desempeno_comentarios', e.target.value)}
              placeholder="Describe logros concretos, áreas de oportunidad, contexto de las puntuaciones o cualquier observación relevante sobre el desempeño del colaborador..."
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid var(--border)', borderRadius: 8,
                padding: '10px 12px', fontSize: 13, color: 'var(--text)',
                fontFamily: 'Inter, sans-serif', lineHeight: 1.55,
                resize: 'vertical', outline: 'none',
                background: 'var(--gray-1)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--teal)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </Sec>

        {/* 6. POTENCIAL */}
        <Sec title="Evaluación de potencial — Eje Y del 9-Box">
          {[
            { n: 'A', name: 'Agilidad de aprendizaje', weight: 'Peso 40%', key: 'p1' },
            { n: 'B', name: 'Aspiración y motivación de crecer', weight: 'Peso 30%', key: 'p2' },
            { n: 'C', name: 'Complejidad cognitiva y visión sistémica', weight: 'Peso 30%', key: 'p3' },
          ].map(dim => (
            <div key={dim.n} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 150px 55px', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-2)' }}>
              <div style={{ width: 26, height: 26, background: 'var(--gray-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{dim.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{dim.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dim.weight}</div>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <ScoreBtn key={v} n={v} active={form.potencial[dim.key] === v}
                    onClick={() => setForm(f => ({ ...f, potencial: { ...f.potencial, [dim.key]: f.potencial[dim.key] === v ? null : v } }))} />
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: form.potencial[dim.key] ? 'var(--accent)' : 'var(--text-muted)', textAlign: 'right' }}>
                {form.potencial[dim.key] ? `${form.potencial[dim.key]} / 5` : '—'}
              </div>
            </div>
          ))}
          {potScore !== null && (
            <div style={{ marginTop: 12, background: 'var(--navy)', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--gray-4)', marginBottom: 4, letterSpacing: .4, textTransform: 'uppercase' }}>Puntuación de potencial (Eje Y)</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>{potScore.toFixed(2)}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>/ 5.00</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: potScore < 2.5 ? '#fbbf24' : potScore < 3.8 ? '#60a5fa' : 'var(--teal-mid)' }}>
                  {potScore < 2.5 ? 'Potencial bajo' : potScore < 3.8 ? 'Potencial medio' : 'Potencial alto'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-4)', marginTop: 2 }}>
                  {potScore < 2.5 ? 'Fila inferior del 9-Box (eje Y: 1)' : potScore < 3.8 ? 'Fila central del 9-Box (eje Y: 2)' : 'Fila superior del 9-Box (eje Y: 3)'}
                </div>
              </div>
            </div>
          )}
        </Sec>

        {/* 7. FORTALEZAS */}
        <Sec title="Fortalezas identificadas">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {FORTALEZAS.map(f => (
              <CheckItem key={f} label={f} checked={form.fortalezas.includes(f)}
                onToggle={() => set('fortalezas', form.fortalezas.includes(f)
                  ? form.fortalezas.filter(x => x !== f)
                  : [...form.fortalezas, f])} />
            ))}
          </div>
          <textarea placeholder="Fortalezas adicionales o comentarios específicos…" value={form.fortalezas_comentarios}
            rows={2} onChange={e => set('fortalezas_comentarios', e.target.value)}
            style={{ width: '100%', marginTop: 10, border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontSize: 13, background: 'var(--gray-1)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: 'var(--text)' }} />
        </Sec>

        {/* 8. ÁREAS DE DESARROLLO */}
        <Sec title="Áreas de desarrollo prioritarias">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {AREAS_DEV.map(a => (
              <CheckItem key={a} label={a} checked={form.areas_desarrollo.includes(a)}
                onToggle={() => set('areas_desarrollo', form.areas_desarrollo.includes(a)
                  ? form.areas_desarrollo.filter(x => x !== a)
                  : [...form.areas_desarrollo, a])} />
            ))}
          </div>
          <textarea placeholder="Áreas adicionales o brechas específicas a cerrar…" value={form.areas_comentarios}
            rows={2} onChange={e => set('areas_comentarios', e.target.value)}
            style={{ width: '100%', marginTop: 10, border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontSize: 13, background: 'var(--gray-1)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: 'var(--text)' }} />
        </Sec>

        {/* 9. MÉTRICAS DE RIESGO */}
        <Sec title="Métricas de riesgo — Plan de sucesión">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { key: 'riesgo', label: 'Riesgo de pérdida', opts: [{ v: 'Bajo', c: 'low' }, { v: 'Intermedio', c: 'mid' }, { v: 'Alto', c: 'high' }] },
              { key: 'impacto', label: 'Impacto de pérdida', opts: [{ v: 'Bajo', c: 'low' }, { v: 'Intermedio', c: 'mid' }, { v: 'Alto', c: 'high' }] },
              { key: 'dificultad', label: 'Dificultad de reemplazo', opts: [{ v: 'Baja', c: 'low' }, { v: 'Intermedia', c: 'mid' }, { v: 'Alta', c: 'high' }] },
            ].map(field => (
              <div key={field.key}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{field.label}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {field.opts.map(opt => (
                    <div key={opt.v} onClick={() => set(field.key, form[field.key] === opt.v ? null : opt.v)} style={radioPillSt(form[field.key] === opt.v, opt.c)}>{opt.v}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Posibles puestos futuros</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ROLES_FUTUROS.map(role => {
              const checked = form.roles_futuros.includes(role.label)
              const bs = badgeSt(role.color)
              return (
                <div key={role.label}
                  onClick={() => set('roles_futuros', checked ? form.roles_futuros.filter(r => r !== role.label) : [...form.roles_futuros, role.label])}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: `1px solid ${checked ? 'var(--teal)' : 'transparent'}`, borderRadius: 4, cursor: 'pointer', background: checked ? 'var(--teal-light)' : 'transparent', userSelect: 'none' }}>
                  <div style={{ width: 16, height: 16, border: `1.5px solid ${checked ? 'var(--teal)' : 'var(--border)'}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: checked ? 'var(--teal)' : 'transparent' }}>
                    {checked && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: checked ? 600 : 500, color: checked ? 'var(--accent)' : 'var(--text)', flex: 1 }}>{role.label}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}>{role.badge}</span>
                </div>
              )
            })}
          </div>
        </Sec>

        {/* 10. 9-BOX */}
        <Sec title="Clasificación 9-Box">
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', marginBottom: 16 }}>
            <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .6, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              Potencial (Eje Y) ↑
            </div>
            <div style={{ flex: 1 }}>
              {NB_ROWS.map((row, ri) => {
                const rowBg = ri === 0 ? '#f0fdf4' : ri === 1 ? 'var(--gray-1)' : '#fef9ee'
                return (
                  <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 6 }}>
                    {row.map(cell => {
                      const sel = form.ninebox === cell.key
                      const isTop = cell.key === '3-3'
                      return (
                        <div key={cell.key}
                          onClick={() => set('ninebox', form.ninebox === cell.key ? null : cell.key)}
                          style={{ border: `1.5px solid ${sel ? 'var(--teal)' : isTop ? 'var(--teal)' : 'var(--border)'}`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', padding: '12px 8px', minHeight: 80, background: sel ? 'var(--teal)' : isTop ? '#d1fae5' : rowBg, userSelect: 'none', transition: 'all .15s' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: sel ? 'white' : isTop ? 'var(--accent)' : 'var(--text)', lineHeight: 1.3 }}>{cell.name}</div>
                          <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,.8)' : 'var(--text-muted)', marginTop: 4 }}>{cell.label}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 6 }}>
                {['Bajo desempeño', 'Desempeño esperado', 'Alto desempeño'].map(l => (
                  <div key={l} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, color: 'var(--text-muted)', padding: '5px 4px', borderTop: '2px solid var(--gray-2)' }}>{l}</div>
                ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>Desempeño actual (Eje X) →</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Nivel de preparación (Readiness)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { key: 'ready', label: 'Listo ahora', sub: 'Ready-now · puede asumir el rol siguiente inmediatamente', border: 'var(--teal)', bg: 'var(--teal-light)', color: 'var(--accent)' },
              { key: 'soon', label: 'Listo pronto', sub: 'Ready in < 6 meses con desarrollo enfocado', border: '#3b82f6', bg: '#eff6ff', color: '#1d4ed8' },
              { key: 'future', label: 'Listo futuro', sub: 'Ready in 6–24 meses · requiere desarrollo sostenido', border: '#f59e0b', bg: '#fef9ee', color: '#92400e' },
            ].map(opt => {
              const sel = form.readiness === opt.key
              return (
                <div key={opt.key}
                  onClick={() => set('readiness', form.readiness === opt.key ? null : opt.key)}
                  style={{ border: `1.5px solid ${sel ? opt.border : 'var(--border)'}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none', textAlign: 'center', background: sel ? opt.bg : 'transparent', transition: 'all .15s' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: sel ? opt.color : 'var(--text)' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{opt.sub}</div>
                </div>
              )
            })}
          </div>
        </Sec>

        {/* 11. COMENTARIOS */}
        <Sec title="Comentarios y observaciones del evaluador">
          <textarea
            placeholder="Observaciones, contexto de la evaluación, acuerdos de conversación de carrera, información relevante para People Operations…"
            value={form.comentarios} rows={4} onChange={e => set('comentarios', e.target.value)}
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', fontSize: 14, background: 'var(--gray-1)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: 'var(--text)' }} />
        </Sec>

        {/* 12. FIRMAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
          {['Director / Supervisor evaluador', 'People Operations', 'Fecha próxima revisión'].map(l => (
            <div key={l}>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 24 }} />
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── SAVE BAR ──────────────────────────────────────────────────────── */}
        <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>Vincular al pipeline</div>
            <select value={linkedId} onChange={e => setLinkedId(e.target.value)}
              style={{ background: 'rgba(255,255,255,.1)', color: 'white', border: '1px solid rgba(255,255,255,.2)', borderRadius: 6, padding: '7px 12px', fontSize: 13, outline: 'none', width: '100%', maxWidth: 300 }}>
              <option value="" style={{ background: '#1a2e3b' }}>— Nuevo colaborador —</option>
              {data.collaborators.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#1a2e3b' }}>{c.code} · {c.readinessStatus}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => { setForm({ ...EMPTY_FORM }); setLinkedId(''); setSaveResult(null); setLoadResult(null) }}
              style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}>
              Limpiar
            </button>
            <button onClick={saveJSON}
              style={{ background: 'rgba(255,255,255,.15)', color: 'white', border: '1px solid rgba(255,255,255,.25)', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              💾 Guardar JSON
            </button>
            <button onClick={() => window.print()}
              style={{ background: 'rgba(255,255,255,.15)', color: 'white', border: '1px solid rgba(255,255,255,.25)', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              🖨 Imprimir / PDF
            </button>
            <button onClick={saveToPlan}
              style={{ background: 'var(--teal)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              ✓ Guardar al Plan
            </button>
          </div>
          {saveResult && (
            <div style={{ width: '100%', padding: '8px 12px', borderRadius: 6, fontSize: 13,
              background: saveResult.type === 'success' ? 'rgba(29,158,117,.2)' : 'rgba(220,38,38,.2)',
              color: saveResult.type === 'success' ? 'var(--teal-mid)' : '#fca5a5',
              border: `1px solid ${saveResult.type === 'success' ? 'rgba(29,158,117,.3)' : 'rgba(220,38,38,.3)'}` }}>
              {saveResult.msg}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

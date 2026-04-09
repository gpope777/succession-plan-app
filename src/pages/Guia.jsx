import { useState } from 'react'

const SECTIONS = [
  { id: 'inicio',    label: 'Inicio',              icon: '🏠' },
  { id: 'secciones', label: 'Secciones del portal', icon: '🗺️' },
  { id: 'admin',     label: 'Modo HR',             icon: '🔑' },
  { id: 'revision',  label: 'Proceso de revisión', icon: '📅' },
  { id: 'flujo',     label: 'Flujo de trabajo',    icon: '🔄' },
  { id: 'faq',       label: 'FAQ',                 icon: '❓' },
]

const PORTAL_TABS = [
  {
    group: 'Resumen',
    color: 'var(--teal)',
    bg: 'var(--teal-light)',
    icon: '🏠',
    tabs: [
      {
        id: 'home',
        label: 'Resumen del Plan',
        desc: 'Vista ejecutiva con los métricas clave del plan: cantidad de colaboradores, distribución por readiness, puestos críticos cubiertos y progreso global del IDP.',
        tips: ['Punto de entrada ideal para presentaciones al liderazgo', 'Muestra el estado general de la sucesión de un vistazo', 'Los números se actualizan automáticamente cuando editas datos'],
      },
    ],
  },
  {
    group: 'Evaluación',
    color: 'var(--purple)',
    bg: 'rgba(139,92,246,.1)',
    icon: '📋',
    tabs: [
      {
        id: 'talent-card',
        label: 'Talent Card (Formulario)',
        desc: 'Formulario para capturar o actualizar la evaluación de un colaborador: competencias técnicas, blandas, 9-Box scores, fortalezas y áreas de mejora.',
        tips: ['Úsalo al inicio de cada ciclo de evaluación', 'Los datos capturados aquí se reflejan automáticamente en Perfiles & IDP', 'Completa una Talent Card por colaborador antes de cada revisión trimestral'],
      },
      {
        id: 'rubricas',
        label: 'Rúbricas',
        desc: 'Criterios detallados para evaluar cada competencia con escalas descriptivas. Sirve como guía para que el evaluador aplique criterios consistentes y objetivos.',
        tips: ['Compártela con los evaluadores antes de la sesión de calibración', 'Sirve como base para conversaciones de desarrollo con los colaboradores', 'Define exactamente qué significa cada nivel de desempeño'],
      },
      {
        id: 'perfiles',
        label: 'Perfiles & IDP',
        desc: 'Vista individual por colaborador: perfil completo, matriz 9-Box, brechas de competencias y el Plan de Desarrollo Individual (IDP) con acciones por fase. En Modo HR puedes editar todo y marcar acciones como completadas.',
        tips: ['Navega entre colaboradores con los botones superiores', 'Las fases del IDP se desbloquean secuencialmente', 'Haz clic en el ícono de estado (○/◔/✓) para actualizar el avance', 'Usa "✏️ Editar" para modificar cualquier campo del perfil'],
      },
    ],
  },
  {
    group: 'Diagnóstico',
    color: 'var(--amber)',
    bg: 'var(--amber-light)',
    icon: '🔍',
    tabs: [
      {
        id: 'banca',
        label: 'Banca de Talento',
        desc: 'Vista consolidada del pipeline de sucesión: todos los colaboradores ordenados por prioridad, con fortalezas clave, brechas críticas y progreso del IDP. Ideal para reuniones de calibración.',
        tips: ['Vista perfecta para comparar candidatos rápidamente', 'Ordenada por prioridad de desarrollo (configurable en Modo HR)', 'El botón "Ver Talent Card →" lleva directo al perfil completo'],
      },
      {
        id: 'calidad',
        label: 'Análisis de Calidad',
        desc: 'Análisis agregado de brechas de competencias del equipo, distribución del 9-Box, patrones de desarrollo y gaps prioritarios. Ayuda a identificar necesidades de desarrollo a nivel de equipo.',
        tips: ['Úsalo para identificar brechas compartidas que justifiquen capacitaciones grupales', 'La distribución 9-Box muestra el balance del equipo', 'Exporta la vista para presentaciones a liderazgo'],
      },
    ],
  },
  {
    group: 'Desarrollo',
    color: 'var(--blue)',
    bg: 'rgba(59,130,246,.08)',
    icon: '📈',
    tabs: [
      {
        id: 'desarrollo',
        label: 'IDP & Seguimiento',
        desc: 'Centro de mando para el seguimiento activo del desarrollo. Tiene 4 sub-vistas: Resumen (tracker con progreso), Alertas & Riesgo (alertas automáticas), 30·60·90 días (acciones por ventana de tiempo) y Para el Manager (acciones de liderazgo + evidencias).',
        tips: [
          'Resumen: haz clic en acciones para marcarlas completas (Modo HR)',
          'Alertas: se generan automáticamente — revísalas antes de cada revisión',
          '30·60·90: muestra qué debe pasar ahora, pronto y después',
          'Manager: registra evidencias de completación y acciones propias de liderazgo',
        ],
      },
    ],
  },
  {
    group: 'Cultura & Valores',
    color: 'var(--coral)',
    bg: 'rgba(239,68,68,.07)',
    icon: '🧭',
    tabs: [
      {
        id: 'valores',
        label: 'Guía de Valores',
        desc: 'Descripción de los valores organizacionales del departamento con ejemplos de comportamientos observables. Sirve como referencia para evaluaciones de fit cultural.',
        tips: ['Usa como base para conversaciones de desempeño', 'Compártela con nuevos integrantes del equipo'],
      },
      {
        id: 'clima',
        label: 'Clima Cultural',
        desc: 'Mapa de calor del clima cultural del equipo por dimensiones: comunicación, autonomía, reconocimiento, trabajo en equipo y más. Identifica áreas de fortaleza y riesgo.',
        tips: ['Compara periódicamente para ver tendencias', 'Los colores van de rojo (crítico) a verde (fortaleza)', 'Úsalo para priorizar iniciativas de cultura'],
      },
      {
        id: 'liderazgo',
        label: 'Evaluación de Liderazgo',
        desc: 'Evaluación de competencias de liderazgo del equipo en dimensiones como visión estratégica, desarrollo de personas, comunicación ejecutiva y toma de decisiones.',
        tips: ['Complementa el 9-Box con perspectiva de liderazgo', 'Ideal para roles directivos y posiciones de sucesión senior'],
      },
    ],
  },
  {
    group: 'Feedback',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    icon: '📬',
    tabs: [
      {
        id: 'feedback',
        label: 'Buzón de Feedback',
        desc: 'Canal de retroalimentación anónima y directa dentro del portal. Permite al equipo expresar comentarios, sugerencias o preocupaciones sobre el proceso de desarrollo.',
        tips: ['Revísalo regularmente para captar señales tempranas', 'El anonimato fomenta retroalimentación más honesta', 'Úsalo para ajustar el plan basado en la perspectiva del equipo'],
      },
    ],
  },
]

const REVIEW_STEPS = [
  {
    phase: 'ANTES de la revisión',
    color: 'var(--blue)',
    bg: 'rgba(59,130,246,.07)',
    border: 'rgba(59,130,246,.25)',
    steps: [
      { icon: '1', title: 'Activar Modo HR', desc: 'Ingresa el PIN de HR en la barra superior. Esto desbloquea la edición completa del portal.' },
      { icon: '2', title: 'Revisar alertas activas', desc: 'Ve a Desarrollo → Alertas & Riesgo. Identifica colaboradores con riesgo crítico o planes sin iniciar.' },
      { icon: '3', title: 'Actualizar progreso IDP', desc: 'En Desarrollo → Resumen, marca las acciones completadas desde la última revisión. Esto actualiza automáticamente los porcentajes.' },
      { icon: '4', title: 'Revisar vista 30·60·90', desc: 'Confirma qué acciones debían completarse este trimestre. Identifica las que están pendientes o bloqueadas.' },
      { icon: '5', title: 'Preparar la Banca de Talento', desc: 'Abre Banca de Talento para tener la vista comparativa lista. Es el documento base para la reunión.' },
    ],
  },
  {
    phase: 'DURANTE la reunión',
    color: 'var(--teal)',
    bg: 'var(--teal-light)',
    border: 'rgba(20,184,166,.3)',
    steps: [
      { icon: '1', title: 'Presentar estado del equipo', desc: 'Comienza con el Resumen del Plan (Home) para dar contexto ejecutivo: cuántos listos ahora, cuántos en desarrollo, puestos críticos cubiertos.' },
      { icon: '2', title: 'Revisar perfil por perfil', desc: 'Navega en Perfiles & IDP por cada colaborador. Revisa el 9-Box, las brechas y el avance del IDP con el equipo de liderazgo.' },
      { icon: '3', title: 'Discutir alertas', desc: 'Aborda las alertas automáticas de Desarrollo. Para cada alerta crítica, define responsables y acciones concretas.' },
      { icon: '4', title: 'Actualizar readiness', desc: 'Si un colaborador ha avanzado significativamente, actualiza el Readiness % y el estado (Listo ahora / pronto / futuro) en su perfil.' },
      { icon: '5', title: 'Revisar acciones del Manager', desc: 'Abre Desarrollo → Para el Manager. Marca las acciones de liderazgo completadas y define las del próximo trimestre.' },
    ],
  },
  {
    phase: 'DESPUÉS de la revisión',
    color: 'var(--amber)',
    bg: 'var(--amber-light)',
    border: 'rgba(245,158,11,.3)',
    steps: [
      { icon: '1', title: 'Registrar evidencias', desc: 'En Desarrollo → Para el Manager, agrega las evidencias de acciones completadas: certificados obtenidos, proyectos liderados, fechas de logros.' },
      { icon: '2', title: 'Actualizar IDP si hubo cambios', desc: 'Si se redefinieron acciones o plazos en la reunión, actualiza el IDP en Modo HR usando el botón ✏️ Editar en cada tarjeta.' },
      { icon: '3', title: 'Exportar documentación', desc: 'Desde Perfiles & IDP, descarga el Word (↓ Word) de cada colaborador para archivar o compartir con el colaborador directamente.' },
      { icon: '4', title: 'Preparar próxima revisión', desc: 'Revisa el Calendario en Desarrollo → 30·60·90 y define las acciones prioritarias del próximo trimestre para cada colaborador.' },
    ],
  },
]

const WORKFLOW = [
  { week: 'Semana 1', label: 'Recopilación de datos', color: 'var(--teal)', items: ['Completar Talent Card de cada colaborador', 'Actualizar 9-Box scores con evidencia objetiva', 'Revisar logros y eventos desde última revisión', 'Recopilar feedback de pares y proyectos'] },
  { week: 'Semana 2', label: 'Análisis individual', color: 'var(--blue)', items: ['Revisar IDP de cada colaborador (Perfiles & IDP)', 'Marcar acciones completadas en Desarrollo', 'Identificar alertas y riesgos activos', 'Actualizar readiness % según progreso real'] },
  { week: 'Semana 3', label: 'Calibración del equipo', color: 'var(--purple)', items: ['Reunión de calibración con Banca de Talento como base', 'Revisar distribución 9-Box del equipo completo', 'Ajustar prioridades y timelines según necesidades del negocio', 'Validar plan de sucesión para puestos críticos'] },
  { week: 'Semana 4', label: 'Plan de acción', color: 'var(--amber)', items: ['Definir acciones del Manager para el próximo trimestre', 'Comunicar resultados y próximos pasos a colaboradores', 'Actualizar IDP con nuevas acciones si aplica', 'Archivar documentación en Word por colaborador'] },
]

const FAQ = [
  { q: '¿Cómo activo el Modo HR?', a: 'Haz clic en el botón "Modo HR" en la barra superior izquierda e ingresa el PIN de administrador. Cuando está activo, verás el botón en color ámbar y aparecerán opciones de edición en todo el portal.' },
  { q: '¿Los cambios se guardan automáticamente?', a: 'Sí. Todos los cambios que realizas en Modo HR se guardan automáticamente en el almacenamiento local del browser. No necesitas guardar manualmente ni hay un servidor.' },
  { q: '¿Qué pasa si reseteo los datos?', a: 'El botón de reset (⚠️ Resetear datos) en la barra superior elimina todos los cambios y vuelve a los datos originales del plan. Esta acción no se puede deshacer, úsalo con precaución.' },
  { q: '¿Puedo agregar colaboradores nuevos?', a: 'Sí, en Modo HR aparece un botón "+ Nuevo colaborador" en la Banca de Talento y en Perfiles. Completa el formulario con todos los datos del nuevo colaborador.' },
  { q: '¿Cómo comparto el portal con mi equipo?', a: 'Comparte el link de GitHub Pages (https://gpope777.github.io/succession-plan-app). El Modo HR está protegido por PIN, así que el equipo puede ver el portal en modo lectura sin riesgo de ediciones accidentales.' },
  { q: '¿Puedo exportar el documento?', a: 'Sí. En Perfiles & IDP, cada Talent Card tiene un botón "↓ Word" que descarga el perfil completo del colaborador en formato .docx. También puedes imprimir cualquier vista del browser con Ctrl+P.' },
  { q: '¿Cómo funciona el 9-Box?', a: 'El 9-Box es una matriz que cruza Desempeño (eje X) y Potencial (eje Y), cada uno en escala 1-5. La posición del colaborador se actualiza automáticamente cuando cambias los scores. Cada celda tiene un perfil descriptivo (Estrella, Diamante en Bruto, etc.).' },
  { q: '¿Qué son las alertas automáticas?', a: 'Las alertas en Desarrollo → Alertas & Riesgo se generan automáticamente analizando el progreso del IDP, las brechas críticas y el Readiness % de cada colaborador. Se actualizan en tiempo real cuando marcas acciones como completadas.' },
  { q: '¿Cómo funciona la vista 30·60·90 días?', a: 'Esta vista organiza las acciones pendientes del IDP según en qué fase está cada colaborador: Fase 1 → próximos 30 días, Fase 2 → 31-60 días, Fase 3 → 61-90 días. No usa fechas reales, sino la secuencia del plan.' },
  { q: '¿Qué es el Log de Evidencias?', a: 'En Desarrollo → Para el Manager, cuando marcas una acción del IDP como completada, aparece un campo para registrar la evidencia: nombre del certificado obtenido, fecha, link de comprobante, etc. Esto convierte el plan en un expediente real.' },
]

export default function Guia() {
  const [section, setSection] = useState('inicio')
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="page">
      <div className="page-inner">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--navy)' }}>Guía de Uso del Portal</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
            Todo lo que necesitas saber para usar el portal de sucesión de manera efectiva
          </div>
        </div>

        {/* Internal nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap', background: 'var(--bg)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: section === s.id ? 'white' : 'transparent',
              color: section === s.id ? 'var(--navy)' : 'var(--text-muted)',
              boxShadow: section === s.id ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
              transition: 'all .15s',
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* ── INICIO ── */}
        {section === 'inicio' && (
          <>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1a3a4f 100%)', borderRadius: 16, padding: '32px 36px', marginBottom: 24, color: 'white' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Portal de Planificación de Sucesión</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 16 }}>
                Una plataforma centralizada para gestionar el desarrollo de talento, identificar sucesores y hacer seguimiento activo de los planes de desarrollo individual.
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { n: '5', l: 'Colaboradores en pipeline' },
                  { n: '11', l: 'Secciones del portal' },
                  { n: '4', l: 'Sub-vistas en Desarrollo' },
                  { n: '100%', l: 'Editable en Modo HR' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--teal)' }}>{s.n}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para quién es */}
            <div className="sec-lbl">¿Para quién es este portal?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '👔', role: 'Director / Liderazgo Senior', uso: 'Vista ejecutiva del pipeline, calibración de talento, decisiones de promoción' },
                { icon: '🧑‍💼', role: 'HR / People Operations', uso: 'Gestión completa del plan en Modo HR, edición de perfiles, seguimiento de IDP' },
                { icon: '👤', role: 'Managers directos', uso: 'Seguimiento de acciones, registro de evidencias, consulta de IDP de su equipo' },
              ].map(r => (
                <div key={r.role} className="card card-p">
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 6 }}>{r.role}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.uso}</div>
                </div>
              ))}
            </div>

            {/* Quick start */}
            <div className="sec-lbl">Inicio rápido — 5 pasos</div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: 4 }}>
              {[
                { n: '01', title: 'Explora el Resumen del Plan', desc: 'La primera pestaña (🏠) muestra el estado general del equipo y los puestos críticos cubiertos.', color: 'var(--teal)' },
                { n: '02', title: 'Revisa la Banca de Talento', desc: 'En Diagnóstico → Banca de Talento verás todos los colaboradores con su prioridad, brechas y progreso.', color: 'var(--blue)' },
                { n: '03', title: 'Profundiza en Perfiles & IDP', desc: 'Cada colaborador tiene una Talent Card completa con 9-Box, fortalezas, brechas y el IDP detallado por fases.', color: 'var(--purple)' },
                { n: '04', title: 'Activa el seguimiento en Desarrollo', desc: 'La sección de Desarrollo tiene 4 sub-vistas: Resumen, Alertas, 30·60·90 días y Para el Manager.', color: 'var(--amber)' },
                { n: '05', title: 'Activa Modo HR para editar', desc: 'Con el PIN de HR puedes editar cualquier campo, marcar acciones y registrar evidencias.', color: 'var(--coral)' },
              ].map((s, i, arr) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── MODO HR ── */}
        {section === 'admin' && (
          <>
            <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '2px solid var(--amber)', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 28 }}>🔑</span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>Modo HR (Administrador)</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Acceso completo de edición para People Operations y Liderazgo</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
                El Modo HR está protegido por un PIN. Cuando está activo, el botón en la barra superior cambia a color <strong style={{ color: 'var(--amber)' }}>ámbar</strong> y aparecen opciones de edición en todo el portal.
              </div>
            </div>

            <div className="sec-lbl">Cómo activarlo</div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
              {[
                { step: '1', txt: 'Localiza el botón "Modo HR" en la barra de navegación lateral izquierda, debajo del logo.' },
                { step: '2', txt: 'Haz clic en el botón. Se abrirá un campo para ingresar el PIN de administrador.' },
                { step: '3', txt: 'Ingresa el PIN y presiona Enter. Si es correcto, el botón cambia a ámbar y aparece "Admin ON".' },
                { step: '4', txt: 'Ahora verás botones ✏️ Editar en Banca de Talento y Perfiles & IDP, checkboxes activos en Desarrollo, y más.' },
                { step: '5', txt: 'Para desactivarlo, haz clic en el botón ámbar nuevamente. Todos los cambios ya guardados persisten.' },
              ].map((s, i, arr) => (
                <div key={s.step} style={{ display: 'flex', gap: 14, padding: '13px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--amber)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.step}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, paddingTop: 4 }}>{s.txt}</div>
                </div>
              ))}
            </div>

            <div className="sec-lbl">Qué se desbloquea en Modo HR</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '✏️', titulo: 'Edición de perfiles', desc: 'Botón "✏️ Editar" en cada tarjeta de Banca de Talento y Perfiles & IDP. Edita todos los campos del colaborador.' },
                { icon: '☑️', titulo: 'Marcar acciones del IDP', desc: 'En Desarrollo → Resumen, haz clic en los checkboxes para marcar acciones como completadas o pendientes.' },
                { icon: '📋', titulo: 'Acciones del Manager', desc: 'En Desarrollo → Para el Manager, marca acciones de liderazgo como completadas.' },
                { icon: '📝', titulo: 'Registro de evidencias', desc: 'Agrega notas y evidencias de completación para cada acción del IDP completada.' },
                { icon: '➕', titulo: 'Agregar colaboradores', desc: 'Agrega nuevos colaboradores al pipeline de sucesión desde cualquier vista de tarjetas.' },
                { icon: '⚙️', titulo: 'Importar / Resetear datos', desc: 'Importa datos desde un archivo JSON o resetea el portal a sus datos originales.' },
              ].map(item => (
                <div key={item.titulo} className="card card-p" style={{ borderLeft: '3px solid var(--amber)' }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 5 }}>{item.titulo}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '14px 18px', fontSize: 13, color: '#dc2626', lineHeight: 1.7 }}>
              <strong>⚠️ Importante:</strong> El botón "Resetear datos" elimina todos los cambios y vuelve a los datos originales del plan. Esta acción <strong>no se puede deshacer</strong>. Úsalo únicamente si necesitas comenzar desde cero.
            </div>
          </>
        )}

        {/* ── SECCIONES (fusionado) ── */}
        {section === 'secciones' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 22, lineHeight: 1.7 }}>
              El portal está organizado en <strong>6 grupos temáticos</strong> accesibles desde la barra de navegación superior.
              Cada grupo puede tener una o más sub-secciones. A continuación encontrarás el propósito, descripción detallada y consejos de uso de cada una.
            </div>

            {PORTAL_TABS.map(group => (
              <div key={group.group} className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${group.color}` }}>
                {/* Group header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: group.bg }}>
                  <span style={{ fontSize: 22 }}>{group.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{group.group}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{group.tabs.length} sección{group.tabs.length > 1 ? 'es' : ''} en este grupo</div>
                  </div>
                </div>

                {/* Tabs within group */}
                {group.tabs.map((tab, ti) => (
                  <div key={tab.id} style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: group.color }}>{tab.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 14 }}>{tab.desc}</div>

                    {/* Sub-views for Desarrollo */}
                    {tab.id === 'desarrollo' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10, marginBottom: 14 }}>
                        {[
                          { tab: '📊 Resumen', desc: 'Tracker de IDP con estado de riesgo, barras de progreso y checkboxes interactivos. 1 clic = En progreso, 2 clics = Completado.', color: 'var(--teal)' },
                          { tab: '🔴 Alertas & Riesgo', desc: 'Alertas automáticas: planes sin iniciar, brechas críticas sin atender, readiness que necesita recalibración.', color: '#ef4444' },
                          { tab: '📅 30 · 60 · 90 días', desc: 'Kanban de acciones organizadas por ventana de tiempo según la fase activa de cada colaborador.', color: 'var(--amber)' },
                          { tab: '👔 Para el Manager', desc: 'Acciones de liderazgo (presupuestos, mentorías) y log de evidencias para todas las acciones del IDP.', color: 'var(--purple)' },
                        ].map(sv => (
                          <div key={sv.tab} style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 14px', border: `1px solid ${sv.color}30` }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: sv.color, marginBottom: 5 }}>{sv.tab}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{sv.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tab.tips.map((tip, i) => (
                        <div key={i} style={{ fontSize: 12, background: group.bg, border: `1px solid ${group.color}25`, borderRadius: 6, padding: '4px 10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ color: group.color, fontWeight: 700 }}>→</span> {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* ── REVISIÓN ── */}
        {section === 'revision' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              El proceso de revisión trimestral es el momento clave para calibrar el plan de sucesión. Sigue estos pasos para sacar el máximo provecho del portal en cada revisión.
            </div>

            {REVIEW_STEPS.map((phase, pi) => (
              <div key={pi} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ height: 2, flex: 1, background: phase.color, opacity: .3 }} />
                  <div style={{ background: phase.bg, border: `1.5px solid ${phase.border}`, borderRadius: 20, padding: '6px 20px', fontWeight: 700, fontSize: 13, color: phase.color, whiteSpace: 'nowrap' }}>
                    {phase.phase}
                  </div>
                  <div style={{ height: 2, flex: 1, background: phase.color, opacity: .3 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {phase.steps.map((step, si) => (
                    <div key={si} className="card" style={{ padding: '16px 18px', borderLeft: `3px solid ${phase.color}` }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: phase.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{step.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 5 }}>{step.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{step.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Frecuencia */}
            <div className="card card-p" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 12 }}>📅 Frecuencia recomendada</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { frec: 'Mensual', accion: 'Actualizar progreso del IDP y revisar alertas activas (15 min)', color: 'var(--teal)' },
                  { frec: 'Trimestral', accion: 'Revisión completa del plan con calibración del equipo (2-3 hrs)', color: 'var(--blue)' },
                  { frec: 'Semestral', accion: 'Actualizar 9-Box scores y readiness % de cada colaborador', color: 'var(--purple)' },
                  { frec: 'Anual', accion: 'Revisión estratégica completa y planificación del siguiente ciclo', color: 'var(--amber)' },
                ].map(f => (
                  <div key={f.frec} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: `1.5px solid ${f.color}30` }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: f.color, marginBottom: 4 }}>{f.frec}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.accion}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── FLUJO ── */}
        {section === 'flujo' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              Flujo de trabajo recomendado para el <strong>mes previo a cada revisión trimestral</strong>. Distribución de actividades en 4 semanas para llegar preparado a la sesión de calibración.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 28 }}>
              {WORKFLOW.map((w, i) => (
                <div key={w.week} className="card" style={{ overflow: 'hidden', borderTop: `4px solid ${w.color}` }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: w.color, marginBottom: 2 }}>{w.week}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{w.label}</div>
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    {w.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: w.color, flexShrink: 0, marginTop: 6 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Roles en el flujo */}
            <div className="sec-lbl">Responsabilidades por rol</div>
            <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    {['Actividad', '👔 Director / Liderazgo', '🧑‍💼 HR / People Ops', '👤 Manager Directo'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Actualizar progreso IDP', '—', '✅ Primario', '✅ Apoya'],
                    ['Calibración 9-Box', '✅ Primario', '✅ Facilita', '✅ Aporta'],
                    ['Aprobar acciones del Manager', '✅ Primario', '—', '—'],
                    ['Registrar evidencias', '—', '✅ Primario', '✅ Apoya'],
                    ['Actualizar Talent Cards', '—', '✅ Primario', '—'],
                    ['Reunión de calibración', '✅ Participa', '✅ Lidera', '✅ Participa'],
                    ['Comunicar plan al colaborador', '—', '✅ Apoya', '✅ Primario'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '10px 14px', color: cell === '—' ? 'var(--border)' : cell.includes('Primario') ? 'var(--teal)' : 'var(--text-muted)', fontWeight: cell.includes('Primario') ? 700 : 400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Herramientas por etapa */}
            <div className="sec-lbl">¿Qué sección del portal usar en cada etapa?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { etapa: 'Preparación individual', secciones: ['Perfiles & IDP', 'Talent Card (formulario)', 'Desarrollo → Resumen'], color: 'var(--blue)' },
                { etapa: 'Reunión de calibración', secciones: ['Banca de Talento', 'Análisis de Calidad', 'Resumen del Plan'], color: 'var(--teal)' },
                { etapa: 'Seguimiento post-revisión', secciones: ['Desarrollo → Para el Manager', 'Desarrollo → Alertas', 'Desarrollo → 30·60·90'], color: 'var(--amber)' },
                { etapa: 'Comunicación al equipo', secciones: ['Perfiles & IDP (exportar Word)', 'Guía de Valores', 'Buzón de Feedback'], color: 'var(--purple)' },
              ].map(e => (
                <div key={e.etapa} className="card card-p" style={{ borderLeft: `3px solid ${e.color}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: e.color, marginBottom: 10 }}>{e.etapa}</div>
                  {e.secciones.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 5 }}>
                      <span style={{ color: e.color }}>→</span>{s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── FAQ ── */}
        {section === 'faq' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              Respuestas a las preguntas más frecuentes sobre el uso del portal.
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              {FAQ.map((item, i) => (
                <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: openFaq === i ? 'var(--teal)' : 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: openFaq === i ? 'white' : 'var(--text-muted)', flexShrink: 0, transition: 'all .15s' }}>
                      {openFaq === i ? '−' : '+'}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', flex: 1 }}>{item.q}</span>
                  </div>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 16px 56px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, background: 'var(--teal-light)', border: '1.5px solid rgba(20,184,166,.3)', borderRadius: 10, padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--teal)' }}>¿Tienes más preguntas?</strong> Usa el <strong>Buzón de Feedback</strong> (sección 📬 en la barra superior) para enviar preguntas o sugerencias sobre el portal.
            </div>
          </>
        )}

      </div>
    </div>
  )
}

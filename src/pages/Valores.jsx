import { useState } from 'react'
import ValoresChat from '../components/ValoresChat'

const VALUES = [
  {
    id: 'teamwork',
    label: 'Teamwork &\nCollaboration',
    labelEs: 'Trabajo en Equipo',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    def_es: 'Trabajar juntos a través de roles, departamentos y áreas de expertise para alcanzar metas comunes, valorando diversas perspectivas y fomentando un entorno cooperativo.',
    competency: 'Resolución Colaborativa de Problemas',
    why: 'Este valor es la base del espíritu de equipo en Provider. Sin colaboración activa, los proyectos se fragmentan, la comunicación se rompe y el talento individual pierde impacto. Un equipo que colabora bien multiplica su capacidad de servir al cliente y enfrentar retos complejos.',
  },
  {
    id: 'accountability',
    label: 'Accountability &\nGetting Things Done',
    labelEs: 'Responsabilidad',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    def_es: 'Asumir la responsabilidad de las acciones, decisiones y resultados, siendo confiable al entregar resultados y manteniendo un compromiso con la excelencia.',
    competency: 'Orientación a Resultados',
    why: 'La responsabilidad individual es lo que convierte las intenciones en resultados concretos. En Provider, cumplir con los compromisos —especialmente bajo presión— es lo que construye la confianza interna y la reputación de excelencia ante los clientes.',
  },
  {
    id: 'innovation',
    label: 'Innovation &\nCreativity',
    labelEs: 'Innovación y Creatividad',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 10.9 13 11.5 13 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    ),
    def_es: 'Adoptar nuevas ideas, enfoques y soluciones, alentando el pensamiento creativo para impulsar el progreso y mantenerse adelante en un entorno competitivo.',
    competency: 'Pensamiento Creativo',
    why: 'En un entorno de servicios de salud en constante cambio, la innovación no es opcional — es la diferencia entre mantenerse relevante y quedarse atrás. Provider valora la creatividad porque cada mejora en procesos o soluciones impacta directamente la calidad del servicio al cliente.',
  },
  {
    id: 'flexibility',
    label: 'Flexibility &\nAdaptability',
    labelEs: 'Flexibilidad y Adaptabilidad',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    def_es: 'Mantenerse abierto al cambio, ajustarse a nuevas circunstancias y estar dispuesto a modificar estrategias o enfoques para enfrentar desafíos u oportunidades cambiantes.',
    competency: 'Gestión del Cambio',
    why: 'Las organizaciones que no se adaptan, no sobreviven. En Provider, la flexibilidad permite responder a cambios regulatorios, tecnológicos y del mercado sin perder el foco en la misión. Los empleados adaptables son los más resilientes y los que mejor guían a sus equipos en transiciones.',
  },
  {
    id: 'learning',
    label: 'Lifelong\nLearning',
    labelEs: 'Aprendizaje Continuo',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
      </svg>
    ),
    def_es: 'Comprometerse con el crecimiento, el desarrollo y la educación continuos, manteniendo la curiosidad y esforzándose por mejorar las habilidades personales y profesionales a lo largo del tiempo.',
    competency: 'Orientación al Aprendizaje / Mejora Continua',
    why: 'El campo de redes de proveedores evoluciona constantemente. En Provider, el aprendizaje continuo garantiza que cada colaborador esté equipado para ofrecer soluciones actualizadas. Además, una cultura de aprendizaje reduce errores, mejora la toma de decisiones y fortalece la retención del talento.',
  },
  {
    id: 'integrity',
    label: 'Integrity &\nHonesty',
    labelEs: 'Integridad y Honestidad',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
      </svg>
    ),
    def_es: 'Actuar con principios morales sólidos, siendo veraz, transparente y ético en todas las interacciones y negociaciones, construyendo confianza con los demás.',
    competency: 'Toma de Decisiones Éticas',
    why: 'La integridad es el cimiento de la reputación de Provider. Sin ella, la confianza de clientes, socios y empleados se erosiona. Actuar con honestidad —especialmente en situaciones difíciles— es lo que diferencia a las organizaciones de excelencia y lo que hace que los equipos se sientan seguros y respetados.',
  },
  {
    id: 'transparency',
    label: 'Transparency &\nCommunication',
    labelEs: 'Transparencia y Comunicación',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    def_es: 'Compartir abiertamente información, decisiones y objetivos, fomentando un entorno en el que la comunicación honesta y clara fluya libremente entre individuos y equipos.',
    competency: 'Comunicación Efectiva',
    why: 'La transparencia elimina la ambigüedad y los rumores que debilitan a los equipos. En Provider, una comunicación clara y honesta entre todos los niveles asegura que todos trabajen con la misma información, tomen mejores decisiones y se sientan incluidos y valorados.',
  },
]

const FALLBACKS = {
  teamwork: [
    { id: 'transparency', name: 'Transparency & Communication', source: 'Project Aristotle · Google', why: 'El estudio más grande sobre equipos de alto rendimiento (Google, 2016) encontró que la seguridad psicológica —sentirse seguro para hablar— depende directamente de la comunicación abierta. Cuando no se puede colaborar físicamente o en tiempo real, la transparencia mantiene ese tejido de confianza.', actions: ['Establece un ritual de actualización breve y periódico: un mensaje de 3 líneas cada mañana ("esto hago hoy, esto me bloquea, esto necesito"). Reduce incertidumbre sin reuniones.', 'Practica el check-in emocional al inicio de cada sincronía: una palabra sobre cómo está cada persona. Equipos que lo hacen resuelven problemas un 30% más rápido (Edmondson, Harvard).'] },
    { id: 'accountability', name: 'Accountability & Getting Things Done', source: 'Lencioni · 5 Dysfunctions', why: 'Patrick Lencioni describe que cuando la coordinación falla, la responsabilidad individual se convierte en el pegamento del equipo. Si cada persona cumple su parte y lo comunica, el resultado colectivo se sostiene aunque la colaboración directa sea limitada.', actions: ['Usa micro-compromisos: al cerrar cualquier interacción, cada persona dice en voz alta qué entregará y cuándo. Esta técnica reduce el "se me olvidó" hasta en un 70%.', 'Haz visible el progreso: un tablero sencillo (físico o digital) donde el equipo vea el avance de cada parte. La visibilidad compartida sustituye la supervisión directa.'] },
    { id: 'flexibility', name: 'Flexibility & Adaptability', source: 'Psicología organizacional · APA', why: 'La American Psychological Association identifica la flexibilidad cognitiva como un predictor clave de resiliencia grupal. Cuando el equipo no puede operar como de costumbre, adaptar el formato de trabajo —no el objetivo— conserva la energía sin rendirse al bloqueo.', actions: ['Separa el "qué" del "cómo": confirmen juntos el objetivo que no cambia y den libertad individual para elegir cómo contribuir. Esto activa autonomía, motivación intrínseca comprobada (Deci & Ryan, SDT).', 'Propón un periodo de prueba corto (una semana) con la nueva forma de trabajar. Los cambios temporales tienen menos resistencia y, si funcionan, se adoptan naturalmente.'] },
  ],
  accountability: [
    { id: 'transparency', name: 'Transparency & Communication', source: 'Psicología de la confianza · Maister', why: 'La ecuación de confianza de David Maister muestra que la confiabilidad percibida baja drásticamente cuando las personas desaparecen o no explican sus obstáculos. Comunicar un bloqueo a tiempo protege la confianza mejor que entregar tarde sin aviso.', actions: ['Cuando algo se desvíe, da señal temprana: "No voy a poder cumplir X por Y razón; propongo Z." Tres elementos, sin excusas largas. La proactividad convierte un fallo en liderazgo.', 'Distingue causa del bloqueo y plan de contingencia. Presentar ambos reduce la frustración del receptor y mantiene al equipo en modo solución.'] },
    { id: 'teamwork', name: 'Teamwork & Collaboration', source: 'Trabajo en equipo · Hackman (Harvard)', why: 'Richard Hackman demostró que los equipos más efectivos redistribuyen carga activamente cuando un miembro está bloqueado, en lugar de esperar. La colaboración como respuesta a un fallo individual es más resiliente que depender del rendimiento constante de cada persona.', actions: ['Implementa "pares de respaldo": cada tarea crítica tiene dos personas que saben cómo realizarla. Si una falla, la otra puede actuar sin fricciones ni reprocesos.', 'Normaliza pedir ayuda con tiempo, no en el último momento. Un equipo donde pedir ayuda es seguro (no signo de debilidad) recupera el ritmo hasta 2 veces más rápido.'] },
    { id: 'flexibility', name: 'Flexibility & Adaptability', source: 'Gestión ágil · Scrum Guide', why: 'Los marcos ágiles parten de un principio claro: el plan siempre cambia, el compromiso con el valor no. Si el camino original está bloqueado, replantear el alcance (no el propósito) sigue siendo cumplir con responsabilidad.', actions: ['Aplica la pregunta ágil: "¿Qué es lo mínimo que podemos entregar esta semana que siga siendo valioso?" Reduce la presión y mantiene la entrega.', 'Documenta el cambio de plan explícitamente para el equipo. Cambiar en silencio genera desconfianza; cambiar de manera transparente genera madurez organizacional.'] },
  ],
  innovation: [
    { id: 'learning', name: 'Lifelong Learning', source: 'Growth Mindset · Dweck (Stanford)', why: 'Carol Dweck (Stanford) demostró que las personas con mentalidad de crecimiento ven las restricciones como información, no como fracaso. Un periodo donde no se puede innovar libremente es una oportunidad de profundizar en fundamentos que hacen mejores las ideas futuras.', actions: ['Identifica una habilidad o área que normalmente no tienes tiempo de estudiar. Dedica 20 minutos al día durante dos semanas. El efecto de aprendizaje compuesto es significativo en períodos cortos.', 'Realiza retrospectivas de aprendizaje: "¿Qué funcionó? ¿Qué no? ¿Qué haríamos diferente?" No para evaluar, sino para documentar conocimiento que después impulsa innovación real.'] },
    { id: 'accountability', name: 'Accountability & Getting Things Done', source: 'Confianza organizacional · Edmondson', why: 'La investigadora Amy Edmondson (Harvard) encontró que los equipos con alta confiabilidad de entrega reciben más espacio para innovar posteriormente. Cumplir con excelencia durante períodos restrictivos genera el crédito de confianza que permite experimentar cuando las condiciones cambian.', actions: ['Enfócate en "innovación de proceso": pequeñas mejoras a cómo haces lo que ya haces. No requiere aprobación externa y genera mejoras tangibles con bajo riesgo.', 'Documenta bien lo que entregas ahora. La documentación de calidad es en sí misma innovación y crea una base sobre la que otros pueden construir.'] },
    { id: 'flexibility', name: 'Flexibility & Adaptability', source: 'Design Thinking · IDEO / d.school', why: 'El enfoque de diseño centrado en el usuario enseña que las restricciones son un insumo creativo, no un obstáculo. Las soluciones más elegantes frecuentemente nacen de limitaciones, no de recursos ilimitados.', actions: ['Practica el reencuadre (reframing): reformula cada restricción como una pregunta creativa. "No podemos X" → "¿Cómo podríamos lograr el mismo resultado sin X?" Esto activa pensamiento lateral.', 'Propón experimentos pequeños y de bajo costo. Un prototipo de papel o un test de 2 horas no requiere presupuesto y mantiene vivo el músculo de la innovación.'] },
  ],
  flexibility: [
    { id: 'teamwork', name: 'Teamwork & Collaboration', source: 'Resiliencia organizacional · Weick', why: 'Karl Weick (Michigan) estudió cómo los equipos navegan situaciones caóticas: los más resilientes comparten el sentido de la situación colectivamente en lugar de dejarlo a cada individuo. La colaboración en contextos rígidos distribuye la carga cognitiva y emocional.', actions: ['Realiza sesiones cortas de "sensemaking": 15 minutos donde el equipo comparte cómo está interpretando la situación. Esto evita que cada persona construya una narrativa diferente que fragmente la cohesión.', 'Asigna roles de apoyo temporal: una persona que revise los bloqueos del equipo cada semana y conecte a quienes los comparten. La coordinación informal funciona cuando la estructura formal falla.'] },
    { id: 'integrity', name: 'Integrity & Honesty', source: 'Ética organizacional · Kohlberg', why: 'Cuando el entorno es rígido e impredecible, los valores se convierten en la brújula más confiable. La investigación en toma de decisiones bajo presión muestra que las personas con claridad ética toman mejores decisiones en menos tiempo, sin necesidad de analizar cada caso.', actions: ['Practica el "test del periódico": antes de cada decisión importante bajo presión, pregúntate si estarías cómodo/a viendo esa decisión publicada. Es simple y funciona para cualquier nivel.', 'Comparte en equipo los principios no negociables: qué haríamos y qué no haríamos sin importar la presión. Tenerlos explícitos reduce el estrés de decidir en el momento.'] },
    { id: 'transparency', name: 'Transparency & Communication', source: 'Cambio organizacional · Kotter (Harvard)', why: 'John Kotter (Harvard) encontró que el 70% de los cambios organizacionales fracasan por falta de comunicación sobre qué cambia y por qué. Cuando la flexibilidad es limitada externamente, explicar los límites con claridad permite que el equipo planifique con realismo.', actions: ['Comunica restricciones con formato "qué, por qué, hasta cuándo": "No podemos hacer X porque Y; estimamos que dure Z semanas." La incertidumbre tolerable es mejor que el silencio.', 'Crea un espacio donde el equipo pueda hacer preguntas sin filtro sobre los límites actuales. Las preguntas no respondidas generan rumores que dañan más que la restricción en sí.'] },
  ],
  learning: [
    { id: 'teamwork', name: 'Teamwork & Collaboration', source: 'Aprendizaje social · Bandura (Stanford)', why: 'Albert Bandura (Stanford) demostró que el aprendizaje más eficiente ocurre observando e interactuando con otros, no solo estudiando en solitario. Cuando el aprendizaje formal no es posible, el conocimiento ya existe distribuido en el equipo.', actions: ['Organiza sesiones de "teach-back": quien conoce algo lo enseña en 10 minutos al resto. Quien enseña consolida su propio aprendizaje un 90% más (pirámide de aprendizaje, NTL Institute).', 'Implementa el "buddy system": empareja a personas con distintas fortalezas para que trabajen juntas en tareas reales. El aprendizaje en contexto supera el entrenamiento fuera de contexto.'] },
    { id: 'innovation', name: 'Innovation & Creativity', source: 'Creatividad aplicada · Amabile (Harvard)', why: 'Teresa Amabile (Harvard) encontró que la creatividad florece cuando las personas aplican lo que saben de formas nuevas. Cuando no hay tiempo de aprender algo nuevo, reorganizar y conectar el conocimiento existente produce innovaciones valiosas.', actions: ['Practica "conexiones forzadas": toma un problema actual y aplícale un principio de un área completamente diferente. Esta técnica genera soluciones inesperadas con lo que ya sabes.', 'Dedica 15 minutos semanales a compartir en equipo algo que hayas visto funcionar en otro contexto. El conocimiento cross-funcional multiplica el valor sin requerir tiempo de formación.'] },
    { id: 'accountability', name: 'Accountability & Getting Things Done', source: 'Motivación intrínseca · Deci & Ryan', why: 'La teoría de autodeterminación (Deci & Ryan) muestra que cuando la autonomía o el crecimiento están limitados temporalmente, anclar en resultados tangibles protege la motivación. Entregar bien hoy genera la confianza organizacional que abre espacios de desarrollo mañana.', actions: ['Define "victorias pequeñas" diarias o semanales. Las investigaciones de Teresa Amabile sobre el "principio del progreso" muestran que avances pequeños sostienen el compromiso igual que los grandes logros.', 'Conecta explícitamente las tareas actuales con el aprendizaje que generan: "Hacer X me enseña Y." Reencuadrar la ejecución como aprendizaje en acción reduce la sensación de estancamiento.'] },
  ],
  integrity: [
    { id: 'transparency', name: 'Transparency & Communication', source: 'Confianza organizacional · Covey', why: 'Stephen M.R. Covey describe que la confianza tiene dos componentes: carácter (intenciones) y competencia (resultados). Cuando la presión externa pone a prueba el carácter, comunicar abiertamente las tensiones que se sienten es en sí un acto de integridad que fortalece la confianza del equipo.', actions: ['Si hay una tensión entre lo que se pide y lo que crees correcto, nómbrala en privado con tu líder o compañero de confianza. Documentarla, aunque sea informalmente, es un primer paso concreto.', 'Usa el lenguaje de preocupación, no de acusación: "Me preocupa el impacto de X en Y" es más efectivo y más seguro que un juicio directo. Mantiene la conversación abierta.'] },
    { id: 'teamwork', name: 'Teamwork & Collaboration', source: 'Seguridad psicológica · Edmondson (Harvard)', why: 'Amy Edmondson encontró que los equipos con alta seguridad psicológica pueden articular preocupaciones éticas sin miedo al rechazo. Un equipo unido alrededor de un valor compartido es mucho más difícil de presionar que un individuo solo.', actions: ['Encuentra al menos otra persona en el equipo que comparta la preocupación y hablen juntos con quien corresponda. La voz colectiva tiene 3 veces más probabilidad de generar cambio (Detert & Burris, 2007).', 'Propón una conversación de equipo sobre los "no negociables": qué harían y qué no harían sin importar la presión. Tenerlos definidos reduce el estrés individual y crea un escudo colectivo.'] },
    { id: 'accountability', name: 'Accountability & Getting Things Done', source: 'Liderazgo ético · Treviño (Penn State)', why: 'La investigadora Linda Treviño (Penn State) encontró que los colaboradores con historial de entrega consistente tienen mayor credibilidad para plantear preocupaciones éticas. El rendimiento sostenido construye el capital moral necesario para ser escuchado.', actions: ['Identifica las áreas donde tu integridad no está comprometida y entrega en ellas con el mayor nivel de calidad posible. Tu trayectoria habla cuando la situación no permite hacerlo directamente.', 'Documenta con fechas y hechos concretos cualquier situación que te genere conflicto ético. Sin juicios, solo hechos. Si el problema escala, tendrás evidencia clara y ordenada.'] },
  ],
  transparency: [
    { id: 'integrity', name: 'Integrity & Honesty', source: 'Comunicación honesta · Argyris (Harvard)', why: 'Chris Argyris (Harvard) estudió durante décadas por qué las personas no dicen lo que piensan en las organizaciones: el miedo al juicio. Ser honesto sobre lo que no puedes compartir, y por qué, es una forma de transparencia que protege la confianza sin violar restricciones legales o de confidencialidad.', actions: ['Usa el enfoque "lo que sí puedo decirte": en lugar de silencio o evasivas, comparte qué partes sí puedes comunicar y reconoce explícitamente qué no puedes. La honestidad sobre los límites genera más confianza que una respuesta vaga.', 'Distingue "no sé" de "no puedo decir" de "no debo decir aún". Estas tres frases son muy distintas y el equipo las interpreta diferente. La precisión reduce la especulación.'] },
    { id: 'teamwork', name: 'Teamwork & Collaboration', source: 'Comunicación organizacional · Shannon & Weaver', why: 'La teoría clásica de la comunicación muestra que el ruido y la ambigüedad escalan cuando los canales formales fallan. Un equipo cohesionado actúa como red de comunicación informal que compensa las restricciones del canal oficial, filtrando rumores y manteniendo narrativas coherentes.', actions: ['Fortalece los espacios informales del equipo (café virtual, canal de "off-topic"): son el sistema de comunicación de respaldo cuando los canales formales están limitados.', 'Designa a alguien como "traductor" de información: quien reciba actualizaciones parciales las sintetiza para el equipo en un mensaje semanal. Reduce la interpretación individual y el rumor.'] },
    { id: 'accountability', name: 'Accountability & Getting Things Done', source: 'Gestión por resultados · Drucker', why: 'Peter Drucker estableció que en ausencia de información completa, los resultados medibles son el lenguaje de confianza de las organizaciones. Cuando no puedes comunicar todo, que los entregables hablen: la consistencia en la ejecución compensa la opacidad informacional.', actions: ['Define métricas de éxito visibles y simples para cada semana: qué contará como "bien hecho" para el equipo. Los resultados claros reemplazan la necesidad de comunicación constante.', 'Cierra cada proyecto o tarea con un resumen breve de resultados, aunque nadie lo pida. Esto construye un historial de confiabilidad que sostiene la credibilidad cuando la comunicación es limitada.'] },
  ],
}

const TOP_IDS    = ['teamwork', 'accountability', 'innovation', 'flexibility']
const BOTTOM_IDS = ['learning', 'integrity', 'transparency']

function ValueCard({ v, state, onClick }) {
  const base = {
    borderRadius: 10,
    padding: '14px 8px 12px',
    cursor: state === 'dimmed' ? 'default' : 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    border: '2px solid transparent',
    transition: 'all 0.18s',
    minHeight: 96,
    position: 'relative',
    userSelect: 'none',
    opacity: state === 'dimmed' ? 0.32 : 1,
    background:
      state === 'compromised' ? '#7a1c1c' :
      state === 'fallback'    ? '#145a32' :
      '#0f2d5e',
    borderColor:
      state === 'compromised' ? '#e05252' :
      state === 'fallback'    ? '#4caf75' :
      'transparent',
    animation: state === 'fallback' ? 'pulse-green 1.8s ease-in-out infinite' : 'none',
  }

  return (
    <div
      style={base}
      onClick={() => state !== 'dimmed' && onClick(v.id)}
      onMouseEnter={e => { if (state !== 'dimmed') e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {state === 'compromised' && (
        <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: '#e05252', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          comprometido
        </span>
      )}
      {state === 'fallback' && (
        <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: '#4caf75', color: '#0a2d1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          apoyo
        </span>
      )}
      {v.icon}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'white', textAlign: 'center', lineHeight: 1.3 }}>
        {v.label.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br/>}</span>)}
      </div>
    </div>
  )
}

export default function Valores() {
  const [selected, setSelected] = useState(null)

  const getState = (id) => {
    if (!selected) return 'default'
    if (id === selected) return 'compromised'
    if (FALLBACKS[selected]?.some(f => f.id === id)) return 'fallback'
    return 'dimmed'
  }

  const toggle = (id) => setSelected(prev => prev === id ? null : id)

  const selectedVal = VALUES.find(v => v.id === selected)
  const fallbacks   = selected ? FALLBACKS[selected] : []

  const CARD_COLORS = ['#e8f4fd', '#fdecea', '#e9f7ef']
  const BORDER_COLORS = ['#b3d9f5', '#f5bcb4', '#a8ddb9']
  const INFO_BG = '#e8f0fb'
  const INFO_TEXT = '#1a56a0'

  return (
    <div className="page">
      <div className="page-inner">

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>Guía de Valores de Apoyo</div>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderLeft: '4px solid var(--teal)', borderRadius: 10, padding: '12px 18px', maxWidth: 700, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, textAlign: 'center' }}>
              Cuando un valor está <strong style={{ color: 'var(--text)' }}>bajo presión o comprometido</strong>, otros valores de la organización pueden actuar como ancla.
              Esta guía, basada en literatura científica organizacional, te indica <strong style={{ color: 'var(--text)' }}>qué valores activar y qué acciones concretas tomar.</strong>
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            {selected ? 'Clic en el valor comprometido nuevamente para deseleccionar' : 'Selecciona el valor que está bajo presión o comprometido →'}
          </div>
        </div>

        {/* Grid top (4) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
          {TOP_IDS.map(id => {
            const v = VALUES.find(val => val.id === id)
            return <ValueCard key={id} v={v} state={getState(id)} onClick={toggle} />
          })}
        </div>

        {/* Grid bottom (3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
          {BOTTOM_IDS.map(id => {
            const v = VALUES.find(val => val.id === id)
            return <ValueCard key={id} v={v} state={getState(id)} onClick={toggle} />
          })}
        </div>

        {/* Reset */}
        {selected && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <button
              onClick={() => setSelected(null)}
              style={{ fontSize: 13, padding: '7px 18px', cursor: 'pointer', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'inherit', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-1)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              ↺ Reiniciar selección
            </button>
          </div>
        )}

        {/* Panel */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90, color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>
              Elige un valor para ver su definición y los valores de apoyo con acciones concretas basadas en evidencia científica
            </div>
          ) : (
            <>
              {/* Definition card */}
              <div style={{
                background: 'linear-gradient(135deg, #0d3b6e 0%, #1b6a6e 100%)',
                borderRadius: 10,
                padding: '16px 18px',
                marginBottom: 20,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>
                  Definición del valor · PNS
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                  {selectedVal.label.replace('\n', ' ')}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 10 }}>
                  {selectedVal.def_es}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 8 }}>
                  {selectedVal.why}
                </div>
                <div style={{ marginTop: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Competencia PNS:</span>
                    {selectedVal.competency}
                  </span>
                </div>
              </div>

              {/* Panel header */}
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cuando <strong style={{ color: 'var(--text)' }}>{selectedVal.label.replace('\n', ' ')}</strong> está bajo presión, apóyate en:
              </div>

              {/* Fallback cards */}
              {fallbacks.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    border: `1px solid ${BORDER_COLORS[i]}`,
                    background: CARD_COLORS[i],
                    borderRadius: 12,
                    padding: '14px 16px',
                    marginBottom: i < fallbacks.length - 1 ? 10 : 0,
                    transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{f.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, background: INFO_BG, color: INFO_TEXT, borderRadius: 5, padding: '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2 }}>
                      {f.source}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{f.why}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Recomendaciones
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {f.actions.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: INFO_BG, color: INFO_TEXT, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          {ai + 1}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55 }}>{a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pulse-green {
          0%, 100% { border-color: #4caf75; }
          50%       { border-color: #86efac; }
        }
      `}</style>
      <ValoresChat />
    </div>
  )
}

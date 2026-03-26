// ─── Knowledge Base: Literatura científica sobre valores y comportamiento organizacional ───
// Cada entrada tiene: triggers (palabras clave), título, autores, respuesta en español

export const KB = [

  // ══════════════════════════════════════════════════════
  // SEGURIDAD PSICOLÓGICA / TRABAJO EN EQUIPO
  // ══════════════════════════════════════════════════════
  {
    id: 'psych_safety',
    value: 'trabajo_equipo',
    triggers: ['seguridad psicologica', 'psychological safety', 'edmondson', 'hablar sin miedo',
               'miedo a hablar', 'ambiente seguro', 'opinar libremente', 'expresar sin miedo',
               'confianza para hablar', 'voz en el equipo'],
    title: '🛡️ Seguridad Psicológica',
    authors: 'Amy Edmondson — Harvard Business School (1999, 2018)',
    response: `La investigación de Amy Edmondson en más de 180 equipos de Google (Project Aristotle) demostró que el predictor #1 del desempeño de un equipo no es el talento individual ni la inteligencia, sino la *seguridad psicológica*: la creencia compartida de que el equipo es seguro para asumir riesgos interpersonales.

Los equipos con alta seguridad psicológica aprenden más rápido, cometen menos errores críticos, innovan más y retienen mejor a su talento. En contraste, el miedo a ser juzgado, ridiculizado o castigado por hablar suprime el 73% de las ideas que los empleados tienen pero nunca expresan (Detert & Edmondson, 2011).

**Lo que dice la ciencia:**
• Los equipos psicológicamente seguros tienen 76% más engagement y 50% más productividad (Gallup, 2023).
• El silencio organizacional —cuando la gente sabe algo importante pero no lo dice— cuesta millones en errores prevenibles.
• La seguridad psicológica se construye desde el liderazgo: cuando el líder modela la vulnerabilidad, el equipo sigue.

**Cómo aplicarlo:**
• Sé el primero en admitir errores públicamente y hablar de lo que no sabes.
• Cuando alguien hable, responde con curiosidad genuina antes que con juicio.
• En cada reunión pregunta: "¿Qué perspectiva no hemos escuchado todavía?"
• Reconoce públicamente cuando alguien señaló un problema a tiempo.`,
  },

  {
    id: 'hackman_teams',
    value: 'trabajo_equipo',
    triggers: ['hackman', 'equipo efectivo', 'condiciones del equipo', 'cinco condiciones',
               'estructura del equipo', 'que hace un buen equipo', 'equipo de alto desempeno',
               'equipos exitosos', 'coaching de equipo', 'direccion clara'],
    title: '⚙️ Las 5 Condiciones de Efectividad de Equipos',
    authors: 'J. Richard Hackman — Harvard University (2002)',
    response: `Richard Hackman estudió durante 40 años qué hace que los equipos sean verdaderamente efectivos. Identificó 5 condiciones que, cuando están presentes, predicen el éxito con alta precisión:

1. **Equipo real**: límites claros, membresía estable, interdependencia genuina.
2. **Dirección motivadora**: una meta clara, retadora y consecuente.
3. **Estructura habilitadora**: normas que promuevan el trabajo colaborativo estratégico.
4. **Apoyo organizacional**: recursos, información y sistema de recompensa alineado.
5. **Coaching experto disponible**: acceso a orientación en el momento correcto.

Hackman encontró que el 60% del éxito de un equipo está determinado *antes* de que el equipo comience a trabajar, mediante el diseño de estas condiciones.

**Lo que dice la ciencia:**
• Los equipos no mejoran por sí solos: necesitan las condiciones correctas, no solo buenas intenciones.
• El coaching de equipo solo es efectivo cuando las otras 4 condiciones ya existen.
• La estabilidad del equipo importa más que tener a los "mejores" individuos.

**Cómo aplicarlo:**
• Define quién ES y quién NO es parte del equipo (los límites difusos destruyen la cohesión).
• Asegúrate de que todos entienden la meta de la misma manera — pregúntalo, no lo asumas.
• Identifica qué recurso o información falta y gestiona su acceso.`,
  },

  {
    id: 'lencioni_trust',
    value: 'trabajo_equipo',
    triggers: ['lencioni', 'cinco disfunciones', 'disfuncion', 'confianza en equipo',
               'conflicto productivo', 'compromiso del equipo', 'accountability colectiva',
               'piramide de lencioni', 'resultados del equipo', 'ausencia de confianza'],
    title: '🔺 Las 5 Disfunciones de un Equipo',
    authors: 'Patrick Lencioni (2002)',
    response: `Patrick Lencioni identificó una pirámide de disfunciones que destruyen a los equipos, donde cada una se construye sobre la anterior. El modelo es ampliamente usado en Fortune 500 y es una de las herramientas de desarrollo de equipos más validadas en práctica:

1. **Ausencia de confianza** → nadie se muestra vulnerable, todos se protegen.
2. **Miedo al conflicto** → se evitan conversaciones difíciles, se acuerda sin convicción.
3. **Falta de compromiso** → las decisiones no se ejecutan porque no hubo debate real.
4. **Evasión de responsabilidad** → nadie señala cuando un colega baja el estándar.
5. **Falta de atención a resultados** → el ego individual supera los objetivos colectivos.

La buena noticia: cuando la confianza existe, las otras cuatro se resuelven en cadena.

**Lo que dice la ciencia:**
• La confianza de equipo se construye con vulnerabilidad deliberada, no con tiempo.
• El conflicto productivo (basado en ideas, no en personas) mejora la calidad de las decisiones.
• Los equipos sin accountability entre pares dependen 100% del líder — un sistema frágil.

**Cómo aplicarlo:**
• Practica decir "no sé" o "me equivoqué" antes de esperar que otros lo hagan.
• Cuando estés en desacuerdo, di tu perspectiva directamente en la reunión, no después.
• Establece compromisos explícitos al final de cada reunión — no asumas que todos saben qué harán.`,
  },

  {
    id: 'project_aristotle',
    value: 'trabajo_equipo',
    triggers: ['project aristotle', 'google equipo', 'que hace equipo exitoso', 'investigacion google',
               'mejor equipo', 'equipos google', 're:work', 'colaboracion efectiva'],
    title: '🔬 Project Aristotle — Google',
    authors: 'Google Research / Julia Rozovsky (2015)',
    response: `Durante 2 años, Google estudió a más de 180 equipos internos para descubrir qué hacía a algunos equipos consistentemente superiores. El resultado fue sorprendente: la composición del equipo (quiénes son) importaba mucho menos que *cómo interactuaban*.

Los 5 factores que predijeron el éxito, en orden de importancia:
1. **Seguridad psicológica** — ¿Puedo tomar riesgos sin ser juzgado?
2. **Confiabilidad** — ¿Puedo confiar en que los demás entregan?
3. **Estructura y claridad** — ¿Tenemos metas, roles y planes claros?
4. **Significado del trabajo** — ¿Lo que hago importa personalmente?
5. **Impacto** — ¿Creo que mi trabajo crea diferencia?

La seguridad psicológica fue el factor dominante — sin ella, los otros cuatro se desmoronan.

**Lo que dice la ciencia:**
• Los equipos más inteligentes no eran los que tenían más personas brillantes, sino los que escuchaban más equitativamente.
• La inteligencia colectiva del equipo (Woolley, 2010) es diferente a la suma de inteligencias individuales.

**Cómo aplicarlo:**
• Fomenta que todos hablen en las reuniones — si siempre hablan los mismos, hay un problema.
• Conecta el trabajo diario con el impacto real en los pacientes/usuarios.
• Define claramente quién hace qué después de cada discusión de proyecto.`,
  },

  // ══════════════════════════════════════════════════════
  // RESPONSABILIDAD / ACCOUNTABILITY
  // ══════════════════════════════════════════════════════
  {
    id: 'self_determination',
    value: 'responsabilidad',
    triggers: ['autodeterminacion', 'motivacion intrinseca', 'deci', 'ryan', 'autonomia',
               'competencia', 'conexion', 'motivacion interna', 'por que nos motiva',
               'motivacion sin presion', 'motivacion genuina'],
    title: '🧭 Teoría de Autodeterminación',
    authors: 'Edward Deci & Richard Ryan — University of Rochester (1985–2000)',
    response: `La Teoría de Autodeterminación (SDT) es una de las teorías de motivación más investigadas del mundo, con más de 1,000 estudios en organizaciones, salud, educación y deporte. Su hallazgo central: las personas tienen tres necesidades psicológicas básicas universales cuya satisfacción determina su nivel de motivación, bienestar y desempeño:

1. **Autonomía** — sentir que elijo cómo hago mi trabajo, no que me lo imponen.
2. **Competencia** — sentir que soy bueno en lo que hago y que crezco.
3. **Vinculación** — sentir que pertenezco y que me importan las personas con quienes trabajo.

Cuando las tres están satisfechas, la motivación se vuelve *intrínseca* — la persona trabaja porque el trabajo en sí es significativo, no por miedo o recompensa externa.

**Lo que dice la ciencia:**
• La motivación extrínseca (bonos, amenazas) destruye la intrínseca si se usa de forma controladora.
• Dar autonomía en *cómo* hacer el trabajo (no necesariamente en *qué* hacer) duplica el engagement.
• Los empleados con alta SDT tienen 25% menos burnout y 33% más creatividad.

**Cómo aplicarlo:**
• Negocia cómo harás tu trabajo, no solo qué entregarás.
• Busca proyectos donde puedas demostrar y expandir tu competencia.
• Invierte en tus relaciones de trabajo — son un recurso motivacional, no un lujo.`,
  },

  {
    id: 'goal_setting',
    value: 'responsabilidad',
    triggers: ['metas', 'objetivos', 'locke', 'latham', 'smart', 'establecimiento de metas',
               'como poner metas', 'goals', 'cumplir metas', 'metas retadoras',
               'okr', 'kpi', 'seguimiento de metas'],
    title: '🎯 Teoría del Establecimiento de Metas',
    authors: 'Edwin Locke & Gary Latham (1990, 2002)',
    response: `Con más de 400 estudios durante 30 años, Locke y Latham demostraron que las metas específicas y difíciles producen desempeño consistentemente superior a las metas vagas ("haz lo mejor que puedas"). Esta es una de las teorías más replicadas en psicología organizacional.

Los cinco principios que hacen que una meta funcione:
1. **Claridad** — ¿Puedo describir exactamente qué significa "logrado"?
2. **Dificultad** — ¿Es suficientemente retadora para activar esfuerzo máximo?
3. **Compromiso** — ¿La persona realmente *quiere* alcanzarla?
4. **Retroalimentación** — ¿Sé cómo voy en tiempo real?
5. **Complejidad de tarea** — ¿Tengo los recursos para lograrla?

El compromiso (punto 3) es especialmente crítico: las metas impuestas sin participación del empleado producen resistencia, no esfuerzo.

**Lo que dice la ciencia:**
• Las metas difíciles pero alcanzables producen 16% más desempeño que las metas fáciles.
• El feedback inmediato amplifica el efecto de las metas — sin él, la meta pierde poder.
• Participar en definir las metas aumenta el compromiso, pero no es imprescindible si hay alta confianza en el líder.

**Cómo aplicarlo:**
• Convierte cada "quiero mejorar en X" en "haré Y cantidad de Z para el [fecha]".
• Revisa tu progreso semanalmente con alguien que te conozca.
• Cuando una meta parece imposible, no la elimines — redúcela al mínimo viable y recomienza.`,
  },

  {
    id: 'bandura_efficacy',
    value: 'responsabilidad',
    triggers: ['bandura', 'autoeficacia', 'self efficacy', 'creer en uno mismo',
               'confianza en capacidades', 'puedo hacerlo', 'creencia personal',
               'aprendizaje social', 'modelamiento', 'observar para aprender'],
    title: '💪 Autoeficacia',
    authors: 'Albert Bandura — Stanford University (1977, 1997)',
    response: `Albert Bandura demostró que la autoeficacia —la creencia de una persona en su capacidad de ejecutar exitosamente una tarea— es el predictor individual más poderoso del desempeño humano, incluso más que las habilidades reales o la inteligencia.

La autoeficacia se construye a través de 4 fuentes, en orden de impacto:
1. **Mastery experiences** — haber logrado la tarea antes, aunque sea a escala pequeña.
2. **Vicarious learning** — ver a alguien similar a mí lograrlo ("si él puede, yo también").
3. **Persuasión verbal** — que alguien en quien confío me diga que puedo hacerlo.
4. **Estado fisiológico** — interpretar los nervios como activación positiva, no como miedo.

La buena noticia: la autoeficacia es *maleable* y se puede desarrollar deliberadamente.

**Lo que dice la ciencia:**
• Las personas con alta autoeficacia persisten más ante obstáculos y se recuperan más rápido del fracaso.
• Los líderes que construyen autoeficacia en su equipo obtienen 28% más productividad (Stajkovic & Luthans, 1998).
• El feedback positivo específico ("lograste X porque hiciste Y") construye autoeficacia; el elogio vago ("eres brillante") no.

**Cómo aplicarlo:**
• Asigna tareas graduales que permitan a la persona —y a ti mismo— acumular pequeñas victorias.
• Comparte tus propios errores pasados y cómo los superaste: eres un modelo para otros.
• Cuando alguien dude de sí mismo, recuérdales evidencia específica de logros pasados.`,
  },

  {
    id: 'pink_motivation',
    value: 'responsabilidad',
    triggers: ['pink', 'drive', 'motivacion 3.0', 'zanahoria y garrote', 'recompensas',
               'autonomia mastery purpose', 'proposito', 'excelencia profesional',
               'motivacion externa no funciona', 'bonos no motivan'],
    title: '🚀 Drive: La Motivación 3.0',
    authors: 'Daniel H. Pink (2009) — basado en décadas de investigación en psicología y economía conductual',
    response: `Daniel Pink sintetizó décadas de investigación para mostrar que el modelo tradicional de motivación (recompensas y castigos) es ineficaz para el trabajo creativo y cognitivo del siglo XXI. Para tareas que requieren pensamiento, creatividad y solución de problemas, las recompensas externas *reducen* la motivación intrínseca.

La Motivación 3.0 se basa en tres elementos:
1. **Autonomía** — la necesidad de dirigir nuestra propia vida. No solo en el trabajo, sino en tiempo, técnica, equipo y tarea.
2. **Maestría** — el deseo de mejorar en algo que importa. El flujo ocurre cuando la habilidad y el desafío están en equilibrio.
3. **Propósito** — hacer algo en servicio de algo más grande que uno mismo. Las organizaciones con "propósito trascendente" retienen mejor y generan más innovación.

**Lo que dice la ciencia:**
• En 51 estudios, las recompensas contingentes ("si haces X te doy Y") redujeron la motivación intrínseca en tareas interesantes.
• Las empresas con alta autonomía tienen 4x más innovación y 2x menos rotación.
• El "propósito trascendente" —conectar el trabajo diario con un impacto mayor— duplica el engagement.

**Cómo aplicarlo:**
• Identifica en qué parte de tu trabajo tienes más autonomía y expándela.
• Dedica tiempo deliberado a mejorar en algo que realmente te importe —no solo a cumplir tareas.
• Conecta tu trabajo diario con el impacto en los pacientes o la organización que sirves.`,
  },

  // ══════════════════════════════════════════════════════
  // INNOVACIÓN Y CREATIVIDAD
  // ══════════════════════════════════════════════════════
  {
    id: 'amabile_creativity',
    value: 'innovacion',
    triggers: ['amabile', 'creatividad', 'innovacion', 'componentes creatividad', 'ser creativo',
               'como innovar', 'pensamiento creativo', 'generar ideas', 'ideas nuevas',
               'clima para la creatividad', 'progreso y creatividad'],
    title: '🎨 Modelo Componencial de Creatividad',
    authors: 'Teresa Amabile — Harvard Business School (1983–2011)',
    response: `Teresa Amabile lleva más de 30 años estudiando la creatividad en organizaciones y demostró que la creatividad no es un rasgo fijo de personalidad, sino el resultado de tres componentes que interactúan:

1. **Expertise de dominio** — conocimiento profundo del área (técnico, procedimental, intelectual).
2. **Habilidades de pensamiento creativo** — tolerancia a la ambigüedad, curiosidad, capacidad de ver conexiones inesperadas.
3. **Motivación intrínseca por la tarea** — el impulso interno de hacer el trabajo por el trabajo mismo.

El ambiente organizacional puede *amplificar o destruir* los tres. Su investigación del "Principio del Progreso" (2011) encontró que el mayor motivador diario de creatividad es el **progreso en trabajo significativo**, incluso el más pequeño.

**Lo que dice la ciencia:**
• El 76% de los días con mayor creatividad tuvieron algún progreso, aunque fuera mínimo.
• La presión extrema de tiempo destruye la creatividad —los empleados a plazos muy cortos son menos creativos incluso días después.
• La autonomía en *cómo* hacer el trabajo es el factor organizacional más potente para la creatividad.

**Cómo aplicarlo:**
• Al final del día anota un progreso, por pequeño que sea — entrena tu cerebro para verlos.
• Busca conexiones entre tu área y otros dominios que parezcan no relacionados.
• Protege tiempo en tu semana para trabajo profundo sin interrupciones — la creatividad necesita concentración sostenida.`,
  },

  {
    id: 'flow',
    value: 'innovacion',
    triggers: ['flow', 'flujo', 'csikszentmihalyi', 'estado de flujo', 'concentracion maxima',
               'cuando el tiempo vuela', 'zona', 'desafio y habilidad', 'trabajo absorbente',
               'engagement profundo'],
    title: '🌊 Estado de Flow',
    authors: 'Mihaly Csikszentmihalyi — Claremont Graduate University (1990)',
    response: `El estado de "flow" (flujo) es la experiencia de inmersión total en una actividad donde el tiempo parece detenerse, el esfuerzo se vuelve natural y el desempeño alcanza su pico. Csikszentmihalyi lo estudió en artistas, atletas, cirujanos, programadores y trabajadores de fábrica durante 30 años.

Las condiciones para el flow:
1. **Desafío = habilidad**: la tarea debe ser suficientemente difícil para activar esfuerzo máximo, pero alcanzable.
2. **Meta clara**: saber exactamente qué se está tratando de lograr.
3. **Feedback inmediato**: saber en tiempo real cómo vas.
4. **Sin interrupciones**: el flow requiere al menos 20-25 minutos de concentración ininterrumpida.

Cuando el desafío supera la habilidad → ansiedad. Cuando la habilidad supera el desafío → aburrimiento. El flow ocurre en el punto de equilibrio.

**Lo que dice la ciencia:**
• Las personas en estado de flow reportan 5x más productividad (McKinsey, 2014).
• El flow es intrínsecamente motivador — quienes lo experimentan buscan repetirlo.
• Solo el 20% del tiempo de trabajo genera flow — la mayoría lo destruyen las interrupciones.

**Cómo aplicarlo:**
• Bloquea 90 minutos al día de trabajo profundo sin notificaciones ni reuniones.
• Elige tareas que estén en tu "zona de desarrollo proximal" — no demasiado fáciles, no demasiado difíciles.
• Aprende a reconocer cuándo estás en flow y protege ese tiempo activamente.`,
  },

  {
    id: 'innovators_dna',
    value: 'innovacion',
    triggers: ['innovador', 'dna del innovador', 'dyer gregersen christensen', 'habilidades innovacion',
               'como pensar como innovador', 'disruption', 'preguntar', 'observar', 'experimentar',
               'asociar ideas', 'networking cognitivo'],
    title: '🧬 El DNA del Innovador',
    authors: 'Jeff Dyer, Hal Gregersen & Clayton Christensen (2011)',
    response: `Durante 6 años, los autores estudiaron a más de 3,000 ejecutivos y 500 innovadores (Jobs, Bezos, Musk, etc.) para identificar qué habilidades cognitivas diferencian a los innovadores. Encontraron que el 67% de la capacidad innovadora es *aprendible* — no genética.

Los innovadores practican 5 habilidades de descubrimiento:
1. **Asociación** — conectar ideas de dominios completamente distintos.
2. **Cuestionamiento** — desafiar supuestos con "¿por qué?" y "¿por qué no?"
3. **Observación** — estudiar el comportamiento de usuarios, clientes, procesos con curiosidad clínica.
4. **Experimentación** — probar hipótesis rápidamente con prototipos y pilotos.
5. **Networking cognitivo** — buscar perspectivas radicalmente distintas a la propia.

**Lo que dice la ciencia:**
• El 33% de la capacidad innovadora es genética (activación cerebral); el 67% se desarrolla con práctica deliberada.
• Los innovadores hacen el *doble* de preguntas que el ejecutivo promedio.
• La observación directa de problemas reales genera 5x más ideas que la lluvia de ideas en sala.

**Cómo aplicarlo:**
• Esta semana, desafía un supuesto de tu trabajo con la pregunta "¿y si hacemos exactamente lo contrario?"
• Observa a alguien que usa tus reportes o dashboards — ¿qué le cuesta entender?
• Habla con alguien de un departamento totalmente diferente sobre cómo resuelven un problema similar al tuyo.`,
  },

  // ══════════════════════════════════════════════════════
  // MENTALIDAD DE CRECIMIENTO / APRENDIZAJE
  // ══════════════════════════════════════════════════════
  {
    id: 'dweck_mindset',
    value: 'aprendizaje',
    triggers: ['dweck', 'growth mindset', 'mentalidad de crecimiento', 'mentalidad fija',
               'fixed mindset', 'puedo aprender', 'inteligencia fija', 'talento vs esfuerzo',
               'crecer intelectualmente', 'poder aprender cualquier cosa', 'fracaso y aprendizaje'],
    title: '🌱 Mentalidad de Crecimiento',
    authors: 'Carol Dweck — Stanford University (2006)',
    response: `Carol Dweck identificó dos mentalidades fundamentales que determinan cómo las personas responden a los desafíos, fracasos y críticas:

**Mentalidad Fija**: La inteligencia y el talento son rasgos fijos que "tienes o no tienes". Las personas evitan el fracaso porque lo ven como evidencia de sus límites.

**Mentalidad de Crecimiento**: Las habilidades se desarrollan con esfuerzo, estrategias correctas y apoyo de otros. El fracaso es información, no identidad.

En estudios con más de 30 años y en múltiples países, la mentalidad de crecimiento predice:
- Mayor persistencia ante obstáculos
- Mayor disfrute del aprendizaje
- Mejor desempeño a largo plazo
- Mayor resiliencia ante el feedback crítico

La clave: la mentalidad no es un rasgo fijo — es una *práctica* que se cultiva con el lenguaje diario.

**Lo que dice la ciencia:**
• Decir "todavía no" en vez de "no puedo" activa el sistema motivacional de manera diferente en el cerebro.
• Los elogios al esfuerzo ("trabajaste duro") producen más perseverancia que los elogios al talento ("eres inteligente").
• Las organizaciones con cultura de growth mindset tienen 47% más empleados innovadores (Dweck & Murphy, 2018).

**Cómo aplicarlo:**
• Reemplaza "no soy bueno en esto" con "no soy bueno en esto *todavía*".
• Cuando des feedback, enfócate en el proceso y el esfuerzo, no en el resultado final.
• Celebra los intentos valientes que no salieron bien — son los que más enseñan.`,
  },

  {
    id: 'deliberate_practice',
    value: 'aprendizaje',
    triggers: ['ericsson', 'practica deliberada', 'deliberate practice', 'como mejorar rapidamente',
               'experto', '10000 horas', 'malcolm gladwell', 'horas de practica',
               'desarrollar habilidades', 'mejorar habilidades', 'como ser mejor'],
    title: '🎯 Práctica Deliberada',
    authors: 'Anders Ericsson — Florida State University (1993–2016)',
    response: `Anders Ericsson estudió durante 30 años cómo los expertos —violinistas, ajedrecistas, médicos, atletas— llegan a la cima de su campo. Su conclusión refutó el mito del talento innato: la excelencia es el resultado de un tipo específico de práctica, no de horas acumuladas.

La **Práctica Deliberada** tiene 4 características:
1. **Foco en debilidades específicas**, no en lo que ya sabes hacer bien.
2. **Feedback inmediato y preciso** de un experto o sistema objetivo.
3. **Salir de la zona de confort** repetidamente — si es cómodo, no estás mejorando.
4. **Concentración total** — no se puede practicar deliberadamente mientras se hace otra cosa.

El famoso estudio de los 10,000 horas (popularizado por Gladwell) viene de Ericsson, pero él fue claro: no es cualquier práctica — es *práctica deliberada* lo que genera maestría.

**Lo que dice la ciencia:**
• Los expertos de clase mundial no tienen más horas de práctica total, sino más horas de práctica deliberada.
• El descanso es parte de la práctica — la consolidación cognitiva ocurre durmiendo.
• Los mejores en cualquier campo tienen coaches que les dan feedback específico, incluso a nivel élite.

**Cómo aplicarlo:**
• Identifica una habilidad específica (no "mejorar en Power BI" sino "construir modelos DAX complejos").
• Practica esa habilidad específica durante 30-60 minutos de concentración total al día.
• Busca feedback real sobre tu trabajo — no "estuvo bien" sino "esto funciona, esto no y por qué".`,
  },

  {
    id: 'senge_learning_org',
    value: 'aprendizaje',
    triggers: ['senge', 'organizacion que aprende', 'quinta disciplina', 'learning organization',
               'sistemas de aprendizaje', 'aprendizaje organizacional', 'vision compartida',
               'modelos mentales', 'pensamiento sistemico organizacion'],
    title: '🏛️ Organizaciones que Aprenden',
    authors: 'Peter Senge — MIT Sloan (1990) — La Quinta Disciplina',
    response: `Peter Senge propuso que las organizaciones más exitosas del futuro serían aquellas capaces de aprender más rápido que el cambio. Identificó 5 disciplinas que, en conjunto, crean una "organización que aprende":

1. **Dominio Personal** — cada persona committed a su propio crecimiento continuo.
2. **Modelos Mentales** — identificar y cuestionar los supuestos invisibles que guían las decisiones.
3. **Visión Compartida** — una imagen del futuro que genera compromiso genuino, no solo compliance.
4. **Aprendizaje en Equipo** — el diálogo y la indagación colectiva como práctica habitual.
5. **Pensamiento Sistémico** — ver las interconexiones y patrones, no solo eventos aislados.

La "Quinta Disciplina" es el pensamiento sistémico porque integra y amplifica todas las demás.

**Lo que dice la ciencia:**
• Las organizaciones que aprenden tienen 37% menos rotación y 21% más rentabilidad (Bersin, 2019).
• El aprendizaje organizacional falla cuando las personas no tienen seguridad psicológica para compartir errores.
• La brecha entre lo que las personas aprenden y lo que aplican en el trabajo es del 80% sin sistemas de transferencia.

**Cómo aplicarlo:**
• Después de cada proyecto importante, realiza una "retrospectiva de aprendizaje" (qué funcionó, qué no, qué cambiamos).
• Pregúntate regularmente: ¿qué supuesto estoy asumiendo aquí que podría estar equivocado?
• Comparte lo que aprendes con tu equipo — el conocimiento que no se comparte se pierde.`,
  },

  {
    id: 'kolb_learning',
    value: 'aprendizaje',
    triggers: ['kolb', 'ciclo de aprendizaje', 'aprendizaje experiencial', 'estilos de aprendizaje',
               'aprender de la experiencia', 'reflexion sobre experiencia', 'conceptualizacion',
               'aprender haciendo'],
    title: '🔄 Ciclo de Aprendizaje Experiencial',
    authors: 'David Kolb — Case Western Reserve University (1984)',
    response: `Kolb propuso que el aprendizaje más efectivo ocurre a través de un ciclo de cuatro etapas, no simplemente "leyendo" o "haciendo". El modelo explica por qué algunas personas aprenden de la experiencia mientras otras repiten los mismos errores:

1. **Experiencia concreta** — vivir una situación, hacer algo, enfrentarse a un problema real.
2. **Observación reflexiva** — detenerse y reflexionar sobre lo que pasó y cómo se sintió.
3. **Conceptualización abstracta** — extraer principios y conclusiones generalizables.
4. **Experimentación activa** — aplicar las conclusiones en la próxima situación.

Sin reflexión (paso 2), la experiencia no se convierte en aprendizaje. Por eso muchas personas con "20 años de experiencia" tienen 1 año repetido 20 veces.

**Lo que dice la ciencia:**
• El modelo 70-20-10 (Lombardo & Eichinger) valida el ciclo de Kolb: 70% aprendizaje experiencial, 20% aprendizaje social, 10% formal.
• La reflexión deliberada duplica la retención del aprendizaje vs. solo tener la experiencia.
• Los diarios de aprendizaje (15 minutos al día) mejoran el desempeño 23% en 10 días (Di Stefano et al., 2016).

**Cómo aplicarlo:**
• Al terminar cualquier proyecto o reunión importante, anota: ¿qué pasó? ¿Cómo me sentí? ¿Qué concluyo? ¿Qué haré diferente?
• Busca activamente oportunidades de hacer cosas nuevas — no solo mejorar lo que ya sabes.
• Comparte reflexiones con tu equipo — el aprendizaje individual se multiplica cuando se socializa.`,
  },

  // ══════════════════════════════════════════════════════
  // FLEXIBILIDAD Y CAMBIO
  // ══════════════════════════════════════════════════════
  {
    id: 'kotter_change',
    value: 'flexibilidad',
    triggers: ['kotter', 'gestion del cambio', 'change management', 'resistencia al cambio',
               'como manejar el cambio', 'liderar el cambio', 'ocho pasos', 'transformacion organizacional',
               'por que falla el cambio', 'cambio organizacional'],
    title: '🔀 Gestión del Cambio — 8 Pasos',
    authors: 'John Kotter — Harvard Business School (1996, 2014)',
    response: `Kotter estudió 100 organizaciones que intentaron transformaciones mayores y encontró que el 70% fracasó. Identificó 8 errores típicos y los convirtió en un modelo de 8 pasos para liderar el cambio exitosamente:

1. **Crear urgencia** — ¿Por qué necesitamos cambiar ahora?
2. **Construir una coalición guía** — los cambios no los hacen individuos, los hacen grupos.
3. **Crear una visión del cambio** — clara, simple, memorable.
4. **Comunicar la visión** — repetirla 10x más de lo que crees necesario.
5. **Empoderar la acción** — eliminar obstáculos y dar autoridad real.
6. **Generar victorias tempranas** — pequeños éxitos visibles que mantienen el momentum.
7. **Consolidar ganancias** — no declarar victoria demasiado pronto.
8. **Anclar el cambio en la cultura** — el cambio es permanente solo cuando es "cómo hacemos las cosas aquí".

**Lo que dice la ciencia:**
• El 70% de los cambios organizacionales fracasan — principalmente por falta de urgencia y comunicación insuficiente.
• La resistencia al cambio no es irracionalidad — es protección de identidad y competencia percibida.
• Los líderes que comunican la visión del cambio con emoción y datos generan 4x más adopción.

**Cómo aplicarlo:**
• Ante cualquier cambio, comunica primero el *por qué* antes del *qué* y el *cómo*.
• Identifica y celebra las primeras personas que adopten el cambio — se vuelven modelos.
• La resistencia es información — escúchala antes de combatirla.`,
  },

  {
    id: 'heifetz_adaptive',
    value: 'flexibilidad',
    triggers: ['heifetz', 'liderazgo adaptativo', 'adaptive leadership', 'problema tecnico',
               'problema adaptativo', 'wicked problems', 'problemas sin solucion clara',
               'cambio sin respuesta obvia', 'cuando no hay manual'],
    title: '🧩 Liderazgo Adaptativo',
    authors: 'Ronald Heifetz & Marty Linsky — Harvard Kennedy School (1994, 2002)',
    response: `Heifetz distinguió dos tipos de problemas que los líderes enfrentan, y esta distinción es crítica porque el error más común es aplicar soluciones técnicas a problemas adaptativos:

**Problemas Técnicos**: tienen respuesta conocida, expertos pueden resolverlos, el sistema actual puede implementar la solución. *Ejemplo: implementar un nuevo software.*

**Problemas Adaptativos**: requieren que las personas cambien sus creencias, prioridades o comportamientos. No hay experto con la respuesta. La solución emerge del proceso colectivo. *Ejemplo: cambiar la cultura del equipo.*

Los líderes que tratan los problemas adaptativos como si fueran técnicos generan frustración, resistencia y fracaso. El liderazgo adaptativo requiere "salir al balcón" — obtener perspectiva del sistema mientras simultáneamente participas en él.

**Lo que dice la ciencia:**
• La mayoría de los desafíos organizacionales críticos son adaptativos, no técnicos.
• El liderazgo adaptativo es inherentemente incómodo porque implica pérdida para alguien.
• "Hacer preguntas en vez de dar respuestas" es la habilidad central del líder adaptativo.

**Cómo aplicarlo:**
• Cuando un problema persiste a pesar de soluciones lógicas, pregúntate: ¿requiere este problema un cambio de comportamiento, no solo una nueva herramienta?
• Practica "subir al balcón": pausa en medio de una situación difícil y pregunta ¿qué patrón estoy viendo?
• Aprende a formular preguntas poderosas en vez de ofrecer soluciones inmediatas.`,
  },

  {
    id: 'seligman_resilience',
    value: 'flexibilidad',
    triggers: ['resiliencia', 'seligman', 'perma', 'bienestar', 'optimismo aprendido',
               'recuperarse', 'adversidad', 'bounce back', 'psicologia positiva',
               'fortalezas', 'como ser mas resiliente'],
    title: '🌟 Resiliencia y Psicología Positiva (PERMA)',
    authors: 'Martin Seligman — University of Pennsylvania (2011)',
    response: `Martin Seligman, padre de la Psicología Positiva, identificó 5 elementos que conforman el bienestar y la resiliencia psicológica (modelo PERMA):

1. **Positive Emotions** — experimentar emociones positivas con regularidad, no solo evitar las negativas.
2. **Engagement** — estar completamente absorto en actividades significativas (flow).
3. **Relationships** — conexiones de calidad con otros — el factor protector más potente.
4. **Meaning** — sentir que perteneces y sirves a algo más grande que tú mismo.
5. **Achievement** — lograr metas por el valor del logro mismo.

La resiliencia no es la ausencia de dolor o dificultad — es la capacidad de adaptarse y crecer a través de ella. El "crecimiento post-traumático" (Tedeschi & Calhoun) muestra que muchas personas emergen más fuertes de las crisis severas.

**Lo que dice la ciencia:**
• El optimismo aprendido (no el ingenuo) reduce el burnout un 27% y mejora el desempeño en roles de presión.
• Las relaciones de alta calidad son el predictor más poderoso de resiliencia en adultos (Harvard Study of Adult Development, 80 años).
• Identificar y usar las fortalezas de carácter (VIA) todos los días aumenta el bienestar en 2 semanas (Seligman, 2005).

**Cómo aplicarlo:**
• Identifica tus 3-5 fortalezas de carácter principales en viacharacter.org (gratis).
• Al final de cada día anota 3 cosas que salieron bien, por pequeñas que sean.
• Invierte en tus relaciones de trabajo como si fueran inversiones de alto retorno — lo son.`,
  },

  // ══════════════════════════════════════════════════════
  // INTEGRIDAD Y CONFIANZA
  // ══════════════════════════════════════════════════════
  {
    id: 'covey_trust',
    value: 'integridad',
    triggers: ['covey', 'confianza', 'velocidad de la confianza', 'speed of trust',
               'integridad organizacional', 'trust', 'cumplir promesas',
               'como construir confianza', 'credibilidad', 'impuesto de desconfianza'],
    title: '🔑 La Velocidad de la Confianza',
    authors: 'Stephen M.R. Covey (2006) — basado en investigación con Fortune 500',
    response: `Covey demostró con datos que la confianza no es solo un valor ético — es una variable económica medible. La desconfianza actúa como un *impuesto* que ralentiza todo y aumenta los costos. La confianza actúa como un *dividendo* que acelera todo y reduce los costos.

La confianza tiene dos dimensiones:
1. **Carácter** — integridad (hacer lo que dices) + intención (motivos genuinos hacia los demás).
2. **Competencia** — capacidades (habilidades) + resultados (historial de entregas).

Las 4 "Cores" de la credibilidad personal:
- Integridad: ¿eres congruente entre lo que dices y lo que haces?
- Intención: ¿tus motivos son transparentes y orientados al bien común?
- Capacidades: ¿tienes las habilidades relevantes para lo que prometes?
- Resultados: ¿tienes historial de entregar lo que dices?

**Lo que dice la ciencia:**
• Las empresas con alta confianza tienen 286% más retorno para accionistas que las de baja confianza (Watson Wyatt).
• El 40% del tiempo de managers en empresas de baja confianza se pierde en políticas, revisiones y burocracia defensiva.
• La confianza rota puede reconstruirse, pero requiere tiempo y consistencia — no palabras.

**Cómo aplicarlo:**
• Haz solo promesas que puedas cumplir — mejor prometer menos y entregar más.
• Cuando cometas un error, adéjatelo: "me equivoqué, aquí está lo que haré diferente."
• Comunica con transparencia incluso cuando las noticias son difíciles — el silencio crea desconfianza.`,
  },

  {
    id: 'ethical_decision',
    value: 'integridad',
    triggers: ['etica', 'decision etica', 'dilema moral', 'integridad personal', 'honestidad',
               'rest', 'bazerman', 'puntos ciegos eticos', 'comportamiento no etico',
               'hipaa', 'privacidad datos', 'compliance etico'],
    title: '⚖️ Toma de Decisiones Éticas',
    authors: 'James Rest (1986) & Max Bazerman — Harvard Business School (2011)',
    response: `Rest identificó que el comportamiento ético requiere 4 procesos que deben activarse en secuencia. El fallo en cualquiera produce comportamiento no ético, incluso en personas con buenos valores:

1. **Sensibilidad moral** — reconocer que una situación tiene dimensiones éticas.
2. **Razonamiento moral** — evaluar qué sería lo correcto.
3. **Motivación moral** — priorizar los valores éticos sobre los intereses personales.
4. **Carácter moral** — tener la valentía de ejecutar la decisión ética.

Bazerman añadió el concepto de "Blind Spots" éticos: la mayoría de las fallas éticas no son deliberadas — son el resultado de sesgos cognitivos que hacen que la gente no *vea* el problema ético. Los más comunes: racionalización ("todos lo hacen"), pensamiento a corto plazo, presión de grupo y conflictos de interés no reconocidos.

**Lo que dice la ciencia:**
• Las personas sobreestiman consistentemente su comportamiento ético propio vs. lo que realmente harían bajo presión.
• El contexto situacional predice el comportamiento ético tanto como el carácter personal (Bazerman & Tenbrunsel, 2011).
• Los marcos de compliance basados solo en reglas son menos efectivos que los basados en valores + conversaciones abiertas.

**Cómo aplicarlo:**
• Antes de tomar una decisión difícil, pregúntate: "¿estaría cómodo si mi líder viera exactamente lo que estoy haciendo?"
• En el manejo de datos de salud (HIPAA): la pregunta no es "¿está permitido?" sino "¿es necesario y proporcional?"
• Crea el hábito de pausa ante decisiones rápidas — los errores éticos casi siempre ocurren en la prisa.`,
  },

  // ══════════════════════════════════════════════════════
  // COMUNICACIÓN Y TRANSPARENCIA
  // ══════════════════════════════════════════════════════
  {
    id: 'difficult_conversations',
    value: 'transparencia',
    triggers: ['conversaciones dificiles', 'stone patton heen', 'como hablar cuando es dificil',
               'dar malas noticias', 'confrontar', 'feedback dificil', 'conflict resolution',
               'como decir lo que pienso', 'conversacion incómoda', 'hablar sin herir'],
    title: '💬 Conversaciones Difíciles',
    authors: 'Douglas Stone, Bruce Patton & Sheila Heen — Harvard Negotiation Project (1999)',
    response: `Los autores identificaron que toda conversación difícil es en realidad tres conversaciones simultáneas que hay que manejar:

1. **La conversación del "qué pasó"** — sobre los hechos, intenciones y contribuciones. Aquí viven la mayoría de los malentendidos: asumimos intenciones negativas cuando en realidad no las conocemos.

2. **La conversación de sentimientos** — lo que cada persona siente al respecto. Ignorarla no la elimina — la convierte en una bomba de tiempo.

3. **La conversación de identidad** — lo que la conversación dice sobre quién soy yo. Las personas se ponen defensivas cuando sienten que su identidad está siendo atacada.

El error más común: tratar de "ganar" la conversación en vez de explorar perspectivas y construir entendimiento mutuo.

**Lo que dice la ciencia:**
• Las organizaciones donde las personas evitan las conversaciones difíciles tienen 2.5x más conflictos no resueltos acumulados.
• La empatía cognitiva (entender la perspectiva del otro) reduce la defensividad 60% incluso cuando el mensaje es crítico.
• Separar la intención del impacto ("no era mi intención, pero el impacto fue...") desescalada la mayoría de los conflictos.

**Cómo aplicarlo:**
• Empieza conversaciones difíciles con "noto que..." en vez de "tú siempre..." — describe hechos, no juicios.
• Antes de hablar, pregúntate: ¿cuál es mi objetivo real en esta conversación? ¿Entender o tener razón?
• Después de expresar tu perspectiva, pregunta genuinamente: "¿Cómo lo ves tú?"`,
  },

  {
    id: 'feedback_science',
    value: 'transparencia',
    triggers: ['retroalimentacion', 'feedback efectivo', 'como dar feedback', 'como recibir feedback',
               'critica constructiva', 'feedback positivo', 'reconocimiento', 'feedback 360',
               'como mejorar con feedback'],
    title: '📣 Retroalimentación Efectiva — Lo que dice la ciencia',
    authors: 'Heen & Stone (2014) · Kluger & DeNisi (1996) · Gottman (1994)',
    response: `La investigación sobre retroalimentación tiene una paradoja: el feedback es el mecanismo más poderoso de desarrollo, pero también uno de los que más frecuentemente falla. Una revisión de 131 estudios (Kluger & DeNisi, 1996) encontró que en el 38% de los casos, el feedback *empeoró* el desempeño.

¿Por qué falla el feedback?
- Se enfoca en la *persona* en vez de en el *comportamiento* ("eres desorganizado" vs. "este reporte llegó tarde").
- Se da sin contexto ni ejemplo específico.
- La persona no se siente segura para recibirlo sin ponerse a la defensiva.
- Se mezcla feedback evaluativo (juzgar) con feedback de desarrollo (aprender).

**Lo que dice la ciencia:**
• El ratio de Gottman (5:1 positivo:negativo) aplica al trabajo: equipos de alto desempeño tienen 5.6 interacciones positivas por cada negativa.
• El feedback específico sobre comportamientos ("cuando hiciste X, el efecto fue Y") es 3x más efectivo que el genérico.
• Pedir permiso antes de dar feedback ("¿puedo compartir algo que noté?") aumenta la receptividad significativamente.

**Cómo aplicarlo:**
• Usa el formato: Situación → Comportamiento → Impacto (SBI). "En la reunión de ayer [S], cuando interrumpiste [B], Marta dejó de participar el resto del tiempo [I]."
• Da feedback inmediato o con poco tiempo de retraso — el feedback de hace 6 meses no sirve para aprender.
• Practica recibir feedback sin responder de inmediato — escucha, agradece, reflexiona.`,
  },

  {
    id: 'data_storytelling',
    value: 'transparencia',
    triggers: ['storytelling', 'narrativa con datos', 'comunicar datos', 'presentar hallazgos',
               'datos a decision', 'visualizacion efectiva', 'como presentar analisis',
               'tableau', 'power bi comunicacion', 'ejecutivos y datos'],
    title: '📊 Data Storytelling',
    authors: 'Cole Nussbaumer Knaflic (2015) · Nancy Duarte (2010)',
    response: `El data storytelling es la habilidad de combinar datos, narrativa y visualización para influenciar y generar acción. Es la competencia que más diferencia a un analista de datos de un analista estratégico.

Los tres componentes del data storytelling:
1. **Datos** — la evidencia que fundamenta el argumento.
2. **Narrativa** — el hilo conductor que da contexto y significado a los datos.
3. **Visualizaciones** — representaciones que hacen los patrones inmediatamente visibles.

El error más común: presentar *todos* los datos en vez de los datos que responden *la pregunta que importa* para la audiencia.

El modelo de Duarte para presentaciones de alto impacto:
- Empieza con "lo que es" (realidad actual)
- Describe "lo que podría ser" (visión del futuro)
- Alterna entre ambos para crear tensión narrativa
- Termina con una llamada a la acción clara

**Lo que dice la ciencia:**
• Las historias son 22x más memorables que los hechos solos (Bruner, 1986).
• Los ejecutivos recuerdan 63% de la información presentada en formato de historia vs. 5% de estadísticas.
• Reducir el número de gráficos en una presentación (no aumentarlo) mejora la comprensión y la persuasión.

**Cómo aplicarlo:**
• Antes de crear un dashboard, escribe en una oración: "Esta visualización le muestra a [audiencia] que [insight] para que pueda [decisión]."
• Usa el principio "una sola idea por slide/visual" — la densidad de información destruye la comunicación.
• Practica explicar tu análisis en 2 minutos a alguien sin contexto técnico.`,
  },

  {
    id: 'gibb_communication',
    value: 'transparencia',
    triggers: ['gibb', 'comunicacion defensiva', 'clima defensivo', 'comunicacion de apoyo',
               'como crear clima de apertura', 'ambiente de comunicacion', 'escucha activa',
               'empatia comunicacion', 'clima organizacional comunicacion'],
    title: '🌡️ Clima de Comunicación: Defensivo vs. Apoyo',
    authors: 'Jack Gibb — Journal of Communication (1961)',
    response: `Gibb identificó 6 pares de comportamientos comunicativos que crean climates radicalmente diferentes. Un clima defensivo hace que las personas se cierren, se protejan y dejen de compartir información crítica. Un clima de apoyo hace exactamente lo contrario.

| Clima Defensivo | Clima de Apoyo |
|---|---|
| Evaluación ("estás equivocado") | Descripción ("noté que...") |
| Control ("tienes que hacer X") | Orientación a problemas ("¿cómo podríamos...?") |
| Estrategia (agenda oculta) | Espontaneidad (transparencia) |
| Neutralidad (indiferencia) | Empatía (importa lo que sientes) |
| Superioridad ("yo sé más") | Igualdad (todos tenemos perspectivas valiosas) |
| Certeza dogmática | Provisionalidad ("podría ser que...") |

**Lo que dice la ciencia:**
• El clima comunicativo se establece en los primeros 5 minutos de una interacción.
• Los líderes que usan lenguaje descriptivo en vez de evaluativo reciben 3x más información honesta de su equipo.
• La comunicación defensiva es contagiosa — una persona en modo defensivo activa respuestas defensivas en otros.

**Cómo aplicarlo:**
• Reemplaza "deberías" y "tienes que" con "¿qué piensas de...?" y "¿cómo te parece...?"
• Cuando recibas información difícil, responde primero con una pregunta de clarificación, no con una defensa.
• Practica decir "no lo había pensado así" — señala apertura genuina al equipo.`,
  },

  // ══════════════════════════════════════════════════════
  // ENGAGEMENT Y CULTURA
  // ══════════════════════════════════════════════════════
  {
    id: 'gallup_engagement',
    value: 'general',
    triggers: ['gallup', 'engagement', 'compromiso laboral', 'empleados comprometidos',
               'que motiva a los empleados', 'disengaged', 'desconectados', 'q12',
               'gerentes y engagement', 'porque se van los empleados'],
    title: '📈 Engagement de Empleados — Gallup',
    authors: 'Gallup Research (2023) — basado en 2.7 millones de empleados en 96 países',
    response: `Gallup lleva 30 años midiendo el engagement de empleados y sus resultados son consistentes y alarmantes: globalmente, solo el 23% de los empleados están activamente comprometidos con su trabajo. El 59% están "quietly quitting" (haciendo lo mínimo) y el 18% están activamente desconectados.

El instrumento Q12 de Gallup mide 12 necesidades que predicen el engagement. Las más críticas:
- ¿Sé exactamente qué se espera de mí en el trabajo?
- ¿Tengo los materiales y herramientas para hacer mi trabajo bien?
- ¿Alguien en el trabajo se preocupa por mí como persona?
- ¿En los últimos 7 días, alguien reconoció mi buen trabajo?
- ¿Mi supervisor o alguien en el trabajo me impulsa a crecer?

**Lo que dice la ciencia:**
• Los equipos de alto engagement tienen 23% más rentabilidad, 18% más ventas y 81% menos ausentismo.
• El gerente directo explica el 70% de la varianza en el engagement de su equipo.
• El reconocimiento frecuente y específico es la acción más costo-efectiva para aumentar el engagement.

**Cómo aplicarlo:**
• Asegúrate de que cada persona de tu equipo puede responder claramente qué se espera de ella.
• Da reconocimiento específico cada semana — no cuando hay un logro grande, sino por el trabajo consistente.
• Pregunta a tu equipo: "¿qué necesitas de mí para hacer tu mejor trabajo?" y responde a lo que digan.`,
  },

  {
    id: 'schein_culture',
    value: 'general',
    triggers: ['cultura organizacional', 'schein', 'cultura empresarial', 'cambiar cultura',
               'valores organizacionales', 'como se forma la cultura', 'cultura y liderazgo',
               'artefactos', 'supuestos', 'normas organizacionales'],
    title: '🏛️ Cultura Organizacional',
    authors: 'Edgar Schein — MIT Sloan School of Management (1985, 2010)',
    response: `Edgar Schein definió la cultura organizacional como el patrón de supuestos básicos compartidos que un grupo ha aprendido como solución a sus problemas. Es el sistema invisible que determina qué se hace, qué se dice y qué se piensa en una organización.

Schein propone 3 niveles de cultura, de más visible a menos:

1. **Artefactos** (visible): logos, decoración, rituales, cómo se visten, cómo son las reuniones.
2. **Valores declarados** (semi-visible): lo que la organización dice que valora — los valores en la pared.
3. **Supuestos básicos** (invisible): creencias inconscientes sobre la naturaleza humana, el trabajo y las relaciones. *Estas son la cultura real.*

La brecha entre los valores declarados (nivel 2) y los supuestos básicos reales (nivel 3) es la fuente de cinismo organizacional: cuando la gente ve que "lo que se predica" no coincide con "lo que se premia."

**Lo que dice la ciencia:**
• Los líderes son los principales arquitectos de la cultura — lo que miden, premian y toleran define la cultura real.
• Cambiar la cultura lleva 3-7 años y requiere cambios en comportamientos del liderazgo, no solo en comunicaciones.
• La cultura más difícil de cambiar es aquella donde los supuestos básicos son nunca cuestionados.

**Cómo aplicarlo:**
• Observa qué comportamientos se premian realmente en tu organización — eso es la cultura real.
• Cuando los valores declarados y los comportamientos premiados divergen, nombra la brecha con respeto.
• La cultura se cambia con microbehaviors consistentes, no con declaraciones o eventos.`,
  },

  {
    id: 'transformational_leadership',
    value: 'general',
    triggers: ['liderazgo transformacional', 'bass', 'avolio', 'inspirar', 'vision del lider',
               'lider que inspira', 'tipo de liderazgo', 'como liderar', 'estilos de liderazgo',
               'liderazgo transaccional', 'diferencia liderazgo'],
    title: '⚡ Liderazgo Transformacional',
    authors: 'Bernard Bass & Bruce Avolio — University of Nebraska (1994)',
    response: `Bass y Avolio distinguieron entre liderazgo transaccional (intercambio: cumples metas, te recompenso) y liderazgo transformacional (inspiras a las personas a superar sus propios intereses por el bien del equipo y la organización).

El liderazgo transformacional tiene 4 dimensiones ("Las 4 Is"):
1. **Influencia idealizada** — el líder es un modelo a seguir moral y competente.
2. **Motivación inspiracional** — comunica una visión emocionante y tiene altas expectativas.
3. **Estimulación intelectual** — desafía a otros a pensar de manera nueva y creativa.
4. **Consideración individualizada** — reconoce las necesidades únicas de cada persona y actúa como coach.

El liderazgo transaccional no es malo — es necesario para la operación. Pero los líderes que solo son transaccionales limitan el potencial de su equipo.

**Lo que dice la ciencia:**
• El liderazgo transformacional es el estilo más validado en la literatura organizacional, con +30 años de investigación en 130 países.
• Los equipos con líderes transformacionales tienen 40% más identificación organizacional y 35% más disposición a esfuerzo extra.
• La consideración individualizada es la dimensión con mayor impacto en retención de talento clave.

**Cómo aplicarlo:**
• Aprende las fortalezas, metas y necesidades de cada miembro de tu equipo — trátalos como individuos, no como roles.
• Comparte tu visión del futuro con regularidad y conecta el trabajo diario con esa visión.
• Cuando alguien proponga algo que no te convence, explora la idea antes de descartarla.`,
  },

  // ══════════════════════════════════════════════════════
  // PREGUNTAS GENERALES Y DE CONTEXTO
  // ══════════════════════════════════════════════════════
  {
    id: 'what_are_values',
    value: 'general',
    triggers: ['que son valores', 'para que sirven valores', 'valores organizacionales para que',
               'importancia de los valores', 'por que importan los valores', 'valores en el trabajo',
               'como vivir los valores', 'valores y comportamiento'],
    title: '🧭 ¿Qué son los Valores Organizacionales y por qué importan?',
    authors: 'Schwartz (1992) · Collins & Porras (1994) · Lencioni (2002)',
    response: `Los valores organizacionales son principios fundamentales que guían las decisiones y comportamientos de una organización. Pero hay una distinción crítica que hace James Collins: la mayoría de las empresas tienen valores *aspiracionales* (lo que quisieran ser) — los más poderosos son los valores *centrales* (lo que genuinamente rigen las decisiones difíciles).

Shalom Schwartz identificó que los valores funcionan como prioridades motivacionales: cuando dos valores entran en conflicto (ej. innovación vs. cumplimiento), la jerarquía de valores determina cuál gana.

En las organizaciones de Alto Desempeño (HPO, De Waal), los valores no son palabras en una pared — son criterios de selección, evaluación, promoción y reconocimiento. Un valor que no influye en las decisiones de personal no es un valor, es un adorno.

**Lo que dice la ciencia:**
• Las empresas con valores centrales auténticos superan en desempeño financiero 6x a las que no los tienen (Collins & Porras, Built to Last).
• Los empleados que perciben alineación entre sus valores personales y los organizacionales tienen 72% más engagement (Gallup).
• La "brecha de valores" — discrepancia entre valores declarados y comportamientos reales — es el predictor más fuerte de rotación voluntaria de talento clave.

**Cómo aplicarlo:**
• Pregúntate: ¿cuándo tomé la última decisión difícil basada en estos valores?
• Identifica cuál de los valores te cuesta más demostrar — ese es tu área de mayor crecimiento.
• Los valores se viven en las conversaciones pequeñas, no solo en los momentos heroicos.`,
  },

  {
    id: 'valores_pns',
    value: 'general',
    triggers: ['valores de pns', 'valores de la empresa', 'nuestros valores', 'los 7 valores',
               'valores pns pr', 'valores del departamento', 'que valores tenemos',
               'trabajo equipo responsabilidad innovacion flexibilidad aprendizaje integridad transparencia'],
    title: '🏢 Los 7 Valores de PNS-PR',
    authors: 'Plan de Sucesión BI — Provider Network Solutions Puerto Rico (2025)',
    response: `Los 7 valores centrales del Departamento de Business Intelligence de PNS-PR, alineados al marco HPO de De Waal:

1. **🤝 Trabajo en Equipo y Colaboración** — Colaborar efectivamente, compartir conocimiento sin competir, construir inclusión.

2. **✅ Responsabilidad** — Asumir ownership de acciones y resultados, entregar con excelencia de forma autónoma.

3. **💡 Innovación y Creatividad** — Desafiar el status quo, adoptar IA y tecnologías emergentes, ver el cambio como oportunidad.

4. **🔄 Flexibilidad y Adaptabilidad** — Responder ágilmente, mantener productividad bajo presión, guiar en transiciones.

5. **📚 Aprendizaje Continuo** — Invertir en desarrollo personal, buscar feedback, adoptar IA como competencia estratégica.

6. **⚖️ Integridad y Honestidad** — Actuar con principios morales, transparencia radical, proteger la integridad de los datos (HIPAA).

7. **📢 Transparencia y Comunicación** — Comunicar claro y oportuno, escuchar activamente, practicar data storytelling ejecutivo.

Puedes hacer clic en cualquier valor en esta página para ver cómo manejarlo cuando estás comprometido con él. También puedes preguntarme sobre cualquiera de ellos en detalle.`,
  },

  {
    id: 'hpo_framework',
    value: 'general',
    triggers: ['hpo', 'organizacion alto desempeno', 'high performance organization', 'de waal',
               'cinco pilares hpo', 'que es hpo', 'ser hpo', 'alto desempeno organizacional'],
    title: '🏆 Organizaciones de Alto Desempeño (HPO)',
    authors: 'André de Waal — HPO Center, Maastricht School of Management (2010)',
    response: `André de Waal analizó 1,475 organizaciones en 50 países durante 10 años para identificar qué las hace consistentemente superiores. Encontró 35 características que diferencian a las HPO, agrupadas en 5 pilares:

1. **Calidad del liderazgo** — Líderes íntegros, que toman decisiones rápidas, están orientados a resultados y desarrollan a otros.

2. **Apertura y orientación a la acción** — Diálogo abierto, toma de decisiones basada en datos, tolerancia al error como aprendizaje.

3. **Enfoque en el largo plazo** — Inversión continua en personas para necesidades a 2-5 años; objetivos de largo plazo sobre ganancias cortoplacistas.

4. **Mejora continua y renovación** — Cuestionar el status quo constantemente; adopción de IA y tecnología como ventaja estratégica.

5. **Calidad del talento** — Reclutamiento, desarrollo y retención de personas excepcionales alineadas con los valores.

**Lo que dice la ciencia:**
• Las HPO superan a sus pares en 10% en rentabilidad, satisfacción de clientes y satisfacción de empleados de manera sostenida.
• El factor más diferenciador es la *calidad del liderazgo directo* — no la estrategia ni la tecnología.
• Las organizaciones HPO tienen 2.5x más capacidad de recuperación ante crisis.

**Cómo aplicarlo:**
• Pregúntate: ¿tomo mis decisiones basado en datos o en intuición sin verificar?
• ¿Cómo de abierto es el diálogo en tu equipo — pueden las personas señalar problemas sin consecuencias?`,
  },

  {
    id: 'ai_values',
    value: 'aprendizaje',
    triggers: ['inteligencia artificial', 'ia', 'ai en el trabajo', 'copilot', 'chatgpt trabajo',
               'herramientas ia', 'como usar ia', 'ia y valores', 'etica ia', 'ia responsable',
               'competencia digital', 'futuro del trabajo'],
    title: '🤖 IA, Valores y el Futuro del Trabajo',
    authors: 'MIT Work of the Future (2023) · World Economic Forum (2023) · Dafoe (2018)',
    response: `La integración de la IA en el trabajo plantea preguntas que van más allá de la tecnología — son preguntas sobre valores, ética y qué significa ser un profesional competente en 2025.

El World Economic Forum (2023) identifica que el 44% de las competencias laborales cambiarán en los próximos 5 años. Las habilidades más resistentes a la automatización no son técnicas — son las humanas: pensamiento crítico, comunicación compleja, creatividad y gestión de relaciones.

**Los 3 roles de IA en el trabajo (aplicado a BI):**
- **AI User**: usa IA para acelerar tareas (Power BI Copilot, ChatGPT para código, análisis de texto).
- **AI Integrator**: diseña flujos donde la IA amplifica la capacidad del equipo; decide *cuándo* y *cómo* usar IA con criterio.
- **AI Strategist**: define visión de adopción de IA, governance de datos, ética y ROI organizacional.

**Lo que dice la ciencia:**
• Los trabajadores que usan IA adecuadamente producen 40% más que sus pares sin IA (Nielsen, 2023).
• La mayor barrera para la adopción de IA no es técnica — es cultural: miedo a ser reemplazado vs. oportunidad de ser amplificado.
• La IA amplifica tanto las fortalezas como las debilidades — un analista con malos hábitos de datos produce errores más rápido con IA.

**Cómo aplicarlo:**
• Identifica 3 tareas repetitivas en tu semana que la IA podría acelerar o automatizar.
• Usa IA como "borrador inteligente" — siempre revisa y añade tu criterio profesional.
• Cuando uses IA con datos de pacientes, aplica los mismos principios HIPAA que con cualquier otra herramienta.`,
  },

  {
    id: 'wellbeing_work',
    value: 'general',
    triggers: ['bienestar', 'burnout', 'agotamiento', 'estres laboral', 'salud mental trabajo',
               'equilibrio trabajo vida', 'work life balance', 'descanso', 'fatiga',
               'como evitar burnout', 'sostenibilidad laboral'],
    title: '🌿 Bienestar y Sostenibilidad en el Trabajo',
    authors: 'Maslach & Leiter (1997) · Seligman (2011) · WHO (2019)',
    response: `La OMS reconoció el burnout como fenómeno ocupacional en 2019. Christina Maslach lo define como el resultado de estrés crónico no manejado en el trabajo, con tres dimensiones: agotamiento, cinismo/despersonalización y sensación de ineficacia.

Las 6 causas de burnout identificadas por Maslach:
1. **Carga de trabajo** excesiva o mal distribuida.
2. **Falta de control** sobre el propio trabajo.
3. **Recompensa insuficiente** (económica, social o intrínseca).
4. **Comunidad fragmentada** — falta de relaciones de apoyo.
5. **Ausencia de equidad** — percepción de injusticia.
6. **Conflicto de valores** — hacer cosas que van contra los propios principios.

La resiliencia personal es necesaria pero no suficiente: el burnout es principalmente un problema organizacional, no individual.

**Lo que dice la ciencia:**
• El burnout cuesta a las empresas $125-190 billones anuales en EEUU en costos de salud (Harvard Business Review).
• El presenteeismo (estar físicamente pero mentalmente ausente) cuesta 2.5x más que el ausentismo.
• Los empleados con alta autonomía y buenas relaciones de trabajo tienen 43% menos riesgo de burnout.

**Cómo aplicarlo:**
• Si reconoces señales de burnout (cinismo, agotamiento, sensación de no importar), habla con alguien — es una señal de alerta, no de debilidad.
• Identifica cuál de las 6 causas de Maslach está más activa en tu situación.
• El descanso no es lo opuesto al desempeño — es su condición. Protege tu tiempo de recuperación.`,
  },
]

// ─── Suggested Starter Questions ────────────────────────────────────────────────
export const SUGGESTED = [
  '¿Qué dice la ciencia sobre la seguridad psicológica?',
  '¿Cómo desarrollo una mentalidad de crecimiento?',
  '¿Qué hace a un equipo verdaderamente efectivo?',
  '¿Cómo construir confianza en el equipo?',
  '¿Qué es el estado de flow y cómo alcanzarlo?',
  '¿Por qué fallan los cambios organizacionales?',
  '¿Cómo dar feedback efectivo?',
  '¿Qué dice Pink sobre la motivación?',
  '¿Qué son los valores organizacionales y para qué sirven?',
  '¿Cómo evitar el burnout?',
  '¿Qué dice la ciencia sobre la IA en el trabajo?',
  '¿Cómo ser más responsable sin microgestión?',
]

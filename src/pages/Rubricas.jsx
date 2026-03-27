import { useState, useMemo } from 'react'

// ─── Full Rubric Data (from plan de sucesion final.pdf) ────────────────────────

const DIMS = [
  {
    id: 'liderazgo',
    name: 'Liderazgo de Personas',
    code: 'A',
    weight: 0.30,
    weightLabel: '30%',
    icon: '👥',
    heatmapKey: 'Liderazgo de personas',
    definition: 'La capacidad del empleado para influir positivamente en otros, desarrollar talento, modelar comportamientos alineados a valores organizacionales, construir equipos efectivos, facilitar retroalimentación de calidad, promover bienestar psicológico y asegurar la continuidad del desempeño en contextos cambiantes.',
    evalAxis: 'Comportamientos observables, impacto en el equipo, madurez de liderazgo, alineación a valores, capacidad de desarrollo, influencia positiva.',
    levels: [
      {
        score: 1,
        label: 'Inicial',
        sublabel: 'Muy por debajo del esperado',
        behaviors: [
          'Evita asumir responsabilidad sobre el equipo; depende totalmente del supervisor para dirigir tareas.',
          'Muestra dificultad para colaborar con otros, gestionar conflictos o comunicarse de forma respetuosa.',
          'No reconoce diferencias individuales ni demuestra empatía en el trabajo.',
          'Ofrece poca o ninguna retroalimentación; evita conversaciones incómodas.',
          'Se centra en tareas, no en personas; no promueve clima psicológico seguro.',
        ],
        impact: [
          'El equipo experimenta confusión, desorganización o falta de claridad.',
          'El comportamiento contribuye a errores, reprocesos o tensiones interpersonales.',
        ],
        indicators: [
          'No puede explicar cómo su rol influye en otros.',
          'No demuestra curiosidad por aprender ni mejorar.',
        ],
      },
      {
        score: 2,
        label: 'Funcional Básico',
        sublabel: 'Por debajo del esperado',
        behaviors: [
          'Colabora cuando se le solicita, pero no anticipa necesidades del equipo.',
          'Aplica comunicación básica, aunque puede ser inconsistente o poco clara.',
          'Gestiona conflictos menores, pero evita los complejos.',
          'Ofrece retroalimentación ocasional pero superficial ("lo hiciste bien").',
          'Entiende valores organizacionales, pero no siempre los aplica.',
        ],
        impact: [
          'Mantiene relaciones adecuadas pero no promueve cohesión.',
          'Puede generar dependencia hacia el supervisor.',
        ],
        indicators: [
          'Reconoce la importancia del desarrollo del talento, pero no sabe cómo hacerlo.',
          'Comienza a asumir responsabilidades pequeñas de liderazgo técnico o de tareas.',
        ],
      },
      {
        score: 3,
        label: 'Competente',
        sublabel: 'Nivel esperado — Analista',
        behaviors: [
          'Facilita trabajo en equipo; distribuye tareas equitativamente.',
          'Ofrece retroalimentación estructurada, orientada a conducta y basada en evidencia.',
          'Resuelve conflictos utilizando escucha activa y neutralidad profesional.',
          'Modela los valores de la organización en conductas observables.',
          'Reconoce fortalezas y áreas de oportunidad del equipo.',
        ],
        impact: [
          'El equipo mantiene un clima saludable y estable.',
          'Contribuye a la continuidad operativa y reduce fricción en procesos.',
        ],
        indicators: [
          'Documenta conversaciones clave relacionadas al desarrollo.',
          'Maneja reuniones efectivas y de seguimiento.',
          'Da ejemplo de responsabilidad, puntualidad y ética.',
        ],
      },
      {
        score: 4,
        label: 'Avanzado',
        sublabel: 'Alto potencial — Supervisor Ready',
        behaviors: [
          'Desarrolla sistemáticamente capacidades en otros; identifica "talento emergente".',
          'Mantiene conversaciones difíciles con profesionalismo y sensibilidad.',
          'Transforma conflictos en oportunidades de aprendizaje.',
          'Conecta el trabajo diario con la misión organizacional; inspira sentido de propósito.',
          'Actúa como mentor informal; impulsa bienestar y clima positivo.',
          'Integra prácticas de coaching (preguntas poderosas, accountability, metas).',
        ],
        impact: [
          'Aumenta desempeño del equipo de forma mensurable (calidad, tiempos, clima).',
          'Reduce rotación interna mediante apoyo y desarrollo significativo.',
        ],
        indicators: [
          'Construye relaciones de confianza con pares y stakeholders.',
          'Lidera iniciativas de mejora orientadas a personas (feedback loops, cambios en dinámica de equipo).',
          'Su estilo de liderazgo es buscado, respetado y reconocido.',
        ],
      },
      {
        score: 5,
        label: 'Excelencia',
        sublabel: 'Liderazgo Estratégico — Director Ready',
        behaviors: [
          'Construye sistemas y prácticas sostenibles de liderazgo dentro del equipo.',
          'Identifica sistemáticamente HiPos y fortalece el pipeline de talento.',
          'Desarrolla autonomía en otros, delega estratégicamente y crea sucesores.',
          'Toma decisiones considerando impacto humano, estratégico y cultural.',
          'Fomenta clima psicológico seguro (según Edmondson).',
          'Actúa con integridad ejemplar; maneja dilemas éticos con madurez y transparencia.',
          'Diseña y promueve prácticas que integran bienestar, desempeño y aprendizaje continuo.',
        ],
        impact: [
          'Eleva indicadores de clima, retención y compromiso.',
          'Incrementa la capacidad del equipo para operar de manera ágil y autónoma.',
          'Su liderazgo genera reputación organizacional positiva.',
        ],
        indicators: [
          'Implementa feedback 360° y rituales formales de desarrollo.',
          'Su equipo sostiene desempeño aun cuando no está presente (marca de liderazgo sólido).',
          'Contribuye directamente a metas estratégicas a través del desarrollo del talento.',
        ],
      },
    ],
  },
  {
    id: 'gestion',
    name: 'Gestión de Proyectos y Flujo Operativo',
    code: 'B',
    weight: 0.20,
    weightLabel: '20%',
    icon: '📋',
    heatmapKey: 'Gestión de proyectos y flujo operativo',
    definition: 'Capacidad de planificar, estructurar, ejecutar y controlar iniciativas y procesos de trabajo de forma eficiente, asegurando que las tareas, recursos, tiempos y entregables fluyan sin interrupciones, con calidad y alineados a los objetivos estratégicos del departamento y de la organización.',
    evalAxis: 'Planificación, ejecución, control de calidad, gestión de riesgos, uso de metodologías formales, impacto operativo.',
    levels: [
      {
        score: 1,
        label: 'Básico Operacional',
        sublabel: 'Ejecución bajo instrucción',
        behaviors: [
          'Comprende el flujo operativo del departamento, sus tareas y entregables.',
          'Ejecuta tareas siguiendo instrucciones claras y SOPs existentes sin desviaciones.',
          'Identifica problemas simples pero depende del supervisor para resolverlos.',
          'Cumple con entregas individuales dentro de los tiempos definidos.',
        ],
        impact: [
          'Sobrecarga en supervisión directa.',
          'Poca contribución a mejoras o eficiencia del flujo.',
        ],
        indicators: [
          '95–100% cumplimiento de tareas individuales con instrucciones claras.',
          'Requiere supervisión frecuente para priorizar.',
          'Mínimos errores en ejecución cuando sigue instrucciones claras.',
        ],
      },
      {
        score: 2,
        label: 'Intermedio',
        sublabel: 'Gestión de microtareas',
        behaviors: [
          'Organiza actividades propias usando herramientas básicas (To-do lists, PM boards).',
          'Documenta procedimientos y pasos de sus entregables.',
          'Comunica desviaciones tempranas sobre tiempo o calidad.',
          'Sugiere pequeñas mejoras en flujos existentes (error reduction, simplificación).',
        ],
        impact: [
          'Queda limitado en roles puramente operativos si no avanza.',
          'No puede liderar esfuerzos cross-functional.',
        ],
        indicators: [
          'Cumplimiento de microproyectos con 90–95% de precisión.',
          'Reducción de retrabajo en tareas recurrentes.',
          'Seguimiento disciplinado de tiempos y procesos.',
        ],
      },
      {
        score: 3,
        label: 'Avanzado',
        sublabel: 'Gestión de procesos — Analista',
        behaviors: [
          'Gestiona subproyectos completos de baja complejidad (dashboards, automatizaciones simples).',
          'Optimiza pasos del flujo operativo usando data y evidencia.',
          'Facilita reuniones de seguimiento y actualiza PM boards sin supervisión.',
          'Integra controles de calidad antes de entregar: QA, validación de datos, revisión de dependencias.',
          'Maneja stakeholders internos (clínicos, operaciones, proveedores de datos).',
        ],
        impact: [
          'Mejora medible en tiempos de ciclo (cycle time).',
          'Documentación clara y reusable creada por la persona.',
        ],
        indicators: [
          '90% cumplimiento de entregables con calidad consistente.',
          'Disminución de errores por retrabajo (20–40% menos reprocesos).',
          'Contribuye a HPO: orientación a la acción, mejora continua.',
        ],
      },
      {
        score: 4,
        label: 'Experto',
        sublabel: 'Gestión integral — Supervisor Ready',
        behaviors: [
          'Lidera proyectos medianos a complejos con múltiples stakeholders.',
          'Realiza gestión de riesgos: identifica, prioriza y crea planes de mitigación.',
          'Diseña flujos operativos completos que reducen tiempos, errores y dependencias.',
          'Establece KPIs de proyecto (Tiempo, Calidad, Throughput, Esperas).',
          'Aplica metodologías formales: Agile/Scrum, Lean (Muda, Kaizen), Waterfall.',
          'Alinea proyectos con metas estratégicas del departamento.',
          'Presenta actualizaciones ejecutivas (RAG status, roadmaps).',
        ],
        impact: [
          '95% cumplimiento de entregas críticas.',
          '10–30% mejora operativa en áreas intervenidas.',
        ],
        indicators: [
          'Flujo operativo estable y controlado (menos variabilidad).',
          'Reducción de problemas recurrentes y apagafuegos.',
          'Contribuye a HPO: calidad del liderazgo, acción rápida y efectiva.',
        ],
      },
      {
        score: 5,
        label: 'Estratégico',
        sublabel: 'Gestión del portafolio — Director Ready',
        behaviors: [
          'Diseña la arquitectura operacional del departamento (process architecture).',
          'Prioriza proyectos alineados a estrategia institucional y Transformation Hub.',
          'Establece gobernanza de proyectos: roles, estándares, controles, escalamiento.',
          'Garantiza resiliencia operacional (redundancias, automatización, dependencia mínima).',
          'Asegura integración entre tecnología, datos, procesos y personas.',
          'Lidera transformaciones: DataOps, automatización, AI Support, rediseños completos.',
          'Mide impacto de manera institucional: ahorros, reducción de riesgos, continuidad operacional.',
        ],
        impact: [
          'Alineación directa al plan estratégico anual.',
          'Resultados visibles a nivel C-suite.',
        ],
        indicators: [
          'Portafolio optimizado por costo, riesgo y valor.',
          'Implementación de estándares que mejoran la madurez del departamento.',
          'Contribuye a HPO: excelencia en liderazgo, innovación continua, orientación a largo plazo.',
        ],
      },
    ],
  },
  {
    id: 'comunicacion',
    name: 'Comunicación e Influencia',
    code: 'C',
    weight: 0.15,
    weightLabel: '15%',
    icon: '🗣️',
    heatmapKey: 'Comunicación e influencia',
    definition: 'Capacidad de transmitir información de forma clara, estratégica y adaptada al público, combinada con la habilidad de generar entendimiento, alineación y acción. Incluye storytelling con datos, gestión de expectativas, negociación, manejo de conversaciones difíciles y capacidad de influir en stakeholders clave sin depender únicamente de autoridad formal.',
    evalAxis: 'Claridad del mensaje, adaptación a la audiencia, data storytelling, influencia, manejo de conversaciones difíciles, impacto organizacional.',
    levels: [
      {
        score: 1,
        label: 'Básico',
        sublabel: 'Operacional / Reactivo',
        behaviors: [
          'Se limita a comunicar datos sin interpretación.',
          'Requiere supervisión para reportar hallazgos o dar estatus.',
          'Su comunicación escrita tiene inconsistencias en claridad o estructura.',
          'Evita conversaciones difíciles o las maneja de forma defensiva.',
        ],
        impact: [
          'Contribuye de manera mínima a la alineación del equipo.',
          'Requiere guía para representar el área frente a stakeholders.',
        ],
        indicators: [
          'Explica métricas solo en términos descriptivos.',
          'Presentaciones básicas sin narrativa ni adaptación al público.',
        ],
      },
      {
        score: 2,
        label: 'Intermedio Bajo',
        sublabel: 'Funcional',
        behaviors: [
          'Expone información ordenada, pero con narrativa limitada.',
          'Aclara dudas básicas y comunica estatus sin retrasos.',
          'Ajusta su estilo según el canal (correo, chat, reunión).',
          'Comienza a participar en discusiones en grupo.',
        ],
        impact: [
          'Facilita coordinación operacional.',
          'Aún no influye decisiones, pero no representa riesgo comunicacional.',
        ],
        indicators: [
          'Explicación simple de causa–efecto.',
          'Resúmenes funcionales sin recomendaciones.',
        ],
      },
      {
        score: 3,
        label: 'Intermedio Alto',
        sublabel: 'Profesional — Analista',
        behaviors: [
          'Presenta hallazgos con claridad y estructura lógica.',
          'Resume información compleja en ideas clave accionables.',
          'Ajusta el mensaje según la audiencia (operacional vs. ejecutivo).',
          'Escucha activamente y responde con precisión.',
          'Maneja desacuerdos de manera respetuosa y orientada a soluciones.',
        ],
        impact: [
          'Contribuye a decisiones tácticas.',
          'Facilita alineación interdepartamental.',
        ],
        indicators: [
          'Storytelling básico con dashboards.',
          'Traduce insights técnicos a lenguaje de negocio.',
          'Integra contexto, impacto y recomendaciones.',
        ],
      },
      {
        score: 4,
        label: 'Avanzado',
        sublabel: 'Liderazgo de Equipo — Supervisor Ready',
        behaviors: [
          'Presenta insights estratégicos que conectan BI con prioridades organizacionales.',
          'Facilita reuniones complejas asegurando claridad y acuerdos.',
          'Influye decisiones mediante evidencia y análisis.',
          'Gestiona conversaciones sensibles (errores, desempeño, conflictos) con alta madurez.',
          'Anticipa preguntas y prepara mensajes clave estratégicamente.',
        ],
        impact: [
          'Aumenta la credibilidad del área de BI.',
          'Reduce fricción y acelera adopción de iniciativas.',
        ],
        indicators: [
          'Construye narrativas ejecutivas con dashboards avanzados.',
          'Lidera comunicaciones interdepartamentales (operaciones, médicos, finanzas).',
          'Genera reportes que orientan decisiones de negocio.',
          'Es referente comunicacional para Analistas.',
        ],
      },
      {
        score: 5,
        label: 'Experto',
        sublabel: 'Comunicación Estratégica — Director Ready',
        behaviors: [
          'Traduce la estrategia corporativa en mensajes claros y accionables para distintos niveles.',
          'Influye decisiones C-Level mediante análisis integrados, visualizaciones poderosas y narrativa estratégica.',
          'Maneja crisis y comunicaciones sensibles con serenidad, precisión y confianza.',
          'Actúa como portavoz del área frente a ejecutivos y stakeholders externos.',
          'Facilita conversaciones de alto conflicto generando confianza, dirección y acuerdos sostenibles.',
        ],
        impact: [
          'Genera alineación institucional.',
          'Incrementa el nivel de madurez comunicacional de la organización.',
          'Fortalece la cultura data-driven.',
        ],
        indicators: [
          'Storytelling corporativo con data sofisticada (tendencias, riesgos, escenarios).',
          'Comunicación de estrategia, visión y roadmap.',
          'Influencia sistémica en comités e iniciativas críticas.',
        ],
      },
    ],
  },
  {
    id: 'tecnico',
    name: 'Capacidad Técnico-Analítica',
    code: 'D',
    weight: 0.20,
    weightLabel: '20%',
    icon: '📊',
    heatmapKey: 'Capacidad técnico-analítica (BI/Stats)',
    definition: 'Conjunto de conocimientos, habilidades y criterios que permiten recopilar, organizar, depurar, interpretar y transformar datos en información accionable, utilizando métodos estadísticos, herramientas de Business Intelligence (BI), modelos analíticos y principios de gobernanza de datos.',
    evalAxis: 'Herramientas (SQL, Power BI, Python/R), data governance, calidad de datos, storytelling técnico, capacidad analítica, impacto en decisiones.',
    levels: [
      {
        score: 1,
        label: 'Básico',
        sublabel: 'Aprendiz / Contribuidor inicial',
        behaviors: [
          'Maneja herramientas básicas (Excel, Power BI inicial, SQL muy básico).',
          'Sigue pasos establecidos sin modificar procesos.',
          'Entiende métricas simples (conteos, promedios, tendencias lineales).',
          'Puede generar reportes manuales, pero requiere supervisión constante.',
          'Comprende definiciones básicas de datos pero no distingue calidad vs. confiabilidad.',
        ],
        impact: [
          'Saturación cognitiva visible cuando maneja más de 2 fuentes de datos.',
          'Se limita a ejecutar sin sugerir mejoras.',
        ],
        indicators: [
          'Exactitud <70% sin supervisión.',
          'Tiempo de ejecución alto (poca eficiencia).',
          'Requiere validación del 100% de su trabajo.',
        ],
      },
      {
        score: 2,
        label: 'Intermedio',
        sublabel: 'Operador competente',
        behaviors: [
          'Maneja competencias intermedias en Excel (tablas dinámicas, fórmulas complejas).',
          'Usa Power BI con soltura en visualizaciones comúnmente usadas.',
          'Conoce y aplica principios básicos de data cleaning.',
          'Puede extraer datos de sistemas o bases de datos con supervisión intermedia.',
          'Entiende estructuras de datos (tablas, relaciones, claves primarias).',
        ],
        impact: [
          'Identifica algunos errores de calidad sin que se le pida.',
          'Explica sus hallazgos usando métricas descriptivas.',
        ],
        indicators: [
          'Exactitud 75–85% con baja supervisión.',
          'Entiende la diferencia entre dato bruto vs. dato transformado.',
          'Maneja 3–5 fuentes de datos sin perder consistencia.',
        ],
      },
      {
        score: 3,
        label: 'Proficiente',
        sublabel: 'Analista fuerte — listo a corto plazo',
        behaviors: [
          'Automatiza pasos básicos usando Power Query, flujos o scripts simples.',
          'Interpreta análisis más complejos (correlaciones, tendencias avanzadas, segmentaciones).',
          'Construye dashboards robustos orientados al usuario final.',
          'Comprende principios de data governance (uso, seguridad, estándares).',
          'Detecta anomalías, inconsistencias y problemas de calidad sin ser instruido.',
          'Puede explicar limitaciones del dato y su impacto en decisiones.',
        ],
        impact: [
          'Los líderes confían en sus reportes como "base confiable".',
          'Propone rediseños de fuentes o métricas para mejorar consistencia.',
        ],
        indicators: [
          'Exactitud ≥90% sin supervisión.',
          'Documenta procesos analíticos sin que se le pida.',
          'Traduce hallazgos en implicaciones operacionales básicas.',
        ],
      },
      {
        score: 4,
        label: 'Avanzado',
        sublabel: 'Supervisor / Líder técnico emergente',
        behaviors: [
          'Domina Power BI avanzado: DAX, relaciones complejas, optimización del modelo.',
          'Diseña estructuras de datos escalables, con lógica de negocio integrada.',
          'Conecta múltiples sistemas o APIs, garantizando integridad.',
          'Interpreta modelos estadísticos avanzados (regresión, predicción moderada).',
          'Implementa principios sólidos de data governance: linaje, diccionarios, estandarización, control de versiones, accesos.',
          'Prioriza y diseña KPIs estratégicos que influyen decisiones de negocio.',
        ],
        impact: [
          'Actúa como guardián de calidad: detecta, corrige y previene errores.',
          'Educa a otros sobre el uso correcto del dato.',
          'Cuestiona decisiones basadas en supuestos incorrectos o métricas mal definidas.',
        ],
        indicators: [
          'Consistencia ≥95% sin supervisión.',
          'Dashboards son usados por niveles gerenciales.',
          'Reduce tiempos operacionales mediante automatización.',
        ],
      },
      {
        score: 5,
        label: 'Experto',
        sublabel: 'Arquitecto de datos — Director Ready',
        behaviors: [
          'Diseña arquitectura integral del ecosistema de datos del departamento.',
          'Define estándares institucionales para KPIs, calidad, gobernanza, integridad, seguridad.',
          'Domina técnicas avanzadas de estadística, modelado predictivo o analítica avanzada.',
          'Gestiona automatizaciones complejas y pipelines robustos.',
          'Traduce la estrategia organizacional en "mapas de datos" para la toma de decisiones.',
          'Evalúa tecnologías emergentes (machine learning, data fabrics, data lakehouses).',
        ],
        impact: [
          'Influye decisiones ejecutivas mediante visualizaciones estratégicas.',
          'Eleva la cultura data-driven institucional.',
          'Anticipa riesgos futuros de datos (compliance, caídas operativas, obsolescencia).',
        ],
        indicators: [
          'Tiene impacto directo en resultados del negocio (reducción de costos, mejoras en SLA).',
          'Sus dashboarding frameworks se convierten en estándares.',
          'Es considerado experto clave y punto de referencia en BI.',
          'Garantiza resiliencia analítica del departamento.',
        ],
      },
    ],
  },
  {
    id: 'cumplimiento',
    name: 'Cumplimiento y Estandarización',
    code: 'E',
    weight: 0.15,
    weightLabel: '15%',
    icon: '✅',
    heatmapKey: 'Cumplimiento y estandarización (HIPAA/SOPs)',
    definition: 'Adherencia consistente a los Procedimientos Operativos Estándar (SOPs), regulaciones HIPAA/FWA, políticas de privacidad, estándares de calidad de datos y cumplimiento regulatorio aplicable al ecosistema de salud en Puerto Rico.',
    evalAxis: 'Adhesión a SOPs, conocimiento regulatorio, documentación, cultura de compliance, gestión de riesgos de cumplimiento.',
    levels: [
      {
        score: 1,
        label: 'Incipiente',
        sublabel: 'Riesgo activo de compliance',
        behaviors: [
          'Comete desviaciones frecuentes de los SOPs establecidos.',
          'Conocimiento superficial o nulo de regulaciones HIPAA y FWA.',
          'No documenta sus procesos ni acciones de manera sistemática.',
          'Requiere corrección constante ante errores de cumplimiento.',
          'No reconoce cuándo una acción representa un riesgo regulatorio.',
        ],
        impact: [
          'Riesgo activo de incumplimiento regulatorio.',
          'Exposición de la organización a auditorías y sanciones.',
        ],
        indicators: [
          'Hallazgos recurrentes en revisiones internas.',
          'Necesita guía en cada paso de procesos regulados.',
        ],
      },
      {
        score: 2,
        label: 'Funcional',
        sublabel: 'Cumplimiento reactivo',
        behaviors: [
          'Conoce las normas pero comete errores ocasionales.',
          'Requiere recordatorios para seguir protocolos establecidos.',
          'Documenta cuando se le indica, pero no de forma proactiva.',
          'Identifica algunos riesgos de cumplimiento pero no los escala apropiadamente.',
        ],
        impact: [
          'Cumplimiento inconsistente que puede pasar desapercibido.',
          'Genera dependencia en el supervisor para garantizar adherencia.',
        ],
        indicators: [
          'Errores ocasionales corregidos a tiempo con supervisión.',
          'Conocimiento básico de HIPAA sin aplicación profunda.',
        ],
      },
      {
        score: 3,
        label: 'Competente',
        sublabel: 'Cumplimiento consistente — Analista',
        behaviors: [
          'Cumple consistentemente con SOPs e HIPAA; documenta adecuadamente.',
          'Aplica regulaciones de privacidad y confidencialidad de datos sin supervisión.',
          'Identifica y escala proactivamente riesgos de cumplimiento.',
          'Mantiene documentación clara, organizada y accesible.',
          'Sin hallazgos significativos en auditorías internas.',
        ],
        impact: [
          'Reduce el riesgo organizacional de manera proactiva.',
          'Contribuye a la cultura de calidad del departamento.',
        ],
        indicators: [
          'Auditorías internas sin hallazgos críticos.',
          'SOPs seguidos sin necesidad de recordatorios.',
          'Documentación actualizada y reusable.',
        ],
      },
      {
        score: 4,
        label: 'Avanzado',
        sublabel: 'Promotor de compliance — Supervisor Ready',
        behaviors: [
          'Promueve activamente la cultura de cumplimiento en el equipo.',
          'Mejora SOPs existentes basado en experiencia y mejores prácticas.',
          'Educa a pares sobre regulaciones y riesgos de cumplimiento.',
          'Lidera revisiones de calidad y auditorías internas.',
          'Es modelo visible de responsabilidad regulatoria.',
        ],
        impact: [
          'Eleva el nivel de cumplimiento del equipo completo.',
          'Reduce el riesgo institucional de forma sistémica.',
        ],
        indicators: [
          'Propone mejoras de SOPs adoptadas por el departamento.',
          'Referente del equipo en dudas de cumplimiento regulatorio.',
          'Cero hallazgos críticos en su área de responsabilidad.',
        ],
      },
      {
        score: 5,
        label: 'Estratégico',
        sublabel: 'Arquitecto de governance — Director Ready',
        behaviors: [
          'Diseña marcos de governance y compliance para el departamento.',
          'Crea SOPs nuevos alineados a necesidades organizacionales y regulatorias.',
          'Anticipa cambios regulatorios y prepara al equipo proactivamente.',
          'Establece métricas de cumplimiento y las monitorea de manera sistemática.',
          'Conecta el compliance con la estrategia organizacional y la cultura HPO.',
          'Cero tolerancia a riesgos regulatorios; defiende la integridad de datos.',
        ],
        impact: [
          'Protege a la organización de sanciones regulatorias de alto impacto.',
          'Fortalece la confianza de stakeholders internos y externos.',
        ],
        indicators: [
          'Frameworks de compliance adoptados como estándar organizacional.',
          'Forma a otros en mejores prácticas de governance.',
          'Reconocido por People Operations como referente de integridad operativa.',
        ],
      },
    ],
  },
]

// Baseline thresholds
const BASELINES = {
  Analista:    { liderazgo: 3, gestion: 3, comunicacion: 3, tecnico: 3, cumplimiento: 3 },
  Supervisor:  { liderazgo: 5, gestion: 4, comunicacion: 5, tecnico: 4, cumplimiento: 4 },
  Director:    { liderazgo: 5, gestion: 5, comunicacion: 5, tecnico: 5, cumplimiento: 5 },
}

// ─── Potential Rubric Dimensions ──────────────────────────────────────────────
const POTENTIAL_DIMS = [
  {
    id: 'aprendizaje',
    name: 'Agilidad de Aprendizaje',
    code: 'P1',
    weight: 0.40,
    weightLabel: '40%',
    icon: '🧠',
    definition: 'Capacidad de aprender rápido de experiencias nuevas, desaprender lo que ya no sirve y aplicar ese aprendizaje efectivamente en situaciones cambiantes o desconocidas. Es el predictor más fuerte de potencial de liderazgo a largo plazo (Lombardo & Eichinger, Korn Ferry).',
    evalAxis: 'Velocidad de aprendizaje, transferencia entre contextos, tolerancia a la ambigüedad, disposición a desaprender, búsqueda activa de retos.',
    levels: [
      {
        score: 1, label: 'Limitada', sublabel: 'Zona de confort rígida',
        behaviors: [
          'Aprende principalmente dentro de su área de dominio actual.',
          'Repite métodos y enfoques aunque los resultados no sean óptimos.',
          'Evita situaciones de incertidumbre o aprendizaje acelerado.',
          'Le cuesta adaptar su forma de trabajar cuando cambia el contexto.',
        ],
        impact: [
          'Riesgo de obsolescencia técnica o conductual a mediano plazo.',
          'Requiere estructuras fijas para rendir; no escala bien ante cambios.',
        ],
        indicators: [
          'Usa las mismas herramientas y métodos por largo tiempo sin actualizarlos.',
          'Reacciona con resistencia ante nuevas metodologías o tecnologías.',
        ],
      },
      {
        score: 2, label: 'En Desarrollo', sublabel: 'Aprende con guía estructurada',
        behaviors: [
          'Adopta nuevas herramientas cuando recibe entrenamiento explícito.',
          'Transfiere aprendizajes dentro de su dominio con tiempo moderado.',
          'Muestra disposición al cambio, pero necesita acompañamiento.',
          'Aprende de retroalimentación directa, no siempre por iniciativa propia.',
        ],
        impact: [
          'Crecimiento posible pero dependiente de intervención externa.',
          'Puede quedarse rezagado en contextos de cambio rápido.',
        ],
        indicators: [
          'Completa capacitaciones asignadas con buen aprovechamiento.',
          'Mejora de manera visible cuando recibe coaching o mentoría activa.',
        ],
      },
      {
        score: 3, label: 'Funcional', sublabel: 'Aprendiz autónomo',
        behaviors: [
          'Aprende de retroalimentación y experiencias sin necesitar guía constante.',
          'Adapta su enfoque ante cambios moderados de manera efectiva.',
          'Busca activamente nuevos conocimientos en su campo.',
          'Transfiere aprendizajes entre contextos similares con fluidez.',
          'Refleja sobre sus errores y ajusta comportamientos.',
        ],
        impact: [
          'Crece de forma consistente; aporta ideas de mejora basadas en lo aprendido.',
          'Reduce curva de adaptación ante cambios organizacionales.',
        ],
        indicators: [
          'Toma iniciativa de formación sin que se le indique.',
          'Puede enseñar a otros lo que aprendió recientemente.',
          'Muestra mejoras observables trimestre a trimestre.',
        ],
      },
      {
        score: 4, label: 'Avanzado', sublabel: 'Aprendizaje en complejidad',
        behaviors: [
          'Aprende rápido de situaciones ambiguas y sin precedente.',
          'Desafía sus propios supuestos y los somete a prueba.',
          'Convierte fracasos en aprendizajes documentados y aplicables.',
          'Busca mentores, experiencias y retos que lo desafíen deliberadamente.',
          'Aplica aprendizajes de un dominio a problemas de otro dominio distinto.',
        ],
        impact: [
          'Cataliza aprendizaje en su equipo; comparte frameworks y modelos.',
          'Alta adaptabilidad ante cambios estratégicos de la organización.',
        ],
        indicators: [
          'Puede describir 2-3 aprendizajes clave del último trimestre y su aplicación.',
          'Propone experimentos o pilotos para probar ideas nuevas.',
          'Es referente al que otros acuden para entender algo nuevo.',
        ],
      },
      {
        score: 5, label: 'Excepcional', sublabel: 'Arquitecto de su propio aprendizaje',
        behaviors: [
          'Anticipa qué habilidades necesitará y las desarrolla proactivamente.',
          'Crea sus propios laboratorios de aprendizaje: proyectos, experimentos, retos autoimpuestos.',
          'Alta tolerancia a la ambigüedad; funciona con eficacia en territorios completamente nuevos.',
          'Transforma fracasos organizacionales en innovaciones sistémicas.',
          'Es fuente de aprendizaje colectivo; eleva la capacidad del equipo entero.',
        ],
        impact: [
          'Acelera la curva de aprendizaje del departamento completo.',
          'Su capacidad de adaptación es un activo estratégico de la organización.',
        ],
        indicators: [
          'Puede articular con claridad su mapa de desarrollo a 12-24 meses.',
          'Lidera iniciativas de conocimiento colectivo (wikis, comunidades de práctica, demos).',
          'Es nombrado para proyectos de alto riesgo y alta novedad por su capacidad de adaptación.',
        ],
      },
    ],
  },
  {
    id: 'pensamiento',
    name: 'Complejidad de Pensamiento',
    code: 'P2',
    weight: 0.30,
    weightLabel: '30%',
    icon: '🔭',
    definition: 'Capacidad de procesar información compleja, pensar de manera sistémica y estratégica, identificar patrones no obvios, anticipar consecuencias de segundo y tercer orden, y tomar decisiones efectivas en contextos de alta ambigüedad y múltiples variables.',
    evalAxis: 'Pensamiento sistémico, anticipación estratégica, resolución de problemas complejos, capacidad de abstracción, conexión causa-efecto a largo plazo.',
    levels: [
      {
        score: 1, label: 'Lineal', sublabel: 'Pensamiento secuencial y concreto',
        behaviors: [
          'Procesa información de manera secuencial; dificultad para ver relaciones entre variables.',
          'Foco casi exclusivo en la tarea inmediata; poca visión de contexto.',
          'Necesita problemas bien estructurados para resolverlos efectivamente.',
          'Le cuesta anticipar consecuencias más allá del corto plazo.',
        ],
        impact: [
          'Efectivo en tareas rutinarias y bien definidas; limitado en contextos complejos.',
          'Requiere supervisión en situaciones de ambigüedad o múltiples variables.',
        ],
        indicators: [
          'Describe problemas en términos concretos y específicos.',
          'Sigue pasos definidos; le cuesta improvisar ante variaciones.',
        ],
      },
      {
        score: 2, label: 'Táctico', sublabel: 'Análisis causa–efecto básico',
        behaviors: [
          'Conecta algunas variables para entender situaciones.',
          'Resuelve problemas moderadamente complejos con orientación.',
          'Analiza causa-efecto de primer orden con razonamiento básico.',
          'Tiene perspectiva de corto a mediano plazo en su área.',
        ],
        impact: [
          'Aporta en análisis tácticos dentro de su dominio.',
          'Poca contribución a decisiones que requieren visión sistémica.',
        ],
        indicators: [
          'Puede explicar por qué ocurrió un problema, no siempre cómo prevenirlo.',
          'Resuelve bien problemas similares a los que ya ha enfrentado.',
        ],
      },
      {
        score: 3, label: 'Analítico', sublabel: 'Múltiples perspectivas y patrones',
        behaviors: [
          'Identifica patrones y relaciones entre datos de distintas fuentes.',
          'Analiza situaciones desde múltiples ángulos antes de concluir.',
          'Anticipa consecuencias de primer y segundo orden.',
          'Resuelve problemas complejos dentro de su dominio con autonomía.',
          'Distingue síntomas de causas raíz con claridad.',
        ],
        impact: [
          'Sus análisis agregan valor real a decisiones tácticas y algunas estratégicas.',
          'Reduce errores de diagnóstico en el equipo con su perspectiva.',
        ],
        indicators: [
          'Usa frameworks o modelos para estructurar su análisis.',
          'Anticipa preguntas que stakeholders harán antes de que las hagan.',
          'Produce recomendaciones con razonamiento claro y evidencia.',
        ],
      },
      {
        score: 4, label: 'Sistémico', sublabel: 'Ve el sistema completo',
        behaviors: [
          'Ve el sistema completo, no solo las partes; conecta departamentos, procesos y estrategia.',
          'Anticipa consecuencias de segundo y tercer orden en sus decisiones.',
          'Conecta la estrategia organizacional con la ejecución operativa.',
          'Identifica causas raíz con precisión, aun en contextos ambiguos.',
          'Piensa a 1-3 años; toma decisiones que preservan opciones futuras.',
        ],
        impact: [
          'Toma decisiones de alta calidad en contextos complejos con información incompleta.',
          'Identifica riesgos y oportunidades que otros en el equipo no ven.',
        ],
        indicators: [
          'Sus propuestas incluyen análisis de impacto en otros sistemas o áreas.',
          'Es consultado por sus pares y líderes para resolver problemas complejos.',
          'Construye modelos mentales que ayuda a otros a entender situaciones.',
        ],
      },
      {
        score: 5, label: 'Estratégico', sublabel: 'Redefine los problemas',
        behaviors: [
          'Redefine los problemas antes de resolverlos; cuestiona el encuadre inicial.',
          'Identifica oportunidades estratégicas donde otros ven obstáculos.',
          'Piensa en ecosistemas, no en equipos; ve la organización como un todo interdependiente.',
          'Visión clara a 3-5 años con capacidad de articular la trayectoria hacia ese futuro.',
          'Influye en la agenda estratégica de la organización con sus ideas y análisis.',
        ],
        impact: [
          'Sus ideas cambian la forma en que el equipo o la organización aborda problemas.',
          'Eleva el nivel de pensamiento colectivo del departamento.',
        ],
        indicators: [
          'Produce frameworks originales adoptados por el equipo o la organización.',
          'Es invitado a discusiones estratégicas más allá de su área funcional.',
          'Puede articular escenarios futuros con lógica y evidencia convincentes.',
        ],
      },
    ],
  },
  {
    id: 'impulso',
    name: 'Impulso y Aspiración',
    code: 'P3',
    weight: 0.30,
    weightLabel: '30%',
    icon: '🚀',
    definition: 'Motivación intrínseca para crecer, asumir responsabilidades de mayor alcance y contribuir al éxito colectivo. Incluye resiliencia ante adversidad, proactividad, orientación al impacto y disposición a incomodarse por crecer. Es la energía que sostiene el desarrollo a largo plazo.',
    evalAxis: 'Motivación intrínseca, resiliencia, proactividad, orientación al impacto, disposición al crecimiento, energía sostenida.',
    levels: [
      {
        score: 1, label: 'Reactivo', sublabel: 'Actúa cuando se le solicita',
        behaviors: [
          'Actúa principalmente cuando recibe instrucciones claras.',
          'Poco interés observable en asumir responsabilidades adicionales.',
          'Baja resiliencia ante contratiempos; tiende a desanimarse.',
          'Busca estabilidad y previsibilidad sobre crecimiento y reto.',
        ],
        impact: [
          'Su desarrollo depende casi totalmente de intervención externa.',
          'Riesgo de estancamiento si no recibe impulso constante del liderazgo.',
        ],
        indicators: [
          'No busca proyectos nuevos ni asume iniciativas por cuenta propia.',
          'Ante dificultades, necesita apoyo externo para retomar el rumbo.',
        ],
      },
      {
        score: 2, label: 'Funcional', sublabel: 'Crece cuando hay oportunidad clara',
        behaviors: [
          'Cumple con sus responsabilidades de manera consistente.',
          'Busca crecimiento cuando existe oportunidad definida y de bajo riesgo.',
          'Resiliencia básica ante dificultades menores.',
          'Motivado principalmente por reconocimiento externo (bonos, elogios, títulos).',
        ],
        impact: [
          'Crecimiento posible, pero dependiente de oferta de oportunidades.',
          'No genera su propio momentum de desarrollo.',
        ],
        indicators: [
          'Acepta nuevas responsabilidades cuando se le ofrecen; rara vez las busca.',
          'Recupera el ritmo tras adversidades, aunque le toma tiempo.',
        ],
      },
      {
        score: 3, label: 'Proactivo', sublabel: 'Busca activamente crecer',
        behaviors: [
          'Busca activamente nuevas responsabilidades y proyectos que lo desafíen.',
          'Supera obstáculos con determinación visible y actitud positiva.',
          'Habla de su desarrollo en términos de impacto, no solo de posición o salario.',
          'Persiste ante dificultades; busca soluciones sin esperar que otros actúen.',
          'Motivación interna visible en su energía, iniciativa y conversaciones.',
        ],
        impact: [
          'Genera un ambiente de mayor energía y compromiso en el equipo.',
          'Contribuye más allá de su descripción formal de puesto.',
        ],
        indicators: [
          'Presenta ideas o proyectos propios en reuniones sin que se le pida.',
          'Tiene un plan de desarrollo personal activo y lo comparte con su líder.',
          'Supera metas de su puesto de manera recurrente.',
        ],
      },
      {
        score: 4, label: 'Orientado al Impacto', sublabel: 'Misión y contribución colectiva',
        behaviors: [
          'Asume proyectos desafiantes voluntariamente, incluso con alta incertidumbre.',
          'Alta resiliencia: convierte adversidades en aprendizajes concretos.',
          'Motivado por el impacto colectivo, no solo por logros individuales.',
          'Trabaja con sentido de misión; conecta su trabajo con el propósito organizacional.',
          'Inspira a otros con su energía y compromiso sostenido.',
        ],
        impact: [
          'Eleva el estándar del equipo con su ejemplo y energía.',
          'Atrae proyectos de mayor complejidad y visibilidad.',
        ],
        indicators: [
          'Es nombrado para proyectos estratégicos por iniciativa de líderes.',
          'Puede articular con claridad por qué le importa lo que hace.',
          'Otros en el equipo lo señalan como fuente de motivación.',
        ],
      },
      {
        score: 5, label: 'Transformador', sublabel: 'Moviliza a otros hacia metas colectivas',
        behaviors: [
          'Moviliza a otros hacia metas colectivas ambiciosas con su visión y energía.',
          'Alta tolerancia a la incertidumbre y al riesgo calculado.',
          'Visión clara de lo que quiere construir y por qué; la articula con convicción.',
          'Su compromiso y energía son contagiosos; eleva el nivel motivacional del equipo.',
          'Construye legado, no solo resultados; piensa en el impacto de largo plazo.',
        ],
        impact: [
          'Su presencia tiene un efecto multiplicador en el desempeño colectivo.',
          'Es un activo estratégico de retención: otros quieren trabajar con y para esta persona.',
        ],
        indicators: [
          'Genera movimiento organizacional más allá de su rol formal.',
          'Es considerado un líder informal reconocido en toda la organización.',
          'Cuando no está, su impacto sigue sintiéndose en los sistemas y equipos que construyó.',
        ],
      },
    ],
  },
]

function calcPotentialScore(pScores) {
  let total = 0, wSum = 0
  POTENTIAL_DIMS.forEach(d => {
    if (pScores[d.id]) { total += pScores[d.id] * d.weight; wSum += d.weight }
  })
  const fullW = POTENTIAL_DIMS.reduce((a, d) => a + d.weight, 0)
  return wSum === fullW ? +(total.toFixed(2)) : null
}

const SCORE_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#0d9488' }
const SCORE_BG    = { 1: '#fef2f2', 2: '#fff7ed', 3: '#fefce8', 4: '#f0fdf4', 5: '#f0fdfa' }

function calcWeightedScore(scores) {
  let total = 0, wSum = 0
  DIMS.forEach(d => {
    if (scores[d.id]) { total += scores[d.id] * d.weight; wSum += d.weight }
  })
  return wSum === DIMS.reduce((a, d) => a + d.weight, 0) ? +(total.toFixed(2)) : null
}

function getReadinessStatus(pct) {
  if (pct >= 70) return { label: 'Listo ahora', color: '#16a34a', bg: '#dcfce7' }
  if (pct >= 45) return { label: 'Listo pronto', color: '#ca8a04', bg: '#fef9c3' }
  return { label: 'Listo futuro', color: '#dc2626', bg: '#fee2e2' }
}

// ─── Level Card ────────────────────────────────────────────────────────────────
function LevelCard({ level, selected, onSelect }) {
  const color = SCORE_COLORS[level.score]
  const bg    = SCORE_BG[level.score]

  return (
    <div
      onClick={() => onSelect(level.score)}
      style={{
        border: `2px solid ${selected ? color : '#e2e8f0'}`,
        borderRadius: 12,
        background: selected ? bg : 'white',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        position: 'relative',
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: color, color: 'white',
          borderRadius: '50%', width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>✓</div>
      )}

      {/* Score badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: selected ? color : '#f1f5f9',
        color: selected ? 'white' : '#64748b',
        borderRadius: 20, padding: '3px 10px',
        fontSize: 13, fontWeight: 700, marginBottom: 8,
      }}>
        {level.score} — {level.label}
      </div>
      <div style={{ fontSize: 11, color: selected ? color : '#94a3b8', fontWeight: 600, marginBottom: 10, fontStyle: 'italic' }}>
        {level.sublabel}
      </div>

      {/* Behaviors */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
          Comportamientos
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'disc' }}>
          {level.behaviors.map((b, i) => (
            <li key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 3, lineHeight: 1.45 }}>{b}</li>
          ))}
        </ul>
      </div>

      {/* Impact */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
          Impacto
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'circle' }}>
          {level.impact.map((imp, i) => (
            <li key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 3, lineHeight: 1.45 }}>{imp}</li>
          ))}
        </ul>
      </div>

      {/* Indicators */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
          Indicadores
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'square' }}>
          {level.indicators.map((ind, i) => (
            <li key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 3, lineHeight: 1.45 }}>{ind}</li>
          ))}
        </ul>
      </div>

      <button
        style={{
          marginTop: 14, width: '100%',
          padding: '8px 0',
          borderRadius: 8,
          border: `1.5px solid ${color}`,
          background: selected ? color : 'white',
          color: selected ? 'white' : color,
          fontWeight: 700, fontSize: 13,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        {selected ? '✓ Nivel seleccionado' : 'Seleccionar nivel'}
      </button>
    </div>
  )
}

// ─── Dimension Section ──────────────────────────────────────────────────────────
function DimSection({ dim, score, onScore, baseline }) {
  const [expanded, setExpanded] = useState(false)
  const color = score ? SCORE_COLORS[score] : '#94a3b8'
  const meetsBaseline = score && baseline ? score >= baseline : null

  return (
    <div style={{
      background: 'white',
      border: `1.5px solid ${score ? SCORE_COLORS[score] + '66' : '#e2e8f0'}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px',
          cursor: 'pointer',
          background: score ? SCORE_BG[score] + '66' : 'white',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: 22 }}>{dim.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
              Dimensión {dim.code}: {dim.name}
            </span>
            <span style={{
              background: '#f1f5f9', color: '#475569',
              borderRadius: 20, padding: '2px 9px', fontSize: 12, fontWeight: 700,
            }}>{dim.weightLabel}</span>
            {score && (
              <span style={{
                background: SCORE_COLORS[score], color: 'white',
                borderRadius: 20, padding: '2px 9px', fontSize: 12, fontWeight: 700,
              }}>{dim.levels[score - 1].label}</span>
            )}
            {meetsBaseline !== null && (
              <span style={{
                background: meetsBaseline ? '#dcfce7' : '#fee2e2',
                color: meetsBaseline ? '#16a34a' : '#dc2626',
                borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700,
              }}>
                {meetsBaseline ? '✓ Cumple baseline' : `✗ Baseline: ${baseline}`}
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.4 }}>
            {dim.definition.slice(0, 120)}…
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {score ? (
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: SCORE_COLORS[score],
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 20,
            }}>{score}</div>
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#f1f5f9', border: '2px dashed #cbd5e1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', fontSize: 13, fontWeight: 700,
            }}>—</div>
          )}
          <div style={{ fontSize: 20, color: '#94a3b8', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
            ▾
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 20px 20px' }}>
          {/* Definition box */}
          <div style={{
            background: '#f8fafc', borderRadius: 10, padding: '12px 16px',
            marginBottom: 16, borderLeft: '3px solid #7c3aed',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', marginBottom: 4, textTransform: 'uppercase' }}>
              Definición operativa
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{dim.definition}</p>
            <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
              <strong>Eje evaluado:</strong> {dim.evalAxis}
            </div>
          </div>

          {/* Level cards grid */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {dim.levels.map(level => (
              <LevelCard
                key={level.score}
                level={level}
                selected={score === level.score}
                onSelect={v => { onScore(dim.id, v); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Summary Ring ───────────────────────────────────────────────────────────────
function MiniRing({ value, max = 5, color, label }) {
  const pct = value ? (value / max) * 100 : 0
  const r = 30, circ = 2 * Math.PI * r, dash = (pct / 100) * circ
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={76} height={76} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
        <circle cx={38} cy={38} r={r} fill="none" stroke={value ? color : '#e2e8f0'}
          strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }} />
      </svg>
      <div style={{ marginTop: -50, marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: value ? color : '#cbd5e1' }}>
          {value ?? '—'}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Rubricas({ data, updateCollaborator, updateHeatmap }) {
  const [selectedId, setSelectedId] = useState(data.collaborators[0]?.id || null)
  const [scores, setScores]         = useState({})
  const [period, setPeriod]         = useState('Q2 2026')
  const [notes,  setNotes]          = useState('')
  const [saved,  setSaved]          = useState(false)
  const [targetRole, setTargetRole] = useState('Analista')
  const [evalMode, setEvalMode]           = useState('desempeno')  // 'desempeno' | 'potencial'
  const [potentialScores, setPotentialScores] = useState({})
  const [potentialNotes, setPotentialNotes]   = useState('')
  const [potentialSaved, setPotentialSaved]   = useState(false)

  const collab = data.collaborators.find(c => c.id === selectedId)

  const loadCollab = (c) => {
    const rs = c?.rubricScores || {}
    setScores(rs.scores || {})
    setPeriod(rs.period || 'Q2 2026')
    setNotes(rs.notes || '')
    setTargetRole(rs.targetRole || 'Analista')
    setSaved(false)
    setPotentialScores(c?.potentialScores?.scores || {})
    setPotentialNotes(c?.potentialScores?.notes || '')
  }

  const handleSelectCollab = (id) => {
    setSelectedId(id)
    loadCollab(data.collaborators.find(x => x.id === id))
  }

  const allFilled   = DIMS.every(d => scores[d.id])
  const weightedAvg = useMemo(() => calcWeightedScore(scores), [scores])
  const filledCount = DIMS.filter(d => scores[d.id]).length
  const progressPct = Math.round((filledCount / DIMS.length) * 100)

  const readinessPct  = weightedAvg ? Math.round((weightedAvg / 5) * 100) : null
  const readinessStat = readinessPct ? getReadinessStatus(readinessPct) : null
  const baselineMap   = BASELINES[targetRole]

  const meetsAllBaseline = allFilled && baselineMap
    ? DIMS.every(d => (scores[d.id] || 0) >= baselineMap[d.id])
    : null

  const potWeightedAvg   = useMemo(() => calcPotentialScore(potentialScores), [potentialScores])
  const potFilledCount   = POTENTIAL_DIMS.filter(d => potentialScores[d.id]).length
  const potAllFilled     = potFilledCount === POTENTIAL_DIMS.length
  const potProgressPct   = Math.round((potFilledCount / POTENTIAL_DIMS.length) * 100)

  const handleSave = () => {
    if (!allFilled || !collab) {
      alert('Completa todas las dimensiones antes de guardar.')
      return
    }
    const newNineBoxPerf = Math.max(1, Math.min(5, Math.round(weightedAvg)))
    const newReadiness   = readinessPct

    updateCollaborator(collab.id, {
      readinessPercentage: newReadiness,
      readinessStatus: readinessStat?.label,
      nineBox: { ...collab.nineBox, performance: newNineBoxPerf },
      rubricScores: { scores, period, notes, targetRole, weightedAvg, lastEvaluated: new Date().toISOString().split('T')[0] },
    })

    // Update heatmap
    const heatmapMap = {}
    DIMS.forEach(d => { if (d.heatmapKey) heatmapMap[d.heatmapKey] = scores[d.id] })
    const newHeatmap = data.heatmap.map(row =>
      heatmapMap[row.dimension] !== undefined ? { ...row, [collab.id]: heatmapMap[row.dimension] } : row
    )
    updateHeatmap(newHeatmap)
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
  }

  const handleSavePotential = () => {
    if (!potAllFilled || !collab) {
      alert('Completa las 3 dimensiones de potencial antes de guardar.')
      return
    }
    const newNineBoxPot = Math.max(1, Math.min(5, Math.round(potWeightedAvg)))
    updateCollaborator(collab.id, {
      nineBox: { ...collab.nineBox, potential: newNineBoxPot },
      potentialScores: {
        scores: potentialScores,
        notes: potentialNotes,
        weightedAvg: potWeightedAvg,
        lastEvaluated: new Date().toISOString().split('T')[0],
      },
    })
    setPotentialSaved(true)
    setTimeout(() => setPotentialSaved(false), 3500)
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 20px 80px' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          📐 Rúbricas de Evaluación por Dimensión
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: '#64748b' }}>
          Instrumentos de evaluación conductual por dimensión estratégica. Selecciona el nivel que mejor describe el desempeño observable del colaborador. Los resultados actualizan automáticamente el perfil, 9-Box y heatmap.
        </p>

        {/* ── Eval Mode Toggle ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 6, marginTop: 16, marginBottom: 0,
          background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content',
        }}>
          {[
            { key: 'desempeno', label: '📊 Desempeño', desc: '5 dimensiones · Peso ponderado' },
            { key: 'potencial', label: '🚀 Potencial',  desc: '3 dimensiones · Trayectoria futura' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setEvalMode(m.key)}
              style={{
                padding: '10px 22px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 14, transition: 'all 0.15s',
                background: evalMode === m.key ? 'white' : 'transparent',
                color: evalMode === m.key ? '#0f172a' : '#64748b',
                boxShadow: evalMode === m.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >{m.label}</button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════ PERFORMANCE MODE ═══════════════════════════ */}
      {evalMode === 'desempeno' && (
      <>

      {/* ── Collaborator + Target Role ─────────────────────────────────── */}
      <div style={{
        background: 'white', borderRadius: 14, padding: '18px 22px',
        marginBottom: 18, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 300px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Colaborador
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {data.collaborators.map(c => (
                <button key={c.id} onClick={() => handleSelectCollab(c.id)} style={{
                  padding: '8px 18px', borderRadius: 24, border: '2px solid',
                  borderColor: selectedId === c.id ? '#0d9488' : '#e2e8f0',
                  background: selectedId === c.id ? '#0d9488' : 'white',
                  color: selectedId === c.id ? 'white' : '#475569',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {c.code}
                  {c.rubricScores && (
                    <span style={{ marginLeft: 6, opacity: 0.8, fontSize: 12 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            {collab && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                <strong style={{ color: '#1e293b' }}>{collab.currentPosition}</strong>
                {collab.rubricScores?.lastEvaluated && (
                  <span style={{ marginLeft: 10, color: '#94a3b8' }}>
                    Última eval: {collab.rubricScores.lastEvaluated} · {collab.rubricScores.period}
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Baseline de referencia
            </div>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', fontSize: 14, background: 'white',
                color: '#1e293b', fontWeight: 600, cursor: 'pointer', outline: 'none',
              }}
            >
              <option>Analista</option>
              <option>Supervisor</option>
              <option>Director</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Progress ───────────────────────────────────────────────────── */}
      {collab && (
        <div style={{
          background: 'white', borderRadius: 10, padding: '12px 20px',
          marginBottom: 18, border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
            Progreso
          </div>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 7 }}>
            <div style={{
              width: `${progressPct}%`, height: '100%', borderRadius: 99,
              background: progressPct === 100 ? '#0d9488' : '#7c3aed',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: progressPct === 100 ? '#0d9488' : '#7c3aed', whiteSpace: 'nowrap' }}>
            {filledCount} / {DIMS.length}
          </div>
        </div>
      )}

      {collab && (
        <>
          {/* ── Dimensions ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {DIMS.map(dim => (
              <DimSection
                key={dim.id}
                dim={dim}
                score={scores[dim.id]}
                onScore={(id, v) => { setScores(p => ({ ...p, [id]: v })); setSaved(false) }}
                baseline={baselineMap?.[dim.id]}
              />
            ))}
          </div>

          {/* ── Summary ─────────────────────────────────────────────────── */}
          <div style={{
            background: 'white', borderRadius: 16, padding: '24px 28px',
            marginBottom: 20, border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', marginBottom: 20 }}>
              📊 Resumen · Tabla de puntuación
            </div>

            {/* Score table */}
            <div style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Dimensión</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Peso</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Puntuación</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Nivel</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Subtotal</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Baseline {targetRole}</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: '#475569', borderBottom: '2px solid #e2e8f0' }}>Cumple</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMS.map((dim, i) => {
                    const s = scores[dim.id]
                    const bl = baselineMap?.[dim.id]
                    const meets = s && bl ? s >= bl : null
                    return (
                      <tr key={dim.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>
                          {dim.icon} {dim.name}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                          {dim.weightLabel}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                          {s ? (
                            <span style={{ background: SCORE_COLORS[s], color: 'white', borderRadius: 6, padding: '3px 10px', fontWeight: 700, fontSize: 14 }}>{s}</span>
                          ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: s ? SCORE_COLORS[s] : '#cbd5e1', fontWeight: 600, fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>
                          {s ? dim.levels[s - 1].label : '—'}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: '#475569', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                          {s ? `${s} × ${dim.weightLabel} = ${(s * dim.weight).toFixed(2)}` : '—'}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                          {bl ?? '—'}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                          {meets === null ? <span style={{ color: '#cbd5e1' }}>—</span>
                            : meets ? <span style={{ color: '#16a34a', fontSize: 16 }}>✓</span>
                            : <span style={{ color: '#ef4444', fontSize: 16 }}>✗</span>}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Total row */}
                  <tr style={{ background: '#f0fdfa', fontWeight: 800 }}>
                    <td style={{ padding: '12px 14px', color: '#0f172a', borderTop: '2px solid #99f6e4' }} colSpan={2}>
                      Total ponderado
                    </td>
                    <td colSpan={2} style={{ padding: '12px 14px', textAlign: 'center', borderTop: '2px solid #99f6e4' }}>
                      {weightedAvg ? (
                        <span style={{
                          background: SCORE_COLORS[Math.round(weightedAvg)],
                          color: 'white', borderRadius: 8, padding: '4px 14px',
                          fontSize: 16, fontWeight: 800,
                        }}>
                          {weightedAvg} / 5.00
                        </span>
                      ) : <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', borderTop: '2px solid #99f6e4', color: '#0d9488' }}>
                      {weightedAvg ?? '—'}
                    </td>
                    <td style={{ padding: '12px 14px', borderTop: '2px solid #99f6e4' }} />
                    <td style={{ padding: '12px 14px', textAlign: 'center', borderTop: '2px solid #99f6e4' }}>
                      {meetsAllBaseline === null ? null
                        : meetsAllBaseline
                        ? <span style={{ color: '#16a34a', fontWeight: 800 }}>✓ Cumple</span>
                        : <span style={{ color: '#ef4444', fontWeight: 800 }}>✗ No cumple</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mini rings */}
            {weightedAvg && (
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                <MiniRing value={weightedAvg} color={SCORE_COLORS[Math.round(weightedAvg)]} label="Score Desempeño" />
                {readinessPct && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: '50%',
                      background: `conic-gradient(${readinessStat?.color} ${readinessPct}%, #f1f5f9 0)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                    }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: '50%', background: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: readinessStat?.color }}>{readinessPct}%</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 8 }}>Readiness</div>
                    <div style={{
                      marginTop: 4, background: readinessStat?.bg, color: readinessStat?.color,
                      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, display: 'inline-block',
                    }}>{readinessStat?.label}</div>
                  </div>
                )}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>9-Box Desempeño</div>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: SCORE_COLORS[Math.round(weightedAvg)],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 800, color: 'white', margin: '0 auto',
                  }}>{Math.round(weightedAvg)}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>valor actualizado</div>
                </div>
              </div>
            )}
          </div>

          {/* ── Save ────────────────────────────────────────────────────── */}
          <div style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#475569', marginBottom: 14 }}>
              Guardar evaluación
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ flex: '1 1 160px' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Período</label>
                <input value={period} onChange={e => setPeriod(e.target.value)}
                  placeholder="ej. Q2 2026"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: '3 1 300px' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Notas del evaluador</label>
                <input value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Observaciones, contexto, acciones de seguimiento..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleSave} disabled={!allFilled} style={{
                padding: '12px 32px', borderRadius: 10, border: 'none',
                background: !allFilled ? '#e2e8f0' : saved ? '#16a34a' : '#0d9488',
                color: !allFilled ? '#94a3b8' : 'white',
                fontWeight: 700, fontSize: 15,
                cursor: !allFilled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              }}>
                {saved ? '✓ Evaluación guardada' : '💾 Guardar evaluación'}
              </button>
              {!allFilled && (
                <span style={{ fontSize: 13, color: '#f59e0b' }}>
                  ⚠ Faltan {DIMS.length - filledCount} dimensión{DIMS.length - filledCount !== 1 ? 'es' : ''} por evaluar — abre cada sección y selecciona un nivel
                </span>
              )}
              {saved && (
                <span style={{ fontSize: 13, color: '#16a34a' }}>
                  Perfil de {collab?.code} actualizado — 9-Box y heatmap sincronizados ✓
                </span>
              )}
            </div>
          </div>
        </>
      )}

      </>
      )} {/* end evalMode === 'desempeno' */}

      {/* ═══════════════════════════════ POTENTIAL MODE ═══════════════════════════ */}
      {evalMode === 'potencial' && (
        <>
          {/* Description */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed11, #0d948811)',
            border: '1px solid #7c3aed33',
            borderRadius: 12, padding: '14px 18px', marginBottom: 18,
          }}>
            <div style={{ fontSize: 13, color: '#4c1d95', fontWeight: 600, marginBottom: 4 }}>
              ¿Qué mide esta sección?
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
              El potencial evalúa la <strong>trayectoria futura</strong> del colaborador — no lo que hace hoy,
              sino su capacidad de crecer hacia roles de mayor complejidad. Se basa en tres dimensiones
              predichas por la investigación como los mejores indicadores de potencial de liderazgo:
              Agilidad de Aprendizaje, Complejidad de Pensamiento e Impulso y Aspiración.
              El resultado actualiza el eje de <strong>Potencial del 9-Box</strong>.
            </div>
          </div>

          {/* Collaborator selector (reuse same UI) */}
          <div style={{
            background: 'white', borderRadius: 14, padding: '18px 22px',
            marginBottom: 18, border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Colaborador
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {data.collaborators.map(c => (
                <button key={c.id} onClick={() => handleSelectCollab(c.id)} style={{
                  padding: '8px 18px', borderRadius: 24, border: '2px solid',
                  borderColor: selectedId === c.id ? '#7c3aed' : '#e2e8f0',
                  background: selectedId === c.id ? '#7c3aed' : 'white',
                  color: selectedId === c.id ? 'white' : '#475569',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {c.code}
                  {c.potentialScores && <span style={{ marginLeft: 6, opacity: 0.8, fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>
            {collab && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
                <strong style={{ color: '#1e293b' }}>{collab.currentPosition}</strong>
                {collab.potentialScores?.lastEvaluated && (
                  <span style={{ marginLeft: 10, color: '#94a3b8' }}>
                    Última eval: {collab.potentialScores.lastEvaluated}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {collab && (
            <div style={{
              background: 'white', borderRadius: 12, padding: '14px 20px',
              marginBottom: 20, border: '1px solid #e2e8f0',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                    Progreso evaluación — {collab.code}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>
                    {potFilledCount}/{POTENTIAL_DIMS.length} dimensiones
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: potAllFilled ? '#7c3aed' : '#a78bfa',
                    width: `${potProgressPct}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
              {potWeightedAvg && (
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed' }}>
                    {potWeightedAvg}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Score Potencial</div>
                </div>
              )}
            </div>
          )}

          {/* Potential dimension sections */}
          {collab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {POTENTIAL_DIMS.map(dim => (
                <DimSection
                  key={dim.id}
                  dim={dim}
                  score={potentialScores[dim.id]}
                  onScore={(id, v) => setPotentialScores(prev => ({ ...prev, [id]: v }))}
                  baseline={null}
                />
              ))}

              {/* Notes */}
              <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                  Observaciones de potencial
                </label>
                <textarea
                  value={potentialNotes}
                  onChange={e => setPotentialNotes(e.target.value)}
                  placeholder="Anota evidencias observables de aprendizaje, pensamiento estratégico o impulso..."
                  rows={3}
                  style={{
                    width: '100%', boxSizing: 'border-box', borderRadius: 8,
                    border: '1.5px solid #e2e8f0', padding: '10px 14px',
                    fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                  }}
                />
              </div>

              {/* Summary + Save */}
              <div style={{
                background: 'white', borderRadius: 14, padding: '20px 24px',
                border: '1.5px solid #7c3aed33',
                boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                  Resumen de Potencial — {collab?.code}
                </div>

                <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                  {POTENTIAL_DIMS.map(d => (
                    <MiniRing
                      key={d.id}
                      value={potentialScores[d.id] || null}
                      max={5}
                      color="#7c3aed"
                      label={d.name.split(' ').slice(0,2).join(' ')}
                    />
                  ))}
                </div>

                {potWeightedAvg && (
                  <div style={{
                    background: '#f5f3ff', borderRadius: 10, padding: '12px 16px',
                    marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>Score Ponderado de Potencial</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>Agilidad ×0.40 + Pensamiento ×0.30 + Impulso ×0.30</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#7c3aed' }}>
                      {potWeightedAvg} <span style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>/ 5</span>
                    </div>
                  </div>
                )}

                {potWeightedAvg && (
                  <div style={{
                    background: '#f8fafc', borderRadius: 8, padding: '10px 14px',
                    marginBottom: 16, fontSize: 13, color: '#475569',
                  }}>
                    <strong>Posición en 9-Box (eje Potencial):</strong>{' '}
                    {potWeightedAvg >= 4.5 ? '5 — Alto potencial excepcional'
                      : potWeightedAvg >= 3.5 ? '4 — Alto potencial'
                      : potWeightedAvg >= 2.5 ? '3 — Potencial moderado–alto'
                      : potWeightedAvg >= 1.5 ? '2 — Potencial en desarrollo'
                      : '1 — Potencial limitado en este momento'}
                  </div>
                )}

                <button
                  onClick={handleSavePotential}
                  disabled={!potAllFilled || !collab}
                  style={{
                    width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
                    background: potAllFilled && collab ? '#7c3aed' : '#e2e8f0',
                    color: potAllFilled && collab ? 'white' : '#94a3b8',
                    fontWeight: 800, fontSize: 15, cursor: potAllFilled && collab ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  {potentialSaved
                    ? '✓ Potencial guardado y 9-Box actualizado'
                    : potAllFilled
                      ? '💾 Guardar evaluación de potencial'
                      : `Completa ${POTENTIAL_DIMS.length - potFilledCount} dimensión(es) restantes`}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

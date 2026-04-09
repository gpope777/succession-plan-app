export const initialData = {
  meta: {
    department: 'Business Intelligence',
    organization: 'La Organización',
    period: 'Spring 2026',
    nextReview: 'Q2 2026',
    responsible: 'People Operations',
    qualityScore: 65,
    criticalPositions: 4,
  },

  collaborators: [
    {
      id: 'UL',
      code: 'Colaborador UL',
      currentPosition: 'Unit Lead — Business Intelligence',
      department: 'Epidemiología · Salud pública · Healthcare analytics',
      readinessStatus: 'Listo pronto',
      readinessPercentage: 72,
      timelineMonths: '18 meses',
      targetPosition: 'Directora de BI',
      colorCode: 'teal',
      priority: 1,
      strengths: [
        '2 maestrías',
        'SQL/R',
        'Publicaciones académicas',
        'Lideró 4 personas',
      ],
      nineBox: { performance: 4, potential: 4 },
      gaps: [
        { name: 'Power BI avanzado', detail: 'Usa Tableau; la organización opera en Power BI', severity: 'Crítica' },
        { name: 'Certificación PMP / Gestión de proyectos', detail: 'No evidenciada en resume', severity: 'Crítica' },
        { name: 'Capacitación en IA generativa y analítica', detail: 'No evidenciada — competencia estratégica 2025', severity: 'Crítica' },
        { name: 'Manejo de presupuesto y planificación operacional', detail: 'Requiere mayor exposición a nivel director', severity: 'Alta' },
        { name: 'Presentación e influencia ejecutiva (C-Level)', detail: 'Exposición directa CEO/COO no evidenciada', severity: 'Alta' },
      ],
      idp: [
        {
          phase: 1, duration: '0–6 meses',
          actions: [
            { text: 'Certificación Power BI avanzado (prioridad máxima)', status: 'pending' },
            { text: 'Certificación PMP o formación Agile formal', status: 'pending' },
            { text: 'Capacitación IA generativa para BI', status: 'pending' },
          ],
        },
        {
          phase: 2, duration: '6–12 meses',
          actions: [
            { text: 'Mentoría ejecutiva con COO/CFO', status: 'pending' },
            { text: 'Liderazgo de proyectos de transformación BI', status: 'pending' },
            { text: 'Exposición directa a presentaciones al board', status: 'pending' },
          ],
        },
        {
          phase: 3, duration: '12–18 meses',
          actions: [
            { text: 'Shadowing de Director de Operaciones', status: 'pending' },
            { text: 'Desarrollar la estrategia técnica de 3 años para BI', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'A1',
      code: 'Colaborador A1',
      currentPosition: 'Analista 1 — Business Intelligence',
      department: 'Evaluación de programas · Claims management · Salud mental',
      readinessStatus: 'Listo pronto',
      readinessPercentage: 35,
      timelineMonths: '12–18 meses',
      targetPosition: 'Analista Senior / Supervisor',
      colorCode: 'purple',
      priority: 2,
      strengths: [
        'SQL + Power BI activos',
        'RAF analytics',
        '7 años contexto interno en la organización',
      ],
      nineBox: { performance: 4, potential: 4 },
      gaps: [
        { name: 'IA y machine learning', detail: 'Competencia estratégica clave', severity: 'Crítica' },
        { name: "Bachelor's degree", detail: 'Requerido para promoción a Supervisor', severity: 'Crítica' },
        { name: 'Liderazgo de personas', detail: 'Sin experiencia formal de supervisión', severity: 'Alta' },
        { name: 'Comunicación ejecutiva', detail: 'Desarrollar skills de presentación a C-Level', severity: 'Media' },
      ],
      idp: [
        {
          phase: 1, duration: '3–6 meses',
          actions: [
            { text: 'SQL avanzado y optimización de queries', status: 'pending' },
            { text: 'Fundamentals de Machine Learning (Coursera/Udacity)', status: 'pending' },
          ],
        },
        {
          phase: 2, duration: '6–12 meses',
          actions: [
            { text: 'Mentoría de liderazgo con UL', status: 'pending' },
            { text: 'Project lead de análisis de high-impact', status: 'pending' },
            { text: 'Capacitación IA generativa', status: 'pending' },
          ],
        },
        {
          phase: 3, duration: '12–18 meses',
          actions: [
            { text: 'Completar o continuar estudios universitarios', status: 'pending' },
            { text: 'Supervisar a un analista junior', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'A2',
      code: 'Colaborador A2',
      currentPosition: 'Analista 2 — Business Intelligence',
      department: 'Contabilidad · Finanzas · Revenue cycle · Healthcare',
      readinessStatus: 'Listo futuro',
      readinessPercentage: 22,
      timelineMonths: '18–24 meses',
      targetPosition: 'Analista Senior / Supervisor (especializado en finanzas)',
      colorCode: 'purple',
      priority: 4,
      strengths: [
        'Claims Medicaid/Medicare expertise',
        'Análisis de salud mental',
        'Visualizaciones complejas',
      ],
      nineBox: { performance: 3, potential: 3 },
      gaps: [
        { name: 'SQL', detail: 'Requisito fundamental para autonomía', severity: 'Crítica' },
        { name: 'Power BI avanzado', detail: 'Técnicas de storytelling y dashboards interactivos', severity: 'Crítica' },
        { name: 'IA y machine learning', detail: 'Aplicaciones en predicción de claims', severity: 'Alta' },
        { name: 'Estadística aplicada', detail: 'Análisis multivariado, regresión', severity: 'Alta' },
      ],
      idp: [
        {
          phase: 1, duration: '4–6 meses',
          actions: [
            { text: 'SQL fundamentals (DataLemur, modo.com — gratuito)', status: 'pending' },
            { text: 'Power BI intermediate certification', status: 'pending' },
          ],
        },
        {
          phase: 2, duration: '6–12 meses',
          actions: [
            { text: 'Estadística aplicada para análisis de claims', status: 'pending' },
            { text: 'Machine learning basado en casos de uso financiero', status: 'pending' },
            { text: 'Certificación IA generativa', status: 'pending' },
          ],
        },
        {
          phase: 3, duration: '12–24 meses',
          actions: [
            { text: 'Titular de métricas de revenue cycle y costo-efectividad', status: 'pending' },
            { text: 'Desarrollar track especializado BI financiero', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'A3',
      code: 'Colaborador A3',
      currentPosition: 'Analista 3 — Business Intelligence (Interno)',
      department: 'Analítica de datos · RAF · Claims · PMG · Finanzas',
      readinessStatus: 'Listo pronto',
      readinessPercentage: 62,
      timelineMonths: '12–18 meses',
      targetPosition: 'Analista BI Financiero',
      colorCode: 'amber',
      priority: 3,
      strengths: [
        'Contabilidad hospitalaria expertise',
        'Revenue cycle dominio',
        'AP/AR/GL profundidad',
        'El más listo entre analistas',
      ],
      nineBox: { performance: 4, potential: 4 },
      gaps: [
        { name: 'SQL y optimización', detail: 'Ya usa SQL; necesita profundidad en queries complejas', severity: 'Media' },
        { name: 'Power BI certificación formal', detail: 'Domina prácticamente; necesita credencial oficial', severity: 'Media' },
        { name: 'IA en contexto financiero', detail: 'Aplicar IA a predicción de revenue y análisis de ciclos', severity: 'Alta' },
        { name: 'Presentación ejecutiva y comunicación a C-Level', detail: 'Produce dashboards; necesita exposición a presentación estratégica', severity: 'Media' },
      ],
      idp: [
        {
          phase: 1, duration: '3–6 meses',
          actions: [
            { text: 'Power BI certification oficial', status: 'pending' },
            { text: 'SQL avanzado (CTEs, window functions, optimización)', status: 'pending' },
            { text: 'Capacitación IA generativa y aplicaciones financieras', status: 'pending' },
          ],
        },
        {
          phase: 2, duration: '6–12 meses',
          actions: [
            { text: 'Presentar reportes de RAF/claims directamente a liderazgo senior', status: 'pending' },
            { text: 'Mentoría de A2 en SQL y Power BI', status: 'pending' },
          ],
        },
        {
          phase: 3, duration: '12–18 meses',
          actions: [
            { text: 'Liderar proyecto de analítica financiera de alto impacto', status: 'pending' },
            { text: 'Desarrollar visión de BI financiero para la organización', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 'MB',
      code: 'Colaborador MB',
      currentPosition: 'Medical Biller — Facturación y Reconciliación',
      department: 'Revenue cycle · Codificación médica · Compliance de salud',
      readinessStatus: 'Listo pronto',
      readinessPercentage: 58,
      timelineMonths: '12–18 meses',
      targetPosition: 'Senior Biller / SME Revenue Cycle',
      colorCode: 'blue',
      priority: 5,
      strengths: [
        '20+ años billing expertise',
        'ICD-10/CPT mastery',
        'Supervisora previa',
        'HIPAA compliant',
        'Activo más valioso para validación de datos',
      ],
      nineBox: { performance: 4, potential: 3 },
      gaps: [
        { name: 'Excel avanzado y herramientas analíticas', detail: 'Actualmente manual; necesita automatización', severity: 'Media' },
        { name: 'IA para billing y revenue cycle', detail: 'Aplicar IA a anomaly detection y compliance', severity: 'Media' },
      ],
      idp: [
        {
          phase: 1, duration: '0–6 meses',
          actions: [
            { text: 'Excel avanzado (tablas dinámicas, macros básicas, Power Query)', status: 'pending' },
          ],
        },
        {
          phase: 2, duration: '6–12 meses',
          actions: [
            { text: 'Documentar formalmente rol como SME (subject matter expert)', status: 'pending' },
            { text: 'Crear protocolo estructurado de consulta con equipo BI', status: 'pending' },
            { text: 'Iniciar documentación de SOPs de billing bajo su liderazgo', status: 'pending' },
          ],
        },
        {
          phase: 3, duration: '12–18 meses',
          actions: [
            { text: 'Certificación IA aplicada a revenue cycle', status: 'pending' },
            { text: 'Formalizar posición SME en estructura organizacional', status: 'pending' },
          ],
        },
      ],
    },
  ],

  heatmap: [
    { dimension: 'Capacidad técnico-analítica (BI/Stats)', UL: 4, A1: 4, A2: 2, A3: 2, MB: null },
    { dimension: 'Comunicación e influencia', UL: 4, A1: 4, A2: 3, A3: 3, MB: 4 },
    { dimension: 'Cumplimiento y estandarización (HIPAA/SOPs)', UL: 5, A1: 4, A2: 3, A3: 3, MB: 5 },
    { dimension: 'Liderazgo de personas', UL: 4, A1: 3, A2: 2, A3: 2, MB: 3 },
    { dimension: 'Gestión de proyectos y flujo operativo', UL: 3, A1: 4, A2: 3, A3: 3, MB: 4 },
    { dimension: 'Competencia digital e IA', UL: 1, A1: 1, A2: 1, A3: 1, MB: 1 },
    { dimension: 'Conocimiento del dominio de salud (PR)', UL: 5, A1: 5, A2: 4, A3: 4, MB: 5 },
  ],

  recommendations: [
    {
      priority: 1,
      color: 'teal',
      title: 'UL: Mayor inversión inmediata',
      detail: 'Es la candidata más lista y el tiempo de preparación más corto (18 meses). Certificación Power BI + PMP son las dos acciones más críticas. Cada mes sin IDP activo es tiempo perdido en el pipeline más importante.',
    },
    {
      priority: 2,
      color: 'purple',
      title: 'A1/A2: SQL como prerequisito técnico',
      detail: 'SQL es el prerequisito técnico más urgente para que los analistas puedan operar con autonomía. Sin él, dependen 100% de UL para extracción de datos. Recomendado: modo.com o DataLemur (gratuitos).',
    },
    {
      priority: 3,
      color: 'blue',
      title: 'MB: Documentación y formalización',
      detail: 'MB no está en el pipeline técnico de BI pero es el activo más valioso para validar los datos de facturación. Documentar su rol como SME y crear protocolo de consulta con el equipo.',
    },
    {
      priority: 4,
      color: 'amber',
      title: 'A2: Track especializado',
      detail: 'El perfil de A2 no encaja perfecto en el pipeline estándar. Su fortaleza financiera sugiere un track especializado. Proponer formalmente este rol a People Operations.',
    },
  ],

  values: [
    { id: 1, name: 'Trabajo en Equipo y Colaboración', color: 'teal', icon: '🤝', definition: 'Colaborar efectivamente con colegas, compartir conocimiento, apoyar a otros sin competir internamente, y contribuir a una cultura de inclusión y respeto.', behaviors: ['Comparte información abiertamente con el equipo', 'Apoya a pares sin buscar reconocimiento personal', 'Construye alianzas más allá de su departamento', 'Facilita la colaboración incluso en conflicto'] },
    { id: 2, name: 'Responsabilidad', color: 'amber', icon: '✅', definition: 'Asumir la responsabilidad de las acciones, decisiones y resultados, siendo confiable al entregar resultados y manteniendo un compromiso con la excelencia.', behaviors: ['Cumple compromisos de forma autónoma', 'Hace seguimiento activo del progreso', 'Asume ownership del fracaso sin externalizar', 'Entrega resultados de alta calidad de forma consistente'] },
    { id: 3, name: 'Innovación y Creatividad', color: 'coral', icon: '💡', definition: 'Desafiar el status quo, proponer nuevas soluciones, adoptar tecnologías emergentes y ver el cambio como oportunidad para mejorar continuamente.', behaviors: ['Propone mejoras de proceso continuamente', 'Adopta nuevas herramientas antes que la competencia', 'Construye procesos de mejora sistémica', 'Ve el cambio como oportunidad, no como amenaza'] },
    { id: 4, name: 'Flexibilidad y Adaptabilidad', color: 'purple', icon: '🔄', definition: 'Responder ágilmente a cambios sin resistencia, mantener la productividad bajo presión y ajustarse a nuevas prioridades sin perder el enfoque.', behaviors: ['Se adapta sin perder productividad', 'No resiste el cambio organizacional', 'Guía al equipo en transiciones complejas', 'Mantiene cohesión durante la incertidumbre'] },
    { id: 5, name: 'Aprendizaje Continuo', color: 'blue', icon: '📚', definition: 'Invertir en desarrollo personal, buscar retroalimentación, adoptar nuevas tecnologías (especialmente IA), y modelar la curiosidad intelectual.', behaviors: ['Busca desarrollo por iniciativa propia', 'Adopta IA y nuevas tecnologías activamente', 'Aprende rápidamente de los errores', 'Invierte tiempo en el aprendizaje del equipo'] },
    { id: 6, name: 'Integridad y Honestidad', color: 'navy', icon: '⚖️', definition: 'Actuar con principios morales sólidos, siendo veraz, transparente y ético en todas las interacciones, construyendo confianza con los demás.', behaviors: ['Toma decisiones basadas en principios éticos', 'Se comunica de manera honesta y transparente', 'Asume responsabilidad de sus acciones', 'Nunca compromete la integridad de datos bajo presión'] },
    { id: 7, name: 'Transparencia y Comunicación', color: 'navy', icon: '📢', definition: 'Comunicar de manera clara, oportuna y honesta; escuchar activamente; y asegurar que la información fluya libremente en todos los niveles.', behaviors: ['Comunica hallazgos claramente a cualquier audiencia', 'Escucha activamente a otros', 'Comunica malas noticias a tiempo', 'Practica data storytelling a nivel ejecutivo'] },
  ],

  competencies: [
    { id: 1, name: 'Collaborative Problem Solving', category: 'behavioral', relatedValue: 'Trabajo en Equipo y Colaboración', description: 'Capacidad de trabajar con otros para identificar problemas, generar soluciones creativas, y ejecutar iniciativas complejas que requieren coordinación interdepartamental.', analyst: 'Comparte info, apoya a pares, no compite internamente', supervisor: 'Facilita trabajo del equipo, construye puentes interdept.', director: 'Crea alianzas estratégicas, alinea BI con la organización' },
    { id: 2, name: 'Results Orientation', category: 'behavioral', relatedValue: 'Responsabilidad', description: 'Enfoque en lograr objetivos y entregar resultados medibles, manteniendo altos estándares de calidad y asumiendo ownership de los resultados.', analyst: 'Cumple compromisos, hace seguimiento autónomo', supervisor: 'Ownership de resultados del equipo, modela accountability', director: 'Accountability institucional, no externaliza resultados' },
    { id: 3, name: 'Creative Thinking', category: 'behavioral', relatedValue: 'Innovación y Creatividad', description: 'Habilidad para pensar críticamente, cuestionar supuestos, y generar alternativas innovadoras a problemas establecidos.', analyst: 'Propone mejoras de proceso, explora herramientas nuevas', supervisor: 'Crea espacio para innovar, integra IA en flujos del equipo', director: 'Define visión tecnológica del departamento' },
    { id: 4, name: 'Change Management', category: 'behavioral', relatedValue: 'Flexibilidad y Adaptabilidad', description: 'Capacidad de adaptarse a cambios organizacionales, mantener productividad bajo incertidumbre y ayudar a otros a navegar transiciones.', analyst: 'Se adapta sin perder productividad, no resiste el cambio', supervisor: 'Guía al equipo en transiciones, mantiene cohesión', director: 'Lidera transformaciones organizacionales complejas' },
    { id: 5, name: 'Learning Orientation', category: 'behavioral', relatedValue: 'Aprendizaje Continuo', description: 'Mentalidad de crecimiento, búsqueda activa de retroalimentación, inversión en desarrollo personal y adopción de IA como competencia estratégica.', analyst: 'Busca desarrollo por iniciativa, adopta IA activamente', supervisor: 'Invierte en desarrollo del equipo, crea cultura de aprendizaje', director: 'Define estrategia de capacitación e innovación del depto.' },
    { id: 6, name: 'Ethical Decision-Making', category: 'behavioral', relatedValue: 'Integridad y Honestidad', description: 'Toma decisiones basadas en principios morales sólidos, con transparencia y responsabilidad, especialmente crítico en el manejo de datos de salud (HIPAA).', analyst: 'Reporta errores, documenta fielmente, no manipula datos', supervisor: 'Decisiones consistentes con políticas, da crédito a otros', director: 'Accountability institucional, modelo ético visible' },
    { id: 7, name: 'Effective Communication', category: 'behavioral', relatedValue: 'Transparencia y Comunicación', description: 'Habilidad de comunicar hallazgos técnicos a audiencias no técnicas, practicar data storytelling ejecutivo y facilitar diálogo transparente.', analyst: 'Comunica hallazgos claramente, escucha activamente', supervisor: 'Comunica malas noticias a tiempo, facilita diálogo', director: 'Data storytelling ejecutivo, alinea narrativa organizacional' },
    { id: 8, name: 'AI & Data Literacy', category: 'technical', relatedValue: 'Aprendizaje Continuo', description: 'Capacidad de adoptar, implementar e integrar IA en flujos de trabajo, con énfasis en cumplimiento HIPAA y governance de datos. Competencia estratégica emergente 2025.', analyst: 'Usa IA para acelerar tareas (AI User)', supervisor: 'Diseña flujos donde IA amplifica la capacidad (AI Integrator)', director: 'Define visión de IA del departamento (AI Strategist)' },
  ],
}

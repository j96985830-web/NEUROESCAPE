/*
 * GENERADO AUTOMÁTICAMENTE por scripts/build-content.js a partir de content/.
 * No edite este archivo a mano: use el editor (/admin) o los JSON de content/.
 * Contenido educativo: no usar para diagnóstico ni dictamen.
 */
window.NEUROSCAPE_DATA = {
  "sources": [
    {
      "id": "morris",
      "short": "Morris & Maisto",
      "title": "Introducción a la psicología",
      "authors": "Charles G. Morris y Albert A. Maisto",
      "edition": "12.ª edición",
      "use": "Funciones cerebrales, memoria, emoción y bases biológicas de la conducta.",
      "locator": "Bases biológicas de la conducta; estructuras cerebrales y memoria."
    },
    {
      "id": "curtis",
      "short": "Curtis & Barnes",
      "title": "Biología",
      "authors": "Helena Curtis, N. Sue Barnes y colaboradores",
      "edition": "7.ª edición",
      "use": "Organización del encéfalo, diencéfalo, sistema límbico, cerebelo y sistema activador reticular.",
      "locator": "Sistema nervioso; organización y funciones encefálicas."
    },
    {
      "id": "hilares",
      "short": "Hilares",
      "title": "Neurociencia para colorear",
      "authors": "Edgar Hilares",
      "edition": "Material de neuroanatomía",
      "use": "Referencia de localización e identificación anatómica de estructuras.",
      "locator": "Láminas de neuroanatomía encefálica."
    },
    {
      "id": "nih3d",
      "short": "NIH 3D / HRA",
      "title": "3D Reference Organ for Brain, Male v1.3",
      "authors": "Kristen Browne y Heidi Schlehlein",
      "edition": "NIH 3D, entrada 3DPX-020960, versión 1.01 (2023)",
      "use": "Modelo anatómico interactivo de esta versión. Derivado del Allen Human Reference Atlas – 3D, 2020.",
      "locator": "Nodos anatómicos auditados en el visor oficial del GLB.",
      "license": "CC BY 4.0",
      "attribution": "Kristen Browne; Heidi Schlehlein. 2023. 3D Reference Organ for Brain, Male v1.3. NIH 3D. https://doi.org/10.48539/HBM929.XKCL.339",
      "url": "https://3d.nih.gov/entries/20960?version=1.01"
    },
    {
      "id": "vazquez",
      "short": "Vázquez & Catalán",
      "title": "Casos prácticos en psicología forense",
      "authors": "Blanca Vázquez Mezquita y M.ª José Catalán Frías",
      "edition": "Texto de psicología forense",
      "use": "Alcance y método de la evaluación forense: entrevista, documentación, observación y pruebas.",
      "locator": "Peritaje y evaluación psicológica forense."
    },
    {
      "id": "alcazar",
      "short": "Alcázar-Córcoles",
      "title": "En la mente del menor delincuente. Casos de psicología",
      "authors": "Miguel Ángel Alcázar-Córcoles",
      "edition": "Texto de psicología forense",
      "use": "Importancia de factores personales, familiares, culturales y ambientales en el análisis de la conducta.",
      "locator": "Casos de psicología forense y análisis contextual."
    }
  ],
  "structures": [
    {
      "id": "frontal",
      "name": "Lóbulo frontal",
      "group": "Corteza",
      "location": "Porción anterior de la corteza cerebral.",
      "description": "Región cortical que integra información procedente de otras áreas y participa en conductas dirigidas a metas.",
      "function": "Participa en atención, conducta dirigida a metas, experiencias emocionales y aspectos de la personalidad.",
      "processes": [
        "Atención",
        "Conducta dirigida a metas",
        "Regulación emocional"
      ],
      "forensic": "Puede contextualizar procesos psicológicos examinados durante una evaluación; no establece por sí solo una conclusión jurídica.",
      "warning": "Una región frontal no explica por sí sola una conducta ni permite inferir imputabilidad.",
      "evidence": "directa",
      "connections": [
        "prefrontal",
        "limbico",
        "talamo"
      ],
      "sources": [
        "morris",
        "curtis"
      ],
      "position": {
        "x": 34,
        "y": 25,
        "view": "surface"
      }
    },
    {
      "id": "prefrontal",
      "name": "Corteza prefrontal",
      "group": "Corteza",
      "location": "Región anterior del lóbulo frontal.",
      "description": "Zona anterior de la corteza frontal representada aquí como una región funcional de exploración.",
      "function": "Participa en solución de problemas y en procesos relacionados con el juicio.",
      "processes": [
        "Juicio",
        "Solución de problemas",
        "Toma de decisiones"
      ],
      "forensic": "Ayuda a contextualizar procesos cognitivos que pueden evaluarse psicológicamente, sin decidir por sí misma responsabilidad jurídica.",
      "warning": "Daño o funcionamiento de una zona cerebral no equivale automáticamente a incapacidad legal.",
      "evidence": "directa",
      "connections": [
        "frontal",
        "talamo",
        "limbico"
      ],
      "sources": [
        "morris"
      ],
      "position": {
        "x": 20,
        "y": 40,
        "view": "surface"
      }
    },
    {
      "id": "temporal",
      "name": "Lóbulo temporal",
      "group": "Corteza",
      "location": "Porción lateral e inferior de cada hemisferio cerebral; incluye regiones temporales mediales y laterales.",
      "description": "Lóbulo cortical incluido como ficha principal, separado del hipocampo, que conserva su propia ficha profunda.",
      "function": "Las fuentes lo relacionan con componentes de memoria y con procesamiento de información.",
      "processes": [
        "Memoria",
        "Procesamiento de información"
      ],
      "forensic": "Permite contextualizar la memoria como un proceso de red en la evaluación psicológica, sin convertir la actividad de un lóbulo en una conclusión sobre un testimonio.",
      "warning": "El lóbulo temporal no es un registro de hechos ni una medida aislada de credibilidad.",
      "evidence": "directa",
      "connections": [
        "hipocampo",
        "amigdala",
        "limbico"
      ],
      "sources": [
        "morris",
        "hilares"
      ],
      "position": {
        "x": 63,
        "y": 42,
        "view": "surface"
      }
    },
    {
      "id": "hipocampo",
      "name": "Hipocampo",
      "group": "Profundas",
      "location": "Región temporal medial, vinculada al sistema límbico.",
      "description": "Estructura profunda incluida en la formación hipocampal.",
      "function": "Es esencial para formar nuevos recuerdos y se relaciona con memoria episódica y espacial.",
      "processes": [
        "Memoria episódica",
        "Aprendizaje",
        "Memoria espacial"
      ],
      "forensic": "Es relevante para comprender procesos de memoria relacionados con el testimonio, sin asumir que un recuerdo reproduce literalmente un hecho.",
      "warning": "Memoria no significa grabación exacta de los acontecimientos.",
      "evidence": "directa",
      "connections": [
        "amigdala",
        "limbico",
        "calloso"
      ],
      "sources": [
        "morris",
        "hilares"
      ],
      "position": {
        "x": 54,
        "y": 60,
        "view": "deep"
      }
    },
    {
      "id": "amigdala",
      "name": "Amígdala",
      "group": "Profundas",
      "location": "Región temporal medial; parte del sistema límbico.",
      "description": "Complejo profundo relacionado con el procesamiento de información emocional.",
      "function": "Participa en la regulación de emociones, memoria emocional e interpretación de expresiones emocionales.",
      "processes": [
        "Emoción",
        "Memoria emocional",
        "Procesamiento de expresiones"
      ],
      "forensic": "Permite explicar por qué componentes emocionales pueden relacionarse con recuerdo e interpretación, dentro de una evaluación integral.",
      "warning": "Amígdala no equivale a violencia ni permite predecir conducta delictiva.",
      "evidence": "directa",
      "connections": [
        "hipocampo",
        "limbico",
        "hipotalamo"
      ],
      "sources": [
        "morris",
        "curtis"
      ],
      "position": {
        "x": 64,
        "y": 66,
        "view": "deep"
      }
    },
    {
      "id": "limbico",
      "name": "Sistema límbico",
      "group": "Profundas",
      "location": "Conjunto de estructuras profundas y corticales mediales.",
      "description": "Sistema funcional que reúne estructuras relacionadas con emoción, aprendizaje y respuestas al estrés.",
      "function": "Participa en aprendizaje y conducta emocional; coordina respuestas durante el estrés.",
      "processes": [
        "Emoción",
        "Aprendizaje",
        "Estrés"
      ],
      "forensic": "Ofrece un puente general para discutir procesos emocionales en evaluación psicológica, nunca una explicación única de conducta.",
      "warning": "Cerebro, proceso psicológico y contexto interactúan: el sistema límbico no determina una conducta.",
      "evidence": "directa",
      "connections": [
        "amigdala",
        "hipocampo",
        "hipotalamo",
        "frontal"
      ],
      "sources": [
        "curtis",
        "morris"
      ],
      "position": {
        "x": 48,
        "y": 50,
        "view": "deep"
      }
    },
    {
      "id": "talamo",
      "name": "Tálamo",
      "group": "Diencéfalo",
      "location": "Diencéfalo, en posición central y profunda.",
      "description": "Estructura diencefálica de relevo e integración.",
      "function": "Funciona como estación de relevo e integración de gran parte de la información sensorial.",
      "processes": [
        "Integración sensorial",
        "Procesamiento de información",
        "Atención"
      ],
      "forensic": "Permite explicar, en términos generales, cómo información que se procesa contribuye a procesos psicológicos superiores; no es una medida pericial.",
      "warning": "La relevancia forense es un puente didáctico; no una relación diagnóstica directa.",
      "evidence": "directa",
      "connections": [
        "reticular",
        "prefrontal",
        "frontal"
      ],
      "sources": [
        "curtis",
        "hilares"
      ],
      "position": {
        "x": 51,
        "y": 47,
        "view": "deep"
      }
    },
    {
      "id": "hipotalamo",
      "name": "Hipotálamo",
      "group": "Diencéfalo",
      "location": "Diencéfalo, inferior al tálamo.",
      "description": "Estructura diencefálica integrada en circuitos de regulación.",
      "function": "Participa en regulación de la motivación y en respuestas emocionales.",
      "processes": [
        "Motivación",
        "Emoción"
      ],
      "forensic": "Puede incorporarse al análisis didáctico de procesos motivacionales y emocionales examinados psicológicamente.",
      "warning": "Hipotálamo no equivale a conducta delictiva ni explica una conducta en aislamiento.",
      "evidence": "directa",
      "connections": [
        "limbico",
        "amigdala",
        "reticular"
      ],
      "sources": [
        "curtis",
        "hilares"
      ],
      "position": {
        "x": 51,
        "y": 56,
        "view": "deep"
      }
    },
    {
      "id": "reticular",
      "name": "Formación reticular",
      "group": "Tronco",
      "location": "Red neuronal distribuida en el tronco del encéfalo.",
      "description": "Sistema representado en relación con el sistema activador reticular.",
      "function": "Junto con neuronas talámicas, participa en alerta, atención, vigilia, conciencia y filtrado de estímulos.",
      "processes": [
        "Alerta",
        "Atención",
        "Vigilia",
        "Conciencia"
      ],
      "forensic": "Puede contextualizar el estado de activación y atención en procesos cognitivos, entrevistas y evaluación; no establece una conclusión aislada.",
      "warning": "La atención se evalúa con múltiples datos; esta estructura no ofrece una medida clínica por sí sola.",
      "evidence": "directa",
      "connections": [
        "talamo",
        "hipotalamo",
        "cerebelo"
      ],
      "sources": [
        "curtis"
      ],
      "position": {
        "x": 52,
        "y": 77,
        "view": "deep"
      }
    },
    {
      "id": "cerebelo",
      "name": "Cerebelo",
      "group": "Tronco",
      "location": "Región posterior e inferior del encéfalo.",
      "description": "Estructura posterior con una contribución secundaria en este enfoque neuropsicológico-forense.",
      "function": "Coordina movimientos, equilibrio y ejecución eficiente de secuencias motoras.",
      "processes": [
        "Coordinación motora",
        "Aprendizaje procedimental"
      ],
      "forensic": "Las fuentes aportadas respaldan su papel motor, de equilibrio y de secuencias, pero no establecen una aplicación forense directa.",
      "interpretiveBridge": "Como decisión didáctica, se incorpora para mostrar que la exploración neuropsicológica no debe reducirse a una sola región. Este puente no atribuye una conducta ni una consecuencia jurídica al cerebelo.",
      "warning": "No se presenta como explicación principal de procesos psicológicos forenses.",
      "evidence": "directa",
      "connections": [
        "reticular",
        "calloso"
      ],
      "sources": [
        "curtis",
        "hilares"
      ],
      "position": {
        "x": 78,
        "y": 79,
        "view": "surface"
      }
    },
    {
      "id": "calloso",
      "name": "Cuerpo calloso",
      "group": "Sustancia blanca",
      "location": "Comisura de sustancia blanca entre los hemisferios cerebrales.",
      "description": "Principal vía comisural visible en una perspectiva medial.",
      "function": "Conecta hemisferios y permite su comunicación y coordinación.",
      "processes": [
        "Integración interhemisférica",
        "Comunicación entre hemisferios"
      ],
      "forensic": "Es útil para explicar que las funciones cerebrales no deben representarse como procesos totalmente aislados.",
      "warning": "Conectividad cerebral no permite atribuir una conducta a una sola región o vía.",
      "evidence": "directa",
      "connections": [
        "hipocampo",
        "cerebelo",
        "frontal"
      ],
      "sources": [
        "curtis",
        "hilares"
      ],
      "position": {
        "x": 49,
        "y": 40,
        "view": "deep"
      }
    }
  ],
  "routes": [
    {
      "id": "cognicion",
      "number": "01",
      "name": "Cognición y juicio",
      "color": "#59c3ff",
      "structures": [
        "frontal",
        "prefrontal"
      ],
      "flow": [
        "Atención y conducta dirigida a metas",
        "Solución de problemas y juicio",
        "Evaluación del funcionamiento psicológico"
      ],
      "forensic": "En evaluación forense pueden explorarse capacidades y funcionamiento psicológico mediante múltiples fuentes; esta ruta no decide responsabilidad jurídica.",
      "warning": "El funcionamiento de una estructura no determina imputabilidad.",
      "sources": [
        "morris",
        "vazquez"
      ]
    },
    {
      "id": "memoria",
      "number": "02",
      "name": "Memoria y testimonio",
      "color": "#9d8cff",
      "structures": [
        "temporal",
        "hipocampo",
        "amigdala",
        "limbico"
      ],
      "flow": [
        "Formación de recuerdos",
        "Memoria episódica y componente emocional",
        "Análisis psicológico del testimonio"
      ],
      "forensic": "La evaluación de la credibilidad o del testimonio no demuestra por sí sola que un hecho ocurrió; se integra con otros datos.",
      "warning": "Memoria ≠ reproducción exacta de los hechos.",
      "sources": [
        "morris",
        "vazquez"
      ]
    },
    {
      "id": "emocion",
      "number": "03",
      "name": "Emoción y regulación",
      "color": "#ff7c98",
      "structures": [
        "amigdala",
        "limbico",
        "hipotalamo",
        "frontal"
      ],
      "flow": [
        "Procesamiento emocional y estrés",
        "Motivación y regulación",
        "Comprensión del estado psicológico"
      ],
      "forensic": "Las variables emocionales se interpretan junto con historia, contexto, entrevistas, observación y demás datos relevantes.",
      "warning": "Amígdala, hipotálamo o sistema límbico no equivalen a violencia ni a personalidad criminal.",
      "sources": [
        "curtis",
        "alcazar",
        "vazquez"
      ]
    },
    {
      "id": "atencion",
      "number": "04",
      "name": "Atención y conciencia",
      "color": "#f8c75b",
      "structures": [
        "reticular",
        "talamo"
      ],
      "flow": [
        "Alerta, vigilia y filtrado de estímulos",
        "Atención e integración de información",
        "Condiciones cognitivas relevantes para la evaluación"
      ],
      "forensic": "La ruta ayuda a comprender la activación y la atención dentro de procesos cognitivos; no reemplaza una evaluación profesional.",
      "warning": "Una ruta didáctica no es una prueba de atención ni de conciencia.",
      "sources": [
        "curtis",
        "vazquez"
      ]
    },
    {
      "id": "contexto",
      "number": "05",
      "name": "Motivación, emoción y contexto",
      "color": "#62d7b3",
      "structures": [
        "hipotalamo",
        "limbico",
        "amigdala"
      ],
      "flow": [
        "Motivación y respuesta emocional",
        "Procesos psicológicos",
        "Factores personales, familiares, culturales y ambientales"
      ],
      "forensic": "La conducta se estudia en un contexto global: cerebro, procesos psicológicos y condiciones personales y ambientales interactúan.",
      "warning": "Conducta ≠ cerebro. El modelo no atribuye la conducta a una estructura o sistema único.",
      "sources": [
        "curtis",
        "alcazar",
        "vazquez"
      ]
    }
  ],
  "groupOrder": [
    "Corteza",
    "Profundas",
    "Diencéfalo",
    "Tronco",
    "Sustancia blanca"
  ],
  "globalWarning": "Una estructura cerebral no explica por sí sola una conducta. El comportamiento humano surge de la interacción entre procesos cerebrales, psicológicos y contextuales. La evaluación forense integra múltiples fuentes de información.",
  "settings": {
    "heroTitle": "El cerebro no es una sentencia.",
    "heroLead": "NEUROSCAPE conecta neuroanatomía, procesos psicológicos y evaluación forense mediante una exploración responsable y documentada.",
    "forensicModule": true
  }
};

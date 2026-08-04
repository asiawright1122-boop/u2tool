import type { Guide } from './guides-types';

export const guidesEs: Guide[] = [
  {
    slug: 'como-crear-diagrama-de-gantt-gratis',
    title: 'Cómo crear un diagrama de Gantt gratis online',
    description: 'Aprende a crear un diagrama de Gantt gratis online en el navegador: tareas, hitos, dependencias y ruta crítica, sin registrarte ni instalar nada.',
    eyebrow: 'Guía práctica',
    updated: 'Actualizado el 4 de agosto de 2026',
    sections: [
      {
        title: 'Qué es un diagrama de Gantt y cuándo usarlo',
        paragraphs: [
          'Un diagrama de Gantt muestra las tareas de un proyecto en una línea de tiempo: cada barra representa una tarea, y su posición y longitud indican cuándo empieza y cuánto dura. Es la forma más directa de comunicar un plan a un equipo o a un cliente.',
          'Se usa sobre todo en proyectos con fechas claras: lanzamientos, campañas, eventos y entregas con varias personas involucradas. Si tu plan solo tiene dos o tres tareas, una lista basta; a partir de media docena de tareas con dependencias, un Gantt ayuda a ver el orden real.',
        ],
      },
      {
        title: 'Cómo hacerlo gratis online (paso a paso)',
        paragraphs: [
          'Abre el generador de diagramas de Gantt de U2Tool directamente en el navegador. No necesitas cuenta, no se sube ningún dato al servidor: todo el proyecto se procesa en tu dispositivo.',
          'Crea una tarea por línea con nombre, fecha de inicio, duración y progreso. Marca los hitos (eventos sin duración) y enlaza dependencias: por ejemplo, «Diseño» debe terminar antes de que empiece «Desarrollo».',
          'El generador calcula la ruta crítica automáticamente y resalta las tareas que no pueden retrasarse sin retrasar el proyecto. También avisa de ciclos, dependencias rotas o fechas inválidas, algo que una hoja de cálculo no hace por ti.',
          'Cuando el plan esté listo, exporta el diagrama como imagen PNG o SVG para compartirlo, o guarda los datos en JSON o CSV para reabrir el proyecto más tarde.',
        ],
      },
      {
        title: 'Consejos para un Gantt útil',
        paragraphs: [
          'Empieza por las entregas (qué debe estar listo y cuándo) y trabaja hacia atrás. No pongas más de 15-20 tareas visibles a la vez: si necesitas más, agrupa trabajo por fases.',
          'Revisa la ruta crítica antes de cada reunión de seguimiento. Si una tarea crítica se retrasa, el Gantt te dice qué otras tareas se ven afectadas.',
          'Si tu proyecto es más narrativo que planificado (por ejemplo, comunicar una evolución temporal en lugar de gestionar entregas), un timeline puede ser una alternativa más visual al Gantt.',
        ],
      },
    ],
    faqs: [
      {
        question: '¿Necesito crear una cuenta para usarlo?',
        answer: 'No. El generador de Gantt de U2Tool funciona completamente en el navegador, sin registro y sin subir tus datos a ningún servidor.',
      },
      {
        question: '¿Puedo exportar el diagrama?',
        answer: 'Sí. Puedes exportar el gráfico como PNG o SVG, y guardar el proyecto como JSON o CSV para reabrirlo y editarlo más adelante.',
      },
      {
        question: '¿Qué es la ruta crítica?',
        answer: 'Es la cadena de tareas dependientes que determina la duración total del proyecto. Si cualquiera de esas tareas se retrasa, el proyecto completo se retrasa. El generador la calcula y resalta automáticamente.',
      },
    ],
    relatedTools: ['gantt-chart-generator', 'timeline-chart-generator', 'excel-viewer'],
  },
  {
    slug: 'como-convertir-json-a-excel',
    title: 'Cómo convertir JSON a Excel en línea',
    description: 'Convierte JSON a Excel online gratis: pega tus datos, elige las columnas y descarga un archivo compatible con Excel sin instalar nada.',
    eyebrow: 'Guía práctica',
    updated: 'Actualizado el 4 de agosto de 2026',
    sections: [
      {
        title: 'Por qué convertir JSON a Excel',
        paragraphs: [
          'Los datos JSON son el formato habitual de las APIs y de muchos sistemas, pero la mayoría de los equipos trabaja en hojas de cálculo. Convertir JSON a Excel te permite filtrar, ordenar y compartir los datos con quien no usa código.',
          'El caso más frecuente es una lista de objetos: por ejemplo, pedidos, usuarios o productos devueltos por una API, que quieres abrir en una tabla con una fila por elemento.',
        ],
      },
      {
        title: 'Pasos para la conversión en línea',
        paragraphs: [
          'Abre el conversor de JSON a Excel de U2Tool y pega tu JSON. La herramienta detecta automáticamente los campos y genera una tabla con una columna por campo.',
          'Si tu JSON tiene objetos anidados (por ejemplo, un campo «dirección» con varias propiedades), revisa qué columnas quieres aplanar antes de descargar.',
          'Descarga el archivo en un formato compatible con Excel y ábrelo en tu hoja de cálculo para seguir trabajando. Todo el proceso ocurre en tu navegador: los datos no se envían a ningún servidor.',
        ],
      },
      {
        title: 'Cuándo conviene otra herramienta',
        paragraphs: [
          'Si tus datos no están en JSON sino en CSV, el flujo es el mismo pero con otra herramienta de conversión. Y si lo que necesitas es inspeccionar un archivo Excel sin Excel instalado, puedes usar un visor de Excel en línea antes de convertirlo.',
        ],
      },
    ],
    faqs: [
      {
        question: '¿Se suben mis datos a algún servidor?',
        answer: 'No. La conversión se realiza localmente en tu navegador, así que los datos no salen de tu dispositivo.',
      },
      {
        question: '¿Funciona con JSON anidado?',
        answer: 'Sí, el conversor aplanará los campos anidados a columnas; revisa el resultado antes de descargarlo.',
      },
      {
        question: '¿Qué formato descargo?',
        answer: 'Descargas un archivo de hoja de cálculo compatible con Excel que puedes abrir y editar directamente.',
      },
    ],
    relatedTools: ['json-to-excel', 'excel-viewer', 'csv-to-vcard-converter'],
  },
  {
    slug: 'como-hacer-una-linea-de-tiempo-gratis',
    title: 'Cómo hacer una línea de tiempo (timeline) gratis online',
    description: 'Crea una línea de tiempo gratis online: añade hitos, fechas y descripciones, personaliza los colores y exporta tu timeline como imagen.',
    eyebrow: 'Guía práctica',
    updated: 'Actualizado el 4 de agosto de 2026',
    sections: [
      {
        title: 'Qué es una línea de tiempo',
        paragraphs: [
          'Una línea de tiempo (timeline) muestra eventos ordenados en el tiempo: desde la historia de una empresa o de un producto, hasta la evolución de un proceso o un calendario editorial.',
          'A diferencia del diagrama de Gantt, el timeline no gestiona duraciones ni dependencias: se centra en cuándo ocurrió cada evento, y por eso es ideal para comunicar y presentar, más que para planificar.',
        ],
      },
      {
        title: 'Crear tu timeline gratis paso a paso',
        paragraphs: [
          'Abre el generador de líneas de tiempo de U2Tool en el navegador, sin registro y sin subir datos: todo se procesa localmente.',
          'Añade cada evento con su fecha (o rango), un título y una descripción corta. Puedes agruparlos por categorías y usar el escalado automático para que intervalos irregulares se vean proporcionados.',
          'Personaliza los colores y la resolución temporal (días, meses o años) hasta que la línea se lea con claridad, y exporta el resultado como imagen vectorial (SVG/PDF) o PNG.',
        ],
      },
      {
        title: 'Timeline o Gantt: cómo elegir',
        paragraphs: [
          'Si necesitas mostrar una evolución para una audiencia (historia, hoja de ruta, hitos logrados), usa un timeline. Si necesitas gestionar tareas con fechas, dependencias y responsabilidades, usa un Gantt.',
          'Muchos proyectos usan ambos: un timeline para comunicar el plan hacia fuera y un Gantt para ejecutarlo internamente.',
        ],
      },
    ],
    faqs: [
      {
        question: '¿Puedo importar mis datos?',
        answer: 'Sí. La herramienta acepta datos estructurados en CSV, JSON o fechas ISO 8601 y los convierte en la línea de tiempo.',
      },
      {
        question: '¿En qué formatos puedo exportar?',
        answer: 'Puedes exportar como SVG, PDF o PNG, según si necesitas una imagen de alta calidad o un archivo vectorial editable.',
      },
      {
        question: '¿Es gratis de verdad?',
        answer: 'Sí, y sin límites de uso. No hay registro, no hay planes de pago y no se suben tus datos a ningún servidor.',
      },
    ],
    relatedTools: ['timeline-chart-generator', 'gantt-chart-generator', 'line-chart-generator'],
  },

  {
    "slug": "tipos-de-graficas-lineas-barras-dispersion",
    "title": "Tipos de gráficas: líneas, barras y dispersión (guía)",
    "description": "Elige la gráfica correcta: líneas para tendencias, barras para comparar, dispersión para relaciones. Guía práctica con ejemplos y cuándo usar cada una.",
    "eyebrow": "Guía práctica",
    "updated": "Actualizado el 4 de agosto de 2026",
    "sections": [
      {
        "title": "Cuándo usar cada tipo",
        "paragraphs": [
          "Una gráfica de líneas muestra la evolución de una variable a lo largo del tiempo: precios, tráfico, temperatura. Es la mejor opción cuando lo que importa es la tendencia y los puntos de cambio.",
          "Las barras comparan cantidades entre categorías discretas: ventas por mes, población por país, duración por tarea. Su fuerza está en la comparación directa, no en la evolución.",
          "El gráfico de dispersión (scatter) revela relaciones entre dos variables: edad y gasto, horas de estudio y nota. Cada punto es un caso; el patrón general muestra correlación o su ausencia."
        ]
      },
      {
        "title": "Cómo crearlas gratis online",
        "paragraphs": [
          "El generador de gráficas de U2Tool crea líneas, barras y dispersión directamente en el navegador. Pega tus datos (o usa una plantilla), elige el tipo y personaliza colores, etiquetas y ejes.",
          "La herramienta ajusta los ejes automáticamente y permite exportar el resultado como imagen o datos, sin registro y sin subir nada al servidor."
        ]
      },
      {
        "title": "Errores comunes al elegir",
        "paragraphs": [
          "Usar barras para series temporales largas: las líneas se leen mejor cuando hay muchos puntos. Usar líneas con categorías sin orden natural: las barras son más claras. Y mezclar escalas distintas en un mismo gráfico sin avisar, que confunde al lector."
        ]
      }
    ],
    "faqs": [
      {
        "question": "¿Cuál es la diferencia entre barras y líneas?",
        "answer": "Las barras comparan categorías; las líneas muestran la evolución en el tiempo. Si el eje horizontal tiene un orden temporal, suele ser mejor una línea."
      },
      {
        "question": "¿Cuándo usar un gráfico de dispersión?",
        "answer": "Cuando quieres ver la relación entre dos variables numéricas. Si los puntos forman una nube diagonal, hay correlación; si están dispersos, no."
      },
      {
        "question": "¿Puedo exportar la gráfica?",
        "answer": "Sí, el generador exporta como imagen (PNG/SVG) o como datos, todo procesado localmente en tu navegador."
      }
    ],
    "relatedTools": [
      "graph-chart-generator",
      "line-chart-generator",
      "excel-viewer"
    ]
  },
  {
    "slug": "ver-archivo-excel-sin-excel",
    "title": "Cómo ver un archivo Excel sin Excel (online)",
    "description": "Abre archivos XLS, XLSX y XLSM en el navegador sin instalar nada: cambia de hoja, consulta valores y exporta a CSV, con tus datos siempre en tu dispositivo.",
    "eyebrow": "Guía práctica",
    "updated": "Actualizado el 4 de agosto de 2026",
    "sections": [
      {
        "title": "Cuándo necesitas un visor de Excel",
        "paragraphs": [
          "Recibes una hoja de cálculo y solo necesitas consultarla: un valor, una comparación, una columna. Instalar Excel o abrir la nube con tu cuenta personal es demasiado para eso.",
          "Un visor en el navegador resuelve el caso sin instalar programas y sin subir el archivo a un servidor, lo que importa cuando el contenido es sensible."
        ]
      },
      {
        "title": "Pasos para verlo en línea",
        "paragraphs": [
          "Abre el visor de Excel de U2Tool y selecciona tu archivo local (XLS, XLSX o XLSM, hasta 2 MiB). El archivo se procesa en tu navegador: no se envía a ningún servidor.",
          "Cambia de hoja para revisar la estructura, mira las celdas y sus valores, y ordena o filtra una columna cuando necesites comparar.",
          "Si necesitas continuar el trabajo en otra herramienta, exporta la hoja seleccionada como CSV y ábrela en tu aplicación de tablas."
        ]
      },
      {
        "title": "Alternativas según el caso",
        "paragraphs": [
          "Para convertir datos (JSON, CSV) hacia Excel, usa el conversor correspondiente. Para revisar archivos muy grandes o con fórmulas complejas, un visor local es el límite práctico: el visor muestra los valores calculados, no re-evalúa fórmulas."
        ]
      }
    ],
    "faqs": [
      {
        "question": "¿Es seguro para datos confidenciales?",
        "answer": "Sí. El archivo se procesa completamente en tu navegador y no se sube a ningún servidor."
      },
      {
        "question": "¿Qué formatos soporta?",
        "answer": "XLS, XLSX y XLSM, con un tamaño máximo de 2 MiB."
      },
      {
        "question": "¿Puedo exportar los datos?",
        "answer": "Sí, puedes exportar la hoja seleccionada como CSV para seguir trabajando en Excel, LibreOffice o Google Sheets."
      }
    ],
    "relatedTools": [
      "excel-viewer",
      "json-to-excel",
      "csv-to-vcard-converter"
    ]
  },
  {
    "slug": "estimar-factura-electricidad",
    "title": "Cómo estimar tu factura de electricidad",
    "description": "Calcula el costo de tu consumo eléctrico: potencia, horas de uso y tarifa. Guía paso a paso para estimar la factura y detectar los mayores consumos.",
    "eyebrow": "Guía práctica",
    "updated": "Actualizado el 4 de agosto de 2026",
    "sections": [
      {
        "title": "Qué necesitas para estimar",
        "paragraphs": [
          "La factura eléctrica depende de tres números: la potencia de cada aparato (vatios), cuántas horas al día lo usas, y el precio por kWh de tu tarifa.",
          "Con esos tres datos, el consumo mensual de un aparato se calcula como potencia × horas × días ÷ 1000. Suma todos los aparatos y multiplica por tu tarifa para obtener la estimación mensual."
        ]
      },
      {
        "title": "Pasos prácticos",
        "paragraphs": [
          "Anota los electrodomésticos que más usas: refrigerador, climatización, lavadora, horno, ordenador. Busca su potencia en la etiqueta (W o kW).",
          "Calcula el consumo mensual de cada uno y súmalo. Compara con tu factura real: si la estimación es muy inferior, hay consumo que no estás contando.",
          "Identifica el mayor consumo y decide dónde actuar: reducir horas de uso o cambiar el aparato suele tener más impacto que pequeños ahorros dispersos."
        ]
      },
      {
        "title": "Hacerlo en línea",
        "paragraphs": [
          "Usa una calculadora de costos para repetir el cálculo con distintas tarifas o escenarios. También puedes aplicar el mismo método de estimación a presupuestos de proyectos con la calculadora de estimación de proyectos."
        ]
      }
    ],
    "faqs": [
      {
        "question": "¿La tarifa es el precio del kWh?",
        "answer": "Sí, es el precio que pagas por cada kilovatio-hora; aparece en tu factura. Puede variar por tramos horarios."
      },
      {
        "question": "¿Cuánto consume un aparato en reposo?",
        "answer": "Menos que en uso, pero los aparatos en stand-by suman. Una estimación razonable es multiplicar la potencia en reposo por las horas conectado."
      },
      {
        "question": "¿La estimación es exacta?",
        "answer": "No sustituye la factura real, pero es muy útil para comparar tarifas y detectar consumos altos. Cuantos más aparatos incluyas, más precisa será."
      }
    ],
    "relatedTools": [
      "currency-converter",
      "project-estimation-calculator",
      "excel-viewer"
    ]
  },
  {
    "slug": "como-crear-diagrama-de-arbol-jerarquico",
    "title": "Cómo crear un diagrama de árbol jerárquico",
    "description": "Crea diagramas de árbol para organizar jerarquías: categorías, organigramas y taxonomías. Guía paso a paso con el generador online, gratis y en el navegador.",
    "eyebrow": "Guía práctica",
    "updated": "Actualizado el 4 de agosto de 2026",
    "sections": [
      {
        "title": "Qué es un diagrama de árbol",
        "paragraphs": [
          "Un diagrama de árbol representa una jerarquía: un nodo raíz, ramas y hojas. Cada nodo tiene un único padre, y la profundidad indica el nivel de detalle. Se usa para organigramas, taxonomías de productos, menús de navegación y estructuras de carpetas."
        ]
      },
      {
        "title": "Cuándo usarlo",
        "paragraphs": [
          "Usa un árbol cuando la información es una jerarquía real: categorías dentro de categorías, roles dentro de departamentos, conceptos dentro de temas. Si los elementos no tienen un orden padre-hijo claro, un gráfico de dispersión o una tabla pueden ser más adecuados."
        ]
      },
      {
        "title": "Crearlo gratis online",
        "paragraphs": [
          "El generador de árboles de U2Tool organiza nodos y relaciones en el navegador: añade el nodo raíz, crea ramas, y la herramienta distribuye el layout automáticamente.",
          "Personaliza colores y etiquetas, y exporta el resultado como imagen (PNG/SVG) o como datos. Todo se procesa localmente, sin registro y sin subir nada al servidor."
        ]
      },
      {
        "title": "Buenas prácticas",
        "paragraphs": [
          "Limita la profundidad a 3-4 niveles si puedes; más allá, el diagrama se vuelve difícil de leer. Agrupa nodos similares bajo una rama intermedia y usa etiquetas cortas que se entiendan sin leyenda."
        ]
      }
    ],
    "faqs": [
      {
        "question": "¿Puedo importar mi estructura?",
        "answer": "Sí, puedes definir nodos y relaciones de forma estructurada y el generador los dibuja automáticamente."
      },
      {
        "question": "¿En qué formatos exporto?",
        "answer": "Como imagen vectorial (SVG/PDF) o PNG, y también puedes guardar los datos."
      },
      {
        "question": "¿Es gratis?",
        "answer": "Sí, sin registro ni límites; todo el procesamiento ocurre en tu navegador."
      }
    ],
    "relatedTools": [
      "tree-chart-generator",
      "graph-chart-generator",
      "excel-viewer"
    ]
  },
  {
    "slug": "que-es-un-grafico-de-dispersion",
    "title": "Qué es un gráfico de dispersión y cuándo usarlo",
    "description": "El gráfico de dispersión (scatter) muestra la relación entre dos variables. Cómo leerlo, cuándo usarlo y crearlo gratis online.",
    "eyebrow": "Guía práctica",
    "updated": "Actualizado el 4 de agosto de 2026",
    "sections": [
      {
        "title": "Qué muestra un scatter",
        "paragraphs": [
          "Un gráfico de dispersión coloca un punto por cada observación, usando el eje X para una variable y el Y para otra. La nube de puntos revela si existe una relación: si los puntos forman una diagonal, hay correlación; si están repartidos sin patrón, no."
        ]
      },
      {
        "title": "Cuándo usarlo",
        "paragraphs": [
          "Úsalo cuando quieras explorar la relación entre dos variables numéricas: horas de estudio y nota, precio y demanda, edad y gasto. También sirve para detectar valores atípicos que no se ven en una tabla.",
          "No lo uses para comparar categorías (ahí van las barras) ni para mostrar tendencias temporales largas (ahí van las líneas)."
        ]
      },
      {
        "title": "Crearlo gratis online",
        "paragraphs": [
          "El generador de gráficas de U2Tool crea dispersión directamente en el navegador: pega pares de valores, la herramienta escala los ejes y coloca los puntos.",
          "Añade colores por grupo si tienes varias series, personaliza etiquetas y exporta como imagen o datos, todo localmente y sin registro."
        ]
      },
      {
        "title": "Cómo interpretarlo",
        "paragraphs": [
          "Mira primero la dirección de la nube: ascendente (relación positiva), descendente (negativa) o sin forma (sin relación). Después fíjate en la dispersión: puntos muy pegados a una línea indican relación fuerte; una nube ancha, relación débil.",
          "Recuerda: correlación no es causalidad. Un scatter muestra asociación, no demuestra que una variable cause la otra."
        ]
      }
    ],
    "faqs": [
      {
        "question": "¿Qué es la correlación en un scatter?",
        "answer": "El grado en que los puntos se ajustan a una dirección común. No implica causalidad: solo muestra asociación entre las dos variables."
      },
      {
        "question": "¿Puedo comparar tres variables?",
        "answer": "Sí, usando el tamaño o el color del punto como tercera dimensión, además de los dos ejes."
      },
      {
        "question": "¿Dónde se procesan mis datos?",
        "answer": "En tu navegador: el generador no sube los datos a ningún servidor."
      }
    ],
    "relatedTools": [
      "graph-chart-generator",
      "line-chart-generator",
      "tree-chart-generator"
    ]
  }

];

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
];

import type { Guide } from './guides-types';

export const guidesDe: Guide[] = [
  {
    slug: 'excel-datei-online-ansehen',
    title: 'Excel-Datei online ansehen ohne Office',
    description: 'Excel-Dateien (XLS, XLSX, XLSM) online im Browser ansehen: Blätter wechseln, Zellwerte prüfen und als CSV exportieren – ganz ohne Office und ohne Upload.',
    eyebrow: 'Ratgeber',
    updated: 'Aktualisiert am 4. August 2026',
    sections: [
      {
        title: 'Wann man Excel online ansehen möchte',
        paragraphs: [
          'Nicht jeder hat Excel installiert, und nicht jede Datei soll auf einen fremden Server hochgeladen werden. Eine Tabellenkalkulation im Browser anzusehen ist praktisch, wenn man schnell einen Wert prüfen, eine Spalte sortieren oder eine einzelne Tabelle als CSV weitergeben möchte.',
          'Der lokale Excel-Betrachter von U2Tool öffnet XLS-, XLSX- und XLSM-Dateien direkt im Browser. Sie wechseln zwischen den Blättern, sehen Zelladressen und zwischengespeicherte Formelwerte und sortieren oder filtern eine Spalte – alles auf Ihrem Gerät, ohne Upload.',
        ],
      },
      {
        title: 'So sehen Sie eine Excel-Datei online an',
        paragraphs: [
          'Öffnen Sie den Excel-Betrachter und wählen Sie die lokale Datei (maximal 2 MiB). Die Datei wird vollständig im Browser verarbeitet und nicht hochgeladen.',
          'Blättern Sie durch die Tabellenblätter, um die Struktur zu verstehen. Bei großen Tabellen hilft das Sortieren oder Filtern einer Spalte, den Überblick zu behalten.',
          'Wenn Sie eine Tabelle weiterverarbeiten möchten, exportieren Sie das gewählte Blatt als CSV und öffnen es in Ihrer Tabellenkalkulation.',
        ],
      },
      {
        title: 'Tipp: Daten zwischen Formaten bewegen',
        paragraphs: [
          'Wenn Sie statt einer Excel-Datei Daten aus JSON oder CSV in eine Tabelle bringen möchten, nutzen Sie den passenden Konverter. Der Excel-Betrachter ist für das schnelle Prüfen gedacht, Konverter für den Formatwechsel.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Werden meine Dateien hochgeladen?',
        answer: 'Nein. Die Datei wird lokal im Browser geöffnet und verarbeitet; es findet kein Upload statt.',
      },
      {
        question: 'Welche Formate werden unterstützt?',
        answer: 'XLS, XLSX und XLSM mit einer maximalen Dateigröße von 2 MiB.',
      },
      {
        question: 'Kann ich die Daten weiterverarbeiten?',
        answer: 'Ja. Sie können das ausgewählte Tabellenblatt als CSV exportieren und in Excel, LibreOffice oder Google Sheets öffnen.',
      },
    ],
    relatedTools: ['excel-viewer', 'csv-to-vcard-converter', 'word-to-txt'],
  },
  {
    slug: 'zeitstrahl-online-erstellen',
    title: 'Zeitstrahl (Timeline) online erstellen – kostenlos',
    description: 'Erstellen Sie kostenlos einen Zeitstrahl online im Browser: Ereignisse, Meilensteine und Intervalle, anpassbare Farben und Export als Bild oder Daten.',
    eyebrow: 'Ratgeber',
    updated: 'Aktualisiert am 4. August 2026',
    sections: [
      {
        title: 'Was ein Zeitstrahl leistet',
        paragraphs: [
          'Ein Zeitstrahl ordnet Ereignisse auf einer Zeitachse an und eignet sich für Produkt-Roadmaps, Firmenhistorie, Projektkommunikation oder redaktionelle Pläne. Anders als ein Gantt-Diagramm zeigt er keine Dauern oder Abhängigkeiten, sondern wann etwas passiert ist.',
          'Wenn Sie einen Ablauf verständlich präsentieren möchten, ist ein Zeitstrahl oft die klarste Darstellung – insbesondere für ein Publikum, das keine Projektplanung braucht.',
        ],
      },
      {
        title: 'Zeitstrahl in drei Schritten erstellen',
        paragraphs: [
          'Öffnen Sie den Zeitstrahl-Generator von U2Tool im Browser. Keine Anmeldung, kein Upload – die Verarbeitung erfolgt lokal.',
          'Fügen Sie Ereignisse mit Datum oder Zeitraum, Titel und Beschreibung hinzu. Sie können Daten als CSV, JSON oder ISO-8601-Daten importieren und die automatische Skalierung unregelmäßige Intervalle ausgleichen lassen.',
          'Passen Sie Farben und die zeitliche Auflösung (Tage, Monate, Jahre) an und exportieren Sie das Ergebnis als SVG, PDF oder PNG.',
        ],
      },
      {
        title: 'Zeitstrahl oder Gantt?',
        paragraphs: [
          'Für die Kommunikation von Meilensteinen und Entwicklungen nehmen Sie einen Zeitstrahl; für die Steuerung von Aufgaben mit Terminen und Abhängigkeiten ein Gantt-Diagramm. In Projekten werden häufig beide eingesetzt.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Kann ich eigene Daten importieren?',
        answer: 'Ja, strukturierte Daten als CSV, JSON oder ISO-8601-Daten werden direkt in den Zeitstrahl übernommen.',
      },
      {
        question: 'Welche Exporte gibt es?',
        answer: 'Sie exportieren als SVG oder PDF (vektorbasiert) oder als PNG (Bild) und können die Daten auch speichern.',
      },
      {
        question: 'Gibt es ein Konto oder Limits?',
        answer: 'Nein. Der Zeitstrahl-Generator ist kostenlos, ohne Registrierung und verarbeitet alles lokal im Browser.',
      },
    ],
    relatedTools: ['timeline-chart-generator', 'waterfall-chart-generator', 'excel-viewer'],
  },
];

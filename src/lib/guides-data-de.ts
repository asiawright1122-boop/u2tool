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

  {
    "slug": "wasserfall-diagramm-erstellen",
    "title": "Wasserfall-Diagramm in Excel vs online erstellen",
    "description": "Wasserfall-Diagramme online oder in Excel erstellen: Plus- und Minuswerte, kumulative Summen und wann sich der Online-Generator mehr lohnt.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ein Wasserfall-Diagramm zeigt",
        "paragraphs": [
          "Ein Wasserfall-Diagramm (Brücken- oder Treppendiagramm) zeigt, wie sich ein Startwert durch positive und negative Beiträge zu einem Endwert entwickelt. Klassische Fälle: Gewinn-zu-Gewinn-Brücken, Budgetveränderungen oder Bestandsverläufe."
        ]
      },
      {
        "title": "In Excel erstellen",
        "paragraphs": [
          "Excel hat kein natives Wasserfall-Diagramm in älteren Versionen; Sie müssen Hilfsspalten für die schwebenden Summen anlegen und ein gestapeltes Säulendiagramm anpassen. In aktuellen Excel-Versionen gibt es den Typ „Wasserfall“ direkt.",
          "Der Nachteil: Sie pflegen die Hilfsspalten und achten auf die Reihenfolge der Kumulierung. Bei häufigen Änderungen ist das fehleranfällig."
        ]
      },
      {
        "title": "Online-Generator als Alternative",
        "paragraphs": [
          "Ein Online-Wasserfall-Generator verarbeitet positive und negative Werte direkt: Sie geben die Beträge ein, und die kumulative Summe wird automatisch berechnet. Farben, Beschriftungen und Export sind integriert, und alles läuft lokal im Browser."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Was ist eine kumulative Summe im Wasserfall?",
        "answer": "Der Wert nach jedem Schritt: Startwert plus alle bisherigen Beiträge. Das Diagramm zeigt so, wie sich der Endwert zusammensetzt."
      },
      {
        "question": "Kann ich das Diagramm exportieren?",
        "answer": "Ja, als Bild (PNG/SVG) – praktisch für Berichte und Präsentationen."
      },
      {
        "question": "Wann lohnt sich der Online-Generator?",
        "answer": "Wenn Sie schnell ein Diagramm für ein Meeting brauchen oder die Daten sich häufig ändern, ohne Hilfsspalten in Excel zu pflegen."
      }
    ],
    "relatedTools": [
      "waterfall-chart-generator",
      "excel-viewer",
      "sunburst-chart-generator"
    ]
  },
  {
    "slug": "waehrungsrechner-verstehen",
    "title": "Währungsrechner: Wechselkurse richtig verstehen",
    "description": "So nutzen Sie einen Währungsrechner richtig: Kurse vergleichen, Gebühren erkennen und umrechnen – mit Beispielen, die im Browser laufen.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ein Wechselkurs bedeutet",
        "paragraphs": [
          "Der Wechselkurs sagt, wie viel eine Währung in einer anderen wert ist. Ein Kurs von 1,10 USD/EUR bedeutet: 1 Euro kostet 1,10 US-Dollar. Umgekehrt erhalten Sie für 1 Dollar etwa 0,91 Euro.",
          "Wichtig: Es gibt immer zwei Richtungen. Ein Rechner, der beide Richtungen zeigt, vermeidet Verwechslungen."
        ]
      },
      {
        "title": "Gebühren nicht vergessen",
        "paragraphs": [
          "Banken und Zahlungsdienste schlagen oft eine Marge auf den Referenzkurs auf. Der tatsächlich erhaltene Betrag kann daher unter dem Rechner-Ergebnis liegen. Rechnen Sie mit einem Aufschlag von 1–3 % für Vergleiche."
        ]
      },
      {
        "title": "Im Browser umrechnen",
        "paragraphs": [
          "Ein Online-Währungsrechner rechnet Beträge sofort um und zeigt beide Richtungen. Aktuelle Kurse und eine lokale Verarbeitung ohne Anmeldung sind dabei hilfreich – prüfen Sie bei wichtigen Transaktionen zusätzlich die Kursquelle."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Ist der Online-Kurs der gleiche wie bei der Bank?",
        "answer": "Meist nicht: Banken verwenden eigene An- und Verkaufskurse mit Marge. Der Referenzkurs ist ein Richtwert."
      },
      {
        "question": "Wie rechne ich ohne Rechner um?",
        "answer": "Multiplizieren Sie den Betrag mit dem Kurs in der passenden Richtung. Für 50 EUR bei 1,10 USD/EUR: 50 × 1,10 = 55 USD."
      },
      {
        "question": "Welche Währungen kann ich vergleichen?",
        "answer": "Der Rechner unterstützt die gängigen Währungen inklusive historischer Vergleiche; für exotische Währungen prüfen Sie die Verfügbarkeit."
      }
    ],
    "relatedTools": [
      "currency-converter",
      "excel-viewer",
      "csv-to-vcard-converter"
    ]
  },
  {
    "slug": "json-pfade-finden",
    "title": "JSON-Pfade finden: Tipps und Beispiele",
    "description": "So finden Sie Pfade in verschachtelten JSON-Daten: Punktnotation, Arrays und Praxistipps, mit dem JSON-Pfad-Finder direkt im Browser.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ein JSON-Pfad ist",
        "paragraphs": [
          "Ein JSON-Pfad beschreibt, wo sich ein Wert in einem verschachtelten Dokument befindet, zum Beispiel user.address.city. Er hilft, APIs zu verstehen und Daten zu extrahieren, ohne das ganze Dokument manuell zu durchsuchen."
        ]
      },
      {
        "title": "Punktnotation und Arrays",
        "paragraphs": [
          "Objekte werden mit Punkten getrennt, Arrays mit Indizes: orders[0].items[2].price. Ein Pfad-Finder zeigt alle möglichen Pfade eines Dokuments, sodass Sie sofort sehen, welche Felder existieren und wie tief die Verschachtelung ist."
        ]
      },
      {
        "title": "Praxistipps",
        "paragraphs": [
          "Kopieren Sie den Pfad, den Sie brauchen, und verwenden Sie ihn in Ihrem Code oder in Tests. Bei großen Dokumenten hilft die Suche nach Feldnamen, statt sich durch jeden Knoten zu klicken."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Was bedeutet Punktnotation?",
        "answer": "Felder eines Objekts werden mit einem Punkt verbunden, etwa a.b.c für das Feld c im Objekt b im Objekt a."
      },
      {
        "question": "Wie adressiere ich Array-Elemente?",
        "answer": "Mit einem Index in eckigen Klammern: items[0] ist das erste Element des Arrays items."
      },
      {
        "question": "Läuft der Finder lokal?",
        "answer": "Ja, die Analyse erfolgt in Ihrem Browser; das Dokument wird nicht hochgeladen."
      }
    ],
    "relatedTools": [
      "json-path-finder",
      "excel-viewer",
      "csv-to-vcard-converter"
    ]
  },
  {
    "slug": "sunburst-diagramm-verstehen-und-erstellen",
    "title": "Sunburst-Diagramm verstehen und erstellen",
    "description": "Sunburst-Diagramme zeigen hierarchische Daten in konzentrischen Ringen. Wann sie helfen, wann nicht, und wie Sie eins kostenlos im Browser erstellen.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ein Sunburst-Diagramm ist",
        "paragraphs": [
          "Ein Sunburst-Diagramm stellt eine Hierarchie als konzentrische Ringe dar: Der innerste Ring ist die oberste Ebene, jeder äußere Ring verfeinert die Segmente darunter. Es ist ein Kreisdiagramm, das um mehrere Ebenen erweitert wurde."
        ]
      },
      {
        "title": "Wann es sinnvoll ist",
        "paragraphs": [
          "Sunburst-Diagramme eignen sich für Hierarchien mit wenigen obersten Segmenten (3-7) und mäßiger Tiefe, etwa Dateisysteme, Produktkategorien oder Organisationsstrukturen. Sie zeigen auf einen Blick, welcher Zweig dominiert."
        ]
      },
      {
        "title": "Wann nicht",
        "paragraphs": [
          "Bei vielen kleinen Segmenten werden äußere Ringe unlesbar. Für reine Teil-Ganze-Vergleiche einer Ebene ist ein Kreis- oder Balkendiagramm besser, für genaue Vergleiche ein Treemap."
        ]
      },
      {
        "title": "Gratis online erstellen",
        "paragraphs": [
          "Der Sunburst-Generator von U2Tool baut die Ringe direkt im Browser: Sie geben die Hierarchieebenen an, und die Ebenen werden automatisch skaliert und beschriftet.",
          "Farben und Beschriftungen sind anpassbar, der Export erfolgt als PNG oder SVG. Alles läuft lokal, ohne Anmeldung und ohne Datenübertragung an einen Server."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Ist ein Sunburst dasselbe wie ein Kreisdiagramm?",
        "answer": "Nein. Ein Kreisdiagramm zeigt eine Ebene; ein Sunburst stapelt mehrere Ebenen als Ringe, um eine Hierarchie darzustellen."
      },
      {
        "question": "Welche Dateiformate kann ich exportieren?",
        "answer": "PNG oder SVG, zusätzlich können Sie die Datenstruktur speichern."
      },
      {
        "question": "Wird mein Diagramm auf einen Server hochgeladen?",
        "answer": "Nein, die Verarbeitung erfolgt vollständig in Ihrem Browser."
      }
    ],
    "relatedTools": [
      "sunburst-chart-generator",
      "tree-chart-generator",
      "graph-chart-generator"
    ]
  },
  {
    "slug": "baumdiagramm-online-erstellen",
    "title": "Baumdiagramm online erstellen",
    "description": "Hierarchien als Baumdiagramm darstellen: Organigramme, Taxonomien, Strukturen. Schritt für Schritt mit dem kostenlosen Generator im Browser.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ein Baumdiagramm ist",
        "paragraphs": [
          "Ein Baumdiagramm zeigt eine Hierarchie mit einer Wurzel, Ästen und Blättern. Jeder Knoten hat genau einen Vorgänger; die Tiefe gibt die Detailstufe an. Typisch sind Organigramme, Menüstrukturen und Taxonomien."
        ]
      },
      {
        "title": "Wann Sie es nutzen",
        "paragraphs": [
          "Nutzen Sie einen Baum, wenn Ihre Daten eine echte Hierarchie haben: Kategorien in Kategorien, Rollen in Abteilungen, Konzepte in Themen. Ohne Eltern-Kind-Beziehung sind Streudiagramme oder Tabellen oft besser."
        ]
      },
      {
        "title": "So erstellen Sie es kostenlos",
        "paragraphs": [
          "Der Baumgenerator von U2Tool ordnet Knoten und Verbindungen automatisch im Browser an: Wurzel anlegen, Äste ergänzen, Layout wird automatisch verteilt.",
          "Beschriften und einfärben können Sie direkt, der Export erfolgt als Bild (PNG/SVG) oder als Daten. Keine Anmeldung, alles lokal."
        ]
      },
      {
        "title": "Tipps für lesbare Bäume",
        "paragraphs": [
          "Halten Sie die Tiefe möglichst bei 3-4 Ebenen. Fassen Sie ähnliche Knoten unter einer Zwischenebene zusammen und verwenden Sie kurze, selbsterklärende Beschriftungen."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Kann ich eine eigene Struktur importieren?",
        "answer": "Ja, Sie können Knoten und Beziehungen strukturiert angeben; das Layout wird automatisch gezeichnet."
      },
      {
        "question": "In welchen Formaten exportiere ich?",
        "answer": "Als Vektor (SVG/PDF) oder PNG; die Daten können zusätzlich gespeichert werden."
      },
      {
        "question": "Ist das wirklich kostenlos?",
        "answer": "Ja, ohne Registrierung und ohne Limit; die Verarbeitung läuft im Browser."
      }
    ],
    "relatedTools": [
      "tree-chart-generator",
      "sunburst-chart-generator",
      "calendar-heatmap-generator"
    ]
  },
  {
    "slug": "csv-zu-vcard-konvertieren",
    "title": "CSV zu vCard konvertieren",
    "description": "Kontakte aus CSV in vCard-Dateien (VCF) umwandeln und ins Handy oder Outlook importieren. Kostenlos und direkt im Browser.",
    "eyebrow": "Ratgeber",
    "updated": "Aktualisiert am 4. August 2026",
    "sections": [
      {
        "title": "Was ist eine vCard",
        "paragraphs": [
          "Eine vCard (.vcf) ist das Standardformat für Kontakte: Smartphones, Gmail, Outlook und Adressbuch-Apps lesen es. Wenn Ihre Kontakte in einer Tabelle oder CSV liegen, macht die Konvertierung in vCard den Import in einem Schritt möglich."
        ]
      },
      {
        "title": "CSV vorbereiten",
        "paragraphs": [
          "Stellen Sie sicher, dass Ihr CSV klare Spalten hat: Vorname, Nachname, Telefon, E-Mail. Der Konverter übernimmt diese Spalten in jede Karte; leere Felder werden einfach weggelassen."
        ]
      },
      {
        "title": "Kostenlos online konvertieren",
        "paragraphs": [
          "Der CSV-zu-vCard-Konverter von U2Tool arbeitet im Browser: CSV einfügen, Spaltenzuordnung prüfen, .vcf mit allen Kontakten herunterladen.",
          "Es wird nichts hochgeladen; Sie erhalten entweder eine einzelne oder eine Sammel-vCard."
        ]
      },
      {
        "title": "Auf dem Handy importieren",
        "paragraphs": [
          "Android: .vcf-Datei öffnen und Kontakte-App wählen. iPhone: Datei an sich selbst senden und öffnen. Gmail: unter Kontakte auf Importieren klicken und die Datei auswählen."
        ]
      }
    ],
    "faqs": [
      {
        "question": "Welche Spalten braucht die CSV?",
        "answer": "Name plus Telefon oder E-Mail reichen. Nachname, Firma und Adresse werden ebenfalls übernommen, falls vorhanden."
      },
      {
        "question": "Kann ich viele Kontakte auf einmal umwandeln?",
        "answer": "Ja, jede Zeile der CSV wird zu einer Karte; das Ergebnis ist eine Sammeldatei .vcf."
      },
      {
        "question": "Ist die Konvertierung sicher?",
        "answer": "Ja, alles läuft in Ihrem Browser; die Daten verlassen das Gerät nicht."
      }
    ],
    "relatedTools": [
      "csv-to-vcard-converter",
      "excel-viewer",
      "word-to-txt"
    ]
  }

];

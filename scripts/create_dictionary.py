
import json
from pathlib import Path

# Common UI terms found in unique_strings analysis
TERMS = {

    # FAQ & Tips - Long Form
    "Tips": {"es": "Consejos", "pt": "Dicas", "fr": "Conseils", "de": "Tipps", "ru": "Советы", "ja": "ヒント", "ko": "팁", "ar": "نصائح"},
    "How do I use this tool?": {
        "es": "¿Cómo uso esta herramienta?",
        "pt": "Como usar esta ferramenta?",
        "fr": "Comment utiliser cet outil ?",
        "de": "Wie benutze ich dieses Werkzeug?",
        "ru": "Как пользоваться этим инструментом?",
        "ja": "このツールの使い方は？",
        "ko": "이 도구는 어떻게 사용하나요?",
        "ar": "كيف أستخدم هذه الأداة؟"
    },
    "Is this tool free to use?": {
        "es": "¿Es esta herramienta gratuita?",
        "pt": "Esta ferramenta é gratuita?",
        "fr": "Cet outil est-il gratuit ?",
        "de": "Ist dieses Werkzeug kostenlos?",
        "ru": "Этот инструмент бесплатный?",
        "ja": "このツールは無料ですか？",
        "ko": "이 도구는 무료인가요?",
        "ar": "هل هذه الأداة مجانية؟"
    },
    "Is my data private and secure?": {
        "es": "¿Son mis datos privados y seguros?",
        "pt": "Meus dados são privados e seguros?",
        "fr": "Mes données sont-elles privées et sécurisées ?",
        "de": "Sind meine Daten privat und sicher?",
        "ru": "Мои данные конфиденциальны и безопасны?",
        "ja": "データはプライベートで安全ですか？",
        "ko": "내 데이터는 안전한가요?",
        "ar": "هل بياناتي خاصة وآمنة؟"
    },
    "Enter your data in the input area, configure any options as needed, and click the action button. Results will appear in the output area.": {
        "es": "Ingrese sus datos en el área de entrada, configure las opciones según sea necesario y haga clic en el botón de acción. Los resultados aparecerán en el área de salida.",
        "pt": "Insira seus dados na área de entrada, configure as opções conforme necessário e clique no botão de ação. Os resultados aparecerão na área de saída.",
        "fr": "Entrez vos données dans la zone de saisie, configurez les options si nécessaire et cliquez sur le bouton d'action. Les résultats apparaîtront dans la zone de sortie.",
        "de": "Geben Sie Ihre Daten in den Eingabebereich ein, konfigurieren Sie die Optionen nach Bedarf und klicken Sie auf die Aktionsschaltfläche. Die Ergebnisse werden im Ausgabebereich angezeigt.",
        "ru": "Введите данные в поле ввода, настройте параметры и нажмите кнопку действия. Результаты появятся в поле вывода.",
        "ja": "入力エリアにデータを入力し、必要に応じてオプションを設定して、アクションボタンをクリックしてください。結果は出力エリアに表示されます。",
        "ko": "입력 영역에 데이터를 입력하고 필요한 옵션을 구성한 다음 실행 버튼을 클릭하세요. 결과가 출력 영역에 나타납니다.",
        "ar": "أدخل بياناتك في منطقة الإدخال، وقم بتكوين أي خيارات حسب الحاجة، وانقر فوق زر الإجراء. ستظهر النتائج في منطقة الإخراج."
    },
    "Yes, this tool is completely free to use.": {
        "es": "Sí, esta herramienta es completamente gratuita.",
        "pt": "Sim, esta ferramenta é totalmente gratuita.",
        "fr": "Oui, cet outil est entièrement gratuit.",
        "de": "Ja, dieses Werkzeug ist völlig kostenlos.",
        "ru": "Да, этот инструмент полностью бесплатен.",
        "ja": "はい、このツールは完全に無料で使用できます。",
        "ko": "네, 이 도구는 완전히 무료입니다.",
        "ar": "نعم، هذه الأداة مجانية بالكامل."
    },
    "Yes, all processing happens locally in your browser. Your data never leaves your device.": {
        "es": "Sí, todo el procesamiento ocurre localmente en su navegador. Sus datos nunca salen de su dispositivo.",
        "pt": "Sim, todo o processamento ocorre localmente no seu navegador. Seus dados nunca saem do seu dispositivo.",
        "fr": "Oui, tout le traitement se fait localement dans votre navigateur. Vos données ne quittent jamais votre appareil.",
        "de": "Ja, die gesamte Verarbeitung erfolgt lokal in Ihrem Browser. Ihre Daten verlassen niemals Ihr Gerät.",
        "ru": "Да, вся обработка происходит локально в вашем браузере. Ваши данные никогда не покидают ваше устройство.",
        "ja": "はい、すべての処理はブラウザ内でローカルに行われます。データがデバイスから送信されることはありません。",
        "ko": "네, 모든 처리는 브라우저에서 로컬로 수행됩니다. 데이터는 장치를 떠나지 않습니다.",
        "ar": "نعم، تتم جميع المعالجات محليًا في متصفحك. بياناتك لا تغادر جهازك أبدًا."
    },

    # Tool Names
    "Bar Chart Generator": {"es": "Generador de gráficos de barras", "pt": "Gerador de Gráficos de Barras", "fr": "Générateur de graphiques à barres", "de": "Balkendiagramm-Generator", "ru": "Генератор столбчатых диаграмм", "ja": "棒グラフ作成", "ko": "막대 차트 생성기", "ar": "مولد المخططات الشريطية"},
    "Line Chart Generator": {"es": "Generador de gráficos de líneas", "pt": "Gerador de Gráficos de Linhas", "fr": "Générateur de graphiques linéaires", "de": "Liniendiagramm-Generator", "ru": "Генератор линейных графиков", "ja": "折れ線グラフ作成", "ko": "선 차트 생성기", "ar": "مولد المخططات الخطية"},
    "Pie Chart Generator": {"es": "Generador de gráficos circulares", "pt": "Gerador de Gráficos de Pizza", "fr": "Générateur de camemberts", "de": "Kreisdiagramm-Generator", "ru": "Генератор круговых диаграмм", "ja": "円グラフ作成", "ko": "파이 차트 생성기", "ar": "مولد المخططات الدائرية"},
    "Scatter Chart Generator": {"es": "Generador de gráficos de dispersión", "pt": "Gerador de Gráficos de Dispersão", "fr": "Générateur de nuages de points", "de": "Streudiagramm-Generator", "ru": "Генератор точечных диаграмм", "ja": "散布図作成", "ko": "산점도 생성기", "ar": "مولد المخططات المبعثرة"},
    "Area Chart Generator": {"es": "Generador de gráficos de área", "pt": "Gerador de Gráficos de Área", "fr": "Générateur de graphiques en aires", "de": "Flächendiagramm-Generator", "ru": "Генератор диаграмм с областями", "ja": "面グラフ作成", "ko": "영역 차트 생성기", "ar": "مولد المخططات المساحية"},
    "Radar Chart Generator": {"es": "Generador de gráficos de radar", "pt": "Gerador de Gráficos de Radar", "fr": "Générateur de graphiques radar", "de": "Netzdiagramm-Generator", "ru": "Генератор лепестковых диаграмм", "ja": "レーダーチャート作成", "ko": "레이더 차트 생성기", "ar": "مولد المخططات الرادارية"},
    "Sunburst Chart Generator": {"es": "Generador de gráficos Sunburst", "pt": "Gerador de Gráficos Sunburst", "fr": "Générateur de graphiques en rayons", "de": "Sunburst-Diagramm-Generator", "ru": "Генератор диаграмм Sunburst", "ja": "サンバーストチャート作成", "ko": "선버스트 차트 생성기", "ar": "مولد مخططات أشعة الشمس"},
    "Tree Chart Generator": {"es": "Generador de gráficos de árbol", "pt": "Gerador de Gráficos de Árvore", "fr": "Générateur de diagrammes en arbre", "de": "Baumdiagramm-Generator", "ru": "Генератор древовидных диаграмм", "ja": "ツリーチャート作成", "ko": "트리 차트 생성기", "ar": "مولد المخططات الشجرية"},
    "Treemap Chart Generator": {"es": "Generador de Treemaps", "pt": "Gerador de Treemaps", "fr": "Générateur de Treemaps", "de": "Treemap-Generator", "ru": "Генератор карт дерева", "ja": "ツリーマップ作成", "ko": "트리맵 생성기", "ar": "مولد الخرائط الشجرية"},
    "Funnel Chart Generator": {"es": "Generador de gráficos de embudo", "pt": "Gerador de Gráficos de Funil", "fr": "Générateur de graphiques en entonnoir", "de": "Trichterdiagramm-Generator", "ru": "Генератор воронкообразных диаграмм", "ja": "ファンネルチャート作成", "ko": "깔때기 차트 생성기", "ar": "مولد المخططات القمعية"},
    "Sankey Chart Generator": {"es": "Generador de gráficos Sankey", "pt": "Gerador de Gráficos Sankey", "fr": "Générateur de diagrammes Sankey", "de": "Sankey-Diagramm-Generator", "ru": "Генератор диаграмм Санки", "ja": "サンキーダイアグラム作成", "ko": "생키 다이어그램 생성기", "ar": "مولد مخططات سانكي"},
    "Venn Diagram Generator": {"es": "Generador de diagramas de Venn", "pt": "Gerador de Diagramas de Venn", "fr": "Générateur de diagrammes de Venn", "de": "Venn-Diagramm-Generator", "ru": "Генератор диаграмм Венна", "ja": "ベン図作成", "ko": "벤 다이어그램 생성기", "ar": "مولد مخططات فين"},
    "Gantt Chart Generator": {"es": "Generador de diagramas de Gantt", "pt": "Gerador de Gráficos de Gantt", "fr": "Générateur de diagrammes de Gantt", "de": "Gantt-Diagramm-Generator", "ru": "Генератор диаграмм Ганта", "ja": "ガントチャート作成", "ko": "간트 차트 생성기", "ar": "مولد مخططات غانت"},
    "Timeline Chart Generator": {"es": "Generador de líneas de tiempo", "pt": "Gerador de Linhas do Tempo", "fr": "Générateur de chronologies", "de": "Zeitstrahl-Generator", "ru": "Генератор временных шкал", "ja": "タイムライン作成", "ko": "타임라인 차트 생성기", "ar": "مولد الجداول الزمنية"},
    "Parallel Coordinates Generator": {"es": "Generador de coordenadas paralelas", "pt": "Gerador de Coordenadas Paralelas", "fr": "Générateur de coordonnées parallèles", "de": "Parallele-Koordinaten-Generator", "ru": "Генератор параллельных координат", "ja": "平行座標プロット作成", "ko": "평행 좌표 생성기", "ar": "مولد الإحداثيات المتوازية"},
    "Bubble Chart Generator": {"es": "Generador de gráficos de burbujas", "pt": "Gerador de Gráficos de Bolhas", "fr": "Générateur de graphiques à bulles", "de": "Blasendiagramm-Generator", "ru": "Генератор пузырьковых диаграмм", "ja": "バブルチャート作成", "ko": "버블 차트 생성기", "ar": "مولد المخططات الفقاعية"},
    "Heatmap Generator": {"es": "Generador de mapas de calor", "pt": "Gerador de Mapas de Calor", "fr": "Générateur de cartes thermiques", "de": "Heatmap-Generator", "ru": "Генератор тепловых карт", "ja": "ヒートマップ作成", "ko": "히트맵 생성기", "ar": "مولد الخرائط الحرارية"},
    "ThemeRiver Generator": {"es": "Generador ThemeRiver", "pt": "Gerador ThemeRiver", "fr": "Générateur ThemeRiver", "de": "ThemeRiver-Generator", "ru": "Генератор ThemeRiver", "ja": "ThemeRiver作成", "ko": "테마리버 생성기", "ar": "مولد ThemeRiver"},

    # Common Actions
    "Copy": {"es": "Copiar", "pt": "Copiar", "fr": "Copier", "de": "Kopieren", "ru": "Копировать", "ja": "コピー", "ko": "복사", "ar": "نسخ"},
    "Paste": {"es": "Pegar", "pt": "Colar", "fr": "Coller", "de": "Einfügen", "ru": "Вставить", "ja": "貼り付け", "ko": "붙여넣기", "ar": "لصق"},
    "Clear": {"es": "Limpiar", "pt": "Limpar", "fr": "Effacer", "de": "Löschen", "ru": "Очистить", "ja": "クリア", "ko": "지우기", "ar": "مسح"},
    "Load": {"es": "Cargar", "pt": "Carregar", "fr": "Charger", "de": "Laden", "ru": "Загрузить", "ja": "読み込み", "ko": "불러오기", "ar": "تحميل"},
    "Save": {"es": "Guardar", "pt": "Salvar", "fr": "Enregistrer", "de": "Speichern", "ru": "Сохранить", "ja": "保存", "ko": "저장", "ar": "حفظ"},
    "Download": {"es": "Descargar", "pt": "Baixar", "fr": "Télécharger", "de": "Herunterladen", "ru": "Скачать", "ja": "ダウンロード", "ko": "다운로드", "ar": "تنزيل"},
    "Search": {"es": "Buscar", "pt": "Buscar", "fr": "Rechercher", "de": "Suchen", "ru": "Поиск", "ja": "検索", "ko": "검색", "ar": "بحث"},
    "Input": {"es": "Entrada", "pt": "Entrada", "fr": "Entrée", "de": "Eingabe", "ru": "Ввод", "ja": "入力", "ko": "입력", "ar": "إدخال"},
    "Output": {"es": "Salida", "pt": "Saída", "fr": "Sortie", "de": "Ausgabe", "ru": "Вывод", "ja": "出力", "ko": "출력", "ar": "إخراج"},
    "Result": {"es": "Resultado", "pt": "Resultado", "fr": "Résultat", "de": "Ergebnis", "ru": "Результат", "ja": "結果", "ko": "결과", "ar": "نتيجة"},
    "Convert": {"es": "Convertir", "pt": "Converter", "fr": "Convertir", "de": "Konvertieren", "ru": "Конвертировать", "ja": "変換", "ko": "변환", "ar": "تحويل"},
    "Calculate": {"es": "Calcular", "pt": "Calcular", "fr": "Calculer", "de": "Berechnen", "ru": "Рассчитать", "ja": "計算", "ko": "계산", "ar": "حساب"},
    "Generate": {"es": "Generar", "pt": "Gerar", "fr": "Générer", "de": "Generieren", "ru": "Генерировать", "ja": "生成", "ko": "생성", "ar": "توليد"},
    "Add": {"es": "Añadir", "pt": "Adicionar", "fr": "Ajouter", "de": "Hinzufügen", "ru": "Добавить", "ja": "追加", "ko": "추가", "ar": "إضافة"},
    "Edit": {"es": "Editar", "pt": "Editar", "fr": "Modifier", "de": "Bearbeiten", "ru": "Редактировать", "ja": "編集", "ko": "편집", "ar": "تعديل"},
    "Delete": {"es": "Eliminar", "pt": "Excluir", "fr": "Supprimer", "de": "Löschen", "ru": "Удалить", "ja": "削除", "ko": "삭제", "ar": "حذف"},
    "Remove": {"es": "Quitar", "pt": "Remover", "fr": "Retirer", "de": "Entfernen", "ru": "Убрать", "ja": "削除", "ko": "제거", "ar": "إزالة"},
    "Close": {"es": "Cerrar", "pt": "Fechar", "fr": "Fermer", "de": "Schließen", "ru": "Закрыть", "ja": "閉じる", "ko": "닫기", "ar": "إغلاق"},
    "Open": {"es": "Abrir", "pt": "Abrir", "fr": "Ouvrir", "de": "Öffnen", "ru": "Открыть", "ja": "開く", "ko": "열기", "ar": "فتح"},
    "Select": {"es": "Seleccionar", "pt": "Selecionar", "fr": "Sélectionner", "de": "Auswählen", "ru": "Выбрать", "ja": "選択", "ko": "선택", "ar": "تحديد"},
    "Cancel": {"es": "Cancelar", "pt": "Cancelar", "fr": "Annuler", "de": "Abbrechen", "ru": "Отмена", "ja": "キャンセル", "ko": "취소", "ar": "إلغاء"},
    "Confirm": {"es": "Confirmar", "pt": "Confirmar", "fr": "Confirmer", "de": "Bestätigen", "ru": "Подтвердить", "ja": "確認", "ko": "확인", "ar": "تأكيد"},

    # Labels & Attributes
    "Name": {"es": "Nombre", "pt": "Nome", "fr": "Nom", "de": "Name", "ru": "Имя", "ja": "名前", "ko": "이름", "ar": "اسم"},
    "Value": {"es": "Valor", "pt": "Valor", "fr": "Valeur", "de": "Wert", "ru": "Значение", "ja": "値", "ko": "값", "ar": "قيمة"},
    "Type": {"es": "Tipo", "pt": "Tipo", "fr": "Type", "de": "Typ", "ru": "Тип", "ja": "タイプ", "ko": "유형", "ar": "نوع"},
    "Size": {"es": "Tamaño", "pt": "Tamanho", "fr": "Taille", "de": "Größe", "ru": "Размер", "ja": "サイズ", "ko": "크기", "ar": "حجم"},
    "Length": {"es": "Longitud", "pt": "Comprimento", "fr": "Longueur", "de": "Länge", "ru": "Длина", "ja": "長さ", "ko": "길이", "ar": "طول"},
    "Width": {"es": "Ancho", "pt": "Largura", "fr": "Largeur", "de": "Breite", "ru": "Ширина", "ja": "幅", "ko": "너비", "ar": "عرض"},
    "Height": {"es": "Alto", "pt": "Altura", "fr": "Hauteur", "de": "Höhe", "ru": "Высота", "ja": "高さ", "ko": "높이", "ar": "ارتفاع"},
    "Status": {"es": "Estado", "pt": "Estado", "fr": "Statut", "de": "Status", "ru": "Статус", "ja": "ステータス", "ko": "상태", "ar": "حالة"},
    "Mode": {"es": "Modo", "pt": "Modo", "fr": "Mode", "de": "Modus", "ru": "Режим", "ja": "モード", "ko": "모드", "ar": "وضع"},
    "Settings": {"es": "Configuración", "pt": "Configurações", "fr": "Paramètres", "de": "Einstellungen", "ru": "Настройки", "ja": "設定", "ko": "설정", "ar": "إعدادات"},
    "Options": {"es": "Opciones", "pt": "Opções", "fr": "Options", "de": "Optionen", "ru": "Опции", "ja": "オプション", "ko": "옵션", "ar": "خيارات"},
    "Format": {"es": "Formato", "pt": "Formato", "fr": "Format", "de": "Format", "ru": "Формат", "ja": "形式", "ko": "형식", "ar": "تنسيق"},
    "Preview": {"es": "Vista previa", "pt": "Visualização", "fr": "Aperçu", "de": "Vorschau", "ru": "Предпросмотр", "ja": "プレビュー", "ko": "미리보기", "ar": "معاينة"},

    # Feedback
    "Error": {"es": "Error", "pt": "Erro", "fr": "Erreur", "de": "Fehler", "ru": "Ошибка", "ja": "エラー", "ko": "오류", "ar": "خطأ"},
    "Success": {"es": "Éxito", "pt": "Sucesso", "fr": "Succès", "de": "Erfolg", "ru": "Успех", "ja": "成功", "ko": "성공", "ar": "نجاح"},
    "Warning": {"es": "Advertencia", "pt": "Aviso", "fr": "Avertissement", "de": "Warnung", "ru": "Предупреждение", "ja": "警告", "ko": "경고", "ar": "تحذير"},
    "Info": {"es": "Info", "pt": "Info", "fr": "Info", "de": "Info", "ru": "Инфо", "ja": "情報", "ko": "정보", "ar": "معلومات"},

    # Time & Date
    "Time": {"es": "Tiempo", "pt": "Tempo", "fr": "Temps", "de": "Zeit", "ru": "Время", "ja": "時間", "ko": "시간", "ar": "وقت"},
    "Date": {"es": "Fecha", "pt": "Data", "fr": "Date", "de": "Datum", "ru": "Дата", "ja": "日付", "ko": "날짜", "ar": "تاريخ"},
    "Year": {"es": "Año", "pt": "Ano", "fr": "Année", "de": "Jahr", "ru": "Год", "ja": "年", "ko": "년", "ar": "سنة"},
    "Month": {"es": "Mes", "pt": "Mês", "fr": "Mois", "de": "Monat", "ru": "Месяц", "ja": "月", "ko": "월", "ar": "شهر"},
    "Week": {"es": "Semana", "pt": "Semana", "fr": "Semaine", "de": "Woche", "ru": "Неделя", "ja": "週", "ko": "주", "ar": "أسبوع"},
    "Day": {"es": "Día", "pt": "Dia", "fr": "Jour", "de": "Tag", "ru": "День", "ja": "日", "ko": "일", "ar": "يوم"},
    "Hour": {"es": "Hora", "pt": "Hora", "fr": "Heure", "de": "Stunde", "ru": "Час", "ja": "時", "ko": "시", "ar": "ساعة"},
    "Minute": {"es": "Minuto", "pt": "Minuto", "fr": "Minute", "de": "Minute", "ru": "Минута", "ja": "分", "ko": "분", "ar": "دقيقة"},
    "Second": {"es": "Segundo", "pt": "Segundo", "fr": "Seconde", "de": "Sekunde", "ru": "Секунда", "ja": "秒", "ko": "초", "ar": "ثانية"},

    # Data & Tech
    "File": {"es": "Archivo", "pt": "Arquivo", "fr": "Fichier", "de": "Datei", "ru": "Файл", "ja": "ファイル", "ko": "파일", "ar": "ملف"},
    "Text": {"es": "Texto", "pt": "Texto", "fr": "Texte", "de": "Text", "ru": "Текст", "ja": "テキスト", "ko": "텍스트", "ar": "نص"},
    "Image": {"es": "Imagen", "pt": "Imagem", "fr": "Image", "de": "Bild", "ru": "Изображение", "ja": "画像", "ko": "이미지", "ar": "صورة"},
    "Link": {"es": "Enlace", "pt": "Link", "fr": "Lien", "de": "Link", "ru": "Ссылка", "ja": "リンク", "ko": "링크", "ar": "رابط"},
    "Code": {"es": "Código", "pt": "Código", "fr": "Code", "de": "Code", "ru": "Код", "ja": "コード", "ko": "코드", "ar": "كود"},
    "Bytes": {"es": "Bytes", "pt": "Bytes", "fr": "Octets", "de": "Bytes", "ru": "Байт", "ja": "バイト", "ko": "바이트", "ar": "بايت"},
    "Lines": {"es": "Líneas", "pt": "Linhas", "fr": "Lignes", "de": "Zeilen", "ru": "Строки", "ja": "行", "ko": "줄", "ar": "أسطر"},
    "Words": {"es": "Palabras", "pt": "Palavras", "fr": "Mots", "de": "Wörter", "ru": "Слова", "ja": "単語", "ko": "단어", "ar": "كلمات"},
    "Chars": {"es": "Caracteres", "pt": "Caracteres", "fr": "Caractères", "de": "Zeichen", "ru": "Символы", "ja": "文字", "ko": "문자", "ar": "محارف"},
    "Hash": {"es": "Hash", "pt": "Hash", "fr": "Hachage", "de": "Hash", "ru": "Хэш", "ja": "ハッシュ", "ko": "해시", "ar": "تجزئة"},
    "Encoding": {"es": "Codificación", "pt": "Codificação", "fr": "Encodage", "de": "Kodierung", "ru": "Кодировка", "ja": "エンコード", "ko": "인코딩", "ar": "تشفير"},
    "Decoding": {"es": "Decodificación", "pt": "Decodificação", "fr": "Décodage", "de": "Dekodierung", "ru": "Декодировка", "ja": "デコード", "ko": "디코딩", "ar": "فك التشفير"},
    "Encrypt": {"es": "Encriptar", "pt": "Criptografar", "fr": "Chiffrer", "de": "Verschlüsseln", "ru": "Зашифровать", "ja": "暗号化", "ko": "암호화", "ar": "تشفير"},
    "Decrypt": {"es": "Desencriptar", "pt": "Descriptografar", "fr": "Déchiffrer", "de": "Entschlüsseln", "ru": "Расшифровать", "ja": "復号化", "ko": "복호화", "ar": "فك التشفير"},
    
    # Colors
    "Red": {"es": "Rojo", "pt": "Vermelho", "fr": "Rouge", "de": "Rot", "ru": "Красный", "ja": "赤", "ko": "빨강", "ar": "أحمر"},
    "Green": {"es": "Verde", "pt": "Verde", "fr": "Vert", "de": "Grün", "ru": "Зеленый", "ja": "緑", "ko": "초록", "ar": "اخضر"},
    "Blue": {"es": "Azul", "pt": "Azul", "fr": "Bleu", "de": "Blau", "ru": "Синий", "ja": "青", "ko": "파랑", "ar": "أزرق"},
    "Black": {"es": "Negro", "pt": "Preto", "fr": "Noir", "de": "Schwarz", "ru": "Черный", "ja": "黒", "ko": "검정", "ar": "أسود"},
    "White": {"es": "Blanco", "pt": "Branco", "fr": "Blanc", "de": "Weiß", "ru": "Белый", "ja": "白", "ko": "흰색", "ar": "أبيض"},

    # Tool Specific
    "Node": {"es": "Nodo", "pt": "Nó", "fr": "Nœud", "de": "Knoten", "ru": "Узел", "ja": "ノード", "ko": "노드", "ar": "عقدة"},
    "Category": {"es": "Categoría", "pt": "Categoria", "fr": "Catégorie", "de": "Kategorie", "ru": "Категория", "ja": "カテゴリ", "ko": "카테고리", "ar": "فئة"},
    "Group": {"es": "Grupo", "pt": "Grupo", "fr": "Groupe", "de": "Gruppe", "ru": "Группа", "ja": "グループ", "ko": "그룹", "ar": "مجموعة"},
    "Graph Chart Generator": {"es": "Generador de gráficos de grafos", "pt": "Gerador de gráficos de grafos", "fr": "Générateur de graphiques", "de": "Graph-Chart-Generator", "ru": "Генератор графов", "ja": "グラフチャート生成", "ko": "그래프 차트 생성기", "ar": "مولد الرسوم البيانية"},
    "Load Sample": {"es": "Cargar ejemplo", "pt": "Carregar exemplo", "fr": "Charger un exemple", "de": "Beispiel laden", "ru": "Загрузить пример", "ja": "サンプルを読み込む", "ko": "샘플 불러오기", "ar": "تحميل نموذج"},
    "Download PNG": {"es": "Descargar PNG", "pt": "Baixar PNG", "fr": "Télécharger PNG", "de": "PNG herunterladen", "ru": "Скачать PNG", "ja": "PNGをダウンロード", "ko": "PNG 다운로드", "ar": "تنزيل PNG"},
    "Download SVG": {"es": "Descargar SVG", "pt": "Baixar SVG", "fr": "Télécharger SVG", "de": "SVG herunterladen", "ru": "Скачать SVG", "ja": "SVGをダウンロード", "ko": "SVG 다운로드", "ar": "تنزيل SVG"},
    "Show Label": {"es": "Mostrar etiqueta", "pt": "Mostrar rótulo", "fr": "Afficher l'étiquette", "de": "Label anzeigen", "ru": "Показать метку", "ja": "ラベルを表示", "ko": "라벨 표시", "ar": "إظهار التسمية"},
    "Color Theme": {"es": "Tema de color", "pt": "Tema de cores", "fr": "Thème de couleur", "de": "Farbthema", "ru": "Цветовая тема", "ja": "カラーテーマ", "ko": "색상 테마", "ar": "نسق الألوان"},

}

output_path = Path(__file__).parent / 'ui_dict.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(TERMS, f, ensure_ascii=False, indent=2)

print(f"Generated {output_path} with {len(TERMS)} keys.")

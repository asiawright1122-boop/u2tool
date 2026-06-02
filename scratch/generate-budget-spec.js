const fs = require('fs');
const path = require('path');

const spec = {
  slug: 'world-cup-budget-calculator',
  category: 'fun',
  icon: 'calculator',
  component: 'WorldCupBudgetCalculator',
  locales: {
    zh: {
      name: "2026世界杯旅游与门票预算计算器",
      description: "免费2026美加墨世界杯差旅与门票计算器。支持16个东道主城市交通住宿预估，门票档次折算，出行人数分摊与多币种自定义汇率，瑞士黑金精算，一键导出预算清单。",
      seo_title: "2026美加墨世界杯旅游预算计算器 - 门票与交通住宿估算",
      seo_description: "免费2026世界杯旅游预算计算器。输入出行人数、出发地区与美加墨16个举办城市路线，一键精算门票、住宿、机票及日常交通开销，支持多币种自定义汇率，瑞士曜石黑金大屏，完全本地安全计算。",
      detailed_description: "免费2026美加墨世界杯旅游预算与门票计算器。支持全部16个举办城市住宿、机票、城际交通（自驾/飞机/巴士）及餐饮开销估算，内置门票档次系数与汇率换算，曜石黑金精算大屏，离线安全无上传。",
      usage_steps: [
        "在左侧选择出行Preset预设，快速初始化人数、出发地区和路线数据",
        "调整出行人数（1-6人分摊住宿）、往返地区和自定义的多币种汇率",
        "在路线规划卡片中自由添加/删除举办城市，并选择机票/自驾/巴士等交通方式",
        "在右侧大屏实时查看人均/团队总预算，ECharts饼图分析及美加墨过境签证提示"
      ],
      usage_examples: [
        "背包客独自自由行，选择CAT4/CAT3最低门票并采用自驾，精算极限省钱世界杯方案",
        "双人经典看球之旅，选择CAT2门票并搭配多次城际飞行，精算中产标配预算区间",
        "家庭轻奢观赛，多人数分摊豪华房型并选购CAT1门票，规划美加墨全景度假消费清单"
      ],
      faqs: [
        {
          "question": "本预算计算器的门票与酒店定价基准是什么？",
          "answer": "计算器内置了FIFA官方标准的各档次门票价格基数（从CAT4的80美元到VIP的3000美元），以及16个举办城市的酒店淡旺季预估价格，并引入了1.3x - 2.0x的赛事溢价系数。"
        },
        {
          "question": "酒店房间是如何自动进行多人分摊计算的？",
          "answer": "计算器采用每2人共用一间双人房的原则：房间数 = 向上取整(出行人数 / 2)。最终总房费由团队人数均摊，以防止单人出行或奇数出行时的预算偏差。"
        },
        {
          "question": "它是如何精算举办城市之间的交通成本的？",
          "answer": "如果选择自驾，计算器会基于GPS经纬度利用半正矢（Haversine）公式计算两城之间的实际路线行车距离，折算租车天数及油耗开销；如果选择飞机或大巴，则按人均固定票价折算。"
        }
      ]
    },
    en: {
      name: "2026 World Cup Travel & Ticket Budget Calculator",
      description: "Free 2026 FIFA World Cup trip budget estimator. Calibrate ticket tiers, accommodation, flight legs, and group splits across 16 host cities. 100% offline.",
      seo_title: "2026 World Cup Travel & Ticket Budget Calculator - Estimate Trip Costs",
      seo_description: "Estimate your 2026 World Cup travel budget for free. Calculate ticket prices, hotels, transport, and meals across 16 host cities in the US, Canada, and Mexico.",
      detailed_description: "Free 2026 FIFA World Cup travel and ticket budget calculator. Track accommodation, international airfare, inter-city travel (driving, flights, bus), and meal costs across all 16 host cities with premium ECharts visualization.",
      usage_steps: [
        "Select a preset (Backpacker, Standard, or Luxury) to initialize the estimator values.",
        "Adjust group size (1 to 6 people) to share hotel rooms, and departure region for flights.",
        "Add successive destination cities to build your itinerary, choosing transport and ticket tiers.",
        "Verify subtotal breakdowns, currency overrides, and international border-crossing visa warnings."
      ],
      usage_examples: [
        "Plan a budget-friendly solo trip with CAT4 seats and local transit/hostels.",
        "Estimate a double-occupancy standard trip with CAT2 category tickets and inter-city driving.",
        "Calculate a luxury family tour splitting suites, premium flights, and VIP seating."
      ],
      faqs: [
        {
          "question": "What is the basis for the ticket and lodging price estimates?",
          "answer": "Estimates utilize official standard FIFA base ticket categories (from $80 for CAT4 to $3,000 for VIP) and host city average hotel benchmarks scaled by a World Cup inflation factor."
        },
        {
          "question": "How does the lodging room-split allocation work?",
          "answer": "We assume up to 2 people share a room. The number of rooms is Ceil(Group Size / 2). Total room expenses are split equally among all members, with full division-by-zero safety."
        },
        {
          "question": "How are inter-city transport costs calculated?",
          "answer": "For driving legs, we calculate the geodesic route distance dynamically using the Haversine formula, automatically scaling car rental days and fuel surcharges."
        }
      ]
    },
    es: {
      name: "Calculadora de Presupuesto del Mundial 2026",
      description: "Calculadora de viaje para el Mundial 2026. Estime entradas, hoteles, transporte y gastos compartidos en las 16 sedes de EE.UU., Canadá y México. 100% local.",
      seo_title: "Calculadora de Presupuesto del Mundial 2026 - Viaje y Entradas",
      seo_description: "Estime gratis el presupuesto de su viaje al Mundial 2026. Calcule el costo de entradas, hoteles, vuelos y transporte en las 16 sedes de EE.UU., Canadá y México.",
      detailed_description: "Calculadora premium de presupuesto para el Mundial FIFA 2026. Estime hospedaje, vuelos internacionales, transporte interurbano (auto, avión, bus) y comidas en las 16 sedes sin compartir datos.",
      usage_steps: [
        "Seleccione un ajuste preestablecido (mochilero, estándar o de lujo) para inicializar los valores.",
        "Ajuste el tamaño del grupo (1 a 6 personas) para compartir habitaciones de hotel y el origen del vuelo.",
        "Agregue ciudades de destino para construir su itinerario, eligiendo transporte y categoría de entrada.",
        "Verifique los subtotales, conversiones de moneda y alertas de visa para cruzar fronteras."
      ],
      usage_examples: [
        "Planifique un viaje en solitario de bajo costo con asientos CAT4 y hostales.",
        "Estime un viaje estándar para dos personas con boletos CAT2 y trayectos en auto de alquiler.",
        "Calcule un tour familiar de lujo compartiendo suites, vuelos premium y asientos VIP."
      ],
      faqs: [
        {
          "question": "¿En qué se basan las estimaciones de boletos y hospedaje?",
          "answer": "Las estimaciones se basan en los precios estándar de la FIFA ($80 a $3000) y tarifas promedio de hotel en cada sede, infladas por la alta demanda del evento."
        },
        {
          "question": "¿Cómo se calcula la división de habitaciones de hotel?",
          "answer": "Se asigna una habitación doble por cada dos personas. El total de habitaciones necesarias es Ceil(personas / 2) y el costo final se divide equitativamente."
        },
        {
          "question": "¿Cómo se calculan los costos de transporte entre ciudades?",
          "answer": "Si viaja en auto, calculamos la distancia geométrica con la fórmula de Haversine para determinar los días de alquiler de auto y el combustible consumido."
        }
      ]
    },
    pt: {
      name: "Calculadora de Orçamento da Copa do Mundo 2026",
      description: "Estimador de orçamento para a Copa do Mundo 2026. Calcule ingressos, hotéis, voos e divisões de grupo nas 16 cidades-sede. Funciona 100% offline.",
      seo_title: "Calculadora de Orçamento da Copa do Mundo 2026 - Passagens e Hotéis",
      seo_description: "Calcule gratuitamente o orçamento da sua viagem para a Copa do Mundo de 2026. Planeje custos com ingressos, hotéis e voos nas 16 sedes de forma totalmente offline.",
      detailed_description: "Calculadora de viagem offline para a Copa do Mundo FIFA 2026. Calcule custos de ingressos, hospedagem, voos e alimentação nas 16 sedes com divisões inteligentes de grupo.",
      usage_steps: [
        "Selecione uma predefinição (Mochileiro, Padrão ou Luxo) para preencher os valores básicos.",
        "Ajuste o tamanho do grupo (1 a 6 pessoas) e a região de partida para passagens aéreas.",
        "Adicione cidades ao seu itinerário, escolhendo o meio de transporte e a categoria dos ingressos.",
        "Confira o detalhamento de custos, conversões de câmbio e requisitos de visto de fronteira."
      ],
      usage_examples: [
        "Planeje uma viagem solo econômica com ingressos CAT4 e hospedagem em albergues.",
        "Estime uma viagem padrão para casal com ingressos CAT2 e deslocamentos de carro alugado.",
        "Calcule uma viagem familiar de luxo com suítes premium, voos e assentos VIP."
      ],
      faqs: [
        {
          "question": "Qual é a base dos preços estimados para ingressos e hotéis?",
          "answer": "Utilizamos os preços oficiais padrão da FIFA ($80 a $3000) e custos médios de hotéis locais multiplicados pela inflação esperada para a Copa."
        },
        {
          "question": "Como funciona o rateio de quartos de hotel no grupo?",
          "answer": "Assumimos que até 2 pessoas compartilham um quarto. O número de quartos é ArredondarParaCima(Grupo / 2) e o custo total é dividido igualmente por pessoa."
        },
        {
          "question": "Como são calculadas as distâncias e custos de carro?",
          "answer": "Para percursos de carro, usamos a fórmula Haversine para estimar a distância real de condução, determinando os dias de aluguel necessários e taxas de combustível."
        }
      ]
    },
    ja: {
      name: "2026W杯旅行・チケット予算計算ツール",
      description: "無料2026W杯旅行予算見積もりツール。16開催都市の宿泊、公式チケット価格、グループ人数割、複数通貨両替に対応。曜石黒金デザイン、完全ローカル実行。",
      seo_title: "2026W杯旅行・チケット予算計算ツール - ワールドカップ費用見積もり",
      seo_description: "無料の2026年W杯旅行予算計算機。旅行人数、出発地、美加墨の16開催都市のルートを入力し、チケット、ホテル、航空券、飲食費を簡単に見積もり。曜石黒金デザイン、完全オフライン。",
      detailed_description: "無料の2026年W杯旅行・チケット予算計算機。16開催都市のホテル宿泊費、チケット代（CAT1〜5）、国際線航空券、都市間移動費、食費を安全に見積もり。オフライン実行。",
      usage_steps: [
        "左パネルで旅行スタイル（バックパッカー、スタンダード、ラグジュアリー）のプリセットを選択します",
        "旅行人数（1〜6名。ホテル料金をシェア）、出発地、為替レートのカスタマイズを行います",
        "ルートプランナーで目的地都市を順次追加し、移動手段やチケットカテゴリを選択します",
        "右パネルで合計費用、ECharts円グラフ内訳、および3カ国間のビザ要件警告を確認します"
      ],
      usage_examples: [
        "一人旅でCAT4チケットとホステルを使用し、極限まで費用を抑えたW杯プランを計画する",
        "二人でのスタンダード旅行でCAT2チケットとレンタカー移動を組み合わせ、平均的な予算を算出する",
        "家族でのラグジュアリー旅行で、高級スイート、国内線飛行機移動、VIPチケットでの予算をシミュレートする"
      ],
      faqs: [
        {
          "question": "チケットと宿泊費の見積もり基準は何ですか？",
          "answer": "チケットはFIFA公式の基本カテゴリ（CAT4：80ドル〜VIP：3000ドル）を使用し、宿泊費は各都市の平均価格にW杯プレミアム係数を掛けて算出しています。"
        },
        {
          "question": "宿泊費のグループシェアはどのように計算されますか？",
          "answer": "1部屋につき最大2名が宿泊すると仮定し、必要部屋数 ＝ 向上切り上げ（人数 / 2）を計算し、合計室料を全員で均等に分割します。"
        },
        {
          "question": "都市間の車移動コストはどのように計算されますか？",
          "answer": "経緯度データをもとにハバース（Haversine）公式を用いて都市間の実走行距離を割り出し、それに応じたレンタカー日数と燃料費を計算します。"
        }
      ]
    },
    ko: {
      name: "2026 월드컵 여행 및 티켓 예산 계산기",
      description: "무료 2026 피파 월드컵 예산 계산기. 16개 개최 도시의 호텔, 경기 티켓 등급, 교통비 및 인원별 더치페이 계산 지원. 오프라인 100% 안전 보장.",
      seo_title: "2026 월드컵 여행 및 티켓 예산 계산기 - FIFA 월드컵 비용 계산",
      seo_description: "2026 월드컵 여행 예산을 무료로 계산하세요. 미국, 캐나다, 멕시코 16개 개최 도시의 티켓 가격, 호텔 숙박비, 항공권, 교통비를 손쉽게 더치페이하고 견적을 뽑아보세요.",
      detailed_description: "2026 피파 월드컵 여행 및 티켓 예산 계산기. 16개 개최 도시의 호텔 요금, 티켓 등급, 국제선 및 국내선 교통비, 식비를 완벽하게 계산해 줍니다. 100% 오프라인 계산.",
      usage_steps: [
        "왼쪽 패널에서 예산 프리셋(배낭여행, 일반여행, 럭셔리) 중 하나를 선택해 기본값을 설정합니다.",
        "동반 인원수(1~6인, 숙박비 분할), 출발 대륙, 환율 정보를 설정합니다.",
        "일정 빌더에서 개최 도시를 순서대로 추가하고, 도시 간 이동 수단 및 티켓 카테고리를 고릅니다.",
        "우측 결과 화면에서 총 비용과 ECharts 차트 분석, 국가 간 이동 시 비자 필요 알림을 확인합니다."
      ],
      usage_examples: [
        "나홀로 배낭여행 시 CAT4 티켓과 버스 이동, 호스텔 예약을 조합해 최저 비용 계획 짜기",
        "커플 동반 일반 여행 시 CAT2 티켓과 렌터카 이동을 매칭해 현실적인 예산 견적 내기",
        "가족 동반 럭셔리 투어 시 스위트룸 분할, 항공편 이동, VIP 관람석을 지정해 경비 계획 짜기"
      ],
      faqs: [
        {
          "question": "경기 티켓 및 호텔 객실 요금의 산정 기준은 무엇인가요?",
          "answer": "티켓은 FIFA 공식 가격대(CAT4 80달러 ~ VIP 3,000달러)를 기준하며, 숙박비는 개최 도시별 호텔 평균가에 월드컵 특별 할증 요율을 더해 산출됩니다."
        },
        {
          "question": "객실 요금의 인원수별 분할 계산은 어떻게 진행되나요?",
          "answer": "최대 2인이 1실을 공유하는 것으로 가정하여 객실 수 = 올림(인원수 / 2)을 구하고, 전체 요금을 동반 인원수로 평등하게 나누어 1인당 숙박비를 구합니다."
        },
        {
          "question": "개최 도시 간 이동 비용은 어떻게 측정되나요?",
          "answer": "자차/렌트 이동 시 GPS 위경도 데이터를 활용하여 하버사인(Haversine) 공식으로 도로 이동 거리를 측정하고, 렌터카 일수와 유류비를 정밀하게 반영합니다."
        }
      ]
    },
    fr: {
      name: "Calculateur de Budget Coupe du Monde 2026",
      description: "Simulateur de budget gratuit pour la Coupe du Monde 2026. Calculez les prix des billets, hébergements, transports et partages dans les 16 villes hôtes.",
      seo_title: "Calculateur de Budget Coupe du Monde 2026 - Prix des Billets",
      seo_description: "Estimez gratuitement votre budget de voyage pour la Coupe du Monde 2026. Calculez le coût des billets, hôtels, vols et transports locaux dans les 16 villes hôtes.",
      detailed_description: "Simulateur de budget hors ligne pour la Coupe du Monde FIFA 2026. Estimez le coût des billets, l'hébergement, les vols et les repas pour les 16 villes hôtes.",
      usage_steps: [
        "Choisissez un préréglage (Mochard, Standard ou Luxe) pour initialiser les valeurs de voyage.",
        "Ajustez la taille du groupe (1 à 6 personnes) pour le partage des chambres et le vol de départ.",
        "Ajoutez des villes à votre itinéraire, en choisissant le transport et la catégorie de billet.",
        "Vérifiez la répartition des coûts, les conversions de devises et les avertissements de visa."
      ],
      usage_examples: [
        "Planifiez un voyage solo économique avec des billets CAT4 et des auberges de jeunesse.",
        "Estimez un voyage standard pour deux personnes avec des billets CAT2 et une voiture de location.",
        "Calculez un voyage de luxe en famille en partageant des suites et des places VIP."
      ],
      faqs: [
        {
          "question": "Sur quoi se basent les estimations de billets et d'hôtels ?",
          "answer": "Les calculs utilisent les tarifs officiels FIFA ($80 à $3000) et les coûts moyens d'hôtels ajustés avec un facteur d'inflation lié à la Coupe du Monde."
        },
        {
          "question": "Comment fonctionne la répartition des chambres ?",
          "answer": "Nous supposons un maximum de 2 personnes par chambre. Le nombre de chambres est ArrondiSup(Groupe / 2) et le coût total est partagé équitablement."
        },
        {
          "question": "Comment sont estimés les trajets entre villes ?",
          "answer": "Pour la route, nous calculons la distance avec la formule de Haversine pour estimer les jours de location et la consommation d'essence."
        }
      ]
    },
    de: {
      name: "WM 2026 Reisebudget & Ticket Rechner",
      description: "Kostenloser Reisekostenrechner für die WM 2026. Planen Sie Ticketpreise, Unterkünfte, Flüge und Gruppen-Splits für all 16 Austragungsorte offline.",
      seo_title: "WM 2026 Reisebudget & Ticket Rechner - Reisekosten schätzen",
      seo_description: "Planen Sie Ihr WM 2026 Reisebudget kostenlos. Schätzen Sie Ticketpreise, Hotelkosten, Flüge und Verpflegung für alle 16 Austragungsorte in den USA, Kanada und Mexiko.",
      detailed_description: "Kostenloser Reisekostenrechner für die FIFA-Weltmeisterschaft 2026. Berechnen Sie Ticketpreise, Unterkünfte, Flüge und Verpflegung in allen 16 Austragungsorten offline.",
      usage_steps: [
        "Wählen Sie ein Preset (Backpacker, Standard, Luxus), um die Basisdaten zu laden.",
        "Passen Sie die Gruppengröße (1-6 Personen) für die Zimmerteilung und den Abflughafen an.",
        "Fügen Sie Austragungsorte hinzu und wählen Sie Transportmittel sowie Ticketkategorien.",
        "Prüfen Sie die Kostenaufteilung, Währungskurse und eventuelle Visumswarnungen."
      ],
      usage_examples: [
        "Planen Sie eine günstige Solo-Reise mit CAT4-Tickets und Hostels.",
        "Schätzen Sie eine Standardreise zu zweit mit CAT2-Tickets und Mietwagen.",
        "Berechnen Sie eine luxuriöse Familienreise mit Suiten, Inlandsflügen und VIP-Sitzen."
      ],
      faqs: [
        {
          "question": "Wie genau sind die Ticket- und Hotelpreise?",
          "answer": "Wir nutzen die offiziellen FIFA-Kategoriepreise ($80 bis $3000) und durchschnittliche Hotelpreise der Städte, multipliziert mit einem WM-Zuschlagfaktor."
        },
        {
          "question": "Wie wird die Kostenaufteilung für Hotels berechnet?",
          "answer": "Wir gehen von maximal 2 Personen pro Zimmer aus. Die Zimmeranzahl ist Aufrunden(Gruppe / 2), die Gesamtkosten werden gleichmäßig aufgeteilt."
        },
        {
          "question": "Wie werden die Transportkosten zwischen den Städten ermittelt?",
          "answer": "Bei Autofahrten nutzen wir die Haversine-Formel zur Distanzermittlung und berechnen darauf basierend Mietwagentage und Benzinkosten."
        }
      ]
    },
    ru: {
      name: "Калькулятор бюджета поездки на ЧМ-2026 по футболу",
      description: "Бесплатный калькулятор расходов на Чемпионат Мира 2026. Расчет стоимости билетов, отелей, перелетов и трат на группу в 16 городах-хозяевах.",
      seo_title: "Калькулятор бюджета поездки на ЧМ-2026 - Билеты и отели",
      seo_description: "Рассчитайте бесплатно бюджет поездки на ЧМ-2026 по футболу. Оценка стоимости билетов, отелей, авиабилетов и питания в 16 городах проведения в США, Канаде и Мексике.",
      detailed_description: "Локальный калькулятор поездки на ЧМ-2026 по футболу. Рассчитайте стоимость билетов FIFA, проживания в отелях, авиаперелетов и питания в 16 городах-хозяевах.",
      usage_steps: [
        "Выберите пресет (Бюджетный, Стандартный, Люкс) для быстрой настройки параметров.",
        "Укажите размер группы (1–6 человек) для совместного проживания и регион вылета.",
        "Добавьте города в маршрут, выберите категории билетов и вид транспорта.",
        "Изучите отчет о расходах, настройте курсы валют и проверьте визовые требования."
      ],
      usage_examples: [
        "Планирование бюджетной поездки в одиночку с билетами CAT4 и хостелами.",
        "Оценка стандартного тура на двоих с билетами CAT2 и арендой автомобиля.",
        "Расчет роскошного семейного тура с люкс-номерами, перелетами бизнес-классом и VIP-ложей."
      ],
      faqs: [
        {
          "question": "На чем основаны оценки билетов и отелей?",
          "answer": "Оценки используют официальные базовые цены FIFA (от $80 за CAT4 до $3000 за VIP) и средние цены отелей с учетом наценки на период ЧМ."
        },
        {
          "question": "Как рассчитывается стоимость отелей на группу?",
          "answer": "Мы предполагаем размещение до 2 человек в номере. Количество номеров: ОкруглВверх(Группа / 2). Расходы делятся поровну на всех."
        },
        {
          "question": "Как рассчитываются переезды между городами?",
          "answer": "Для поездок на авто расстояние вычисляется по формуле Хаверсина, на основе чего рассчитываются дни аренды машины и расходы на бензин."
        }
      ]
    },
    ar: {
      name: "حاسبة ميزانية السفر وتذاكر كأس العالم 2026",
      description: "حاسبة ميزانية كأس العالم 2026 المجانية. قدر تكاليف التذاكر، السكن، الرحلات، وتقاسم النفقات بين المجموعات في 16 مدينة مضيفة. تعمل بالكامل دون اتصال.",
      seo_title: "حاسبة ميزانية السفر وتذاكر كأس العالم 2026 - تقدير التكاليف",
      seo_description: "احسب ميزانية سفرك لكأس العالم 2026 مجاناً. قدر أسعار التذاكر، الفنادق، رحلات الطيران، والمصاريف اليومية في 16 مدينة مضيفة في أمريكا، كندا، والمكسيك دون اتصال.",
      detailed_description: "حاسبة ميزانية السفر لكأس العالم 2026 دون اتصال. قدر تكاليف تذاكر الفيفا، الفنادق، الطيران، والمواصلات في 16 مدينة مضيفة مع تقسيم المصاريف بشكل ذكي.",
      usage_steps: [
        "اختر أحد الإعدادات المسبقة (رحالة، قياسي، فاخر) لتعبئة البيانات الأساسية تلقائياً.",
        "اضبط حجم المجموعة (من 1 إلى 6 أشخاص) لمشاركة الغرف، وحدد منطقة المغادرة للطيران.",
        "أضف المدن المضيفة إلى مسارك، واختر وسيلة النقل وفئة تذكرة المباراة.",
        "تحقق من تفاصيل التكاليف الفرعية، وتعديل أسعار الصرف، وتحذيرات تأشيرات العبور."
      ],
      usage_examples: [
        "التخطيط لرحلة فردية منخفضة التكلفة باستخدام تذاكر CAT4 والسكن المشترك والمواصلات البرية.",
        "تقدير تكاليف رحلة ثنائية عادية باستخدام تذاكر CAT2 واستئجار سيارة للتنقل بين المدن.",
        "حساب رحلة عائلية فاخرة تشمل أجنحة فندقية، وطيران داخلي، ومقاعد كبار الشخصيات VIP."
      ],
      faqs: [
        {
          "question": "ما هو أساس أسعار التذاكر والسكن التقديرية؟",
          "answer": "تعتمد التقديرات على فئات أسعار تذاكر الفيفا الرسمية (من 80$ لـ CAT4 إلى 3000$ لـ VIP) ومتوسط أسعار الفنادق مضروبة في معامل تضخم كأس العالم."
        },
        {
          "question": "كيف يتم حساب مشاركة الغرف الفندقية؟",
          "answer": "نفترض مشاركة شخصين للغرفة كحد أقصى. عدد الغرف = تقريب لأعلى(حجم المجموعة / 2) وتوزع التكلفة الإجمالية للغرف بالتساوي بين الأفراد."
        },
        {
          "question": "كيف يتم حساب تكاليف النقل الداخلي بين المدن؟",
          "answer": "عند اختيار القيادة بالسيارة، نحسب المسافة الحقيقية باستخدام معادلة هافرسين لحساب أيام استئجار السيارة والوقود المستهلك."
        }
      ]
    }
  }
};

const scratchDir = '/Users/kaka/Dev/u2tool/scratch';
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

fs.writeFileSync(
  path.join(scratchDir, 'world-cup-budget-calculator-spec.json'),
  JSON.stringify(spec, null, 2) + '\n'
);

console.log('Spec written to scratch/world-cup-budget-calculator-spec.json');

// Check SEO descriptions lengths
for (const [locale, data] of Object.entries(spec.locales)) {
  const len = data.seo_description.length;
  const expectedMin = ['zh', 'ja', 'ko'].includes(locale) ? 70 : 120;
  const expectedMax = ['zh', 'ja', 'ko'].includes(locale) ? 100 : 160;
  const status = (len >= expectedMin && len <= expectedMax) ? '💚 OK' : '❌ FAIL';
  console.log(`- ${locale}: length ${len} (limits: [${expectedMin}, ${expectedMax}]) - ${status}`);
}

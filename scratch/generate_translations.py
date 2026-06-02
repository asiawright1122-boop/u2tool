import json
import os

locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar']
messages_dir = 'src/messages'

# 1. Detailed translations for each locale
detailed_data = {
    'en': {
        'detailed_description': 'Estimate your travel and ticket budget for the 2026 FIFA World Cup across USA, Canada, and Mexico. Includes match ticket tiers, flight routes, hotel room splits, local transit, and border-crossing visa warnings.',
        'usage_steps': [
            'Select your origin region and choose a budget preset (Backpacker, Standard, or Luxury) to initialize values.',
            'Adjust the group size and select your base currency for calculation.',
            'Build your route by adding host cities, match stages, ticket categories, transit modes, and accommodation nights.',
            'View the ECharts donut breakdown and read visa warnings when traveling between different host countries.'
        ],
        'usage_examples': [
            'Plan a solo backpacker trip starting from London to watch 3 Group Stage matches in Atlanta and Miami with Category 3 tickets.',
            'Estimate a premium family-of-four trip from Seoul to watch the Quarterfinals, Semifinals, and Final in LA and NY.',
            'Calculate driving costs and hotel split savings for a group of three friends touring host cities in Mexico.'
        ],
        'faqs': [
            {
                'question': 'How are ticket prices estimated for the 2026 World Cup?',
                'answer': 'Ticket costs are based on historical FIFA ticket tiers for group and knockout stages, adjusted for estimated 2026 inflation. You can customize ticket categories for each match in your route.'
            },
            {
                'question': 'What border-crossing visa warnings does this calculator provide?',
                'answer': 'The calculator automatically checks if your route crosses borders between the USA, Canada, and Mexico. It alerts you to the visa requirements (ESTA, eTA, or tourist visas) depending on your selected home region.'
            },
            {
                'question': 'How does the shared hotel room split logic work?',
                'answer': 'Accommodation costs assume double occupancy. For odd group sizes (e.g., 3 travelers), the calculator automatically estimates the additional room required, preventing cost underestimations.'
            }
        ]
    },
    'zh': {
        'detailed_description': '2026美加墨世界杯一站式旅行与门票预算精算器。覆盖各档门票、城际机票与自驾油费、酒店拼房分摊、多币种汇率换算以及美加墨三国跨国出入境签证提醒。',
        'usage_steps': [
            '选择您的出发地区，并点击预算预设（背包客、双人标准、家庭奢华）以快速初始化基础数据。',
            '调整随行出行人数，并选择适合您的预算结算货币。',
            '构建您的观赛行程：依次添加主办城市、观赛阶段、门票档位、城市间交通方式以及入住天数。',
            '实时查看ECharts费用占比圆环图，并仔细阅读跨国移动时自动生成的出入境签证风险提示。'
        ],
        'usage_examples': [
            '规划单人背包客从上海出发，前往亚特兰大和迈阿密观看3场小组赛的Category 3门票预算。',
            '估算来自首尔的四口之家前往洛杉矶和纽约观看四分之一决赛、半决赛和决赛的豪华观赛团总成本。',
            '计算三位好友自驾游历墨西哥主办城市（墨西哥城、瓜达拉哈拉）的油耗成本与拼房分摊省钱方案。'
        ],
        'faqs': [
            {
                'question': '2026世界杯各阶段门票的价格是如何预估的？',
                'answer': '门票价格基于FIFA历届世界杯小组赛至淘汰赛的官方指导价，并结合2026年美加墨当地通胀水平进行预估。您可以在行程中为每一场比赛单独选择不同的门票档位。'
            },
            {
                'question': '计算器提供的跨国边境签证提醒涵盖哪些内容？',
                'answer': '计算器会检测您的行程是否跨越了美国、加拿大和墨西哥的国境线。根据您选择的出发地区，自动提醒您是否需要办理美签(B1/B2/EVUS)、加签(eTA)或墨签，确保出行无忧。'
            },
            {
                'question': '拼房住宿费用的分摊逻辑是怎样的？',
                'answer': '住宿费用默认按双人间折算人均成本。对于奇数出行人数（如3人），计算器会自动按加开一间房的成本进行保底精算，防止出现少算酒店预算的情况。'
            }
        ]
    },
    'ja': {
        'detailed_description': '2026年北米W杯（アメリカ・カナダ・メキシコ）観戦旅行のチケット・宿泊・交通予算を網羅した精算ツール。チケット席種、都市間フライト、相部屋料金、3国間のビザ警告に対応。',
        'usage_steps': [
            '出発地域を選択し、予算プリセット（バックパッカー、標準、ラグジュアリー）をクリックして初期化します。',
            '同行者人数を調整し、計算に使用する基本通貨を選択します。',
            '開催都市、観戦ステージ、チケットカテゴリ、移動手段、宿泊日数を追加して、独自のルートを構築します。',
            'EChartsグラフで費用内訳を確認し、国境を越える移動のビザ要件（ESTA、eTAなど）の警告を確認します。'
        ],
        'usage_examples': [
            '東京発、アトランタとマイアミでグループステージ3試合をカテゴリ3席で観戦する一人旅プラン。',
            'ソウル発、LAとNYで準々決勝、準決勝、決勝を観戦する4人家族のプレミアム観戦ツアーの予算見積もり。',
            '友人3人でメキシコの開催都市（メキシコシティ、グアダラハラなど）をレンタカーで巡る際の宿泊・燃料費の計算。'
        ],
        'faqs': [
            {
                'question': 'チケット料金はどのように見積もられていますか？',
                'answer': '過去のFIFAワールドカップ公式価格をベースに、2026年のインフレ予測を加味して算出しています。ルート内の試合ごとに席種を個別設定できます。'
            },
            {
                'question': '国境越えのビザ警告はどのような仕組みですか？',
                'answer': 'ルート内でアメリカ、カナダ、メキシコの国境を跨ぐ移動が発生した場合に自動で作動します。選択された出発地域に基づき、ESTA、eTA、観光ビザなどの必要性を警告します。'
            },
            {
                'question': 'ホテルの相部屋分割ロジックはどのようになっていますか？',
                'answer': '宿泊費は1室2名利用を前提に算出します。3名などの奇数グループの場合、不足分の客室追加料金を自動で加算し、予算の過小評価を防ぎます。'
            }
        ]
    },
    'ko': {
        'detailed_description': '미국, 캐나다, 멕시코에서 개최되는 2026 FIFA 월드컵의 여행 및 티켓 예산 통합 계산기. 경기 티켓 등급, 항공 노선, 호텔 비용 분할, 렌터카 주유비 및 국경 이동 비자 요구사항 안내.',
        'usage_steps': [
            '출발 지역을 선택하고 예산 프리셋(배낭여행, 표준, 럭셔리) 중 하나를 선택해 기초 데이터를 채웁니다.',
            '동행 인원수를 설정하고 예산 정산에 사용할 기본 통화를 선택합니다.',
            '개최 도시, 경기 단계, 티켓 등급, 교통 수단 및 숙박 일수를 추가하여 나만의 여행 경로를 구성합니다.',
            'ECharts 원형 차트로 항목별 비중을 확인하고, 국가 간 이동 시 표시되는 비자 경고 메시지를 확인합니다.'
        ],
        'usage_examples': [
            '서울에서 출발하여 애틀랜타와 마이애미에서 조별리그 3경기를 Category 3 티켓으로 관람하는 1인 배낭여행 예산 수립.',
            'LA와 뉴욕에서 열리는 8강, 준결승, 결승전을 관람하는 4인 가족의 프리미엄 여행 패키지 총 예산 추정.',
            '친구 3명이 멕시코 개최 도시들을 렌터카로 여행할 때 발생하는 주유비 및 숙소 분할 비용 정밀 계산.'
        ],
        'faqs': [
            {
                'question': '경기 티켓 가격은 어떻게 책정되었나요?',
                'answer': '역대 FIFA 월드컵 조별리그 및 토너먼트 공식 티켓 가격을 기준으로 2026년 현지 물가 상승률을 반영해 추정했습니다. 매치별로 티켓 등급을 다르게 설정할 수 있습니다.'
            },
            {
                'question': '국경 이동 시 어떤 비자 안내가 제공되나요?',
                'answer': '미국, 캐나다, 멕시코 간 국경을 넘는 일정이 포함되면 작동합니다. 설정된 출발 지역에 따라 ESTA, eTA 또는 일반 관광비자 필요 여부를 자동으로 알려드립니다.'
            },
            {
                'question': '홀수 인원의 호텔 비용 분할 방식은 무엇인가요?',
                'answer': '숙박비는 기본 2인 1실로 계산됩니다. 3명과 같이 홀수 인원일 경우 방 1개가 추가되는 비용을 예산에 자동으로 안전하게 반영하여 실제 비용 누락을 방지합니다.'
            }
        ]
    },
    'es': {
        'detailed_description': 'Estime su presupuesto para el Mundial de Fútbol 2026 en EE. UU., Canadá y México. Incluye categorías de entradas, vuelos interurbanos, alojamiento compartido y alertas de visa transfronterizas.',
        'usage_steps': [
            'Seleccione su región de origen y un ajuste preestablecido (Mochilero, Estándar o Lujo) para inicializar los valores.',
            'Ajuste el tamaño del grupo y elija su moneda base para el cálculo.',
            'Construya su ruta agregando ciudades anfitrionas, fases, categorías de entradas, modos de transporte y noches de hotel.',
            'Vea el desglose en el gráfico circular de ECharts y lea las alertas de visado cuando su ruta cruce fronteras nacionales.'
        ],
        'usage_examples': [
            'Planificar un viaje de mochilero en solitario desde Madrid para ver 3 partidos de Fase de Grupos en Atlanta y Miami con entradas de Categoría 3.',
            'Calcular un viaje familiar de lujo para cuatro personas desde Bogotá para ver los Cuartos, Semifinal y Final en Los Ángeles y Nueva York.',
            'Estimar los costos de conducción y el ahorro en hoteles compartidos para un grupo de tres amigos que recorren las sedes en México.'
        ],
        'faqs': [
            {
                'question': '¿Cómo se estiman los precios de las entradas para el Mundial 2026?',
                'answer': 'Los costos se basan en los precios históricos de la FIFA para la fase de grupos y eliminatorias, ajustados a la inflación proyectada de 2026. Puede personalizar la categoría para cada partido de su ruta.'
            },
            {
                'question': '¿Qué tipo de alertas de visas transfronterizas proporciona la calculadora?',
                'answer': 'La herramienta detecta si viaja entre Estados Unidos, Canadá y México. Según su región de origen, le alertará sobre requisitos de visado, autorizaciones electrónicas (ESTA, eTA) o visados de turista.'
            },
            {
                'question': '¿Cómo funciona la lógica de división de habitaciones de hotel?',
                'answer': 'Los costos de alojamiento se calculan sobre ocupación doble. Para grupos con un número impar de viajeros (ej. 3 personas), la calculadora suma la habitación adicional necesaria para evitar sorpresas de costo.'
            }
        ]
    },
    'pt': {
        'detailed_description': 'Estime seu orçamento para a Copa do Mundo FIFA 2026 nos EUA, Canadá e México. Calcule custos de ingressos, voos, acomodação compartilhada, transporte terrestre e receba alertas de visto de fronteira.',
        'usage_steps': [
            'Selecione sua região de origem e escolha um perfil de orçamento (Mochileiro, Padrão ou Luxo) para inicializar os valores.',
            'Defina o número de viajantes no grupo e selecione a moeda base para os cálculos.',
            'Monte seu roteiro adicionando cidades-sede, fases do torneio, categorias de ingressos, modos de transporte e noites de estadia.',
            'Visualize o gráfico circular do ECharts com os custos e leia os alertas de vistos ao viajar entre países anfitriões.'
        ],
        'usage_examples': [
            'Planejar uma viagem solo no estilo mochileiro partindo de Lisboa para ver 3 jogos da Fase de Grupos em Atlanta e Miami com ingressos Categoria 3.',
            'Estimar os custos de uma viagem de luxo para uma família de quatro pessoas saindo de São Paulo para ver as Quartas, Semifinal e Final em LA e NY.',
            'Calcular custos de combustível e economia de hotel compartilhado para três amigos dirigindo pelas cidades-sede do México.'
        ],
        'faqs': [
            {
                'question': 'Como os preços dos ingressos para a Copa de 2026 são estimados?',
                'answer': 'Os custos são baseados na tabela oficial histórica da FIFA para a fase de grupos e mata-mata, ajustados pela inflação prevista para 2026. Você pode selecionar a categoria do ingresso para cada partida.'
            },
            {
                'question': 'Que tipo de alertas de vistos transfronteiriços esta calculadora oferece?',
                'answer': 'A calculadora verifica se o seu roteiro cruza fronteiras entre EUA, Canadá e México. Dependendo da sua origem, ela alerta se você precisará de vistos de turista ou autorizações eletrônicas (ESTA, eTA).'
            },
            {
                'question': 'Como funciona a divisão dos custos de hospedagem para grupos?',
                'answer': 'Assume-se acomodação em quartos duplos. Se o número de viajantes for ímpar (ex: 3 pessoas), a calculadora adiciona automaticamente o custo de um quarto adicional para que o orçamento permaneça realista.'
            }
        ]
    },
    'fr': {
        'detailed_description': 'Calculez votre budget voyage et billets pour la Coupe du Monde FIFA 2026 aux États-Unis, Canada et Mexique. Inclut les catégories de billets, vols interurbains, hébergements partagés et visas transfrontaliers.',
        'usage_steps': [
            'Sélectionnez votre région d\'origine et choisissez un profil de budget (Backpacker, Standard ou Luxe) pour initialiser les valeurs.',
            'Ajustez le nombre de personnes dans le groupe et choisissez votre devise de calcul.',
            'Créez votre itinéraire en ajoutant des villes hôtes, des phases de match, des catégories de billets, des modes de transport et le nombre de nuits.',
            'Analysez le graphique de répartition ECharts et lisez les alertes de visa si vous changez de pays hôte en cours de route.'
        ],
        'usage_examples': [
            'Prévoir un voyage solo en mode routard depuis Paris pour voir 3 matchs de phase de groupes à Atlanta et Miami avec des billets de catégorie 3.',
            'Estimer un voyage familial haut de gamme de 4 personnes depuis Montréal pour assister aux quarts de finale, demi-finales et finale à LA et NY.',
            'Calculer les frais de voiture et les économies de chambre partagée pour un groupe de trois amis visitant les villes hôtes du Mexique.'
        ],
        'faqs': [
            {
                'question': 'Comment sont estimés les tarifs des billets de match pour 2026 ?',
                'answer': 'Les prix sont extrapolés à partir des grilles tarifaires officielles des éditions précédentes de la Coupe du Monde, indexés sur l\'inflation locale estimée pour 2026. Vous pouvez définir la catégorie pour chaque match.'
            },
            {
                'question': 'Quelles alertes de visa transfrontalier la calculatrice fournit-elle ?',
                'answer': 'La calculatrice vérifie si votre itinéraire traverse les frontières des USA, du Canada ou du Mexique. Elle indique la nécessité d\'obtenir une autorisation de voyage (ESTA, AVE) ou un visa classique selon votre origine.'
            },
            {
                'question': 'Comment est calculé le coût de l\'hôtel pour les groupes impairs ?',
                'answer': 'L\'hébergement est basé sur des chambres doubles. Pour les groupes impairs (ex: 3 voyageurs), la calculatrice intègre d\'office le coût d\'une chambre solo supplémentaire pour garantir un budget réaliste.'
            }
        ]
    },
    'de': {
        'detailed_description': 'Planen Sie Ihr Reise- und Ticketbudget für die WM 2026 in den USA, Kanada und Mexiko. Berechnet Ticketkategorien, Inlandsflüge, Hotelkosten bei Aufteilung im Zimmer und Visa-Grenzübertrittswarnungen.',
        'usage_steps': [
            'Wählen Sie Ihre Herkunftsregion und ein Budget-Preset (Backpacker, Standard, Luxus), um die Standardwerte zu laden.',
            'Passen Sie die Gruppengröße an und wählen Sie Ihre Abrechnungswährung.',
            'Erstellen Sie Ihre Route, indem Sie Spielorte, Turnierphasen, Ticketkategorien, Transportmittel und Hotelübernachtungen hinzufügen.',
            'Überprüfen Sie das ECharts-Kreisdiagramm für die Kostenaufteilung und beachten Sie Visa-Hinweise bei Länderwechseln.'
        ],
        'usage_examples': [
            'Planung einer Solo-Rucksackreise ab Frankfurt für 3 Gruppenspiele in Atlanta und Miami mit Tickets der Kategorie 3.',
            'Schätzung einer Premium-Familienreise (4 Personen) von Zürich zu den Viertelfinals, Halbfinals und dem Finale in LA und NY.',
            'Berechnung von Kraftstoffkosten und Hotelersparnissen für eine Gruppe von drei Freunden, die Spielorte in Mexiko mit dem Auto bereisen.'
        ],
        'faqs': [
            {
                'question': 'Wie werden die Ticketpreise für die WM 2026 geschätzt?',
                'answer': 'Die Kosten basieren auf historischen Ticketpreisen früherer WMs, angepasst an die erwartete lokale Inflation für 2026. Sie können die Preiskategorie für jedes Spiel individuell wählen.'
            },
            {
                'question': 'Welche Visa-Warnungen bei Grenzübertritten bietet der Rechner?',
                'answer': 'Der Rechner prüft, ob Ihre Route die Grenzen zwischen USA, Kanada und Mexiko überschreitet. Je nach Herkunft erhalten Sie Hinweise zu nötigen Genehmigungen (ESTA, eTA) oder Touristenvisa.'
            },
            {
                'question': 'Wie funktioniert die Aufteilung der Hotelzimmer bei ungerader Personenzahl?',
                'answer': 'Die Zimmerpreise basieren auf Doppelzimmern. Bei ungerader Personenzahl (z. B. 3 Reisende) bucht der Rechner automatisch die Kosten für ein notwendiges Zusatz-Einzelzimmer ein, um Fehlkalkulationen vorzubeugen.'
            }
        ]
    },
    'ru': {
        'detailed_description': 'Рассчитайте бюджет поездки и билетов на ЧМ-2026 по футболу в США, Канаде и Мексике. Включает категории билетов, перелеты между городами, отели, авто и визовые предупреждения на границах.',
        'usage_steps': [
            'Выберите регион отправления и профиль бюджета (Бэкпекер, Стандарт, Люкс) для автоматического заполнения данных.',
            'Установите количество человек в группе и выберите валюту для расчета.',
            'Постройте свой маршрут, добавляя города, стадии матчей, категории билетов, способы перемещения и ночи в отелях.',
            'Изучите диаграмму ECharts с долями затрат и проверьте визовые требования при пересечении границ стран-хозяек.'
        ],
        'usage_examples': [
            'Бюджетная одиночная поездка бэкпекера из Алматы на 3 матча группового этапа в Атланту и Майами с билетами Категории 3.',
            'Премиум-поездка для семьи из 4 человек из Москвы на четвертьфинал, полуфинал и финал в Лос-Анджелес и Нью-Йорк.',
            'Расчет затрат на бензин при аренде авто и экономии на совместных номерах для трех друзей в городах Мексики.'
        ],
        'faqs': [
            {
                'question': 'Как оценивается стоимость билетов на матчи ЧМ-2026?',
                'answer': 'Цены рассчитаны на основе официальных тарифов FIFA на прошлых ЧМ с поправкой на ожидаемую инфляцию 2026 года. Вы можете настроить категорию билета для каждого матча в маршруте.'
            },
            {
                'question': 'Какие визовые предупреждения выдает калькулятор?',
                'answer': 'Калькулятор отслеживает пересечение границ между США, Канадой и Мексикой. Исходя из страны отправления, он сообщает о необходимости получения электронных авторизаций (ESTA, eTA) или классических виз.'
            },
            {
                'question': 'Как рассчитывается проживание в отелях для нечетного числа людей?',
                'answer': 'Стоимость отелей рассчитывается на базе двухместного размещения. Если в группе нечетное количество человек (например, 3), калькулятор автоматически добавляет плату за еще один одноместный номер.'
            }
        ]
    },
    'ar': {
        'detailed_description': 'احسب ميزانية السفر والتذاكر لكأس العالم 2026 في أمريكا وكندا والمكسيك. تشمل فئات التذاكر، الطيران الداخلي، تكاليف الفنادق المشتركة، وتنبيهات تأشيرات الحدود.',
        'usage_steps': [
            'حدد منطقتك الأم واختر إحدى الميزانيات الجاهزة (رحالة، قياسية، فاخرة) لتعبئة البيانات تلقائياً.',
            'اضبط عدد أفراد المجموعة وحدد العملة الأساسية لحساب التكاليف الإجمالية.',
            'ابنِ مسار رحلتك بإضافة المدن المستضيفة، مراحل المباريات، درجات التذاكر، وسائل النقل، وعدد ليالي الإقامة.',
            'شاهد مخطط ECharts الدائري لتحليل المصاريف، واقرأ تحذيرات التأشيرة عند الانتقال بين الدول المستضيفة.'
        ],
        'usage_examples': [
            'التخطيط لرحلة رحالة فردي من الرياض لمشاهدة 3 مباريات في دور المجموعات في أتلانتا وميامي بتذاكر الفئة الثالثة.',
            'تقدير تكلفة رحلة عائلية فاخرة لأربعة أشخاص من القاهرة لحضور ربع النهائي ونصف النهائي والنهائي في لوس أنجلوس ونيويورك.',
            'حساب تكاليف القيادة ووفورات مشاركة غرف الفندق لثلاثة أصدقاء يتنقلون بين المدن المستضيفة في المكسيك.'
        ],
        'faqs': [
            {
                'question': 'كيف يتم تقدير أسعار تذاكر مباريات كأس العالم 2026؟',
                'answer': 'تستند التكاليف إلى أسعار التذاكر الرسمية السابقة للاتحاد الدولي لكرة القدم (فيفا) مع تعديلها بما يتناسب مع التضخم المتوقع لعام 2026. يمكنك تحديد فئة التذكرة لكل مباراة بشكل منفصل.'
            },
            {
                'question': 'ما هي تحذيرات تأشيرات الدخول الحدودية التي توفرها الحاسبة؟',
                'answer': 'تتحقق الحاسبة تلقائياً إذا كان مسار رحلتك يعبر الحدود بين أمريكا وكندا والمكسيك، وتنبهك بمتطلبات التأشيرة (مثل ESTA أو eTA أو تأشيرة سياحية) حسب منطقتك التي حددتها.'
            },
            {
                'question': 'كيف تعمل منطقية توزيع تكاليف الفندق في الغرف المشتركة؟',
                'answer': 'تفترض تكلفة الإقامة شخصين في الغرفة المزدوجة. في حال كان عدد المسافرين فردياً (مثل 3 أشخاص)، تضيف الحاسبة تلقائياً تكلفة غرفة إضافية لضمان واقعية ودقة الميزانية.'
            }
        ]
    }
}

# 2. Metadata for base.json files
base_metadata = {
    'en': {
        'name': '2026 World Cup Travel & Ticket Budget Calculator',
        'description': 'All-in-one budget estimator for the 2026 FIFA World Cup. Calculate tickets, inter-city flights, car rentals, hotels, and split group costs with border crossing visa warnings.',
        'seo_title': '2026 World Cup Travel & Ticket Budget Calculator',
        'seo_description': 'Plan your 2026 World Cup trip budget. Calculate ticket tiers, flights, hotel room splits, and driving fuel costs across USA, Canada, and Mexico with live exchange rates.'
    },
    'zh': {
        'name': '2026世界杯旅行与门票预算计算器',
        'description': '一站式2026美加墨世界杯门票与旅行预算精算器。包含各档门票、美加墨城际机票、自驾油耗成本、酒店拼房分摊，支持多币种汇率换算与跨国边境出入境签证提醒。',
        'seo_title': '2026世界杯预算计算器 - 门票交通住宿精算',
        'seo_description': '免费2026世界杯观赛预算计算器。提供小组赛至决赛各档门票、美加墨16城机票与自驾油耗精算，支持多币种转换与拼房分摊，智能生成跨国边境签证提醒，助您合理规划行程。'
    },
    'ja': {
        'name': '2026年W杯旅行予算計算器',
        'description': '2026年北米W杯のチケット・旅行予算計算ツール。チケット料金、都市間フライト、ホテル料金のシェア、ビザ警告などの費用を自动算出します。',
        'seo_title': '2026年W杯旅行・チケット予算計算ツール',
        'seo_description': '2026年W杯の旅行予算を無料計算。チケット、都市間フライト、ホテル相部屋分割、自驾油代を網羅。米加墨3国間を移動する際のビザ警告も対応。お得な観戦計画をサポート。'
    },
    'ko': {
        'name': '2026 월드컵 여행 예산 계산기',
        'description': '2026 북미 월드컵 티켓 및 여행 예산 통합 계산기. 매치 티켓, 도시 간 항공권, 호텔 분할 비용, 렌터카 주유비 계산 및 다국가 비자 경고 제공.',
        'seo_title': '2026 월드컵 여행 및 티켓 예산 계산기',
        'seo_description': '2026 월드컵 여행 예산을 무료로 계산해 보세요. 티켓 가격, 항공권, 숙소 분할 비용, 렌터카 주유비를 정밀 계산하며 국경 이동 비자 경고와 실시간 환율을 제공합니다.'
    },
    'es': {
        'name': 'Calculadora de Presupuesto del Mundial 2026',
        'description': 'Estime su presupuesto para el Mundial de Fútbol 2026. Calcule entradas, vuelos, hoteles, alquiler de autos y divida gastos grupales con alertas de visas de frontera.',
        'seo_title': 'Calculadora de Presupuesto para el Mundial 2026',
        'seo_description': 'Planifique su viaje al Mundial 2026. Calcule costos de entradas, vuelos interurbanos, alquiler de autos y hoteles en EE. UU., Canadá y México con tipos de cambio reales.'
    },
    'pt': {
        'name': 'Calculadora de Orçamento da Copa do Mundo 2026',
        'description': 'Estime seu orçamento para a Copa do Mundo 2026. Calcule ingressos, voos intercidades, hotéis, aluguel de carros e divida custos com alertas de vistos de fronteira.',
        'seo_title': 'Calculadora de Orçamento para a Copa do Mundo 2026',
        'seo_description': 'Planeje sua viagem para a Copa de 2026. Calcule ingressos, voos, aluguel de carros e divisão de hotéis nos EUA, Canadá e México com taxas de câmbio atualizadas em tempo real.'
    },
    'fr': {
        'name': 'Calculateur de Budget Coupe du Monde 2026',
        'description': 'Estimez votre budget pour la Coupe du Monde 2026. Calculez les billets, vols, hôtels, locations de voiture, et partagez les frais avec des alertes visas transfrontaliers.',
        'seo_title': 'Calculateur de Budget Voyage Coupe du Monde 2026',
        'seo_description': 'Planifiez votre budget pour la Coupe du Monde 2026. Calculez les billets, vols, hôtels et frais de route aux USA, Canada et Mexique avec conversion de devises en temps réel.'
    },
    'de': {
        'name': 'Budgetrechner für die Weltmeisterschaft 2026',
        'description': 'Kalkulieren Sie Ihr Budget für die WM 2026. Berechnen Sie Tickets, Inlandsflüge, Mietwagen, Hotelkosten und Gruppenaufteilungen inklusive Visa-Grenzübertrittshinweisen.',
        'seo_title': 'WM 2026 Reise & Ticket Budgetrechner',
        'seo_description': 'Planen Sie Ihr WM 2026 Reisebudget. Berechnen Sie Ticketkategorien, Inlandsflüge, Hotelkosten und Kraftstoffpreise in den USA, Kanada und Mexiko mit Echtzeit-Wechselkursen.'
    },
    'ru': {
        'name': 'Калькулятор бюджета поездки на ЧМ-2026',
        'description': 'Калькулятор билетов и бюджета поездки на ЧМ-2026 по футболу. Рассчитайте билеты, перелеты, отели, авто и поделите расходы с учетом пограничных визовых требований.',
        'seo_title': 'Калькулятор бюджета и билетов на ЧМ-2026',
        'seo_description': 'Планируйте бюджет на ЧМ-2026. Рассчитайте стоимость билетов, перелетов, отелей и топлива в США, Канаде и Мексике с конвертацией валют и визовыми предупреждениями.'
    },
    'ar': {
        'name': 'حاسبة ميزانية السفر لكأس العالم 2026',
        'description': 'حاسبة ميزانية السفر والتذاكر لكأس العالم 2026. احسب أسعار التذاكر، الطيران الداخلي، الفنادق، واستئجار السيارات مع تحذيرات تأشيرات الدخول الحدودية للولايات المتحدة وكندا والمكسيك.',
        'seo_title': 'حاسبة ميزانية السفر وتذاكر كأس العالم 2026',
        'seo_description': 'خطط لميزانية رحلتك لكأس العالم 2026. احسب تكاليف التذاكر، الطيران، الفنادق، والوقود في أمريكا وكندا والمكسيك مع أسعار صرف العملات المباشرة وتحذيرات التأشيرة الحدودية.'
    }
}

# Create tools directories and write split json files
for loc in locales:
    tools_dir = os.path.join(messages_dir, loc, 'tools')
    os.makedirs(tools_dir, exist_ok=True)
    detailed_file = os.path.join(tools_dir, 'world-cup-budget-calculator.json')
    
    with open(detailed_file, 'w', encoding='utf-8') as f:
        json.dump(detailed_data[loc], f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Created detailed translation: {detailed_file}")

# Update base.json files
for loc in locales:
    base_file = os.path.join(messages_dir, loc, 'base.json')
    with open(base_file, 'r', encoding='utf-8') as f:
        base_content = json.load(f)
    
    if 'tools' not in base_content:
        base_content['tools'] = {}
        
    base_content['tools']['world-cup-budget-calculator'] = base_metadata[loc]
    
    with open(base_file, 'w', encoding='utf-8') as f:
        json.dump(base_content, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f"Updated metadata in base: {base_file}")

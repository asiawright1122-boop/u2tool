const fs = require('fs');
const path = require('path');

const locales = ['zh', 'en', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'];

const data = {
  zh: {
    name: "2026世界杯夺冠概率模拟器",
    description: "免费2026美加墨世界杯模拟器。采用蒙特卡洛算法与Elo等级分，支持东道主优势与豪门底蕴三维加成调节，一键跑分十万次对决，瑞士私银暗金大屏，纯前端精算，保护隐私安全。"
  },
  en: {
    name: "2026 World Cup Monte Carlo Simulator",
    description: "Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline."
  },
  es: {
    name: "Simulador de Probabilidades del Mundial 2026",
    description: "Simulador del Mundial 2026 gratis. Dirige 10k simulaciones de Montecarlo con Elo, deslizadores de local/herencia y gráficos oro mate de ECharts. 100% local."
  },
  pt: {
    name: "Simulador da Copa do Mundo 2026",
    description: "Simulador da Copa do Mundo 2026 grátis. Execute 10k simulações de Monte Carlo com Elo, controles de anfitrião/tradição e gráficos ouro fosco no cliente."
  },
  ja: {
    name: "2026W杯モンテカルロシミュレーター",
    description: "無料2026W杯シミュレーター。モンテカルロ法とEloレーティングを用い、ホスト国や伝統国の補正スライダーとマットゴールド of ECharts搭載。ブラウザ実行で完全保護。"
  },
  ko: {
    name: "2026 월드컵 몬테카를로 시뮬레이터",
    description: "무료 2026 월드컵 시뮬레이터. 몬테카를로 알고리즘과 Elo 레이팅을 사용하며, 개최국 및 전통 강호 슬라이더 조절과 매트 골드 ECharts 차트를 지원합니다."
  },
  fr: {
    name: "Simulateur de la Coupe du Monde 2026",
    description: "Simulateur gratuit de la Coupe du Monde 2026. Lancez 10k simulations de Monte Carlo avec Elo, curseurs hôte/tradition et graphiques ECharts or mat. 100% local."
  },
  de: {
    name: "WM 2026 Monte-Carlo-Simulator",
    description: "Kostenloser WM 2026 Simulator. Führen Sie 10k Monte-Carlo-Simulationen mit Elo-Klassen, Gastgeber/Tradition-Reglern und edlen ECharts aus. 100% offline."
  },
  ru: {
    name: "Симулятор Чемпионата Мира по футболу 2026",
    description: "Бесплатный симулятор ЧМ-2026. Запуск 10к симуляций Монте-Карло с рейтингом Elo, настройкой хозяев/традиций и золотыми графиками ECharts. 100% на клиенте."
  },
  ar: {
    name: "محاكي كأس العالم 2026 مونت كارلو",
    description: "محاكي كأس العالم 2026 المجاني. تشغيل 10 آلاف محاكاة مونت كارلو مع تصنيف Elo، وتعديلات المضيف/التقاليد، ومخططات ECharts الذهبية الأنيقة. محلي 100%."
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, `../src/messages/${locale}/base.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  // Make sure tools exists and add the key
  if (!json.tools) {
    json.tools = {};
  }
  
  json.tools["world-cup-simulator"] = {
    name: data[locale].name,
    description: data[locale].description
  };
  
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log(`Updated ${locale}/base.json`);
});

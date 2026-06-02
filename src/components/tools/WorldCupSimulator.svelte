<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { 
    Sliders, Trophy, Flame, Sparkles, RefreshCw, Award, Info, Percent, ChevronRight 
  } from 'lucide-svelte';
  import EChartsWrapper from './EChartsWrapper.svelte';
  import { 
    BASE_TEAMS, 
    adjustEloForTrioDNA, 
    calculateMatchProbability, 
    simulateFullTournament,
    type BaseTeam
  } from '../../lib/runtime-integrity/world-cup-engine';
  import { createTranslator } from '../../lib/translations';

  let { locale, translations } = $props<{ locale: string; translations: any }>();
  const t = createTranslator(translations, locale, 'tools.world-cup-simulator');

  // Unified localized UI copy map (covering all 10 locales)
  const uiTranslations: Record<string, Record<string, string>> = {
    en: {
      homeAdvantage: 'Home Advantage',
      homeAdvantageDesc: 'Boost USA, Canada, and Mexico',
      heritageDna: 'Heritage DNA Boost',
      heritageDnaDesc: 'Power up traditional giants',
      wildcardChaos: 'Wildcard Chaos',
      wildcardChaosDesc: ' thermodynamically scale upsets',
      runSim: 'Run 10,000 Simulations',
      runningSim: 'Running Monte Carlo...',
      championProb: 'Championship Win Probabilities',
      focusTeamComparison: 'Head-to-Head focus comparison',
      winOdds: 'Win Odds',
      drawOdds: 'Draw Odds',
      champion: 'Champion',
      runnerUp: 'Runner-up',
      semiFinals: 'Semi-finals',
      quarterFinals: 'Quarter-finals',
      roundOf16: 'Round of 16',
      roundOf32: 'Round of 32',
      groupStage: 'Group Stage Exit',
      advancementFunnel: 'Advancement Funnel',
      tuneDnaTitle: 'Trio DNA Tuning Sliders',
      focusCompareTitle: 'Head-to-Head Comparison',
      hostNation: 'Host Nation',
      heritageTeam: 'Traditional Giant',
      chooseTeam: 'Choose Team',
      readyToSim: 'Ready to Run Simulation',
      readyToSimDesc: 'Adjust the DNA sliders on the left and run 10k Monte Carlo simulations to see predictions.',
      stageLabel: 'Stage',
      probabilityLabel: 'Probability',
      baseElo: 'Base ELO',
      adjElo: 'Adjusted ELO'
    },
    zh: {
      homeAdvantage: '东道主优势',
      homeAdvantageDesc: '加成美、加、墨三国表现',
      heritageDna: '豪门底蕴加成',
      heritageDnaDesc: '提升传统豪门底蕴加分',
      wildcardChaos: '狂野混乱度 (爆冷概率)',
      wildcardChaosDesc: '增加小概率事件与逆袭发生率',
      runSim: '运行 10,000 次模拟',
      runningSim: '蒙特卡洛计算中...',
      championProb: '冠军概率统计 (Top 15)',
      focusTeamComparison: '焦点队伍对决预测',
      winOdds: '胜率',
      drawOdds: '平局率',
      champion: '夺冠',
      runnerUp: '亚军',
      semiFinals: '四强',
      quarterFinals: '八强',
      roundOf16: '十六强',
      roundOf32: '三十二强',
      groupStage: '小组赛淘汰',
      advancementFunnel: '晋级概率漏斗',
      tuneDnaTitle: 'Trio DNA 战术微调面板',
      focusCompareTitle: '焦点队伍战绩与预测对比',
      hostNation: '东道主国家',
      heritageTeam: '传统强国',
      chooseTeam: '选择队伍',
      readyToSim: '准备运行模拟',
      readyToSimDesc: '调整左侧的 DNA 微调滑块，一键跑分 10,000 次，获取最新的人工智能精算预测。',
      stageLabel: '晋级轮次',
      probabilityLabel: '达成概率',
      baseElo: '基础 ELO',
      adjElo: '修正后 ELO'
    },
    es: {
      homeAdvantage: 'Ventaja de Local',
      homeAdvantageDesc: 'Impulsar a EE. UU., Canadá y México',
      heritageDna: 'Impulso de Tradición',
      heritageDnaDesc: 'Aumentar a gigantes tradicionales',
      wildcardChaos: 'Caos del Comodín',
      wildcardChaosDesc: 'Escalar sorpresas termodinámicamente',
      runSim: 'Ejecutar 10.000 Simulaciones',
      runningSim: 'Calculando Montecarlo...',
      championProb: 'Probabilidad de Campeonato',
      focusTeamComparison: 'Comparación Cara a Cara',
      winOdds: 'Prob. de Victoria',
      drawOdds: 'Prob. de Empate',
      champion: 'Campeón',
      runnerUp: 'Subcampeón',
      semiFinals: 'Semifinales',
      quarterFinals: 'Cuartos',
      roundOf16: 'Octavos',
      roundOf32: 'Dieciseisavos',
      groupStage: 'Eliminación en Grupos',
      advancementFunnel: 'Embudo de Progreso',
      tuneDnaTitle: 'Deslizadores de Sintonización Trio DNA',
      focusCompareTitle: 'Comparación Focalizada',
      hostNation: 'Nación Anfitriona',
      heritageTeam: 'Gigante Tradicional',
      chooseTeam: 'Elegir Equipo',
      readyToSim: 'Listo para Ejecutar',
      readyToSimDesc: 'Ajusta los deslizadores a la izquierda y ejecuta la simulación para ver los resultados.',
      stageLabel: 'Etapa',
      probabilityLabel: 'Probabilidad',
      baseElo: 'ELO Base',
      adjElo: 'ELO Ajustado'
    },
    pt: {
      homeAdvantage: 'Vantagem de Casa',
      homeAdvantageDesc: 'Aumentar EUA, Canadá e México',
      heritageDna: 'Impulso de Tradição',
      heritageDnaDesc: 'Aumentar gigantes tradicionais',
      wildcardChaos: 'Caos do Curinga',
      wildcardChaosDesc: 'Escalar zebras termodinamicamente',
      runSim: 'Executar 10.000 Simulações',
      runningSim: 'Rodando Monte Carlo...',
      championProb: 'Probabilidades de Campeão',
      focusTeamComparison: 'Comparação Direta H2H',
      winOdds: 'Vitória',
      drawOdds: 'Empate',
      champion: 'Campeão',
      runnerUp: 'Vice-campeão',
      semiFinals: 'Semifinais',
      quarterFinals: 'Quartas de final',
      roundOf16: 'Oitavas de final',
      roundOf32: 'Dezesseis-avos de final',
      groupStage: 'Eliminação de Grupos',
      advancementFunnel: 'Funil de Progresso',
      tuneDnaTitle: 'Controles de Sintonia Trio DNA',
      focusCompareTitle: 'Comparação Focalizada H2H',
      hostNation: 'Nação Anfitriã',
      heritageTeam: 'Gigante Tradicional',
      chooseTeam: 'Escolher Equipe',
      readyToSim: 'Pronto para Simular',
      readyToSimDesc: 'Ajuste os controles e execute a simulação para calcular as probabilidades de avanço.',
      stageLabel: 'Etapa',
      probabilityLabel: 'Probabilidade',
      baseElo: 'ELO Base',
      adjElo: 'ELO Ajustado'
    },
    ja: {
      homeAdvantage: 'ホスト国補正',
      homeAdvantageDesc: 'アメリカ、カナダ、メキシコを強化',
      heritageDna: '伝統国DNA加算',
      heritageDnaDesc: '歴史的強豪の底力を補正',
      wildcardChaos: '爆冷（アップセット）率',
      wildcardChaosDesc: '番狂わせと混沌度を調節',
      runSim: '10,000回シミュレート',
      runningSim: 'モンテカルロ計算中...',
      championProb: '優勝確率ランキング (Top 15)',
      focusTeamComparison: '注目チーム直接対決予測',
      winOdds: '勝率',
      drawOdds: '引き分け率',
      champion: '優勝',
      runnerUp: '準優勝',
      semiFinals: 'ベスト4',
      quarterFinals: 'ベスト8',
      roundOf16: 'ベスト16',
      roundOf32: 'ベスト32',
      groupStage: 'グループ敗退',
      advancementFunnel: '勝ち進みファネル',
      tuneDnaTitle: 'Trio DNA 戦術スライダー',
      focusCompareTitle: '注目チーム直接対決',
      hostNation: 'ホスト国',
      heritageTeam: '歴史的強豪',
      chooseTeam: 'チーム選択',
      readyToSim: 'シミュレーションの実行準備完了',
      readyToSimDesc: '左側の戦術スライダーを調節し、10,000回のシミュレーションを実行して結果を表示します。',
      stageLabel: 'ステージ',
      probabilityLabel: '到達確率',
      baseElo: '基礎 ELO',
      adjElo: '補正後 ELO'
    },
    ko: {
      homeAdvantage: '개최국 이점',
      homeAdvantageDesc: '미국, 캐나다, 멕시코 능력치 조정',
      heritageDna: '전통 강호 버프',
      heritageDnaDesc: '우승 경험국 가중치 증가',
      wildcardChaos: '와일드카드 혼란도',
      wildcardChaosDesc: '이변 및 업셋 발생 확률 조절',
      runSim: '10,000회 시뮬레이션',
      runningSim: '몬테카를로 분석 중...',
      championProb: '우승 확률 통계',
      focusTeamComparison: '포커스 팀 맞대결',
      winOdds: '승리 확률',
      drawOdds: '무승부 확률',
      champion: '우승',
      runnerUp: '준우승',
      semiFinals: '4강',
      quarterFinals: '8강',
      roundOf16: '16강',
      roundOf32: '32강',
      groupStage: '조별리그 탈락',
      advancementFunnel: '단계별 생존 확률',
      tuneDnaTitle: 'Trio DNA 조절 슬라이더',
      focusCompareTitle: '선택 팀 맞대결 비교',
      hostNation: '개최국',
      heritageTeam: '전통 강호',
      chooseTeam: '팀 선택',
      readyToSim: '시뮬레이션 준비 완료',
      readyToSimDesc: '슬라이더를 조절하여 전력을 수정한 뒤 10,000회 몬테카를로 분석을 진행하세요.',
      stageLabel: '단계',
      probabilityLabel: '진출 확률',
      baseElo: '기본 ELO',
      adjElo: '보정 ELO'
    },
    fr: {
      homeAdvantage: 'Avantage Hôte',
      homeAdvantageDesc: 'Booster USA, Canada et Mexique',
      heritageDna: 'Boost ADN Tradition',
      heritageDnaDesc: 'Renforcer les puissances historiques',
      wildcardChaos: 'Chaos du Joker',
      wildcardChaosDesc: 'Multiplier les surprises',
      runSim: 'Lancer 10 000 Simulations',
      runningSim: 'Monte Carlo en cours...',
      championProb: 'Probabilités de Titre',
      focusTeamComparison: 'Face-à-Face des Favoris',
      winOdds: 'Victoire',
      drawOdds: 'Match Nul',
      champion: 'Champion',
      runnerUp: 'Finaliste',
      semiFinals: 'Demi-finales',
      quarterFinals: 'Quarts',
      roundOf16: 'Huitièmes',
      roundOf32: 'Seizièmes',
      groupStage: 'Élimination en Groupes',
      advancementFunnel: 'Entonnoir d’Avancement',
      tuneDnaTitle: 'Sliders de Réglage Trio DNA',
      focusCompareTitle: 'Comparaison Directe H2H',
      hostNation: 'Pays Hôte',
      heritageTeam: 'Puissance Historique',
      chooseTeam: 'Choisir Équipe',
      readyToSim: 'Prêt à Simuler',
      readyToSimDesc: 'Réglez les curseurs tactiques et lancez les simulations pour estimer les chances de titre.',
      stageLabel: 'Tour',
      probabilityLabel: 'Probabilité',
      baseElo: 'ELO Base',
      adjElo: 'ELO Ajusté'
    },
    de: {
      homeAdvantage: 'Heimvorteil',
      homeAdvantageDesc: 'USA, Kanada und Mexiko boosten',
      heritageDna: 'Traditions-DNA',
      heritageDnaDesc: 'Traditionelle Giganten stärken',
      wildcardChaos: 'Wildcard-Chaos',
      wildcardChaosDesc: 'Thermodynamischer Außenseiter-Boost',
      runSim: '10.000 Simulationen laufen lassen',
      runningSim: 'Berechne Monte Carlo...',
      championProb: 'Meisterschafts-Wahrscheinlichkeiten',
      focusTeamComparison: 'H2H-Direktvergleich',
      winOdds: 'Sieg',
      drawOdds: 'Remis',
      champion: 'Weltmeister',
      runnerUp: 'Vizeweltmeister',
      semiFinals: 'Halbfinale',
      quarterFinals: 'Viertelfinale',
      roundOf16: 'Achtelfinale',
      roundOf32: 'Sechzehntelfinale',
      groupStage: 'Aus in Vorrunde',
      advancementFunnel: 'Fortschritts-Trichter',
      tuneDnaTitle: 'Trio DNA Regler',
      focusCompareTitle: 'H2H Focus-Teams',
      hostNation: 'Gastgeber',
      heritageTeam: 'Traditioneller Gigant',
      chooseTeam: 'Team wählen',
      readyToSim: 'Bereit zum Simulieren',
      readyToSimDesc: 'Stellen Sie die Regler links ein und starten Sie die 10k Monte-Carlo-Simulationen.',
      stageLabel: 'Runde',
      probabilityLabel: 'Wahrscheinlichkeit',
      baseElo: 'Basis ELO',
      adjElo: 'Ajustiertes ELO'
    },
    ru: {
      homeAdvantage: 'Преимущество Хозяев',
      homeAdvantageDesc: 'Буст США, Канады и Мексики',
      heritageDna: 'Исторический Опыт',
      heritageDnaDesc: 'Усиление традиционных гигантов',
      wildcardChaos: 'Хаос Уайлд-кард',
      wildcardChaosDesc: 'Термодинамический шанс сенсаций',
      runSim: 'Запуск 10 000 Симуляций',
      runningSim: 'Расчет Монте-Карло...',
      championProb: 'Вероятность Титула (Топ-15)',
      focusTeamComparison: 'Сравнение Избранных Команд',
      winOdds: 'Победа',
      drawOdds: 'Ничья',
      champion: 'Чемпион',
      runnerUp: 'Финалист',
      semiFinals: 'Полуфинал',
      quarterFinals: 'Четвертьфинал',
      roundOf16: '1/8 Финала',
      roundOf32: '1/16 Финала',
      groupStage: 'Вылет в Группе',
      advancementFunnel: 'Сетка Продвижения',
      tuneDnaTitle: 'Панель Настройки Trio DNA',
      focusCompareTitle: 'Сравнение H2H',
      hostNation: 'Хозяин турнира',
      heritageTeam: 'Футбольный Гигант',
      chooseTeam: 'Выбрать Команду',
      readyToSim: 'Готово к Симуляции',
      readyToSimDesc: 'Настройте слайдеры ДНК слева и запустите 10 тысяч симуляций для прогноза.',
      stageLabel: 'Раунд',
      probabilityLabel: 'Вероятность',
      baseElo: 'Базовый ELO',
      adjElo: 'Адаптированный ELO'
    },
    ar: {
      homeAdvantage: 'أفضلية الأرض',
      homeAdvantageDesc: 'دعم أمريكا، كندا، والمكسيك',
      heritageDna: 'عامل العراقة والتاريخ',
      heritageDnaDesc: 'تعزيز قوة العمالقة التقليديين',
      wildcardChaos: 'عامل المفاجآت (الفوضى)',
      wildcardChaosDesc: 'زيادة نسبة الفرص للفرق غير المتوقعة',
      runSim: 'تشغيل 10,000 محاكاة',
      runningSim: 'جاري تشغيل محاكاة مونت كارلو...',
      championProb: 'احتمالات الفوز بالبطولة (أول 15)',
      focusTeamComparison: 'مقارنة مباشرة للفرق',
      winOdds: 'الفوز',
      drawOdds: 'التعادل',
      champion: 'البطل',
      runnerUp: 'الوصيف',
      semiFinals: 'نصف النهائي',
      quarterFinals: 'ربع النهائي',
      roundOf16: 'دور الـ 16',
      roundOf32: 'دور الـ 32',
      groupStage: 'الخروج من دور المجموعات',
      advancementFunnel: 'مراحل التقدم في البطولة',
      tuneDnaTitle: 'مؤشرات تعديل Trio DNA',
      focusCompareTitle: 'مقارنة H2H المباشرة',
      hostNation: 'الدولة المستضيفة',
      heritageTeam: 'عملاق عريق',
      chooseTeam: 'اختر الفريق',
      readyToSim: 'جاهز لبدء المحاكاة',
      readyToSimDesc: 'قم بضبط مؤشرات الحمض النووي (DNA) على اليسار وشغّل 10 آلاف محاكاة مونت كارلو لعرض التوقعات.',
      stageLabel: 'الدور',
      probabilityLabel: 'الاحتمالية',
      baseElo: 'تصنيف ELO الأساسي',
      adjElo: 'تصنيف ELO المعدل'
    }
  };

  const currentUi = $derived(uiTranslations[locale] || uiTranslations['en']);

  // Slider States
  let homeSlider = $state(5);
  let heritageSlider = $state(5);
  let chaosSlider = $state(5);

  // Focus Teams
  let focusTeamA = $state('BRA');
  let focusTeamB = $state('ARG');

  // Simulation Status
  let isSimulating = $state(false);
  let simProgress = $state(0);
  let simCompleted = $state(false);

  // Statistics aggregated over 10k simulations
  let champCounts = $state<Record<string, number>>({});
  let runnerUpCounts = $state<Record<string, number>>({});
  let semiCounts = $state<Record<string, number>>({});
  let quarterCounts = $state<Record<string, number>>({});
  let r16Counts = $state<Record<string, number>>({});
  let r32Counts = $state<Record<string, number>>({});
  let groupExitCounts = $state<Record<string, number>>({});
  
  // Sorted array of top teams based on championship win rate
  let topChampions = $state<{ id: string, name: string, percent: number }[]>([]);

  // Advancement probabilities for focus teams
  let focusAdvancementA = $state<Record<string, number>>({});
  let focusAdvancementB = $state<Record<string, number>>({});

  // Direct H2H odds
  let directH2H = $derived.by(() => {
    const teamA = BASE_TEAMS.find(t => t.id === focusTeamA)!;
    const teamB = BASE_TEAMS.find(t => t.id === focusTeamB)!;
    if (!teamA || !teamB) return { winA: 33, winB: 33, draw: 34 };

    const eloA = adjustEloForTrioDNA(teamA.elo, teamA.isHost, teamA.isHeritage, homeSlider, heritageSlider);
    const eloB = adjustEloForTrioDNA(teamB.elo, teamB.isHost, teamB.isHeritage, homeSlider, heritageSlider);
    const { probA, probB, probDraw } = calculateMatchProbability(eloA, eloB, chaosSlider);

    const sum = probA + probB + probDraw;
    return {
      winA: Math.round((probA / sum) * 100),
      winB: Math.round((probB / sum) * 100),
      draw: Math.round((probDraw / sum) * 100)
    };
  });

  // Derived options for Champion ECharts
  let championChartOption = $derived.by(() => {
    if (topChampions.length === 0) return {};

    const categories = topChampions.map(tc => tc.name);
    const values = topChampions.map(tc => tc.percent);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '4%',
        right: '6%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
        axisLabel: { color: '#a3a3a3', formatter: '{value}%' }
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLabel: { color: '#d4d4d8', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: currentUi.probabilityLabel,
          type: 'bar',
          data: values,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#D4AF37' }, // Matte Gold
                { offset: 1, color: '#B8860B' }  // Dark Gold
              ]
            },
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: 'right',
            color: '#D4AF37',
            formatter: '{c}%',
            fontSize: 10
          }
        }
      ]
    };
  });

  // Derived options for H2H Radar Chart
  let radarChartOption = $derived.by(() => {
    const teamA = BASE_TEAMS.find(t => t.id === focusTeamA)!;
    const teamB = BASE_TEAMS.find(t => t.id === focusTeamB)!;
    if (!teamA || !teamB) return {};

    const eloA = adjustEloForTrioDNA(teamA.elo, teamA.isHost, teamA.isHeritage, homeSlider, heritageSlider);
    const eloB = adjustEloForTrioDNA(teamB.elo, teamB.isHost, teamB.isHeritage, homeSlider, heritageSlider);

    const kRateA = focusAdvancementA[currentUi.roundOf32] || 0;
    const kRateB = focusAdvancementB[currentUi.roundOf32] || 0;
    const fRateA = focusAdvancementA[currentUi.runnerUp] || 0;
    const fRateB = focusAdvancementB[currentUi.runnerUp] || 0;
    const cRateA = focusAdvancementA[currentUi.champion] || 0;
    const cRateB = focusAdvancementB[currentUi.champion] || 0;

    return {
      tooltip: { trigger: 'item' },
      legend: {
        data: [teamA.name, teamB.name],
        textStyle: { color: '#d4d4d8' },
        bottom: 0
      },
      radar: {
        indicator: [
          { name: currentUi.baseElo, max: 2100 },
          { name: currentUi.adjElo, max: 2300 },
          { name: 'Knockout %', max: 100 },
          { name: 'Finals %', max: 50 },
          { name: 'Champion %', max: 30 }
        ],
        axisName: { color: '#a3a3a3', fontSize: 10 },
        splitArea: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [teamA.elo, eloA, Math.round(kRateA), Math.round(fRateA + cRateA), Math.round(cRateA)],
              name: teamA.name,
              itemStyle: { color: '#f59e0b' },
              areaStyle: { color: 'rgba(245,158,11,0.1)' }
            },
            {
              value: [teamB.elo, eloB, Math.round(kRateB), Math.round(fRateB + cRateB), Math.round(cRateB)],
              name: teamB.name,
              itemStyle: { color: '#38bdf8' },
              areaStyle: { color: 'rgba(56,189,248,0.1)' }
            }
          ]
        }
      ]
    };
  });

  // Non-blocking Monte Carlo simulation runner
  function triggerSimulation() {
    isSimulating = true;
    simProgress = 0;
    simCompleted = false;

    // Reset statistics counts
    const tempChamps: Record<string, number> = {};
    const tempRunnerUps: Record<string, number> = {};
    const tempSemis: Record<string, number> = {};
    const tempQuarters: Record<string, number> = {};
    const tempR16s: Record<string, number> = {};
    const tempR32s: Record<string, number> = {};
    const tempGroupExits: Record<string, number> = {};

    BASE_TEAMS.forEach(t => {
      tempChamps[t.id] = 0;
      tempRunnerUps[t.id] = 0;
      tempSemis[t.id] = 0;
      tempQuarters[t.id] = 0;
      tempR16s[t.id] = 0;
      tempR32s[t.id] = 0;
      tempGroupExits[t.id] = 0;
    });

    const totalRuns = 10000;
    const batchSize = 250;
    let runsDone = 0;

    function runBatch() {
      const limit = Math.min(runsDone + batchSize, totalRuns);
      for (let i = runsDone; i < limit; i++) {
        const sim = simulateFullTournament(homeSlider, heritageSlider, chaosSlider);
        
        tempChamps[sim.champion.id]++;
        tempRunnerUps[sim.runnerUp.id]++;
        
        sim.semiFinalists.forEach(t => tempSemis[t.id]++);
        sim.quarterFinalists.forEach(t => tempQuarters[t.id]++);
        sim.roundOf16.forEach(t => tempR16s[t.id]++);
        sim.roundOf32.forEach(t => tempR32s[t.id]++);
        sim.groupStageExit.forEach(t => tempGroupExits[t.id]++);
      }

      runsDone = limit;
      simProgress = Math.round((runsDone / totalRuns) * 100);

      if (runsDone < totalRuns) {
        requestAnimationFrame(runBatch);
      } else {
        // Complete
        champCounts = tempChamps;
        runnerUpCounts = tempRunnerUps;
        semiCounts = tempSemis;
        quarterCounts = tempQuarters;
        r16Counts = tempR16s;
        r32Counts = tempR32s;
        groupExitCounts = tempGroupExits;

        // Process top 15 champions
        const list = BASE_TEAMS.map(t => {
          const count = champCounts[t.id] || 0;
          return {
            id: t.id,
            name: t.name,
            percent: parseFloat(((count / totalRuns) * 100).toFixed(2))
          };
        })
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 15);

        topChampions = list;

        // Compute focus team advancement probabilities
        calculateFocusAdvancement(focusTeamA, totalRuns);
        calculateFocusAdvancement(focusTeamB, totalRuns);

        isSimulating = false;
        simCompleted = true;
      }
    }

    // Start asynchronously
    setTimeout(runBatch, 50);
  }

  function calculateFocusAdvancement(teamId: string, total: number) {
    const champ = champCounts[teamId] || 0;
    const runner = runnerUpCounts[teamId] || 0;
    const semi = semiCounts[teamId] || 0;
    const quarter = quarterCounts[teamId] || 0;
    const r16 = r16Counts[teamId] || 0;
    const r32 = r32Counts[teamId] || 0;
    const group = groupExitCounts[teamId] || 0;

    // A team advances to a stage if they reached it or any higher stage
    const r32Total = r32 + r16 + quarter + semi + runner + champ;
    const r16Total = r16 + quarter + semi + runner + champ;
    const quarterTotal = quarter + semi + runner + champ;
    const semiTotal = semi + runner + champ;
    const runnerTotal = runner + champ;

    const dataObj = {
      [currentUi.champion]: (champ / total) * 100,
      [currentUi.runnerUp]: (runnerTotal / total) * 100,
      [currentUi.semiFinals]: (semiTotal / total) * 100,
      [currentUi.quarterFinals]: (quarterTotal / total) * 100,
      [currentUi.roundOf16]: (r16Total / total) * 100,
      [currentUi.roundOf32]: (r32Total / total) * 100,
      [currentUi.groupStage]: (group / total) * 100
    };

    if (teamId === focusTeamA) {
      focusAdvancementA = dataObj;
    } else {
      focusAdvancementB = dataObj;
    }
  }

  // Pre-load default comparison when team selections change
  $effect(() => {
    if (simCompleted) {
      calculateFocusAdvancement(focusTeamA, 10000);
      calculateFocusAdvancement(focusTeamB, 10000);
    }
  });

  onMount(() => {
    // Initial pre-filled run to have the charts look good on initial render
    triggerSimulation();
  });
</script>

<!-- Outer Strict Dark Mode Gold Container -->
<div class="dark bg-[#0a0a0a] text-neutral-200 border border-neutral-800 rounded-3xl p-6 lg:p-10 shadow-2xl relative font-sans leading-relaxed selection:bg-amber-500/20">
  
  <!-- Glassmorphic Trophy Loading Overlay -->
  {#if isSimulating}
    <div class="absolute inset-0 bg-black/80 backdrop-blur-md rounded-3xl z-50 flex flex-col items-center justify-center space-y-6">
      <div class="relative flex items-center justify-center">
        <!-- Pulse Glow Outer ring -->
        <div class="absolute w-28 h-28 bg-amber-500/10 rounded-full border border-amber-500/30 animate-ping"></div>
        <div class="w-24 h-24 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border border-amber-500/30">
          <Trophy class="w-12 h-12 text-[#0a0a0a] animate-bounce" />
        </div>
      </div>
      <div class="text-center space-y-2">
        <h3 class="text-xl font-bold tracking-wide text-amber-400 font-outfit">{currentUi.runningSim}</h3>
        <p class="text-xs text-neutral-500 font-mono">Monte Carlo Sampling: {simProgress}%</p>
      </div>
      <div class="w-64 bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800">
        <div class="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-300" style="width: {simProgress}%"></div>
      </div>
    </div>
  {/if}

  <!-- Header Banner -->
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-900 pb-8 mb-8">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono text-amber-400">
        <Sparkles class="w-3.5 h-3.5" />
        2026 World Cup Analytical Sandbox
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight font-outfit">
        🏆 {t('name')}
      </h2>
      <p class="text-sm text-neutral-400 max-w-2xl">
        {t('detailed_description')}
      </p>
    </div>
    
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 shadow-inner">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Offline 精算
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Left Configuration Panel (4 cols) -->
    <div class="lg:col-span-4 space-y-6">
      
      <!-- DNA Sliders Block -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-6">
        <h3 class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Sliders class="w-4 h-4 text-amber-500" />
          {currentUi.tuneDnaTitle}
        </h3>

        <!-- Slider 1: Home Advantage -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white flex items-center gap-1.5">
              <Flame class="w-3.5 h-3.5 text-amber-500" />
              {currentUi.homeAdvantage}
            </span>
            <span class="font-mono text-amber-400 font-bold">{homeSlider}/10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            bind:value={homeSlider}
            class="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p class="text-[10px] text-neutral-500">{currentUi.homeAdvantageDesc}</p>
        </div>

        <!-- Slider 2: Heritage DNA -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white flex items-center gap-1.5">
              <Award class="w-3.5 h-3.5 text-amber-500" />
              {currentUi.heritageDna}
            </span>
            <span class="font-mono text-amber-400 font-bold">{heritageSlider}/10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            bind:value={heritageSlider}
            class="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p class="text-[10px] text-neutral-500">{currentUi.heritageDnaDesc}</p>
        </div>

        <!-- Slider 3: Wildcard Chaos -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5 text-amber-500" />
              {currentUi.wildcardChaos}
            </span>
            <span class="font-mono text-amber-400 font-bold">{chaosSlider}/10</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            bind:value={chaosSlider}
            class="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <p class="text-[10px] text-neutral-500">{currentUi.wildcardChaosDesc}</p>
        </div>
      </div>

      <!-- Focus Team H2H comparison configurations -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
          <ChevronRight class="w-4 h-4 text-amber-500" />
          {currentUi.focusTeamComparison}
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="focus-team-a" class="text-[10px] font-mono text-neutral-500 block uppercase">{currentUi.chooseTeam} A</label>
            <select
              id="focus-team-a"
              bind:value={focusTeamA}
              class="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            >
              {#each BASE_TEAMS as team}
                <option value={team.id}>{team.name}</option>
              {/each}
            </select>
          </div>

          <div class="space-y-2">
            <label for="focus-team-b" class="text-[10px] font-mono text-neutral-500 block uppercase">{currentUi.chooseTeam} B</label>
            <select
              id="focus-team-b"
              bind:value={focusTeamB}
              class="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            >
              {#each BASE_TEAMS as team}
                <option value={team.id}>{team.name}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Real-time dynamic win probabilities -->
        <div class="mt-4 p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-3">
          <div class="flex justify-between items-center text-xs font-mono">
            <span class="text-amber-400 font-bold">{BASE_TEAMS.find(t => t.id === focusTeamA)?.name}</span>
            <span class="text-sky-400 font-bold">{BASE_TEAMS.find(t => t.id === focusTeamB)?.name}</span>
          </div>
          
          <div class="relative h-6 bg-neutral-900 rounded-lg overflow-hidden flex text-[10px] font-mono text-white text-center font-bold">
            <div class="bg-amber-500 flex items-center justify-center transition-all duration-300" style="width: {directH2H.winA}%">
              {directH2H.winA > 15 ? `${directH2H.winA}%` : ''}
            </div>
            <div class="bg-neutral-800 flex items-center justify-center transition-all duration-300" style="width: {directH2H.draw}%">
              {directH2H.draw > 15 ? `${directH2H.draw}%` : ''}
            </div>
            <div class="bg-sky-500 flex items-center justify-center transition-all duration-300" style="width: {directH2H.winB}%">
              {directH2H.winB > 15 ? `${directH2H.winB}%` : ''}
            </div>
          </div>
          
          <div class="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>{currentUi.winOdds} (A)</span>
            <span>{currentUi.drawOdds}</span>
            <span>{currentUi.winOdds} (B)</span>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        onclick={triggerSimulation}
        disabled={isSimulating}
        class="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-neutral-950 font-bold rounded-2xl text-sm font-sans shadow-[0_4px_20px_rgba(245,158,11,0.2)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 group cursor-pointer"
      >
        <RefreshCw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
        {currentUi.runSim}
      </button>

    </div>

    <!-- Right Presentation Panels (8 cols) -->
    <div class="lg:col-span-8 space-y-6">
      
      {#if !simCompleted && topChampions.length === 0}
        <!-- Initial Placeholder State -->
        <div class="p-12 border border-dashed border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
          <div class="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-amber-500 shadow-inner">
            <Trophy class="w-10 h-10 animate-pulse" />
          </div>
          <div class="space-y-2 max-w-sm">
            <h3 class="text-lg font-bold text-white font-outfit">{currentUi.readyToSim}</h3>
            <p class="text-xs text-neutral-500 leading-relaxed">
              {currentUi.readyToSimDesc}
            </p>
          </div>
        </div>
      {:else}
        <!-- Simulator Dashboards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Panel A: Top 15 Win Probability Bar Chart -->
          <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-3xl space-y-4 flex flex-col justify-between min-h-[460px]">
            <h3 class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Trophy class="w-4 h-4 text-amber-500" />
              {currentUi.championProb}
            </h3>
            
            <div class="flex-1 min-h-[380px] w-full">
              <EChartsWrapper
                option={championChartOption}
                style="height: 380px; width: 100%;"
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </div>

          <!-- Panel B: Focus Head-to-Head Radar Chart -->
          <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-3xl space-y-4 flex flex-col justify-between min-h-[460px]">
            <h3 class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Sliders class="w-4 h-4 text-amber-500" />
              {currentUi.focusCompareTitle}
            </h3>

            <div class="flex-1 min-h-[380px] w-full">
              <EChartsWrapper
                option={radarChartOption}
                style="height: 380px; width: 100%;"
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </div>

        </div>

        <!-- Panel C: Full Advancement Funnel Comparative Matrix -->
        <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-3xl space-y-4">
          <h3 class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
            <Percent class="w-4 h-4 text-amber-500" />
            {currentUi.advancementFunnel}
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr class="text-neutral-500 border-b border-neutral-900">
                  <th class="py-3 px-4 text-left">{currentUi.stageLabel}</th>
                  <th class="py-3 px-4 text-amber-400 text-right">{BASE_TEAMS.find(t => t.id === focusTeamA)?.name}</th>
                  <th class="py-3 px-4 text-sky-400 text-right">{BASE_TEAMS.find(t => t.id === focusTeamB)?.name}</th>
                </tr>
              </thead>
              <tbody>
                {#each [
                  currentUi.champion,
                  currentUi.runnerUp,
                  currentUi.semiFinals,
                  currentUi.quarterFinals,
                  currentUi.roundOf16,
                  currentUi.roundOf32,
                  currentUi.groupStage
                ] as stage}
                  <tr class="border-b border-neutral-900/40 hover:bg-neutral-900/20 transition-colors">
                    <td class="py-3 px-4 font-bold text-neutral-300">{stage}</td>
                    <td class="py-3 px-4 text-right text-amber-300 font-bold">
                      {focusAdvancementA[stage] ? `${focusAdvancementA[stage].toFixed(2)}%` : '0.00%'}
                    </td>
                    <td class="py-3 px-4 text-right text-sky-300 font-bold">
                      {focusAdvancementB[stage] ? `${focusAdvancementB[stage].toFixed(2)}%` : '0.00%'}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}

    </div>

  </div>

  <!-- Interactive explanation overlay/notes -->
  <div class="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3">
    <Info class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
    <div class="space-y-1">
      <h4 class="text-xs font-bold text-amber-400 font-outfit">Simulation Guidelines & Physics</h4>
      <p class="text-[10.5px] text-neutral-400 leading-relaxed">
        This simulator applies a <strong>Logistic win probability equation</strong> with thermodynamic chaos scaling.
        Maxing out the <strong>Home Advantage</strong> gives host countries (USA, Canada, Mexico) an ELO boost up to +150.
        <strong>Heritage DNA</strong> powers traditional titans (Brazil, Argentina, Germany, France, Uruguay, Spain, England, Italy) by +140 ELO.
        <strong>Wildcard Chaos</strong> scales the ELO denominator up to 2.5x, allowing dark horses to pull off massive tournament-wide upsets.
      </p>
    </div>
  </div>

</div>

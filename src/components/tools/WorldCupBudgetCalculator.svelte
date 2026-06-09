<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    Sliders,
    Plane,
    Car,
    Train,
    DollarSign,
    Users,
    MapPin,
    Plus,
    Trash2,
    ShieldAlert,
    Download,
    Share2,
    Sparkles,
    Briefcase,
    Calendar,
    Wallet,
    Info,
    CheckCircle
  } from 'lucide-svelte';
  import EChartsWrapper from './EChartsWrapper.svelte';
  import {
    HOST_CITIES,
    calculateTotalBudget,
    checkVisaRequirements,
    type RouteLeg,
    type BudgetInput
  } from '../../lib/runtime-integrity/world-cup-budget-calculator';
  import { createTranslator } from '../../lib/translations';

  let props = $props<{ locale: string; translations: any }>();
  function t(key: string, fallback?: string): string {
    return createTranslator(props.translations, props.locale, 'tools.world-cup-budget-calculator')(key, fallback);
  }

  // Multi-language UI copy mapper
  const uiTranslations: Record<string, Record<string, string>> = {
    en: {
      budgetSettings: 'Budget & Trip Settings',
      originRegionLabel: 'Origin Region',
      groupSizeLabel: 'Group Size',
      accommodationLabel: 'Accommodation Level',
      baseCurrencyLabel: 'Base Currency',
      tripRouteTitle: 'Trip Route Builder',
      addCityBtn: 'Add Host City',
      budgetBreakdownTitle: 'Budget Summary & Breakdown',
      totalCostLabel: 'Total Group Cost',
      perPersonCostLabel: 'Per Person Cost',
      visaAlertsTitle: 'Border Crossing Visa Alerts',
      visaStatusOk: 'No cross-border visa warnings for this route.',
      exportBtn: 'Export Budget Details',
      currencyRatesTitle: 'Exchange Rates Reference (per 1 USD)',
      cityLabel: 'City',
      nightsLabel: 'Nights',
      ticketLabel: 'Ticket Category',
      stageLabel: 'Match Stage',
      transitLabel: 'Transit Mode',
      actionsLabel: 'Actions',
      budgetPresetLabel: 'Budget Presets',
      backpackerPreset: 'Backpacker Solo',
      standardPreset: 'Double Standard',
      luxuryPreset: 'Family Luxury',
      transitNone: 'Arrival / None',
      transitFlight: 'Flight',
      transitDrive: 'Drive',
      transitTrain: 'Train/Bus',
      ticketCat1: 'Category 1',
      ticketCat2: 'Category 2',
      ticketCat3: 'Category 3',
      ticketCat4: 'Category 4',
      stageGroup: 'Group Stage',
      stageR32: 'Round of 32',
      stageR16: 'Round of 16',
      stageQuarter: 'Quarterfinals',
      stageSemi: 'Semifinals',
      stageFinal: 'Final',
      accommodationBudget: 'Budget (Hostel / Shared)',
      accommodationStandard: 'Standard (Hotel / Airbnb)',
      accommodationLuxury: 'Luxury (Premium Hotel)',
      visaRequiresUsa: 'Requires USA Entry Permit (ESTA or B1/B2 Visa)',
      visaRequiresCanada: 'Requires Canada Entry Permit (eTA or Tourist Visa)',
      visaRequiresMexico: 'Requires Mexico Entry Permit (Tourist Visa)',
      visaUsaEsta: 'ESTA (Electronic Authorization)',
      visaUsaRegular: 'Regular B1/B2 Tourist Visa',
      visaCanadaEta: 'eTA (Electronic Authorization)',
      visaCanadaRegular: 'Regular Tourist Visa',
      visaMexicoRegular: 'Regular Tourist Visa',
      visaNoneRequired: 'No action needed',
      chartTickets: 'Tickets',
      chartAccommodation: 'Accommodation',
      chartTransport: 'Intercity Transport',
      chartLiving: 'Living & Food',
      csvExported: 'Budget details copied to clipboard!',
      confirmDelete: 'Are you sure you want to delete this city leg?'
    },
    zh: {
      budgetSettings: '预算与行程配置',
      originRegionLabel: '出发地区',
      groupSizeLabel: '随行人数',
      accommodationLabel: '住宿水平',
      baseCurrencyLabel: '结算货币',
      tripRouteTitle: '观赛路线构建器',
      addCityBtn: '添加主办城市',
      budgetBreakdownTitle: '预算总览与比例精算',
      totalCostLabel: '团队总预算',
      perPersonCostLabel: '人均估算费用',
      visaAlertsTitle: '跨国边境签证风险提示',
      visaStatusOk: '当前路线未检测到跨国边境签证警告。',
      exportBtn: '导出预算明细表',
      currencyRatesTitle: '实时参考汇率 (对等 1 USD)',
      cityLabel: '主办城市',
      nightsLabel: '停留天数',
      ticketLabel: '门票类别',
      stageLabel: '赛事阶段',
      transitLabel: '交通方式',
      actionsLabel: '操作',
      budgetPresetLabel: '预算预设方案',
      backpackerPreset: '背包客单人',
      standardPreset: '双人标准游',
      luxuryPreset: '家庭奢华行',
      transitNone: '抵达城市 / 无',
      transitFlight: '航班 (飞机)',
      transitDrive: '自驾 (租车+油费)',
      transitTrain: '火车/长途大巴',
      ticketCat1: '一等票 (Category 1)',
      ticketCat2: '二等票 (Category 2)',
      ticketCat3: '三等票 (Category 3)',
      ticketCat4: '四等票 (Category 4)',
      stageGroup: '小组赛',
      stageR32: '32强淘汰赛',
      stageR16: '16强淘汰赛',
      stageQuarter: '1/4决赛',
      stageSemi: '半决赛',
      stageFinal: '决赛',
      accommodationBudget: '经济型 (青年旅舍 / 拼房)',
      accommodationStandard: '舒适型 (标准酒店 / 独立公寓)',
      accommodationLuxury: '豪华型 (五星高档酒店)',
      visaRequiresUsa: '需办理美国入境凭证 (ESTA 或 B1/B2 签证)',
      visaRequiresCanada: '需办理加拿大入境凭证 (eTA 或 旅游签证)',
      visaRequiresMexico: '需办理墨西哥入境凭证 (旅游签证)',
      visaUsaEsta: 'ESTA (电子旅行授权免签)',
      visaUsaRegular: '常规 B1/B2 旅游签证',
      visaCanadaEta: 'eTA (电子旅行授权免签)',
      visaCanadaRegular: '常规旅游签证',
      visaMexicoRegular: '常规旅游签证',
      visaNoneRequired: '无需办理签证凭证',
      chartTickets: '门票费用',
      chartAccommodation: '住宿费用',
      chartTransport: '城际及跨国交通',
      chartLiving: '日常餐饮与生活费',
      csvExported: '预算明细已成功复制到剪贴板！',
      confirmDelete: '确定要删除这个城市节点吗？'
    },
    ja: {
      budgetSettings: '予算と旅行構成',
      originRegionLabel: '出発地域',
      groupSizeLabel: '同行者人数',
      accommodationLabel: '宿泊レベル',
      baseCurrencyLabel: '決済通貨',
      tripRouteTitle: '観戦ルートビルダー',
      addCityBtn: '開催都市を追加',
      budgetBreakdownTitle: '予算内訳とグラフィック分析',
      totalCostLabel: 'グループ総予算',
      perPersonCostLabel: '1人あたりの予算',
      visaAlertsTitle: '国境越えビザ警告',
      visaStatusOk: '国境越えのビザ警告はありません。',
      exportBtn: '予算明細をエクスポート',
      currencyRatesTitle: '為替レート参考 (1 USD あたり)',
      cityLabel: '都市',
      nightsLabel: '宿泊数',
      ticketLabel: '席種カテゴリ',
      stageLabel: '観戦ステージ',
      transitLabel: '移動手段',
      actionsLabel: '操作',
      budgetPresetLabel: '予算プリセット',
      backpackerPreset: 'バックパッカー一人旅',
      standardPreset: 'ツインスタンダード',
      luxuryPreset: 'ファミリーラグジュアリー',
      transitNone: '到着 / なし',
      transitFlight: 'フライト',
      transitDrive: 'レンタカー（自車）',
      transitTrain: '電車 / バス',
      ticketCat1: 'カテゴリ 1',
      ticketCat2: 'カテゴリ 2',
      ticketCat3: 'カテゴリ 3',
      ticketCat4: 'カテゴリ 4',
      stageGroup: 'グループステージ',
      stageR32: 'ラウンド32',
      stageR16: 'ラウンド16',
      stageQuarter: '準々決勝',
      stageSemi: '準決勝',
      stageFinal: '決勝',
      accommodationBudget: '予算重視 (ホステル / シェア)',
      accommodationStandard: '標準 (ホテル / 民泊)',
      accommodationLuxury: '高級 (プレミアムホテル)',
      visaRequiresUsa: '米国入国許可（ESTAまたは観光ビザ）が必要',
      visaRequiresCanada: 'カナダ入国許可（eTAまたは観光ビザ）が必要',
      visaRequiresMexico: 'メキシコ入国許可（観光ビザ）が必要',
      visaUsaEsta: 'ESTA（電子渡航認証）',
      visaUsaRegular: '通常のB1/B2観光ビザ',
      visaCanadaEta: 'eTA（電子渡航認証）',
      visaCanadaRegular: '通常の観光ビザ',
      visaMexicoRegular: '通常の観光ビザ',
      visaNoneRequired: '手続き不要',
      chartTickets: 'チケット代',
      chartAccommodation: '宿泊費',
      chartTransport: '都市間交通費',
      chartLiving: '食費・生活費',
      csvExported: '予算の明細がクリップボードにコピーされました！',
      confirmDelete: 'この都市ルートを削除してもよろしいですか？'
    },
    ko: {
      budgetSettings: '예산 및 여행 구성',
      originRegionLabel: '출발 지역',
      groupSizeLabel: '여행 인원수',
      accommodationLabel: '숙소 수준',
      baseCurrencyLabel: '결제 통화',
      tripRouteTitle: '관람 경로 빌더',
      addCityBtn: '개최 도시 추가',
      budgetBreakdownTitle: '예산 요약 및 세부 분석',
      totalCostLabel: '그룹 총비용',
      perPersonCostLabel: '1인당 예상 비용',
      visaAlertsTitle: '국경 이동 비자 경고',
      visaStatusOk: '이 경로에 대한 국경 이동 비자 경고가 없습니다.',
      exportBtn: '예산 내역 내보내기',
      currencyRatesTitle: '참고 환율 (1 USD 기준)',
      cityLabel: '도시',
      nightsLabel: '숙박 일수',
      ticketLabel: '티켓 등급',
      stageLabel: '경기 단계',
      transitLabel: '교통 수단',
      actionsLabel: '작업',
      budgetPresetLabel: '예산 프리셋',
      backpackerPreset: '1인 배낭여행',
      standardPreset: '2인 표준 여행',
      luxuryPreset: '가족 럭셔리 여행',
      transitNone: '도착 / 없음',
      transitFlight: '항공편',
      transitDrive: '렌터카 (주유비 포함)',
      transitTrain: '기차 / 버스',
      ticketCat1: '1등석 (Category 1)',
      ticketCat2: '2등석 (Category 2)',
      ticketCat3: '3등석 (Category 3)',
      ticketCat4: '4등석 (Category 4)',
      stageGroup: '조별리그',
      stageR32: '32강전',
      stageR16: '16강전',
      stageQuarter: '8강전',
      stageSemi: '준결승전',
      stageFinal: '결승전',
      accommodationBudget: '절약형 (호스텔 / 공동 객실)',
      accommodationStandard: '일반형 (호텔 / 에어비앤비)',
      accommodationLuxury: '고급형 (프리미엄 호텔)',
      visaRequiresUsa: '미국 입국 허가 필요 (ESTA 또는 관광비자)',
      visaRequiresCanada: '캐나다 입국 허가 필요 (eTA 또는 관광비자)',
      visaRequiresMexico: '멕시코 입국 허가 필요 (관광비자)',
      visaUsaEsta: 'ESTA (전자여행허가)',
      visaUsaRegular: '일반 B1/B2 관광비자',
      visaCanadaEta: 'eTA (전자여행허가)',
      visaCanadaRegular: '일반 관광비자',
      visaMexicoRegular: '일반 관광비자',
      visaNoneRequired: '필요한 조치 없음',
      chartTickets: '티켓 비용',
      chartAccommodation: '숙박 비용',
      chartTransport: '도시 간 교통비',
      chartLiving: '식비 및 일상 경비',
      csvExported: '예산 상세 내역이 클립보드에 복사되었습니다!',
      confirmDelete: '이 도시 노드를 삭제하시겠습니까?'
    }
  };

  const currentUi = $derived(uiTranslations[props.locale] || uiTranslations['en']);

  // Global Config States
  let originRegion = $state<'US_CAN_MEX' | 'SA' | 'EU' | 'AS_PAC' | 'AFR'>('EU');
  let groupSize = $state(2);
  let accommodationLevel = $state<'budget' | 'standard' | 'luxury'>('standard');
  let baseCurrency = $state<'USD' | 'EUR' | 'GBP' | 'CAD' | 'MXN' | 'CNY' | 'JPY' | 'KRW'>('EUR');
  
  // Exchange Rates Database
  const exchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.36,
    MXN: 17.5,
    CNY: 7.25,
    JPY: 155.0,
    KRW: 1360.0
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    MXN: 'Mex$',
    CNY: '¥',
    JPY: '¥',
    KRW: '₩'
  };

  // Route Leg list Svelte 5 state
  let route = $state<RouteLeg[]>([
    {
      fromCity: 'MIA',
      toCity: 'MIA',
      transitMode: 'none',
      matchStage: 'group',
      ticketCategory: 'cat3',
      nights: 3
    },
    {
      fromCity: 'MIA',
      toCity: 'NYC',
      transitMode: 'flight',
      matchStage: 'round_16',
      ticketCategory: 'cat2',
      nights: 2
    }
  ]);

  // Set default currency when locale changes
  $effect(() => {
    if (props.locale === 'zh') {
      baseCurrency = 'CNY';
    } else if (props.locale === 'ja') {
      baseCurrency = 'JPY';
    } else if (props.locale === 'ko') {
      baseCurrency = 'KRW';
    } else if (props.locale === 'fr' || props.locale === 'de') {
      baseCurrency = 'EUR';
    } else {
      baseCurrency = 'USD';
    }
  });

  // Presets Handlers
  function applyPreset(type: 'backpacker' | 'standard' | 'luxury') {
    if (type === 'backpacker') {
      originRegion = 'EU';
      groupSize = 1;
      accommodationLevel = 'budget';
      baseCurrency = 'EUR';
      route = [
        {
          fromCity: 'MEX',
          toCity: 'MEX',
          transitMode: 'none',
          matchStage: 'group',
          ticketCategory: 'cat4',
          nights: 3
        },
        {
          fromCity: 'MEX',
          toCity: 'GDL',
          transitMode: 'drive',
          matchStage: 'group',
          ticketCategory: 'cat4',
          nights: 3
        }
      ];
    } else if (type === 'standard') {
      originRegion = 'AS_PAC';
      groupSize = 2;
      accommodationLevel = 'standard';
      baseCurrency = 'USD';
      route = [
        {
          fromCity: 'LAX',
          toCity: 'LAX',
          transitMode: 'none',
          matchStage: 'group',
          ticketCategory: 'cat3',
          nights: 3
        },
        {
          fromCity: 'LAX',
          toCity: 'SFO',
          transitMode: 'drive',
          matchStage: 'round_32',
          ticketCategory: 'cat2',
          nights: 3
        },
        {
          fromCity: 'SFO',
          toCity: 'SEA',
          transitMode: 'flight',
          matchStage: 'round_16',
          ticketCategory: 'cat2',
          nights: 2
        }
      ];
    } else if (type === 'luxury') {
      originRegion = 'SA';
      groupSize = 4;
      accommodationLevel = 'luxury';
      baseCurrency = 'USD';
      route = [
        {
          fromCity: 'MIA',
          toCity: 'MIA',
          transitMode: 'none',
          matchStage: 'quarter',
          ticketCategory: 'cat1',
          nights: 4
        },
        {
          fromCity: 'MIA',
          toCity: 'NYC',
          transitMode: 'flight',
          matchStage: 'semi',
          ticketCategory: 'cat1',
          nights: 3
        },
        {
          fromCity: 'NYC',
          toCity: 'DFW',
          transitMode: 'flight',
          matchStage: 'final',
          ticketCategory: 'cat1',
          nights: 3
        }
      ];
    }
  }

  // Budget Calculator integration
  const budgetResult = $derived.by(() => {
    const input: BudgetInput = {
      originRegion,
      groupSize,
      accommodationLevel,
      baseCurrency,
      exchangeRates,
      route
    };
    return calculateTotalBudget(input);
  });

  // Derived Donut option for ECharts
  let donutChartOption = $derived.by(() => {
    const byCategory = budgetResult.byCategoryBase;
    const symbol = currencySymbols[baseCurrency];

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `<div class="p-1 font-sans text-xs text-neutral-300">
            <span class="font-bold text-white">${params.name}</span>: ${symbol}${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${params.percent}%)
          </div>`;
        },
        backgroundColor: '#171717',
        borderColor: '#262626',
        textStyle: { color: '#d4d4d8' }
      },
      legend: {
        top: 'bottom',
        textStyle: { color: '#a3a3a3', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16
      },
      series: [
        {
          name: 'Budget Category',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0a0a0a',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#ffffff'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: Math.round(byCategory.tickets),
              name: currentUi.chartTickets,
              itemStyle: { color: '#E5C158' } // Golden
            },
            {
              value: Math.round(byCategory.accommodation),
              name: currentUi.chartAccommodation,
              itemStyle: { color: '#C59B27' } // Mid Gold
            },
            {
              value: Math.round(byCategory.transport),
              name: currentUi.chartTransport,
              itemStyle: { color: '#7E600F' } // Dark Gold
            },
            {
              value: Math.round(byCategory.living),
              name: currentUi.chartLiving,
              itemStyle: { color: '#A8A8A8' } // Silver/Gray
            }
          ]
        }
      ]
    };
  });

  // Adding and Deleting Route legs
  function addRouteLeg() {
    const lastLeg = route[route.length - 1];
    const previousCity = lastLeg ? lastLeg.toCity : 'MIA';
    
    // Choose a logical next city (avoiding duplicate city if possible, or cycle through high-value host cities)
    const availableCities = Object.keys(HOST_CITIES);
    const nextCity = availableCities.find(c => c !== previousCity) || 'NYC';

    route.push({
      fromCity: previousCity,
      toCity: nextCity,
      transitMode: 'flight',
      matchStage: 'group',
      ticketCategory: 'cat3',
      nights: 2
    });
  }

  function deleteRouteLeg(index: number) {
    if (route.length <= 1) return;
    if (confirm(currentUi.confirmDelete)) {
      route.splice(index, 1);
      // Re-stitch fromCities to match the previous leg's toCity
      for (let i = 0; i < route.length; i++) {
        if (i === 0) {
          route[i].fromCity = route[i].toCity;
          route[i].transitMode = 'none';
        } else {
          route[i].fromCity = route[i - 1].toCity;
        }
      }
    }
  }

  // Handle city selection change in route
  function handleCityChange(index: number, toCity: string) {
    route[index].toCity = toCity;
    if (index === 0) {
      route[index].fromCity = toCity;
    }
    // Update the starting point of the next leg to match
    if (index + 1 < route.length) {
      route[index + 1].fromCity = toCity;
    }
  }

  // CSV Budget Export
  let showCopiedAlert = $state(false);
  function exportBudgetCSV() {
    const symbol = currencySymbols[baseCurrency];
    let csvContent = 'From,To,Transit Mode,Match Stage,Ticket Category,Nights,Accommodation (Base),Tickets (Base),Transit (Base),Total Leg Cost (Base)\n';
    
    route.forEach((leg, index) => {
      // Lodging leg cost
      const roomsNeeded = Math.ceil(groupSize / 2);
      const roomRatesMap = { budget: 60, standard: 150, luxury: 400 };
      const roomRate = roomRatesMap[accommodationLevel];
      const accCost = (leg.nights * roomRate * roomsNeeded) / groupSize;

      // Tickets leg cost
      const ticketCost = getTicketPrice(leg.matchStage, leg.ticketCategory);

      // Transit cost
      const transitCost = calculateLegCost(leg, groupSize);

      const total = accCost + ticketCost + transitCost;
      const rate = baseCurrency === 'USD' ? 1 : (exchangeRates[baseCurrency] || 1);

      csvContent += `"${leg.fromCity}","${leg.toCity}","${leg.transitMode}","${leg.matchStage}","${leg.ticketCategory}",${leg.nights},${(accCost * rate).toFixed(2)},${(ticketCost * rate).toFixed(2)},${(transitCost * rate).toFixed(2)},${(total * rate).toFixed(2)}\n`;
    });

    // Add international flight
    const intlRates = { US_CAN_MEX: 0, SA: 600, EU: 800, AS_PAC: 1200, AFR: 1000 };
    const intlUSD = intlRates[originRegion];
    const rate = baseCurrency === 'USD' ? 1 : (exchangeRates[baseCurrency] || 1);
    csvContent += `\n"International Flight",,,,,,0.00,0.00,${(intlUSD * rate).toFixed(2)},${(intlUSD * rate).toFixed(2)}\n`;

    // Add totals
    csvContent += `\n"TOTAL BUDGET PER PERSON",,,,,,,,,,${budgetResult.perPersonBase.toFixed(2)} (${baseCurrency})\n`;
    csvContent += `"TOTAL GROUP BUDGET (${groupSize} people)",,,,,,,,,,${budgetResult.totalBase.toFixed(2)} (${baseCurrency})\n`;

    // Copy to clipboard
    navigator.clipboard.writeText(csvContent).then(() => {
      showCopiedAlert = true;
      setTimeout(() => {
        showCopiedAlert = false;
      }, 3000);
    });
  }

  const isRtl = $derived(props.locale === 'ar');
</script>

<!-- Outer Container styled in luxury Matte Gold Obsidian theme -->
<div class="world-cup-budget-calculator-container dark bg-[#0a0a0a] text-neutral-200 border border-neutral-800 rounded-3xl p-6 lg:p-10 shadow-2xl relative font-sans leading-relaxed selection:bg-amber-500/20" dir={isRtl ? 'rtl' : 'ltr'}>
  
  <!-- Top Banner Header -->
  <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-900 pb-8 mb-8">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono text-amber-400">
        <Sparkles class="w-3.5 h-3.5" />
        2026 World Cup Premium Estimator
      </div>
      <h2 class="text-3xl font-extrabold text-white tracking-tight font-outfit">
        🏆 {t('name') || currentUi.budgetPresetLabel}
      </h2>
      <p class="text-sm text-neutral-400 max-w-2xl">
        {t('detailed_description')}
      </p>
    </div>
    
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 shadow-inner">
        <span class="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse"></span>
        No Data Leaves Browser
      </span>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Left column: Configuration Panel (7 cols) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- Preset Triggers -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-white tracking-wide border-b border-neutral-900 pb-3 flex items-center gap-2">
          <Briefcase class="w-4 h-4 text-[#E5C158]" />
          {currentUi.budgetPresetLabel}
        </h3>
        <div class="grid grid-cols-3 gap-3">
          <button
            onclick={() => applyPreset('backpacker')}
            class="px-3 py-2 text-xs bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all font-medium font-mono btn-preset"
          >
            🎒 {currentUi.backpackerPreset}
          </button>
          <button
            onclick={() => applyPreset('standard')}
            class="px-3 py-2 text-xs bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all font-medium font-mono btn-preset"
          >
            👥 {currentUi.standardPreset}
          </button>
          <button
            onclick={() => applyPreset('luxury')}
            class="px-3 py-2 text-xs bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all font-medium font-mono btn-preset"
          >
            👑 {currentUi.luxuryPreset}
          </button>
        </div>
      </div>

      <!-- Settings Sliders & Selectors -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-6">
        <h3 class="text-sm font-semibold text-white tracking-wide border-b border-neutral-900 pb-3 flex items-center gap-2">
          <Sliders class="w-4 h-4 text-[#E5C158]" />
          {currentUi.budgetSettings}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Origin Region -->
          <div class="space-y-2">
            <label for="origin-region" class="text-xs text-neutral-400 block font-medium">{currentUi.originRegionLabel}</label>
            <select
              id="origin-region"
              bind:value={originRegion}
              class="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E5C158]/40"
            >
              <option value="US_CAN_MEX">North America (Local)</option>
              <option value="SA">South America</option>
              <option value="EU">Europe</option>
              <option value="AS_PAC">Asia/Pacific</option>
              <option value="AFR">Africa</option>
            </select>
          </div>

          <!-- Base Currency -->
          <div class="space-y-2">
            <label for="base-currency" class="text-xs text-neutral-400 block font-medium">{currentUi.baseCurrencyLabel}</label>
            <select
              id="base-currency"
              bind:value={baseCurrency}
              class="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E5C158]/40"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="MXN">MXN (Mex$)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="KRW">KRW (₩)</option>
            </select>
          </div>

          <!-- Group Size -->
          <div class="space-y-2 md:col-span-2">
            <div class="flex justify-between items-center text-xs text-neutral-400">
              <span class="font-medium flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-[#E5C158]" />
                {currentUi.groupSizeLabel}
              </span>
              <span class="font-mono text-[#E5C158] font-bold">{groupSize} 人</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              bind:value={groupSize}
              class="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#E5C158]"
            />
          </div>

          <!-- Accommodation Level -->
          <div class="space-y-2 md:col-span-2">
            <label for="accommodation-level" class="text-xs text-neutral-400 block font-medium">{currentUi.accommodationLabel}</label>
            <select
              id="accommodation-level"
              bind:value={accommodationLevel}
              class="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E5C158]/40"
            >
              <option value="budget">{currentUi.accommodationBudget}</option>
              <option value="standard">{currentUi.accommodationStandard}</option>
              <option value="luxury">{currentUi.accommodationLuxury}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Route Builder -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-6">
        <div class="flex justify-between items-center border-b border-neutral-900 pb-3">
          <h3 class="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Calendar class="w-4 h-4 text-[#E5C158]" />
            {currentUi.tripRouteTitle}
          </h3>
          <button
            onclick={addRouteLeg}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E5C158] hover:bg-[#C59B27] text-neutral-950 font-bold text-xs rounded-lg transition-all btn-add-city"
          >
            <Plus class="w-3.5 h-3.5" />
            {currentUi.addCityBtn}
          </button>
        </div>

        <div class="space-y-4">
          {#each route as leg, index}
            <div class="p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl space-y-3 relative group">
              <!-- Leg Header -->
              <div class="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-900/60 pb-2">
                <span class="font-mono text-[#E5C158] font-bold">Leg {index + 1}</span>
                {#if index > 0}
                  <button
                    onclick={() => deleteRouteLeg(index)}
                    class="text-neutral-500 hover:text-red-400 transition-colors p-1 btn-delete-leg"
                    title="Delete city leg"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                {/if}
              </div>

              <!-- Route inputs -->
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                
                <!-- City Selection -->
                <div class="space-y-1">
                  <label for="city-select-{index}" class="text-[10px] text-neutral-500 font-mono uppercase">{currentUi.cityLabel}</label>
                  <select
                    id="city-select-{index}"
                    value={leg.toCity}
                    onchange={(e) => handleCityChange(index, (e.target as HTMLSelectElement).value)}
                    class="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg focus:outline-none"
                  >
                    {#each Object.entries(HOST_CITIES) as [code, city]}
                      <option value={code}>{city.name} ({city.country})</option>
                    {/each}
                  </select>
                </div>

                <!-- Match Stage -->
                <div class="space-y-1">
                  <label for="stage-select-{index}" class="text-[10px] text-neutral-500 font-mono uppercase">{currentUi.stageLabel}</label>
                  <select
                    id="stage-select-{index}"
                    bind:value={leg.matchStage}
                    class="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg focus:outline-none"
                  >
                    <option value="group">{currentUi.stageGroup}</option>
                    <option value="round_32">{currentUi.stageR32}</option>
                    <option value="round_16">{currentUi.stageR16}</option>
                    <option value="quarter">{currentUi.stageQuarter}</option>
                    <option value="semi">{currentUi.stageSemi}</option>
                    <option value="final">{currentUi.stageFinal}</option>
                  </select>
                </div>

                <!-- Ticket Category -->
                <div class="space-y-1">
                  <label for="ticket-select-{index}" class="text-[10px] text-neutral-500 font-mono uppercase">{currentUi.ticketLabel}</label>
                  <select
                    id="ticket-select-{index}"
                    bind:value={leg.ticketCategory}
                    class="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg focus:outline-none"
                  >
                    <option value="cat1">{currentUi.ticketCat1}</option>
                    <option value="cat2">{currentUi.ticketCat2}</option>
                    <option value="cat3">{currentUi.ticketCat3}</option>
                    <option value="cat4">{currentUi.ticketCat4}</option>
                  </select>
                </div>

                <!-- Accommodation Nights -->
                <div class="space-y-1">
                  <label for="nights-input-{index}" class="text-[10px] text-neutral-500 font-mono uppercase">{currentUi.nightsLabel}</label>
                  <input
                    id="nights-input-{index}"
                    type="number"
                    min="0"
                    max="14"
                    bind:value={leg.nights}
                    class="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg focus:outline-none"
                  />
                </div>

                <!-- Transit Mode (if index > 0) -->
                <div class="space-y-1 col-span-2">
                  <label for="transit-select-{index}" class="text-[10px] text-neutral-500 font-mono uppercase">{currentUi.transitLabel}</label>
                  {#if index === 0}
                    <div class="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs rounded-lg">
                      {currentUi.transitNone}
                    </div>
                  {:else}
                    <select
                      id="transit-select-{index}"
                      bind:value={leg.transitMode}
                      class="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-lg focus:outline-none"
                    >
                      <option value="flight">✈️ {currentUi.transitFlight}</option>
                      <option value="drive">🚗 {currentUi.transitDrive}</option>
                      <option value="train">🚇 {currentUi.transitTrain}</option>
                    </select>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right column: Statistics & Visualization (5 cols) -->
    <div class="lg:col-span-5 space-y-6">
      
      <!-- Big Golden Cost Box -->
      <div class="p-6 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl space-y-6 text-center shadow-lg relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 opacity-[0.03] text-white">
          <Wallet class="w-40 h-40" />
        </div>
        
        <div class="space-y-1">
          <span class="text-xs text-neutral-400 font-medium tracking-wide uppercase">{currentUi.perPersonCostLabel}</span>
          <div class="text-4xl font-extrabold text-[#E5C158] font-outfit tracking-tight">
            {currencySymbols[baseCurrency]}{Math.round(budgetResult.perPersonBase).toLocaleString()}
          </div>
          <p class="text-[10px] text-neutral-500 font-mono">USD Equivalency: ${(budgetResult.perPersonUSD).toFixed(0)}</p>
        </div>

        <div class="border-t border-neutral-900 pt-4 flex justify-around text-xs">
          <div class="space-y-0.5">
            <span class="text-neutral-500 block uppercase text-[10px]">{currentUi.totalCostLabel}</span>
            <span class="font-bold text-white text-sm font-mono">
              {currencySymbols[baseCurrency]}{Math.round(budgetResult.totalBase).toLocaleString()}
            </span>
          </div>
          <div class="space-y-0.5 border-l border-neutral-900 pl-6">
            <span class="text-neutral-500 block uppercase text-[10px]">{currentUi.nightsLabel}</span>
            <span class="font-bold text-white text-sm font-mono">{budgetResult.totalNights} Nights</span>
          </div>
        </div>
      </div>

      <!-- Donut Chart of Breakdown -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-white tracking-wide border-b border-neutral-900 pb-3 flex items-center gap-2">
          <DollarSign class="w-4 h-4 text-[#E5C158]" />
          {currentUi.budgetBreakdownTitle}
        </h3>
        
        <div class="w-full flex items-center justify-center min-h-[300px]">
          <EChartsWrapper option={donutChartOption} style="height: 280px; width: 100%" />
        </div>
      </div>

      <!-- Border Crossing Visa Warning Box -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-white tracking-wide border-b border-neutral-900 pb-3 flex items-center gap-2">
          <ShieldAlert class="w-4 h-4 text-[#E5C158]" />
          {currentUi.visaAlertsTitle}
        </h3>

        <div class="space-y-3">
          {#if !budgetResult.visaRequirements.requiresUSAVisa && !budgetResult.visaRequirements.requiresCanadaVisa && !budgetResult.visaRequirements.requiresMexicoVisa}
            <div class="flex gap-2.5 items-start text-xs text-neutral-400 bg-neutral-950 p-4 border border-neutral-900 rounded-xl">
              <CheckCircle class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>{currentUi.visaStatusOk}</span>
            </div>
          {:else}
            <!-- US Warning -->
            {#if budgetResult.visaRequirements.requiresUSAVisa}
              <div class="flex gap-2.5 items-start text-xs bg-amber-500/5 p-4 border border-amber-500/10 rounded-xl text-neutral-300">
                <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <span class="font-bold text-white">{currentUi.visaRequiresUsa}</span>
                  <p class="text-[11px] text-neutral-400 leading-normal">
                    {budgetResult.visaRequirements.usaVisaType === 'ESTA' ? currentUi.visaUsaEsta : currentUi.visaUsaRegular}
                  </p>
                </div>
              </div>
            {/if}

            <!-- Canada Warning -->
            {#if budgetResult.visaRequirements.requiresCanadaVisa}
              <div class="flex gap-2.5 items-start text-xs bg-amber-500/5 p-4 border border-amber-500/10 rounded-xl text-neutral-300">
                <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <span class="font-bold text-white">{currentUi.visaRequiresCanada}</span>
                  <p class="text-[11px] text-neutral-400 leading-normal">
                    {budgetResult.visaRequirements.canadaVisaType === 'eTA' ? currentUi.visaCanadaEta : currentUi.visaCanadaRegular}
                  </p>
                </div>
              </div>
            {/if}

            <!-- Mexico Warning -->
            {#if budgetResult.visaRequirements.requiresMexicoVisa}
              <div class="flex gap-2.5 items-start text-xs bg-amber-500/5 p-4 border border-amber-500/10 rounded-xl text-neutral-300">
                <ShieldAlert class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div class="space-y-1">
                  <span class="font-bold text-white">{currentUi.visaRequiresMexico}</span>
                  <p class="text-[11px] text-neutral-400 leading-normal">
                    {currentUi.visaMexicoRegular}
                  </p>
                </div>
              </div>
            {/if}
          {/if}
        </div>
      </div>

      <!-- Export CSV Section -->
      <div class="flex flex-col gap-3">
        <button
          onclick={exportBudgetCSV}
          class="btn-export-csv w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#E5C158] hover:bg-[#C59B27] text-neutral-950 font-bold rounded-xl transition-all"
        >
          <Download class="w-4 h-4" />
          {currentUi.exportBtn}
        </button>
        {#if showCopiedAlert}
          <div class="text-center text-xs text-[#E5C158] font-medium animate-pulse">
            {currentUi.csvExported}
          </div>
        {/if}
      </div>

      <!-- Exchange Rates Reference -->
      <div class="p-6 bg-neutral-900/40 border border-neutral-900 rounded-2xl space-y-4">
        <h3 class="text-sm font-semibold text-white tracking-wide border-b border-neutral-900 pb-3 flex items-center gap-2">
          <Info class="w-4 h-4 text-[#E5C158]" />
          {currentUi.currencyRatesTitle}
        </h3>
        <div class="grid grid-cols-2 gap-4 text-xs font-mono text-neutral-400">
          <div>EUR (€): <span class="text-white">{exchangeRates.EUR}</span></div>
          <div>GBP (£): <span class="text-white">{exchangeRates.GBP}</span></div>
          <div>CAD (CA$): <span class="text-white">{exchangeRates.CAD}</span></div>
          <div>MXN (Mex$): <span class="text-white">{exchangeRates.MXN}</span></div>
          <div>CNY (¥): <span class="text-white">{exchangeRates.CNY}</span></div>
          <div>JPY (¥): <span class="text-white">{exchangeRates.JPY}</span></div>
          <div>KRW (₩): <span class="text-white">{exchangeRates.KRW}</span></div>
        </div>
      </div>

    </div>
  </div>
</div>

<style>
  /* 强制把该容器下的所有 button, select, input, option 强制定制为黑金曜石质感，防止浅色主题覆盖 */
  .world-cup-budget-calculator-container :global(button),
  .world-cup-budget-calculator-container :global(select),
  .world-cup-budget-calculator-container :global(input),
  .world-cup-budget-calculator-container :global(option) {
    font-family: inherit;
  }

  /* 精确覆盖各种按钮的状态 */
  .world-cup-budget-calculator-container :global(button) {
    /* 默认清除全局 button 样式对背景和颜色的强行覆盖 */
    box-shadow: none !important;
  }

  /* 针对 select */
  .world-cup-budget-calculator-container :global(select) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
    border-color: #262626 !important;
  }

  .world-cup-budget-calculator-container :global(select:focus) {
    border-color: #e5c158 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(229, 193, 88, 0.4) !important;
  }

  /* 针对 option */
  .world-cup-budget-calculator-container :global(option) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
  }

  /* 针对 range 进度条 */
  .world-cup-budget-calculator-container :global(input[type="range"]) {
    background-color: #262626 !important;
  }

  /* 预设方案按钮 */
  .world-cup-budget-calculator-container :global(.btn-preset) {
    background-color: #0a0a0a !important;
    border-color: #262626 !important;
    color: #d4d4d4 !important;
  }

  .world-cup-budget-calculator-container :global(.btn-preset:hover) {
    color: #ffffff !important;
    border-color: #404040 !important;
    background-color: #171717 !important;
  }

  /* 添加主办城市按钮 */
  .world-cup-budget-calculator-container :global(.btn-add-city) {
    background-color: #e5c158 !important;
    color: #0a0a0a !important;
    border: none !important;
  }
  .world-cup-budget-calculator-container :global(.btn-add-city:hover) {
    background-color: #c59b27 !important;
  }

  /* 删除 Leg 按钮 */
  .world-cup-budget-calculator-container :global(.btn-delete-leg) {
    background: none !important;
    border: none !important;
  }

  /* 导出 CSV 按钮 */
  .world-cup-budget-calculator-container :global(.btn-export-csv) {
    background-color: #e5c158 !important;
    color: #0a0a0a !important;
    border: none !important;
  }
  .world-cup-budget-calculator-container :global(.btn-export-csv:hover) {
    background-color: #c59b27 !important;
  }
</style>

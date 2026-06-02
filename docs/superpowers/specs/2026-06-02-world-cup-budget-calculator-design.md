# 2026 World Cup Travel & Ticket Budget Calculator Design Spec

This specification defines the architecture, data models, SEO keyword layout, i18n metadata bounds, mathematical models, and visual guidelines for the "2026 World Cup Travel & Ticket Budget Calculator" (`world-cup-budget-calculator`).

---

## 1. SEO Keyword Analysis & Target Layout

To capture high-value search queries ahead of the 2026 FIFA World Cup, this tool targets key search intents across multiple languages:

| Locale | Primary Keywords (Intent: Tickets, Travel Cost, Budget Planner) | Target TDK Guidelines |
|---|---|---|
| **zh** | 2026世界杯门票价格, 2026美加墨世界杯旅游预算, 世界杯差旅费用计算器 | CJK Character Count: [70, 100] chars |
| **en** | 2026 World Cup ticket prices, 2026 FIFA World Cup travel budget calculator, World Cup trip planner | Phonetic Char Count: [120, 160] chars |
| **es** | presupuesto mundial 2026, coste viaje mundial 2026, entradas mundial 2026 precio | Phonetic Char Count: [120, 160] chars |
| **pt** | orçamento copa do mundo 2026, custo viagem copa do mundo 2026, ingressos copa do mundo | Phonetic Char Count: [120, 160] chars |
| **ja** | 2026W杯旅行予算計算ツール, 2026ワールドカップチケット料金, W杯旅行費用見積もり | CJK Character Count: [70, 100] chars |
| **ko** | 2026 월드컵 예산 계산기, 2026 월드컵 티켓 가격, 월드컵 여행 비용 계산 | CJK Character Count: [70, 100] chars |
| **fr** | budget coupe du monde 2026, coût voyage coupe du monde 2026, prix billets coupe du monde | Phonetic Char Count: [120, 160] chars |
| **de** | WM 2026 Reisebudget Rechner, ticketpreise wm 2026, reisekosten wm 2026 schätzen | Phonetic Char Count: [120, 160] chars |
| **ru** | бюджет чемпионата мира 2026, стоимость поездки на чм 2026, калькулятор расходов чм | Phonetic Char Count: [120, 160] chars |
| **ar** | حاسبة ميزانية السفر وتذاكر كأس العالم 2026, تكاليف السفر لكأس العالم 2026, أسعار تذاكر كأس العالم | Phonetic Char Count: [120, 160] chars |

---

## 2. Core Calculators & Data Architecture

The budget estimation model is fully client-side and processes four main cost layers: Accommodation, Tickets, Transport (Inter-city & Local), and Food & Living.

### A. Host Cities Database (16 Cities with Coordinates & Premium Factors)
To estimate distance and premium inflation during the World Cup, the city schema includes GPS coordinates and a markup multiplier:

```typescript
export interface HostCityData {
  id: string;
  name: string;
  country: 'USA' | 'CAN' | 'MEX';
  hotelBackpackerUSD: number; // Lodging per room per night (Base)
  hotelStandardUSD: number;
  hotelLuxuryUSD: number;
  dailyFoodAndTransitUSD: number; // Daily food, local buses/trains (Base)
  lat: number; // Latitude
  lng: number; // Longitude
  cupPremiumMultiplier: number; // World Cup inflation factor (1.0x - 3.0x)
}

export const HOST_CITIES: Record<string, HostCityData> = {
  LAX: { id: 'LAX', name: 'Los Angeles', country: 'USA', hotelBackpackerUSD: 60, hotelStandardUSD: 220, hotelLuxuryUSD: 550, dailyFoodAndTransitUSD: 90, lat: 34.0522, lng: -118.2437, cupPremiumMultiplier: 1.8 },
  NYC: { id: 'NYC', name: 'New York/NJ', country: 'USA', hotelBackpackerUSD: 70, hotelStandardUSD: 240, hotelLuxuryUSD: 600, dailyFoodAndTransitUSD: 95, lat: 40.7128, lng: -74.0060, cupPremiumMultiplier: 2.0 },
  MEX: { id: 'MEX', name: 'Mexico City', country: 'MEX', hotelBackpackerUSD: 30, hotelStandardUSD: 110, hotelLuxuryUSD: 320, dailyFoodAndTransitUSD: 45, lat: 19.4326, lng: -99.1332, cupPremiumMultiplier: 1.4 },
  YYZ: { id: 'YYZ', name: 'Toronto', country: 'CAN', hotelBackpackerUSD: 50, hotelStandardUSD: 180, hotelLuxuryUSD: 450, dailyFoodAndTransitUSD: 75, lat: 43.6532, lng: -79.3832, cupPremiumMultiplier: 1.6 },
  YVR: { id: 'YVR', name: 'Vancouver', country: 'CAN', hotelBackpackerUSD: 55, hotelStandardUSD: 190, hotelLuxuryUSD: 480, dailyFoodAndTransitUSD: 80, lat: 49.2827, lng: -123.1207, cupPremiumMultiplier: 1.6 },
  DFW: { id: 'DFW', name: 'Dallas', country: 'USA', hotelBackpackerUSD: 45, hotelStandardUSD: 160, hotelLuxuryUSD: 380, dailyFoodAndTransitUSD: 70, lat: 32.7767, lng: -96.7970, cupPremiumMultiplier: 1.5 },
  MIA: { id: 'MIA', name: 'Miami', country: 'USA', hotelBackpackerUSD: 60, hotelStandardUSD: 210, hotelLuxuryUSD: 500, dailyFoodAndTransitUSD: 85, lat: 25.7617, lng: -80.1918, cupPremiumMultiplier: 1.7 },
  SFO: { id: 'SFO', name: 'San Francisco', country: 'USA', hotelBackpackerUSD: 65, hotelStandardUSD: 230, hotelLuxuryUSD: 580, dailyFoodAndTransitUSD: 95, lat: 37.7749, lng: -122.4194, cupPremiumMultiplier: 1.7 },
  SEA: { id: 'SEA', name: 'Seattle', country: 'USA', hotelBackpackerUSD: 55, hotelStandardUSD: 180, hotelLuxuryUSD: 420, dailyFoodAndTransitUSD: 75, lat: 47.6062, lng: -122.3321, cupPremiumMultiplier: 1.5 },
  ATL: { id: 'ATL', name: 'Atlanta', country: 'USA', hotelBackpackerUSD: 45, hotelStandardUSD: 150, hotelLuxuryUSD: 360, dailyFoodAndTransitUSD: 70, lat: 33.7490, lng: -84.3880, cupPremiumMultiplier: 1.4 },
  BOS: { id: 'BOS', name: 'Boston', country: 'USA', hotelBackpackerUSD: 55, hotelStandardUSD: 190, hotelLuxuryUSD: 440, dailyFoodAndTransitUSD: 80, lat: 42.3601, lng: -71.0589, cupPremiumMultiplier: 1.5 },
  HOU: { id: 'HOU', name: 'Houston', country: 'USA', hotelBackpackerUSD: 40, hotelStandardUSD: 140, hotelLuxuryUSD: 330, dailyFoodAndTransitUSD: 65, lat: 29.7604, lng: -95.3698, cupPremiumMultiplier: 1.4 },
  MCI: { id: 'MCI', name: 'Kansas City', country: 'USA', hotelBackpackerUSD: 35, hotelStandardUSD: 130, hotelLuxuryUSD: 300, dailyFoodAndTransitUSD: 60, lat: 39.0997, lng: -94.5786, cupPremiumMultiplier: 1.3 },
  PHL: { id: 'PHL', name: 'Philadelphia', country: 'USA', hotelBackpackerUSD: 45, hotelStandardUSD: 160, hotelLuxuryUSD: 380, dailyFoodAndTransitUSD: 75, lat: 39.9526, lng: -75.1652, cupPremiumMultiplier: 1.4 },
  GDL: { id: 'GDL', name: 'Guadalajara', country: 'MEX', hotelBackpackerUSD: 25, hotelStandardUSD: 90, hotelLuxuryUSD: 240, dailyFoodAndTransitUSD: 40, lat: 20.6597, lng: -103.3496, cupPremiumMultiplier: 1.3 },
  MTY: { id: 'MTY', name: 'Monterrey', country: 'MEX', hotelBackpackerUSD: 25, hotelStandardUSD: 95, hotelLuxuryUSD: 260, dailyFoodAndTransitUSD: 40, lat: 25.6866, lng: -100.3161, cupPremiumMultiplier: 1.3 }
};
```

### B. Match Stages & Ticket Tiers (FIFA Standard Pricing)
Ticket prices scale by **Ticket Category** and **Match Stage Multiplier**:

```typescript
export type TicketCategory = 'CAT4' | 'CAT3' | 'CAT2' | 'CAT1' | 'VIP';

export const TICKET_BASE_PRICES: Record<TicketCategory, number> = {
  CAT4: 80,
  CAT3: 250,
  CAT2: 600,
  CAT1: 1200,
  VIP: 3000
};

export type MatchStage = 'GROUP' | 'ROUND_32_16' | 'QUARTERS_SEMIS' | 'FINAL';

export const STAGE_MULTIPLIERS: Record<MatchStage, number> = {
  GROUP: 1.0,
  ROUND_32_16: 1.3,
  QUARTERS_SEMIS: 1.8,
  FINAL: 3.5
};
```

### C. Origin Regions (International Flights)
Defines global departure regions to initialize intercontinental airfare (representing standard round-trip fares):
- **Asia-Pacific (APAC)**: $1,400 USD
- **Europe (EUR)**: $900 USD
- **South America (SAM)**: $700 USD
- **North America Domestic (NAM)**: $250 USD
- **Africa & Middle East (AFR)**: $1,200 USD

### D. Currency & Exchange Rates Matrix (Default Localized Linkage)
Exchange rates baseline:
```typescript
export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  CNY: 7.25,
  CAD: 1.36,
  MXN: 17.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
  KRW: 1380.0
};
```

**i18n Language & Default Currency Auto-Linkage**:
- `zh` $\rightarrow$ `CNY`
- `ja` $\rightarrow$ `JPY`
- `ko` $\rightarrow$ `KRW`
- `fr`, `de` $\rightarrow$ `EUR`
- `en`, `es`, `pt`, `ru`, `ar` $\rightarrow$ `USD`

---

## 3. Mathematical Formula Definitions

### A. Room Split Allocation
Up to 2 people can share a room. The number of hotel rooms needed is:
$$R = \lceil N_{\text{people}} / 2 \rceil$$
To prevent division by zero, the room split is protected for $N_{\text{people}} \ge 1$:
$$\text{LodgingPerPersonUSD} = \begin{cases} 
0 & \text{if } N_{\text{people}} < 1 \\ 
\frac{R \times \text{HotelRoomRate} \times \text{CupPremiumMultiplier}}{N_{\text{people}}} & \text{if } N_{\text{people}} \ge 1 
\end{cases}$$

### B. Haversine Distance (Inter-city driving)
To calculate driving distance in miles between successive station $A(\text{lat}_A, \text{lng}_A)$ and $B(\text{lat}_B, \text{lng}_B)$, degree coordinates must be converted to radians ($\text{rad} = \text{deg} \times \pi / 180$):
$$\phi_A = \text{lat}_A \times \frac{\pi}{180}, \quad \phi_B = \text{lat}_B \times \frac{\pi}{180}$$
$$\Delta \phi = (\text{lat}_B - \text{lat}_A) \times \frac{\pi}{180}, \quad \Delta \lambda = (\text{lng}_B - \text{lng}_A) \times \frac{\pi}{180}$$
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_A) \cos(\phi_B) \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$d = 2 \times r \times \arctan2\left(\sqrt{a}, \sqrt{1-a}\right)$$
Where $r = 3959$ miles (Earth's radius), and distance with routing curvature overhead is $d_{\text{route}} = d \times 1.25$.

### C. Transit Cost per Leg
- **Flight**: $300 USD per person.
- **Car Rental / Drive**:
  Transit duration in days scales automatically based on driving distance:
  $$\text{DaysOfTransit} = \max(1, \lceil d_{\text{route}} / 500 \rceil)$$
  $$\text{DriveCostPerPerson} = \frac{65 \times \text{DaysOfTransit}}{N_{\text{people}}} + \frac{d_{\text{route}} \times 0.15}{N_{\text{people}}}$$
- **Train/Bus**: $80 USD per person.

### D. Subtotal Estimations
- **Accommodation subtotal**: $\sum (\text{Nights} \times \text{LodgingPerPersonUSD})$
- **Tickets subtotal**: $\sum (\text{TicketsPerPerson} \times \text{TicketBasePrice} \times \text{StageMultiplier})$
- **Transport subtotal**: $\text{InternationalFlightUSD} + \sum (\text{InterCityTransitLegCost})$ (where `InternationalFlightUSD` is initialized by the chosen departure region)
- **Food & Living subtotal**: $\sum (\text{Nights} \times \text{DailyFoodAndTransitUSD} \times \text{CupPremiumMultiplier})$
- **Total Personal Budget (USD)**: $\text{Accommodation} + \text{Tickets} + \text{Transport} + \text{Food/Living}$
- **Group Total Budget (USD)**: $\text{TotalPersonal} \times N_{\text{people}}$

---

## 4. UI Layout & Visual Guidelines (曜石黑金 Matte Gold Obsidian)

### CSS Variables Declarations
```css
:root {
  --bg-obsidian: #0c0a09;       /* Deep stone background */
  --bg-card: #1c1917;           /* Slate stone for cards */
  --gold-primary: #fbbf24;      /* Pure Matte Gold (primary highlight) */
  --gold-hover: #fef08a;        /* Soft gold light */
  --gold-dark: #d97706;         /* Deep bronze gold for gradients */
  --border-obsidian: #292524;   /* Low-contrast border gray */
  --text-primary: #fafaf9;      /* Pure white text */
  --text-mute: #a8a29e;         /* Warm grey helper text */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### Layout Structures
- **Left Panel (Inputs & Form Controls)**:
  - **Travel Preset Buttons**: One-click quick actions to override values.
  - **Global Sliders**: Group size (`1-6`) and Origin Continental Flights selection.
  - **Dynamic Route Planner**:
    - Add/remove cards dynamically.
    - Custom Svelte transition (`slide` / `fade`) for adding/removing destinations.
    - Custom stage and ticket selection.
  - **Advanced Currency Exchanger Accordion**: Users can review or override exchange rates.
- **Right Panel (Static Stats & ECharts Donut)**:
  - Large Outfit-font counter with smooth CountUp rolling animation upon slider changes.
  - Interactive currency toggle (e.g. switch USD to CNY, JPY, EUR instantly).
  - Golden-gradient donut pie chart (ECharts) showing breakdown percentages.
  - Travel Visa Checklist: If a travel leg is USA $\leftrightarrow$ MEX or USA $\leftrightarrow$ CAN, show explicit visa alerts in amber-bordered warning callouts.

### Responsive & RTL Behavior
- **Responsive**: On viewports `< 1024px`, the split-panel changes into a vertical stack or tabs.
- **RTL Support**: When rendering in Arabic (`ar`), the main container uses `dir="rtl"`, and flex/grid orders are mirrored.

---

## 5. i18n Base Localization Schema

All 10 `base.json` files must register the tool metadata. The exact translations are certified below:

### Metadata Registrations (`src/messages/*/base.json` under `"tools"`)
- **zh**:
  ```json
  "world-cup-budget-calculator": {
    "name": "2026世界杯旅游与门票预算计算器",
    "description": "免费2026美加墨世界杯差旅与门票计算器。支持16个东道主城市交通住宿预估，门票档次折算，出行人数分摊与多币种自定义汇率，瑞士黑金精算，一键导出预算清单。"
  }
  ```
- **en**:
  ```json
  "world-cup-budget-calculator": {
    "name": "2026 World Cup Travel & Ticket Budget Calculator",
    "description": "Free 2026 FIFA World Cup trip budget estimator. Calibrate ticket tiers, accommodation, flight legs, and group splits across 16 host cities. 100% offline."
  }
  ```
- **es**:
  ```json
  "world-cup-budget-calculator": {
    "name": "Calculadora de Presupuesto del Mundial 2026",
    "description": "Calculadora de viaje para el Mundial 2026. Estime entradas, hoteles, transporte y gastos compartidos en las 16 sedes de EE.UU., Canadá y México. 100% local."
  }
  ```
- **pt**:
  ```json
  "world-cup-budget-calculator": {
    "name": "Calculadora de Orçamento da Copa do Mundo 2026",
    "description": "Estimador de orçamento para a Copa do Mundo 2026. Calcule ingressos, hotéis, voos e divisões de grupo nas 16 cidades-sede. Funciona 100% offline."
  }
  ```
- **ja**:
  ```json
  "world-cup-budget-calculator": {
    "name": "2026W杯旅行・チケット予算計算ツール",
    "description": "無料2026W杯旅行予算見積もりツール。16開催都市の宿泊、公式チケット価格、グループ人数割、複数通貨両替に対応。曜石黒金デザイン、完全ローカル実行。"
  }
  ```
- **ko**:
  ```json
  "world-cup-budget-calculator": {
    "name": "2026 월드컵 여행 및 티켓 예산 계산기",
    "description": "무료 2026 피파 월드컵 예산 계산기. 16개 개최 도시의 호텔, 경기 티켓 등급, 교통비 및 인원별 더치페이 계산 지원. 오프라인 100% 안전 보장."
  }
  ```
- **fr**:
  ```json
  "world-cup-budget-calculator": {
    "name": "Calculateur de Budget Coupe du Monde 2026",
    "description": "Simulateur de budget gratuit pour la Coupe du Monde 2026. Calculez les prix des billets, hébergements, transports et partages dans les 16 villes hôtes."
  }
  ```
- **de**:
  ```json
  "world-cup-budget-calculator": {
    "name": "WM 2026 Reisebudget & Ticket Rechner",
    "description": "Kostenloser Reisekostenrechner für die WM 2026. Planen Sie Ticketpreise, Unterkünfte, Flüge und Gruppen-Splits für alle 16 Austragungsorte offline."
  }
  ```
- **ru**:
  ```json
  "world-cup-budget-calculator": {
    "name": "Калькулятор бюджета поездки на ЧМ-2026 по футболу",
    "description": "Бесплатный калькулятор расходов на Чемпионат Мира 2026. Расчет стоимости билетов, отелей, перелетов и трат на группу в 16 городах-хозяевах."
  }
  ```
- **ar**:
  ```json
  "world-cup-budget-calculator": {
    "name": "حاسبة ميزانية السفر وتذاكر كأس العالم 2026",
    "description": "حاسبة ميزانية كأس العالم 2026 المجانية. قدر تكاليف التذاكر، السكن، الرحلات، وتقاسم النفقات بين المجموعات في 16 مدينة مضيفة. تعمل بالكامل دون اتصال."
  }
  ```

---

## 6. Verification & Quality Gates Plan

To ensure absolute runtime stability and compliance, the following gates will be executed:
- **TDK Bounds check**: Run `npm run qa:seo-governance` to ensure descriptions fall strictly in character limits.
- **Svelte 5 build check**: Run `npm run check` and `npm run build` to confirm zero compilation errors.
- **Unit Tests**: Implement unit test suite verifying:
  - Exact lodging calculation with odd/even group sizes (1 and 3 travelers).
  - Transit cost logic with plane vs rental car configurations.
  - Custom currency converter precision.
  - Haversine distance equation accuracy.

# Design Spec: 2026 World Cup Monte Carlo Probability Simulator

This specification details the architecture, mathematical simulation modeling, user interface, responsive state machines, and localization schema for the premium Obsidian Matte Gold interactive tool: **"2026 World Cup Monte Carlo Probability Simulator"** (slug: `world-cup-simulator`).

## 1. Goal Description

The 2026 FIFA World Cup is commencing June 11, 2026. This tool provides a state-of-the-art sports analytics dashboard that runs a 10,000-iteration Monte Carlo simulation in the browser using the actual 48-team tournament structure. Users customize the match probabilities through three distinct tactical tuning parameters (Home Advantage, Heritage DNA Boost, and Wildcard Chaos), visualising real-time odds updates through custom-wrapped ECharts and reactive Svelte 5 states.

## 2. User Review Required

> [!IMPORTANT]
> **Strict Dark Mode Only Container**
> To preserve the luxury look of the Matte Gold theme and prevent muddy color contrasts in light mode, the widget is designed as a **Strict Dark Mode Only** container. If placed on a light-themed page, it will render as a dark titanium/black widget, matching the premium dashboard look.

> [!IMPORTANT]
> **Premium Typographic Specs**
> The UI utilizes `font-family: 'Outfit', 'Inter', sans-serif;` in its design system: `Outfit` is used for bold champion header stats, and `Inter` is used for compact, tabular data grids.

> [!TIP]
> **100% Browser-Side Non-blocking Simulation**
> Running 10,000 iterations of a 104-match tournament requires simulating over 1,000,000 matches. We implement an asynchronous batching queue using `setTimeout` or `requestAnimationFrame` to ensure the Svelte UI remains completely responsive and doesn't block the browser main thread. When active, a glassmorphic 3D-gold trophy SVG skeleton with custom pulse effects (`animate-pulse`) overlays the viewport.

## 3. Architecture & Mathematical Modeling

### 3.1 48-Team Baseline Elo and Groups
The simulation pre-populates the 48 teams of the 2026 World Cup, split into 12 groups (A to L) of 4 teams each. Each team is assigned a realistic base Elo rating representing their current strength:

* **Group A**: United States (1780), Switzerland (1820), Cameroon (1610), Iraq (1550)
* **Group B**: Canada (1690), Colombia (1850), Poland (1710), Uzbekistan (1580)
* **Group C**: Mexico (1710), Denmark (1800), Egypt (1640), New Zealand (1480)
* **Group D**: Argentina (2080), Sweden (1790), Algeria (1630), Saudi Arabia (1600)
* **Group E**: France (2040), Croatia (1910), Ecuador (1740), UAE (1520)
* **Group F**: Belgium (1940), Morocco (1870), Ukraine (1750), Panama (1590)
* **Group G**: Brazil (2020), Netherlands (1950), Senegal (1720), Jamaica (1540)
* **Group H**: England (1990), Uruguay (1880), South Korea (1760), Costa Rica (1580)
* **Group I**: Portugal (1980), Japan (1830), Austria (1770), Tunisia (1610)
* **Group J**: Italy (1960), Germany (1920), Chile (1730), Iran (1650)
* **Group K**: Spain (2010), Peru (1710), Nigeria (1660), Australia (1680)
* **Group L**: Turkey (1780), Hungary (1790), Ivory Coast (1680), South Africa (1590)

### 3.2 Trio DNA Strength Tuning Formula
When the user adjusts the sliders for Home Advantage (0-10), Heritage DNA Boost (0-10), and Wildcard Chaos (0-10), the active ratings are re-calculated:

$$Elo_{final} = Elo_{base} + \left( \frac{Home}{10} \times 150 \times \mathbb{I}_{host} \right) + \left( \frac{Heritage}{10} \times 140 \times \mathbb{I}_{heritage} \right)$$

* **$\mathbb{I}_{host}$ (Host Indicator)**: Evaluates to $1$ if team $\in$ `[USA, Canada, Mexico]`, else $0$.
* **$\mathbb{I}_{heritage}$ (Heritage Indicator)**: Evaluates to $1$ if team $\in$ `[Brazil, Germany, Argentina, France, Spain, England, Uruguay, Italy]`, else $0$.
* **Wildcard Chaos Factor ($\sigma$)**: Acts as a thermodynamic temperature parameter that adjusts the predictability scale factor in the Logistic Match Winner Formula, allowing dark horses to pull off upsets at higher settings.

### 3.3 Match Simulation & 2026 Knockout Rules
For each match between Team A and Team B, the expected win probability of Team A is computed as:

$$W_e = \frac{1}{1 + 10^{\frac{Elo_B - Elo_A}{400 \times \left(1 + \frac{Chaos}{10} \times 1.5\right)}}}$$

To support realistic group stage tables, we simulate draws (about 26% of football games end in draws). The probability of a draw $P(Draw)$ is modeled around closely-rated matches:

$$P(Draw) = 0.26 \times \exp\left( - \left(\frac{Elo_A - Elo_B}{300}\right)^2 \right)$$

The final outcomes are simulated using the partitioned probability space:
* **Team A Wins:** $P(A) = W_e \times (1 - P(Draw))$
* **Team B Wins:** $P(B) = (1 - W_e) \times (1 - P(Draw))$
* **Match Ends in a Draw:** $P(Draw)$

#### Goal Generation (Tie-breaker support)
To determine goal differences and goals scored for group rankings, each simulated match generates goals based on independent Poisson-like distributions:
* $Goals_A = \text{Poisson}(\lambda_A)$, where $\lambda_A = \max\left(0.2, 1.3 + \frac{Elo_A - Elo_B}{400}\right)$
* $Goals_B = \text{Poisson}(\lambda_B)$, where $\lambda_B = \max\left(0.2, 1.3 + \frac{Elo_B - Elo_A}{400}\right)$
* If the result generated by the Poisson scores contradicts the probability space partition (e.g., A wins the partition but Poisson scores show a tie), the score is adjusted by adding/subtracting 1 goal to align with the partition outcome.

#### 2026 FIFA World Cup Group Stage Rankings
1. Points (3 for win, 1 for draw, 0 for loss)
2. Goal difference in all group matches
3. Greatest number of goals scored in all group matches
4. Head-to-head records

#### 2026 Knockout Selection (Best Third-Place Teams)
* The top 2 teams from each of the 12 groups automatically advance (24 teams).
* The 12 third-placed teams are ranked by Points, Goal Difference, and Goals Scored. The **top 8 third-placed teams** advance to complete the Round of 32 (32 teams total).
* Knockout matchups are mapped according to the official FIFA bracket matrix (e.g., Winner Group A plays 3rd C/D/I/J, etc.). Tie-breaks in knockout matches simulate extra-time/penalties using Elo-weighted random outcomes.

## 4. UI Components & Svelte 5 State Machine

```
+--------------------------------------------------------+
|   🏆 2026 World Cup Monte Carlo Probability Simulator  |
+------------------------------------+-------------------+
|  [Slid 1] Home Advantage (0-10)    |   Top 15 Champions|
|  [Slid 2] Heritage DNA (0-10)      |   [=============] |
|  [Slid 3] Wildcard Chaos (0-10)    |   [=========]     |
|                                    |   [======]        |
|  Compare Focus Teams:              |   [====]          |
|  [Brazil v] vs [Argentina v]       |                   |
|                                    |   FOCUS COMPARISON|
|  [ RUN 10,000 SIMULATIONS ]        |   A Win: 54%      |
|                                    |   B Win: 46%      |
+------------------------------------+-------------------+
```

### 4.1 Component Properties
```typescript
interface Props {
  locale: string;
  translations: Record<string, unknown>;
}
```

### 4.2 Runes & States
* `homeBias`: `$state(5)`
* `heritageBias`: `$state(5)`
* `chaosBias`: `$state(5)`
* `focusTeamA`: `$state('Brazil')`
* `focusTeamB`: `$state('Argentina')`
* `simResults`: `$state<Record<string, SimRecord>>({})`
* `isSimulating`: `$state(false)`
* `simProgress`: `$state(0)`

## 5. 10-Locale Localization Requirements

We implement strictly formatted Meta descriptions matching CJK `[70, 100]` character rules and phonetic `[120, 160]` rules:

* **zh**:
  * **name**: 2026世界杯夺冠概率模拟器
  * **seo_description**: 免费2026美加墨世界杯模拟器。采用蒙特卡洛算法与Elo等级分，支持东道主优势与豪门底蕴三维加成调节，一键跑分十万次对决，瑞士私银暗金大屏，纯前端精算，保护隐私安全。（共93字）
* **en**:
  * **name**: 2026 World Cup Monte Carlo Simulator
  * **seo_description**: Free 2026 World Cup simulator. Run 10k Monte Carlo simulations with Elo ratings, custom host/heritage sliders, and sleek gold ECharts. 100% offline. (148 chars)
* **es**:
  * **name**: Simulador de Probabilidades del Mundial 2026
  * **seo_description**: Simulador del Mundial 2026 gratis. Dirige 10k simulaciones de Montecarlo con Elo, deslizadores de local/herencia y gráficos oro mate de ECharts. 100% local. (153 chars)
* **pt**:
  * **name**: Simulador da Copa do Mundo 2026
  * **seo_description**: Simulador da Copa do Mundo 2026 grátis. Execute 10k simulações de Monte Carlo com Elo, controles de anfitrião/tradição e gráficos ouro fosco no cliente. (154 chars)
* **ja**:
  * **name**: 2026W杯モンテカルロシミュレーター
  * **seo_description**: 無料2026W杯シミュレーター。モンテカルロ法とEloレーティングを用い、ホスト国や伝統国の補正スライダーとマットゴールドのECharts搭載。ブラウザ実行で完全保護。（共95文字）
* **ko**:
  * **name**: 2026 월드컵 몬테카를로 시뮬레이터
  * **seo_description**: 무료 2026 월드컵 시뮬레이터. 몬테카를로 알고리즘과 Elo 레이팅을 사용하며, 개최국 및 전통 강호 슬라이더 조절과 매트 골드 ECharts 차트를 지원합니다. (94자)
* **fr**:
  * **name**: Simulateur de la Coupe du Monde 2026
  * **seo_description**: Simulateur gratuit de la Coupe du Monde 2026. Lancez 10k simulations de Monte Carlo avec Elo, curseurs hôte/tradition et graphiques ECharts or mat. 100% local. (158 chars)
* **de**:
  * **name**: WM 2026 Monte-Carlo-Simulator
  * **seo_description**: Kostenloser WM 2026 Simulator. Führen Sie 10k Monte-Carlo-Simulationen mit Elo-Klassen, Gastgeber/Tradition-Reglern und edlen ECharts aus. 100% offline. (153 chars)
* **ru**:
  * **name**: Симулятор Чемпионата Мира по футболу 2026
  * **seo_description**: Бесплатный симулятор ЧМ-2026. Запуск 10к симуляций Монте-Карло с рейтингом Elo, настройкой хозяев/традиций и золотыми графиками ECharts. 100% на клиенте. (154 chars)
* **ar**:
  * **name**: محاكي كأس العالم 2026 مونت كارلو
  * **seo_description**: محاكي كأس العالم 2026 المجاني. تشغيل 10 آلاف محاكاة مونت كارلو مع تصنيف Elo، وتعديلات المضيف/التقاليد، ومخططات ECharts الذهبية الأنيقة. محلي 100%. (146 chars)

## 6. Verification Plan

### 6.1 Automated Testing
* **Vitest Suite**: Add `src/components/tools/WorldCupSimulator.test.ts` to verify the mathematical accuracy of the Elo match winner calculations and group stage ranking outcomes (including the 2026 best-third-place rule).
* **SEO Compliance Crawler**: Run `npm run qa:seo-governance` to ensure the localized description character boundaries are strictly validated.
* **Release Health check**: Run `npm run check` and `npm run build` to confirm zero static compilation noise under Astro 6.

### 6.2 Manual Testing
* Deploy locally via `npm run dev` and test:
  1. Toggle sliders (e.g. maxing out Home Advantage) and confirm that USA, Mexico, and Canada move to the top of the ECharts champion bar chart.
  2. Confirm Svelte UI remains completely fluid without any browser lag while running 10,000 Monte Carlo runs.
  3. Validate that ECharts tooltips and colors correctly sync with Light/Dark mode changes.

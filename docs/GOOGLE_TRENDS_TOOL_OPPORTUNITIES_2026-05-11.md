# Google Trends Tool Opportunities - 2026-05-11

## Sources Checked

- Google Trends Daily Search Trends RSS: `https://trends.google.com/trending/rss?geo=US`
- Google Trends Daily Search Trends RSS: `https://trends.google.com/trending/rss?geo=GB`
- Google Trends Daily Search Trends RSS: `https://trends.google.com/trending/rss?geo=IN`
- Google Trends Daily Search Trends RSS: `https://trends.google.com/trending/rss?geo=CA`
- Google Trends Daily Search Trends RSS: `https://trends.google.com/trending/rss?geo=AU`

## What The Feed Showed

The current feeds are dominated by short-lived news, sports, entertainment, and stock-market terms.

- US: mayoral politics, sports, entertainment, and incident/news terms.
- GB: entertainment, local services, sports, and travel/operator terms.
- IN: a strong cluster of `share price` queries, including HCL, Lenskart, Pidilite, NBCC, SBI, HFCL, Tata Consumer, and South Indian Bank.
- CA: sports and entertainment names, plus a market/personality news term.
- AU: local place names, sports, politics, defense, travel, and events.

This means the RSS feed is useful as a freshness signal, but it should not be copied directly into tool pages. The better filter is: keep terms with recurring utility intent, ignore one-off celebrity/news/sports terms, and prefer tools that can rank after the spike fades.

## Implemented

1. `stock-average-calculator`
   - Why: the IN feed showed a clear concentration of share-price demand.
   - Evergreen intent: investors who search share prices often need position-average, break-even, profit/loss, and ROI calculations.
   - Category: `finance`.

2. `utm-builder`
   - Why: U2Tool already has SEO and metadata tools, but lacked a campaign URL builder for marketers.
   - Evergreen intent: `utm builder`, `campaign url builder`, and analytics tracking tasks are high-action utility searches.
   - Category: `generators`.

3. `websocket-tester`
   - Why: the component and translations already existed but the tool was not exposed in config/import mapping.
   - Evergreen intent: developers repeatedly search for WebSocket testers while debugging real-time apps.
   - Category: `development`.

4. `stock-profit-calculator`
   - Why: extends the share-price trend cluster into net profit/loss intent.
   - Evergreen intent: investors want fast trade outcome calculations without a spreadsheet.
   - Category: `finance`.

5. `dividend-yield-calculator`
   - Why: pairs naturally with stock lookup behavior and dividend-income research.
   - Evergreen intent: calculate yield and annual dividend income from price and dividend per share.
   - Category: `finance`.

6. `market-cap-calculator`
   - Why: share-price spikes often lead to market capitalization comparisons.
   - Evergreen intent: convert share price and shares outstanding into market cap.
   - Category: `finance`.

7. `cagr-calculator`
   - Why: recurring investment and growth-analysis utility with strong evergreen demand.
   - Evergreen intent: calculate compound annual growth rate from start/end values.
   - Category: `finance`.

8. `position-size-calculator`
   - Why: trading-related search demand sits adjacent to share-price spikes.
   - Evergreen intent: calculate position size from account risk and stop distance.
   - Category: `finance`.

9. `youtube-thumbnail-generator`
   - Why: creator/search workflows are evergreen and safer than a downloader framing.
   - Evergreen intent: generate public YouTube thumbnail image URLs and previews.
   - Category: `image`.

10. `ai-prompt-generator`
    - Why: AI workflow tools remain a broad recurring search category.
    - Evergreen intent: build structured prompts without calling an AI API.
    - Category: `text`.

11. `title-capitalization-tool`
    - Why: simple editorial utility with direct long-tail search intent.
    - Evergreen intent: convert headings between title case, sentence case, uppercase, and lowercase.
    - Category: `text`.

12. `meta-description-generator`
    - Why: complements existing SEO/meta tooling and UTM builder.
    - Evergreen intent: generate concise search snippet options from keyword and page context.
    - Category: `generators`.

13. `wifi-qr-code-generator`
    - Why: high-frequency everyday utility with clear generator intent.
    - Evergreen intent: create a scannable WiFi QR code from SSID/password settings.
    - Category: `generators`.

## Deferred Candidates

- `share-price-calculator`: too close to financial-data lookup and would require careful wording to avoid implying live market data.

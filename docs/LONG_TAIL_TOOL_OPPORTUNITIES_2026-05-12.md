# Long-Tail Tool Opportunities - 2026-05-12

## Sources Checked

- Existing U2Tool English catalog: 513 tool pages from `src/messages/en/tools/`.
- Bing autosuggest endpoint sampled with US English seeds for tool-intent queries.
- Google Trends Daily Search Trends RSS for `US`, `GB`, `IN`, `CA`, and `AU`.
- Reference methodology:
  - Google Search Help: autocomplete predictions reflect real searches and consider language, location, trending interest, and past searches: https://support.google.com/websearch/answer/7368877?hl=en
  - Google Trends Help: Trending Now shows top trending search queries by country/region and timeframe: https://support.google.com/trends/answer/3076011?hl=en-uk
  - Microsoft Learn: Bing AutoSuggest sends a search query and returns query suggestions: https://learn.microsoft.com/en-us/python/api/azure-cognitiveservices-search-autosuggest/azure-cognitiveservices.search.autosuggest.operations.autosuggestclientoperationsmixin?view=azure-python-preview

## Readout

Google Trends RSS on 2026-05-12 remains mostly news, sports, entertainment, and event driven:

- US: `jesper wallstedt`, `giants vs dodgers`, `max strus`, entertainment names.
- GB: `apple iphone 18 pro max`, lottery, TV/entertainment, sports.
- IN: cricket/IPL, politics, weather, local terms.
- CA/AU: sports, entertainment, housing, silver price, local news.

Conclusion: keep Trends RSS as a freshness filter, but use autosuggest-style long-tail discovery for durable tool pages.

## Highest Priority Candidates

| Priority | Slug | Category | Long-tail evidence | Why it fits | Implementation path |
|---|---|---|---|---|---|
| P0 | `macro-calculator` | lifestyle | 11 suggestions: bodybuilding, fat loss, muscle gain, recipes, men/women, UK | Clear recurring calculator intent; adjacent to existing BMI/calorie/water health tools | New component |
| P0 | `debt-snowball-calculator` | finance | 10 suggestions: Excel, spreadsheet, amortization, UK | Strong finance utility intent; can export payoff schedule | New component |
| P0 | `calorie-deficit-calculator` | lifestyle | 9 suggestions: weight loss, TDEE, timeline, country variants | High-intent health calculator; pairs with calorie/water tools | New component |
| P0 | `cover-letter-generator` | office | 9 suggestions: AI, no sign up, PDF, from resume | High conversion job-search intent; strong "free/no signup" modifiers | PopularUtilityTool first, later richer component |
| P0 | `one-rep-max-calculator` | lifestyle | 9 suggestions: bench, squat, deadlift, RPE, formula | Simple formula tool with many landing-page modifiers | New component or PopularUtilityTool |
| P0 | `passport-photo-maker` | image | 8 suggestions: white background, free online, AI | High utility search; could start as size/background helper without compliance claims | New component |
| P0 | `paypal-fee-calculator` | finance | 8 suggestions: international, UK, AU, PH, AR | Transactional finance utility; evergreen seller/freelancer demand | New component |
| P0 | `youtube-title-generator` | generators/text | 8 suggestions: AI, SEO, Hindi, free | Creator SEO intent; complements existing thumbnail tool | PopularUtilityTool |
| P0 | `instagram-bio-generator` | generators/text | 7 suggestions: AI, font, emoji, free | Social profile utility with many modifiers | PopularUtilityTool |
| P0 | `youtube-description-generator` | generators/text | 7 suggestions: AI, free, Hindi | Creator workflow; can cross-link with title + thumbnail pages | PopularUtilityTool |

## Developer / SEO Tool Candidates

| Priority | Slug | Category | Evidence | Notes |
|---|---|---|---|---|
| P0 | `security-headers-checker` | security/development | 4 suggestions: missing security headers, HTTP security header checker, online | Strong fit; can analyze pasted headers and URL-style demo mode without promising live scan |
| P0 | `csv-to-vcard-converter` | converters/office | 3 suggestions: free, online | Clear input-output converter; browser-only |
| P0 | `vcard-to-csv-converter` | converters/office | 3 suggestions: free, online | Pair page with CSV-to-vCard |
| P1 | `csp-header-generator` | development/security | Direct suggestion | Strong dev SEO, but needs careful UX/options |
| P1 | `docker-run-to-docker-compose-converter` | development | Direct suggestion | High-intent developer utility; good moat if parser is decent |
| P1 | `llms-txt-generator` | generators/development | Direct suggestion | Timely AI-discovery/GEO adjacent; good internal linking to AI pages |
| P1 | `ics-file-generator` | office | Direct suggestion | Useful evergreen calendar utility |
| P2 | `zod-schema-generator` | development | Direct suggestion, but `json-to-zod` already exists | Either add alias/support page or improve existing page targeting |

## Finance / Creator Expansion Candidates

| Priority | Slug | Category | Evidence | Notes |
|---|---|---|---|---|
| P1 | `savings-goal-calculator` | finance | 6 suggestions: compound interest, monthly, weekly | Simple and high-intent |
| P1 | `etsy-fee-calculator` | finance | 3 suggestions: digital products, UK | Useful seller traffic; fees change, so requires dated assumptions and update path |
| P1 | `freelance-rate-calculator` | finance/office | 3 suggestions: UK, social media | Strong freelancer intent; can avoid tax promises by framing as rate planning |
| P1 | `linkedin-headline-generator` | office/text | 5 suggestions: AI, job seekers, free | Job-search cluster; pairs with cover letter |
| P1 | `linkedin-summary-generator` | office/text | 3 suggestions | Same cluster, slightly lower breadth |
| P1 | `email-subject-line-generator` | generators/text | 4 suggestions | Marketing utility; easy PopularUtilityTool |
| P2 | `midjourney-prompt-generator` | text/generators | 5 suggestions | Good AI image intent; risk of brand/dependency framing, keep generic but target phrase |
| P2 | `stable-diffusion-prompt-generator` | text/generators | 6 suggestions | Similar; can support style/negative prompt fields |

## Recommended Next Batch

Implement these 10 first:

1. `macro-calculator`
2. `debt-snowball-calculator`
3. `calorie-deficit-calculator`
4. `cover-letter-generator`
5. `one-rep-max-calculator`
6. `passport-photo-maker`
7. `paypal-fee-calculator`
8. `youtube-title-generator`
9. `security-headers-checker`
10. `csv-to-vcard-converter`

Rationale: this batch balances calculators, converters, creator tools, and developer tools. It avoids overloading one category, creates natural internal-link clusters, and includes several pages that can launch with deterministic browser logic rather than external APIs.

## Avoid / Defer

- Brand-comparison variants like `grammarly`, `vidiq`, `bankrate`, `resumeup`, `alura`, `mayo`, `nhs`, etc. Use them only as evidence of demand, not as target slugs.
- Country/year fee pages (`paypal fee calculator 2026 uk`, `etsy fee calculator 2026`) until there is an update workflow for assumptions.
- Medical-sensitive variants (`implantation calculator`, `dog ovulation calculator`) unless the page has careful disclaimers and clear non-medical positioning.
- Existing-adjacent duplicates like `qr-code-generator for email` and `hashtag-generator for tiktok`; better handled as sections/templates on existing pages first.

## Follow-Up Actions

1. Add the P0 batch as tool specs using the onboarding pipeline.
2. For PopularUtilityTool-friendly pages, ship fast with grounded copy and deterministic output.
3. For calculators/converters, create real components before localization.
4. After launch, add internal links:
   - Health: BMI, calorie, water intake, macro, one-rep max.
   - Finance: compound interest, debt snowball, savings goal, PayPal fee.
   - Creator: YouTube thumbnail, YouTube title, YouTube description, Instagram bio.
   - Developer: JSON to Zod, CSP header, security headers, Docker converter.

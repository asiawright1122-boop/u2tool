# Requirements Document

## Introduction

本功能旨在为 U2Tool 项目添加一批在欧美市场流行但项目中尚未存在的在线工具。这些工具经过市场调研，具有高搜索量和用户需求，将帮助提升网站的用户覆盖面和 SEO 表现。

## Glossary

- **Tool_System**: U2Tool 工具管理系统，负责工具的注册、渲染和翻译
- **Calculator**: 执行数学或逻辑计算的工具组件
- **Generator**: 根据用户输入生成内容的工具组件
- **Converter**: 将一种格式转换为另一种格式的工具组件
- **Checker**: 验证或分析用户输入的工具组件

## Requirements

### Requirement 1: Currency Converter (货币转换器)

**User Story:** As a user, I want to convert between different currencies, so that I can quickly calculate exchange rates for international transactions.

#### Acceptance Criteria

1. WHEN a user enters an amount and selects source and target currencies, THE Currency_Converter SHALL display the converted amount
2. WHEN the user changes either currency selection, THE Currency_Converter SHALL automatically recalculate the result
3. THE Currency_Converter SHALL support at least 30 major world currencies including USD, EUR, GBP, JPY, CNY, etc.
4. THE Currency_Converter SHALL display the exchange rate used for the conversion
5. WHEN the user clicks the swap button, THE Currency_Converter SHALL swap the source and target currencies

### Requirement 2: ROI Calculator (投资回报率计算器)

**User Story:** As an investor, I want to calculate return on investment, so that I can evaluate the profitability of my investments.

#### Acceptance Criteria

1. WHEN a user enters initial investment, final value, and time period, THE ROI_Calculator SHALL calculate and display the ROI percentage
2. THE ROI_Calculator SHALL support both simple ROI and annualized ROI calculations
3. WHEN the user enters additional investments or withdrawals, THE ROI_Calculator SHALL factor them into the calculation
4. THE ROI_Calculator SHALL display a breakdown of the calculation steps

### Requirement 3: Calorie Calculator (卡路里计算器)

**User Story:** As a health-conscious user, I want to calculate my daily calorie needs, so that I can plan my diet effectively.

#### Acceptance Criteria

1. WHEN a user enters age, gender, height, weight, and activity level, THE Calorie_Calculator SHALL calculate daily calorie needs
2. THE Calorie_Calculator SHALL display maintenance calories, weight loss calories, and weight gain calories
3. THE Calorie_Calculator SHALL support both metric and imperial units
4. THE Calorie_Calculator SHALL use the Mifflin-St Jeor equation for accurate calculations

### Requirement 4: Water Intake Calculator (饮水量计算器)

**User Story:** As a health-conscious user, I want to calculate my recommended daily water intake, so that I can stay properly hydrated.

#### Acceptance Criteria

1. WHEN a user enters their weight and activity level, THE Water_Intake_Calculator SHALL calculate recommended daily water intake
2. THE Water_Intake_Calculator SHALL support both metric and imperial units
3. THE Water_Intake_Calculator SHALL provide intake recommendations in cups, liters, and ounces
4. THE Water_Intake_Calculator SHALL adjust recommendations based on climate and exercise factors

### Requirement 5: Random Picker/Lottery Tool (随机抽奖器)

**User Story:** As a user, I want to randomly select items from a list, so that I can make fair random selections for giveaways or decisions.

#### Acceptance Criteria

1. WHEN a user enters a list of items, THE Random_Picker SHALL randomly select one or more items
2. THE Random_Picker SHALL support configurable number of winners
3. THE Random_Picker SHALL provide animation effects during the selection process
4. THE Random_Picker SHALL allow excluding previously selected items
5. THE Random_Picker SHALL support importing items from text or CSV

### Requirement 6: Code Screenshot Generator (代码截图生成器)

**User Story:** As a developer, I want to create beautiful code screenshots, so that I can share code snippets on social media and documentation.

#### Acceptance Criteria

1. WHEN a user pastes code, THE Code_Screenshot_Generator SHALL render it with syntax highlighting
2. THE Code_Screenshot_Generator SHALL support multiple programming languages
3. THE Code_Screenshot_Generator SHALL allow customizing background color, padding, and window style
4. THE Code_Screenshot_Generator SHALL support multiple themes (dark, light, custom)
5. THE Code_Screenshot_Generator SHALL export images in PNG and SVG formats

### Requirement 7: Keyword Density Checker (关键词密度检查器)

**User Story:** As a content creator, I want to analyze keyword density in my text, so that I can optimize my content for SEO.

#### Acceptance Criteria

1. WHEN a user enters text, THE Keyword_Density_Checker SHALL analyze and display word frequency
2. THE Keyword_Density_Checker SHALL calculate density percentage for each keyword
3. THE Keyword_Density_Checker SHALL highlight overused keywords
4. THE Keyword_Density_Checker SHALL support filtering by minimum word length
5. THE Keyword_Density_Checker SHALL display results in a sortable table

### Requirement 8: Instagram Font Generator (Instagram 字体生成器)

**User Story:** As a social media user, I want to generate stylish Unicode fonts, so that I can make my Instagram bio and posts stand out.

#### Acceptance Criteria

1. WHEN a user enters text, THE Instagram_Font_Generator SHALL display the text in multiple Unicode font styles
2. THE Instagram_Font_Generator SHALL support at least 20 different font styles
3. THE Instagram_Font_Generator SHALL provide one-click copy functionality for each style
4. THE Instagram_Font_Generator SHALL preview how the text will look on Instagram

### Requirement 9: Mortgage Calculator (房贷计算器)

**User Story:** As a home buyer, I want to calculate mortgage payments, so that I can plan my home purchase budget.

#### Acceptance Criteria

1. WHEN a user enters loan amount, interest rate, and loan term, THE Mortgage_Calculator SHALL calculate monthly payments
2. THE Mortgage_Calculator SHALL display total interest paid over the loan term
3. THE Mortgage_Calculator SHALL generate an amortization schedule
4. THE Mortgage_Calculator SHALL support extra payment calculations
5. THE Mortgage_Calculator SHALL compare different loan scenarios

### Requirement 10: Tax Calculator (税费计算器)

**User Story:** As a taxpayer, I want to estimate my tax liability, so that I can plan my finances accordingly.

#### Acceptance Criteria

1. WHEN a user enters income and filing status, THE Tax_Calculator SHALL estimate tax liability
2. THE Tax_Calculator SHALL support multiple tax brackets
3. THE Tax_Calculator SHALL calculate effective tax rate
4. THE Tax_Calculator SHALL support common deductions and credits
5. THE Tax_Calculator SHALL display a breakdown of taxes by bracket

### Requirement 11: Countdown Days Calculator (倒计时天数计算器)

**User Story:** As a user, I want to count down days to important events, so that I can track upcoming milestones.

#### Acceptance Criteria

1. WHEN a user enters a target date, THE Countdown_Days_Calculator SHALL display days remaining
2. THE Countdown_Days_Calculator SHALL show breakdown in years, months, weeks, and days
3. THE Countdown_Days_Calculator SHALL support multiple countdowns simultaneously
4. THE Countdown_Days_Calculator SHALL allow saving countdowns to local storage
5. THE Countdown_Days_Calculator SHALL display progress percentage

### Requirement 12: Social Media Image Size Guide (社交媒体图片尺寸指南)

**User Story:** As a social media manager, I want to know the optimal image sizes for different platforms, so that I can create properly sized content.

#### Acceptance Criteria

1. THE Social_Media_Size_Guide SHALL display recommended image sizes for major platforms
2. THE Social_Media_Size_Guide SHALL include Facebook, Instagram, Twitter, LinkedIn, YouTube, TikTok, and Pinterest
3. THE Social_Media_Size_Guide SHALL show sizes for different content types (profile, cover, post, story)
4. THE Social_Media_Size_Guide SHALL provide aspect ratio information
5. THE Social_Media_Size_Guide SHALL allow searching and filtering by platform

### Requirement 13: Text Summarizer (文本摘要工具)

**User Story:** As a user, I want to summarize long text, so that I can quickly understand the main points.

#### Acceptance Criteria

1. WHEN a user enters text, THE Text_Summarizer SHALL generate a condensed summary
2. THE Text_Summarizer SHALL allow configuring summary length (short, medium, long)
3. THE Text_Summarizer SHALL extract key sentences from the original text
4. THE Text_Summarizer SHALL display word count reduction percentage
5. THE Text_Summarizer SHALL highlight key phrases in the original text

### Requirement 14: Paraphrase Tool (文本改写工具)

**User Story:** As a writer, I want to rephrase text, so that I can avoid plagiarism and improve my writing.

#### Acceptance Criteria

1. WHEN a user enters text, THE Paraphrase_Tool SHALL generate alternative phrasings
2. THE Paraphrase_Tool SHALL offer multiple rewriting styles (formal, casual, creative)
3. THE Paraphrase_Tool SHALL highlight changed words and phrases
4. THE Paraphrase_Tool SHALL preserve the original meaning
5. THE Paraphrase_Tool SHALL support sentence-by-sentence paraphrasing

### Requirement 15: GraphQL Formatter (GraphQL 格式化工具)

**User Story:** As a developer, I want to format GraphQL queries, so that I can improve code readability.

#### Acceptance Criteria

1. WHEN a user enters a GraphQL query, THE GraphQL_Formatter SHALL format it with proper indentation
2. THE GraphQL_Formatter SHALL validate GraphQL syntax
3. THE GraphQL_Formatter SHALL support minifying GraphQL queries
4. THE GraphQL_Formatter SHALL highlight syntax errors
5. THE GraphQL_Formatter SHALL support both queries and mutations

### Requirement 16: Fuel Cost Calculator (油费计算器)

**User Story:** As a driver, I want to calculate fuel costs for trips, so that I can budget my travel expenses.

#### Acceptance Criteria

1. WHEN a user enters distance, fuel efficiency, and fuel price, THE Fuel_Cost_Calculator SHALL calculate total fuel cost
2. THE Fuel_Cost_Calculator SHALL support both metric (km/L) and imperial (MPG) units
3. THE Fuel_Cost_Calculator SHALL allow comparing costs between different vehicles
4. THE Fuel_Cost_Calculator SHALL calculate round-trip costs

### Requirement 17: Electricity Cost Calculator (电费计算器)

**User Story:** As a homeowner, I want to calculate electricity costs for appliances, so that I can manage my energy consumption.

#### Acceptance Criteria

1. WHEN a user enters wattage, usage hours, and electricity rate, THE Electricity_Cost_Calculator SHALL calculate daily, monthly, and yearly costs
2. THE Electricity_Cost_Calculator SHALL provide a preset list of common appliances with typical wattages
3. THE Electricity_Cost_Calculator SHALL support multiple appliances calculation
4. THE Electricity_Cost_Calculator SHALL display total energy consumption in kWh

### Requirement 18: GPA Calculator (GPA 计算器)

**User Story:** As a student, I want to calculate my GPA, so that I can track my academic performance.

#### Acceptance Criteria

1. WHEN a user enters courses, credits, and grades, THE GPA_Calculator SHALL calculate cumulative GPA
2. THE GPA_Calculator SHALL support both 4.0 and 5.0 scale systems
3. THE GPA_Calculator SHALL allow adding multiple semesters
4. THE GPA_Calculator SHALL calculate semester GPA and cumulative GPA separately
5. THE GPA_Calculator SHALL support letter grades and percentage grades

### Requirement 19: Sleep Calculator (睡眠计算器)

**User Story:** As a user concerned about sleep quality, I want to calculate optimal sleep and wake times, so that I can wake up feeling refreshed.

#### Acceptance Criteria

1. WHEN a user enters desired wake time, THE Sleep_Calculator SHALL suggest optimal bedtimes based on sleep cycles
2. WHEN a user enters bedtime, THE Sleep_Calculator SHALL suggest optimal wake times
3. THE Sleep_Calculator SHALL account for average time to fall asleep (15 minutes)
4. THE Sleep_Calculator SHALL explain sleep cycle science
5. THE Sleep_Calculator SHALL recommend 5-6 complete sleep cycles

### Requirement 20: Pregnancy Due Date Calculator (预产期计算器)

**User Story:** As an expecting parent, I want to calculate my due date, so that I can prepare for the baby's arrival.

#### Acceptance Criteria

1. WHEN a user enters last menstrual period date, THE Due_Date_Calculator SHALL calculate estimated due date
2. THE Due_Date_Calculator SHALL display current pregnancy week and trimester
3. THE Due_Date_Calculator SHALL show key pregnancy milestones
4. THE Due_Date_Calculator SHALL support conception date calculation method
5. THE Due_Date_Calculator SHALL display countdown to due date

### Requirement 21: Love Calculator (爱情计算器)

**User Story:** As a user, I want a fun tool to calculate love compatibility, so that I can have entertainment with friends.

#### Acceptance Criteria

1. WHEN a user enters two names, THE Love_Calculator SHALL generate a compatibility percentage
2. THE Love_Calculator SHALL provide fun compatibility descriptions
3. THE Love_Calculator SHALL use consistent algorithm for same name pairs
4. THE Love_Calculator SHALL include shareable results

### Requirement 22: Name Generator (名字生成器)

**User Story:** As a user, I want to generate random names, so that I can find names for characters, projects, or babies.

#### Acceptance Criteria

1. THE Name_Generator SHALL generate random first names and last names
2. THE Name_Generator SHALL support filtering by gender and origin/culture
3. THE Name_Generator SHALL allow generating multiple names at once
4. THE Name_Generator SHALL support different name styles (fantasy, modern, classic)
5. THE Name_Generator SHALL provide name meanings when available

### Requirement 23: Team Generator (团队分组器)

**User Story:** As a teacher or organizer, I want to randomly divide people into teams, so that I can create fair group assignments.

#### Acceptance Criteria

1. WHEN a user enters a list of names, THE Team_Generator SHALL randomly divide them into teams
2. THE Team_Generator SHALL support specifying number of teams or team size
3. THE Team_Generator SHALL ensure balanced team sizes
4. THE Team_Generator SHALL allow re-shuffling teams
5. THE Team_Generator SHALL support exporting team assignments

### Requirement 24: Decision Wheel (决策转盘)

**User Story:** As a user, I want a spinning wheel to make random decisions, so that I can make choices in a fun way.

#### Acceptance Criteria

1. WHEN a user enters options, THE Decision_Wheel SHALL display them on a spinning wheel
2. WHEN the user clicks spin, THE Decision_Wheel SHALL animate and select a random option
3. THE Decision_Wheel SHALL allow customizing colors for each option
4. THE Decision_Wheel SHALL support weighted probabilities
5. THE Decision_Wheel SHALL provide sound effects during spin

### Requirement 25: Flip a Coin (抛硬币)

**User Story:** As a user, I want to flip a virtual coin, so that I can make quick binary decisions.

#### Acceptance Criteria

1. WHEN the user clicks flip, THE Coin_Flipper SHALL animate a coin flip and show result
2. THE Coin_Flipper SHALL track flip history and statistics
3. THE Coin_Flipper SHALL support multiple consecutive flips
4. THE Coin_Flipper SHALL provide realistic flip animation

### Requirement 26: Roll Dice (掷骰子)

**User Story:** As a user, I want to roll virtual dice, so that I can use them for games or random number generation.

#### Acceptance Criteria

1. WHEN the user clicks roll, THE Dice_Roller SHALL animate dice rolling and show results
2. THE Dice_Roller SHALL support different dice types (D4, D6, D8, D10, D12, D20)
3. THE Dice_Roller SHALL support rolling multiple dice simultaneously
4. THE Dice_Roller SHALL calculate and display sum of all dice
5. THE Dice_Roller SHALL track roll history

### Requirement 27: Pace Calculator (配速计算器)

**User Story:** As a runner, I want to calculate running pace, so that I can plan my training and races.

#### Acceptance Criteria

1. WHEN a user enters distance and time, THE Pace_Calculator SHALL calculate pace per km/mile
2. WHEN a user enters pace and distance, THE Pace_Calculator SHALL calculate finish time
3. THE Pace_Calculator SHALL support common race distances (5K, 10K, half marathon, marathon)
4. THE Pace_Calculator SHALL provide pace conversion between km and miles
5. THE Pace_Calculator SHALL display splits for different distances

### Requirement 28: Shoe Size Converter (鞋码转换器)

**User Story:** As a shopper, I want to convert shoe sizes between different systems, so that I can buy shoes from international retailers.

#### Acceptance Criteria

1. WHEN a user enters a shoe size, THE Shoe_Size_Converter SHALL convert to other sizing systems
2. THE Shoe_Size_Converter SHALL support US, UK, EU, and Asian sizing systems
3. THE Shoe_Size_Converter SHALL support both men's and women's sizes
4. THE Shoe_Size_Converter SHALL support children's sizes
5. THE Shoe_Size_Converter SHALL display foot length in cm/inches

### Requirement 29: Ring Size Calculator (戒指尺寸计算器)

**User Story:** As a jewelry shopper, I want to determine my ring size, so that I can buy rings online with confidence.

#### Acceptance Criteria

1. THE Ring_Size_Calculator SHALL provide methods to measure ring size at home
2. THE Ring_Size_Calculator SHALL convert between US, UK, EU, and Asian ring sizes
3. THE Ring_Size_Calculator SHALL calculate size from finger circumference
4. THE Ring_Size_Calculator SHALL provide a printable ring sizer

### Requirement 30: Bra Size Calculator (文胸尺码计算器)

**User Story:** As a shopper, I want to calculate my bra size, so that I can find properly fitting undergarments.

#### Acceptance Criteria

1. WHEN a user enters band and bust measurements, THE Bra_Size_Calculator SHALL calculate bra size
2. THE Bra_Size_Calculator SHALL support US, UK, EU, and Asian sizing systems
3. THE Bra_Size_Calculator SHALL support both metric and imperial measurements
4. THE Bra_Size_Calculator SHALL provide sister size recommendations

### Requirement 31: Concrete Calculator (混凝土计算器)

**User Story:** As a DIY enthusiast or contractor, I want to calculate concrete needed for a project, so that I can order the right amount of materials.

#### Acceptance Criteria

1. WHEN a user enters dimensions, THE Concrete_Calculator SHALL calculate volume of concrete needed
2. THE Concrete_Calculator SHALL support different shapes (slab, column, stairs, footings)
3. THE Concrete_Calculator SHALL calculate number of bags needed for different bag sizes
4. THE Concrete_Calculator SHALL add recommended waste factor

### Requirement 32: Paint Calculator (油漆计算器)

**User Story:** As a homeowner, I want to calculate paint needed for a room, so that I can buy the right amount.

#### Acceptance Criteria

1. WHEN a user enters room dimensions, THE Paint_Calculator SHALL calculate paint needed
2. THE Paint_Calculator SHALL account for doors and windows
3. THE Paint_Calculator SHALL support different paint coverage rates
4. THE Paint_Calculator SHALL calculate for multiple coats
5. THE Paint_Calculator SHALL provide cost estimate based on paint price

### Requirement 33: Tile Calculator (瓷砖计算器)

**User Story:** As a homeowner, I want to calculate tiles needed for a floor or wall, so that I can plan my renovation project.

#### Acceptance Criteria

1. WHEN a user enters area dimensions and tile size, THE Tile_Calculator SHALL calculate number of tiles needed
2. THE Tile_Calculator SHALL account for grout spacing
3. THE Tile_Calculator SHALL add recommended waste percentage
4. THE Tile_Calculator SHALL support different tile patterns (straight, diagonal, herringbone)
5. THE Tile_Calculator SHALL calculate total cost based on tile price

### Requirement 34: Subnet Calculator Enhanced (增强子网计算器)

**User Story:** As a network administrator, I want to calculate subnet details, so that I can plan network configurations.

#### Acceptance Criteria

1. WHEN a user enters an IP address and subnet mask, THE Subnet_Calculator SHALL display network details
2. THE Subnet_Calculator SHALL show network address, broadcast address, and usable host range
3. THE Subnet_Calculator SHALL support CIDR notation
4. THE Subnet_Calculator SHALL calculate number of usable hosts
5. THE Subnet_Calculator SHALL support IPv4 and IPv6

### Requirement 35: Binary/Hex/Decimal Converter Enhanced (增强进制转换器)

**User Story:** As a developer, I want to convert between number systems with additional features, so that I can work with different data representations.

#### Acceptance Criteria

1. THE Number_System_Converter SHALL convert between binary, octal, decimal, and hexadecimal
2. THE Number_System_Converter SHALL support floating-point numbers
3. THE Number_System_Converter SHALL show step-by-step conversion process
4. THE Number_System_Converter SHALL support negative numbers (two's complement)
5. THE Number_System_Converter SHALL support batch conversion


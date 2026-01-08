# Requirements Document

## Introduction

本文档定义了为 U2Tool 项目添加新一批热门工具的需求。这些工具经过市场调研，选择了低竞争、高流量转化的工具类型，且项目中尚未存在。

## Glossary

- **Tool_System**: U2Tool 在线工具平台系统
- **User**: 使用工具的访问者
- **Tool_Component**: 工具的 React 组件实现
- **Translation_System**: 多语言翻译系统，支持 10 种语言

## Requirements

### Requirement 1: Markdown to PDF Converter

**User Story:** As a user, I want to convert Markdown files to PDF format, so that I can share formatted documents easily.

#### Acceptance Criteria

1. WHEN a user inputs Markdown content, THE Tool_System SHALL render a preview of the formatted content
2. WHEN a user clicks the convert button, THE Tool_System SHALL generate a downloadable PDF file
3. THE Tool_System SHALL support common Markdown syntax including headers, lists, code blocks, tables, and images
4. IF the Markdown content is empty, THEN THE Tool_System SHALL display an appropriate error message

### Requirement 2: Text to Image Generator

**User Story:** As a user, I want to convert text to an image, so that I can create shareable text graphics for social media.

#### Acceptance Criteria

1. WHEN a user inputs text content, THE Tool_System SHALL display a real-time preview of the generated image
2. THE Tool_System SHALL allow customization of font, font size, text color, and background color
3. WHEN a user clicks download, THE Tool_System SHALL generate a PNG image file
4. THE Tool_System SHALL support multiple text alignment options (left, center, right)
5. IF the text content is empty, THEN THE Tool_System SHALL prevent image generation

### Requirement 3: Lorem Ipsum Generator for Chinese

**User Story:** As a Chinese developer, I want to generate placeholder Chinese text, so that I can use it in my design mockups.

#### Acceptance Criteria

1. WHEN a user specifies the number of paragraphs, THE Tool_System SHALL generate the corresponding amount of Chinese placeholder text
2. THE Tool_System SHALL provide options for generating sentences, paragraphs, or words
3. THE Tool_System SHALL generate grammatically coherent Chinese text
4. WHEN a user clicks copy, THE Tool_System SHALL copy the generated text to clipboard

### Requirement 4: Loan Calculator

**User Story:** As a user, I want to calculate loan payments, so that I can plan my finances effectively.

#### Acceptance Criteria

1. WHEN a user inputs loan amount, interest rate, and loan term, THE Tool_System SHALL calculate monthly payment
2. THE Tool_System SHALL display total interest paid and total amount paid
3. THE Tool_System SHALL generate an amortization schedule showing principal and interest breakdown
4. THE Tool_System SHALL support different payment frequencies (monthly, bi-weekly, weekly)
5. IF any input is invalid, THEN THE Tool_System SHALL display appropriate validation errors

### Requirement 5: BMI Calculator

**User Story:** As a user, I want to calculate my Body Mass Index, so that I can monitor my health status.

#### Acceptance Criteria

1. WHEN a user inputs height and weight, THE Tool_System SHALL calculate and display the BMI value
2. THE Tool_System SHALL support both metric (kg/cm) and imperial (lb/ft-in) units
3. THE Tool_System SHALL display the BMI category (underweight, normal, overweight, obese)
4. THE Tool_System SHALL provide a visual indicator showing where the user's BMI falls on the scale
5. IF inputs are invalid or out of reasonable range, THEN THE Tool_System SHALL display validation errors

### Requirement 6: Age Calculator

**User Story:** As a user, I want to calculate my exact age, so that I can know my age in years, months, and days.

#### Acceptance Criteria

1. WHEN a user inputs their birth date, THE Tool_System SHALL calculate and display age in years, months, and days
2. THE Tool_System SHALL display the next birthday countdown
3. THE Tool_System SHALL show total days lived and other interesting statistics
4. THE Tool_System SHALL support date input via calendar picker
5. IF the birth date is in the future, THEN THE Tool_System SHALL display an error message

### Requirement 7: Tip Calculator

**User Story:** As a user, I want to calculate tips for restaurant bills, so that I can quickly determine appropriate tip amounts.

#### Acceptance Criteria

1. WHEN a user inputs bill amount and tip percentage, THE Tool_System SHALL calculate the tip amount
2. THE Tool_System SHALL display total amount including tip
3. THE Tool_System SHALL support splitting the bill among multiple people
4. THE Tool_System SHALL provide preset tip percentages (15%, 18%, 20%, 25%)
5. THE Tool_System SHALL allow custom tip percentage input

### Requirement 8: Discount Calculator

**User Story:** As a user, I want to calculate discounted prices, so that I can quickly determine savings on purchases.

#### Acceptance Criteria

1. WHEN a user inputs original price and discount percentage, THE Tool_System SHALL calculate the discounted price
2. THE Tool_System SHALL display the amount saved
3. THE Tool_System SHALL support calculating the discount percentage from original and sale prices
4. THE Tool_System SHALL support multiple discount calculations (e.g., additional discounts)
5. IF inputs are invalid, THEN THE Tool_System SHALL display validation errors

### Requirement 9: Compound Interest Calculator

**User Story:** As a user, I want to calculate compound interest, so that I can plan my investments and savings.

#### Acceptance Criteria

1. WHEN a user inputs principal, interest rate, time period, and compounding frequency, THE Tool_System SHALL calculate the final amount
2. THE Tool_System SHALL display total interest earned
3. THE Tool_System SHALL generate a growth chart showing balance over time
4. THE Tool_System SHALL support different compounding frequencies (daily, monthly, quarterly, annually)
5. THE Tool_System SHALL allow adding regular contributions to the calculation

### Requirement 10: Aspect Ratio Calculator Enhanced

**User Story:** As a user, I want to calculate and convert aspect ratios, so that I can resize images and videos correctly.

#### Acceptance Criteria

1. WHEN a user inputs width and height, THE Tool_System SHALL calculate and display the aspect ratio
2. THE Tool_System SHALL provide common preset aspect ratios (16:9, 4:3, 1:1, 9:16, etc.)
3. WHEN a user changes one dimension, THE Tool_System SHALL calculate the other dimension maintaining the ratio
4. THE Tool_System SHALL display the ratio in multiple formats (ratio, decimal, percentage)

### Requirement 11: Binary Calculator

**User Story:** As a developer, I want to perform binary arithmetic operations, so that I can work with binary numbers efficiently.

#### Acceptance Criteria

1. THE Tool_System SHALL support binary addition, subtraction, multiplication, and division
2. THE Tool_System SHALL display results in binary, decimal, and hexadecimal formats
3. THE Tool_System SHALL support bitwise operations (AND, OR, XOR, NOT, shift)
4. THE Tool_System SHALL validate that inputs are valid binary numbers
5. IF inputs are invalid, THEN THE Tool_System SHALL display appropriate error messages

### Requirement 12: Hex Calculator

**User Story:** As a developer, I want to perform hexadecimal arithmetic operations, so that I can work with hex values efficiently.

#### Acceptance Criteria

1. THE Tool_System SHALL support hexadecimal addition, subtraction, multiplication, and division
2. THE Tool_System SHALL display results in hexadecimal, decimal, and binary formats
3. THE Tool_System SHALL support bitwise operations on hex values
4. THE Tool_System SHALL validate that inputs are valid hexadecimal numbers
5. IF inputs are invalid, THEN THE Tool_System SHALL display appropriate error messages

### Requirement 13: IP Subnet Calculator

**User Story:** As a network administrator, I want to calculate IP subnets, so that I can plan network configurations.

#### Acceptance Criteria

1. WHEN a user inputs an IP address and subnet mask, THE Tool_System SHALL calculate network address, broadcast address, and usable host range
2. THE Tool_System SHALL display the number of usable hosts
3. THE Tool_System SHALL support both CIDR notation and dotted decimal subnet masks
4. THE Tool_System SHALL support IPv4 addresses
5. IF the IP address or subnet mask is invalid, THEN THE Tool_System SHALL display validation errors

### Requirement 14: Text to Handwriting Converter

**User Story:** As a user, I want to convert typed text to handwriting style, so that I can create personalized notes and documents.

#### Acceptance Criteria

1. WHEN a user inputs text, THE Tool_System SHALL render it in a handwriting-style font
2. THE Tool_System SHALL provide multiple handwriting style options
3. THE Tool_System SHALL allow customization of ink color and paper background
4. WHEN a user clicks download, THE Tool_System SHALL generate a downloadable image
5. THE Tool_System SHALL support line spacing and margin adjustments

### Requirement 15: Screen Resolution Tester

**User Story:** As a web developer, I want to test different screen resolutions, so that I can ensure responsive design works correctly.

#### Acceptance Criteria

1. THE Tool_System SHALL display the current screen resolution and viewport size
2. THE Tool_System SHALL provide preset common device resolutions (iPhone, iPad, desktop sizes)
3. THE Tool_System SHALL allow custom resolution input
4. THE Tool_System SHALL provide a preview frame that simulates the selected resolution
5. THE Tool_System SHALL display device pixel ratio information

### Requirement 16: Keyboard Tester

**User Story:** As a user, I want to test my keyboard keys, so that I can verify all keys are working properly.

#### Acceptance Criteria

1. WHEN a user presses a key, THE Tool_System SHALL highlight the corresponding key on a virtual keyboard
2. THE Tool_System SHALL display the key code, key name, and character for each pressed key
3. THE Tool_System SHALL track which keys have been tested
4. THE Tool_System SHALL support different keyboard layouts (QWERTY, AZERTY)
5. THE Tool_System SHALL provide a reset function to clear tested keys

### Requirement 17: Typing Speed Test

**User Story:** As a user, I want to test my typing speed, so that I can measure and improve my typing skills.

#### Acceptance Criteria

1. THE Tool_System SHALL display a passage of text for the user to type
2. WHEN the user starts typing, THE Tool_System SHALL start a timer
3. THE Tool_System SHALL calculate and display words per minute (WPM) and accuracy
4. THE Tool_System SHALL highlight errors in real-time
5. THE Tool_System SHALL provide different difficulty levels and text lengths
6. WHEN the test is complete, THE Tool_System SHALL display final statistics

### Requirement 18: Morse Code Audio Player

**User Story:** As a user, I want to hear Morse code audio, so that I can learn and practice Morse code.

#### Acceptance Criteria

1. WHEN a user inputs text, THE Tool_System SHALL convert it to Morse code
2. THE Tool_System SHALL play the Morse code as audio (dots and dashes)
3. THE Tool_System SHALL allow adjustment of playback speed
4. THE Tool_System SHALL display the visual Morse code representation
5. THE Tool_System SHALL support pause, play, and stop controls

### Requirement 19: CSS Sprite Generator

**User Story:** As a web developer, I want to generate CSS sprites, so that I can optimize image loading on my website.

#### Acceptance Criteria

1. WHEN a user uploads multiple images, THE Tool_System SHALL combine them into a single sprite sheet
2. THE Tool_System SHALL generate the corresponding CSS code for each sprite
3. THE Tool_System SHALL allow customization of sprite arrangement (horizontal, vertical, grid)
4. THE Tool_System SHALL support padding between sprites
5. THE Tool_System SHALL provide a downloadable sprite image and CSS file

### Requirement 20: SVG Path Editor

**User Story:** As a designer, I want to edit SVG paths visually, so that I can create and modify vector graphics easily.

#### Acceptance Criteria

1. THE Tool_System SHALL provide a visual canvas for editing SVG paths
2. THE Tool_System SHALL support adding, moving, and deleting path points
3. THE Tool_System SHALL display the SVG path code in real-time
4. THE Tool_System SHALL support importing existing SVG path code
5. THE Tool_System SHALL allow exporting the edited path as SVG code or file

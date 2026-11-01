# ClearExam — Design Tokens & UI/UX Specification

Extracted from Reference UI Designs (`01-home.png`, `02-explore.png`, `03-practice.png`, `04-history.png`).

## 1. Color Palette

### 1.1 Brand & Primaries
- **Primary Deep Navy**: `#0F172A` (Background headers, high-contrast text)
- **Primary Indigo**: `#4F46E5` (Active tabs, primary action buttons, focused borders)
- **Primary Indigo Light**: `#EEF2FF` (Badge backgrounds, selected item fills)
- **Secondary Vibrant Teal**: `#0EA5E9` (Accent badges, timer rings, progress bars)
- **Teal Light**: `#E0F2FE` (Teal chip background)

### 1.2 Status & Feedback
- **Success Emerald**: `#10B981` (High score badges, correct answers, synced status)
- **Success Emerald Light**: `#ECFDF5`
- **Warning Amber**: `#F59E0B` (Timer countdown alerts, unattempted warning)
- **Warning Amber Light**: `#FFFBEB`
- **Destructive Crimson**: `#EF4444` (Incorrect answers, negative marks, expired state)
- **Destructive Light**: `#FEF2F2`

### 1.3 Neutrals & Surface
- **Surface Pure White**: `#FFFFFF` (Cards, sheet backgrounds)
- **Surface Off-White**: `#F8FAFC` (App scaffold background)
- **Border Subtle**: `#E2E8F0` (Card borders, dividers)
- **Text Main**: `#1E293B` (Headings, question stems)
- **Text Muted**: `#64748B` (Secondary descriptions, metadata)
- **Text Subtle**: `#94A3B8` (Placeholders, disabled text)

---

## 2. Typography Scale (Inter / Roboto)
- **Display**: 28sp / Line Height 34sp / Bold (Home greeting, final score hero)
- **Title Large**: 20sp / Line Height 26sp / SemiBold (Section titles, screen headers)
- **Title Medium**: 16sp / Line Height 22sp / SemiBold (Card titles, exam names)
- **Body Large**: 16sp / Line Height 24sp / Regular (Question stems, reading text)
- **Body Medium**: 14sp / Line Height 20sp / Regular (Options, instructions)
- **Label Large**: 14sp / Line Height 18sp / Medium (Buttons, tab items)
- **Label Small**: 11sp / Line Height 14sp / SemiBold (Badges, timer, tags)

---

## 3. Shape & Elevation
- **Card Corner Radius**: `16dp` / `1rem`
- **Button Corner Radius**: `12dp` / `0.75rem`
- **Pill / Chip Radius**: `9999px` (Full rounded)
- **Card Elevation**: Low shadow `0 2px 4px rgba(15, 23, 42, 0.06)`
- **Modal Elevation**: High shadow `0 10px 25px rgba(15, 23, 42, 0.15)`

---

## 4. Spacing System
- `xs`: 4dp / 0.25rem
- `sm`: 8dp / 0.5rem
- `md`: 12dp / 0.75rem
- `lg`: 16dp / 1.0rem
- `xl`: 24dp / 1.5rem
- `2xl`: 32dp / 2.0rem

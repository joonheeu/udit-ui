# udit-ui

A collection of custom shadcn/ui components for React applications.

## Installation

Add this registry to your `components.json`:

```json
{
  "registries": [
    {
      "name": "udit-ui",
      "url": "https://raw.githubusercontent.com/joonheeu/udit-ui/main"
    }
  ]
}
```

## Components

### DatePicker

A flexible date picker component with Korean holiday support and various input formats.

```bash
pnpm dlx shadcn@latest add date-picker --registry udit-ui
```

#### Features

- Multiple date input formats (numeric, hyphenated, slash, dot, etc.)
- Customizable locale (i18n support)
- Customizable holidays data
- Customizable display format
- Min/max date restrictions
- Disable future/past dates
- Today button
- Popover calendar with year/month/day selection

#### Usage

**Basic Usage:**
```tsx
import { DatePicker } from "@/components/ui/date-picker";

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      displayFormat="yyyy-MM-dd"
    />
  );
}
```

**With Custom Locale:**
```tsx
import { DatePicker, DatePickerLocale } from "@/components/ui/date-picker";

const koreanLocale: Partial<DatePickerLocale> = {
  weekDays: ["일", "월", "화", "수", "목", "금", "토"],
  monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  today: "오늘",
  placeholder: "날짜를 입력해주세요",
  errorMessage: "올바른 날짜 형식을 입력해주세요",
  dateFormat: "yyyy년 M월 dd일",
  yearFormat: "yyyy년",
  monthFormat: "yyyy년 M월",
  yearRangeFormat: (start, end) => `${start}년 - ${end}년`,
  parsePatterns: [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/,
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
  ],
};

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      locale={koreanLocale}
    />
  );
}
```

**With Custom Holidays:**
```tsx
import { DatePicker, HolidaysData } from "@/components/ui/date-picker";

const holidays: HolidaysData = {
  "2025": {
    "2025-01-01": ["New Year's Day"],
    "2025-12-25": ["Christmas"],
  },
};

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      holidays={holidays}
      showHolidays={true}
    />
  );
}
```

## License

MIT

# udit-ui

A collection of custom shadcn/ui components for React applications.

## Installation

Add this registry to your `components.json`:

```json
{
  "registries": [
    {
      "name": "udit-ui",
      "url": "https://raw.githubusercontent.com/YOUR_USERNAME/udit-ui/main"
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

- Multiple date input formats (numeric, hyphenated, Korean, etc.)
- Korean public holiday support (2018-2035)
- Customizable display format
- Min/max date restrictions
- Disable future/past dates
- Today button
- Popover calendar with year/month/day selection

#### Usage

```tsx
import { DatePicker } from "@/components/ui/date-picker";

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      displayFormat="yyyy년 M월 dd일"
      showHolidays={true}
    />
  );
}
```

## License

MIT

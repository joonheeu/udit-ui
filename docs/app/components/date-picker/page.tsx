"use client";

import { useState } from "react";
import { DatePicker, DatePickerLocale, HolidaysData } from "@/components/ui/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function DatePickerPage() {
  const [basicDate, setBasicDate] = useState<Date>();
  const [formattedDate, setFormattedDate] = useState<Date>();
  const [restrictedDate, setRestrictedDate] = useState<Date>();
  const [holidayDate, setHolidayDate] = useState<Date>();
  const [koreanDate, setKoreanDate] = useState<Date>();

  const koreanLocale: Partial<DatePickerLocale> = {
    weekDays: ["일", "월", "화", "수", "목", "금", "토"],
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    today: "오늘",
    placeholder: "날짜를 입력해주세요",
    errorMessage: "올바른 날짜 형식을 입력해주세요 (예: 20240112, 2025-01-01, 2025년1월1일)",
    dateFormat: "yyyy년 M월 dd일",
    yearFormat: "yyyy년",
    monthFormat: "yyyy년 M월",
    yearRangeFormat: (start, end) => `${start}년 - ${end}년`,
    parsePatterns: [
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/,
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
      /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})$/,
    ],
    parseExamples: ["20240112", "2025-01-01", "2025년1월1일"],
  };

  const holidays: HolidaysData = {
    "2025": {
      "2025-01-01": ["New Year's Day"],
      "2025-12-25": ["Christmas"],
    },
    "2026": {
      "2026-01-01": ["New Year's Day"],
      "2026-12-25": ["Christmas"],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">DatePicker</h1>
            <p className="text-lg text-muted-foreground">
              A flexible date picker component with internationalization support and customizable
              holidays
            </p>
          </div>

          <Tabs defaultValue="examples" className="w-full">
            <TabsList>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            <TabsContent value="examples" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Usage</CardTitle>
                  <CardDescription>
                    Simple date picker with default English locale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DatePicker value={basicDate} onChange={setBasicDate} />
                  {basicDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(basicDate, "yyyy-MM-dd")}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Display Format</CardTitle>
                  <CardDescription>
                    Date picker with custom display format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DatePicker
                    value={formattedDate}
                    onChange={setFormattedDate}
                    displayFormat="MMMM dd, yyyy"
                  />
                  {formattedDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(formattedDate, "MMMM dd, yyyy")}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Date Restrictions</CardTitle>
                  <CardDescription>
                    Date picker with min/max date and disable future/past options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Disable Past Dates</p>
                      <DatePicker
                        value={restrictedDate}
                        onChange={setRestrictedDate}
                        disablePast={true}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>With Holidays</CardTitle>
                  <CardDescription>
                    Date picker with custom holiday data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DatePicker
                    value={holidayDate}
                    onChange={setHolidayDate}
                    holidays={holidays}
                    showHolidays={true}
                  />
                  {holidayDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(holidayDate, "yyyy-MM-dd")}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Korean Locale</CardTitle>
                  <CardDescription>
                    Date picker with Korean language support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DatePicker
                    value={koreanDate}
                    onChange={setKoreanDate}
                    locale={koreanLocale}
                  />
                  {koreanDate && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {format(koreanDate, "yyyy년 M월 dd일")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>DatePickerProps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <code className="text-sm font-mono">value?: Date</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The selected date value
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">onChange?: (date: Date) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback function when date is selected
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">displayFormat?: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Date format string (default: "yyyy-MM-dd")
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">showHolidays?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Show holidays in calendar (default: true)
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">holidays?: HolidaysData</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Custom holiday data object
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">locale?: Partial&lt;DatePickerLocale&gt;</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Custom locale configuration
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">minDate?: Date | null</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Minimum selectable date
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">maxDate?: Date | null</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Maximum selectable date
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">disableFuture?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Disable all future dates (default: false)
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">disablePast?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Disable all past dates (default: false)
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <code className="text-sm font-mono">showToday?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Highlight today's date (default: false)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      value={date}
      onChange={setDate}
    />
  );
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>With Custom Locale</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { DatePicker, DatePickerLocale } from "@/components/ui/date-picker";

const koreanLocale: Partial<DatePickerLocale> = {
  weekDays: ["일", "월", "화", "수", "목", "금", "토"],
  monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  today: "오늘",
  placeholder: "날짜를 입력해주세요",
  errorMessage: "올바른 날짜 형식을 입력해주세요",
  dateFormat: "yyyy년 M월 dd일",
  yearFormat: "yyyy년",
  monthFormat: "yyyy년 M월",
  yearRangeFormat: (start, end) => \`\${start}년 - \${end}년\`,
  parsePatterns: [
    /^(\\d{4})-(\\d{1,2})-(\\d{1,2})$/,
    /^(\\d{4})년\\s*(\\d{1,2})월\\s*(\\d{1,2})일$/,
  ],
};

<DatePicker
  value={date}
  onChange={setDate}
  locale={koreanLocale}
/>`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>With Holidays</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { DatePicker, HolidaysData } from "@/components/ui/date-picker";

const holidays: HolidaysData = {
  "2025": {
    "2025-01-01": ["New Year's Day"],
    "2025-12-25": ["Christmas"],
  },
};

<DatePicker
  value={date}
  onChange={setDate}
  holidays={holidays}
  showHolidays={true}
/>`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

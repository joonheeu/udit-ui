"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  addMonths,
  format,
  isSameDay,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  setMonth,
  setYear,
  isBefore,
  isAfter,
  startOfDay,
  isValid,
} from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Types
type CalendarView = "year" | "month" | "day";

export type HolidaysData = {
  [year: string]: {
    [date: string]: string[];
  };
};

export type DatePickerLocale = {
  weekDays: string[];
  monthNames: string[];
  today: string;
  placeholder: string;
  errorMessage: string;
  dateFormat: string;
  yearFormat: string;
  monthFormat: string;
  yearRangeFormat: (start: number, end: number) => string;
  parsePatterns: RegExp[];
  parseExamples: string[];
};

const defaultLocale: DatePickerLocale = {
  weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  today: "Today",
  placeholder: "Enter a date",
  errorMessage: "Please enter a valid date format (e.g., 20240112, 2025-01-01, 2025/01/01)",
  dateFormat: "yyyy-MM-dd",
  yearFormat: "yyyy",
  monthFormat: "MMMM yyyy",
  yearRangeFormat: (start: number, end: number) => `${start} - ${end}`,
  parsePatterns: [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
    /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})$/,
  ],
  parseExamples: ["20240112", "2025-01-01", "2025/01/01"],
};

function isHoliday(date: Date, holidays: HolidaysData): boolean {
  const year = date.getFullYear().toString();
  const dateStr = format(date, "yyyy-MM-dd");
  return !!holidays[year]?.[dateStr];
}

function isDateSelectable(
  date: Date,
  minDate: Date | null,
  maxDate: Date | null,
  disableFuture: boolean = false,
  disablePast: boolean = false
): boolean {
  const dateStart = startOfDay(date);
  const today = startOfDay(new Date());

  if (disablePast && isBefore(dateStart, today)) {
    return false;
  }

  if (disableFuture && isAfter(dateStart, today)) {
    return false;
  }

  if (minDate && isBefore(dateStart, startOfDay(minDate))) {
    return false;
  }

  if (maxDate && isAfter(dateStart, startOfDay(maxDate))) {
    return false;
  }

  return true;
}

// Shared Grid Components
interface DayGridProps {
  date: Date;
  value?: Date;
  onChange?: (date: Date) => void;
  holidays: HolidaysData;
  showHolidays?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  showToday?: boolean;
  locale: DatePickerLocale;
}

function DayGrid({
  date,
  value,
  onChange,
  holidays,
  showHolidays = true,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  showToday = false,
  locale,
}: DayGridProps) {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const weekDays = locale.weekDays;
  const firstDayOfMonth = getDay(startOfMonth(date));
  const blankCount = firstDayOfMonth;
  const blanks = Array(blankCount).fill(null);

  const handleDateClick = (clickedDate: Date) => {
    if (
      isDateSelectable(
        clickedDate,
        minDate,
        maxDate,
        disableFuture,
        disablePast
      ) &&
      onChange
    ) {
      onChange(clickedDate);
    }
  };

  return (
    <>
      <div className="grid grid-cols-7 mb-2 w-full text-center">
        {weekDays.map((day, index) => {
          const isSun = index === 0;
          const isSat = index === 6;
          return (
            <div
              key={day}
              className={cn(
                "font-medium text-slate-500 text-xs",
                isSun && "text-red-500",
                isSat && "text-blue-500"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="gap-x-0 gap-y-2 grid grid-cols-7">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {daysInMonth.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = value && isSameDay(day, value);
          const dayOfWeek = getDay(day);
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;
          const isHolidayDate = showHolidays && isHoliday(day, holidays);
          const isSelectable = isDateSelectable(
            day,
            minDate,
            maxDate,
            disableFuture,
            disablePast
          );

          return (
            <div key={day.toString()} className="flex justify-center">
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={!isSelectable}
                className={cn(
                  "flex justify-center items-center rounded-full w-9 h-9 text-sm transition-colors",
                  !isSelectable && "opacity-30 cursor-not-allowed",
                  isSelected
                    ? "bg-slate-900 text-white font-bold"
                    : "hover:bg-slate-100",
                  !isSelected &&
                    isToday &&
                    isSelectable &&
                    showToday &&
                    "bg-slate-200 font-bold",
                  !isSelected &&
                    !isToday &&
                    isSelectable &&
                    (isSunday || isHolidayDate) &&
                    "text-red-500",
                  !isSelected &&
                    !isToday &&
                    isSelectable &&
                    isSaturday &&
                    !isHolidayDate &&
                    "text-blue-500"
                )}
              >
                {format(day, "d")}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

interface MonthGridProps {
  date: Date;
  onSelect: (monthIndex: number) => void;
  value?: Date;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  locale: DatePickerLocale;
}

function MonthGrid({
  date,
  onSelect,
  value,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  locale,
}: MonthGridProps) {
  return (
    <div className="gap-2 grid grid-cols-4">
      {locale.monthNames.map((monthName, index) => {
        const isSelected = value
          ? value.getFullYear() === date.getFullYear() &&
            index === value.getMonth()
          : index === date.getMonth();
        const testDate = setMonth(date, index);
        const isSelectable = isDateSelectable(
          startOfMonth(testDate),
          minDate,
          maxDate,
          disableFuture,
          disablePast
        );

        return (
          <Button
            key={monthName}
            variant={isSelected ? "default" : "ghost"}
            disabled={!isSelectable}
            className={cn(
              "h-12 font-medium text-sm",
              isSelected
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-50 border-slate-200",
              !isSelectable && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => onSelect(index)}
          >
            {monthName}
          </Button>
        );
      })}
    </div>
  );
}

interface YearGridProps {
  date: Date;
  onSelect: (year: number) => void;
  value?: Date;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  locale: DatePickerLocale;
}

function YearGrid({
  date,
  onSelect,
  value,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  locale,
}: YearGridProps) {
  const currentYear = new Date().getFullYear();
  const currentYearInView = date.getFullYear();
  const startYear = Math.floor((currentYearInView - 1) / 12) * 12 + 1;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className="gap-2 grid grid-cols-3">
      {years.map((year) => {
        const isSelected = value
          ? year === value.getFullYear()
          : year === date.getFullYear();
        const isSelectable =
          (!minDate || year >= minDate.getFullYear()) &&
          (!maxDate || year <= maxDate.getFullYear()) &&
          (!disablePast || year >= currentYear) &&
          (!disableFuture || year <= currentYear);

        return (
          <Button
            key={year}
            variant={isSelected ? "default" : "ghost"}
            disabled={!isSelectable}
            className={cn(
              "h-12 font-medium text-sm",
              isSelected
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-600 hover:bg-slate-50 border-slate-200",
              !isSelectable && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => onSelect(year)}
          >
            {format(new Date(year, 0, 1), locale.yearFormat)}
          </Button>
        );
      })}
    </div>
  );
}

// CalendarPopover Component
interface CalendarPopoverProps {
  value?: Date;
  onChange?: (date: Date) => void;
  isOpen?: boolean;
  showHolidays?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  showToday?: boolean;
  holidays?: HolidaysData;
  locale?: DatePickerLocale;
}

function CalendarPopover({
  value,
  onChange,
  isOpen,
  showHolidays = true,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  showToday = false,
  holidays = {},
  locale = defaultLocale,
}: CalendarPopoverProps) {
  const [displayDate, setDisplayDate] = useState(value || new Date());
  const [view, setView] = useState<CalendarView>("day");

  useEffect(() => {
    if (value) {
      setDisplayDate(value);
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      setView("day");
      if (value) {
        setDisplayDate(value);
      }
    }
  }, [isOpen, value]);

  const getYearRange = () => {
    const currentYear = displayDate.getFullYear();
    const startYear = Math.floor((currentYear - 1) / 12) * 12 + 1;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  };

  const getHeaderText = (): string => {
    if (view === "year") {
      const years = getYearRange();
      return locale.yearRangeFormat(years[0], years[years.length - 1]);
    } else if (view === "month") {
      return format(new Date(displayDate.getFullYear(), 0, 1), locale.yearFormat);
    } else {
      return format(displayDate, locale.monthFormat);
    }
  };

  const handlePrev = () => {
    if (view === "year") {
      const currentYear = displayDate.getFullYear();
      const startYear = Math.floor((currentYear - 1) / 12) * 12 + 1;
      const prevStartYear = startYear - 12;
      const newYear =
        value &&
        value.getFullYear() >= prevStartYear &&
        value.getFullYear() < prevStartYear + 12
          ? value.getFullYear()
          : prevStartYear;
      const newDate = setYear(displayDate, newYear);
      setDisplayDate(newDate);
    } else if (view === "month") {
      const prevYearDate = subMonths(displayDate, 12);
      const newMonth =
        value && value.getFullYear() === prevYearDate.getFullYear()
          ? value.getMonth()
          : 0;
      const newDate = setMonth(prevYearDate, newMonth);
      setDisplayDate(newDate);
    } else {
      const prevMonthDate = subMonths(displayDate, 1);
      if (
        minDate &&
        isBefore(startOfMonth(prevMonthDate), startOfMonth(minDate))
      ) {
        return;
      }
      if (
        disablePast &&
        isBefore(startOfMonth(prevMonthDate), startOfMonth(new Date()))
      ) {
        return;
      }
      setDisplayDate(prevMonthDate);
    }
  };

  const handleNext = () => {
    if (view === "year") {
      const currentYear = displayDate.getFullYear();
      const startYear = Math.floor((currentYear - 1) / 12) * 12 + 1;
      const nextStartYear = startYear + 12;
      const newYear =
        value &&
        value.getFullYear() >= nextStartYear &&
        value.getFullYear() < nextStartYear + 12
          ? value.getFullYear()
          : nextStartYear;
      const newDate = setYear(displayDate, newYear);
      setDisplayDate(newDate);
    } else if (view === "month") {
      const nextYearDate = addMonths(displayDate, 12);
      const newMonth =
        value && value.getFullYear() === nextYearDate.getFullYear()
          ? value.getMonth()
          : 0;
      const newDate = setMonth(nextYearDate, newMonth);
      setDisplayDate(newDate);
    } else {
      const nextMonthDate = addMonths(displayDate, 1);
      if (
        maxDate &&
        isAfter(startOfMonth(nextMonthDate), startOfMonth(maxDate))
      ) {
        return;
      }
      if (
        disableFuture &&
        isAfter(startOfMonth(nextMonthDate), startOfMonth(new Date()))
      ) {
        return;
      }
      setDisplayDate(nextMonthDate);
    }
  };

  const handleHeaderClick = () => {
    if (view === "day") {
      setView("month");
    } else if (view === "month") {
      setView("year");
    }
  };

  const handleYearSelect = (year: number) => {
    const newDate = setYear(displayDate, year);
    const currentYear = new Date().getFullYear();
    if (minDate && year < minDate.getFullYear()) {
      return;
    }
    if (maxDate && year > maxDate.getFullYear()) {
      return;
    }
    if (disablePast && year < currentYear) {
      return;
    }
    if (disableFuture && year > currentYear) {
      return;
    }
    setDisplayDate(newDate);
    setView("month");
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(displayDate, monthIndex);
    if (
      !isDateSelectable(
        startOfMonth(newDate),
        minDate,
        maxDate,
        disableFuture,
        disablePast
      )
    ) {
      return;
    }
    setDisplayDate(newDate);
    setView("day");
  };

  const handleDateSelect = (date: Date) => {
    if (onChange) {
      onChange(date);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    if (
      isDateSelectable(today, minDate, maxDate, disableFuture, disablePast) &&
      onChange
    ) {
      onChange(today);
    }
  };

  const canGoPrev = () => {
    if (view === "year" || view === "month") {
      return true;
    }
    const prevMonthDate = subMonths(displayDate, 1);
    return (
      (!minDate ||
        !isBefore(startOfMonth(prevMonthDate), startOfMonth(minDate))) &&
      (!disablePast ||
        !isBefore(startOfMonth(prevMonthDate), startOfMonth(new Date())))
    );
  };

  const canGoNext = () => {
    if (view === "year" || view === "month") {
      return true;
    }
    const nextMonthDate = addMonths(displayDate, 1);
    return (
      (!maxDate ||
        !isAfter(startOfMonth(nextMonthDate), startOfMonth(maxDate))) &&
      (!disableFuture ||
        !isAfter(startOfMonth(nextMonthDate), startOfMonth(new Date())))
    );
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={!canGoPrev()}
          className={cn(!canGoPrev() && "opacity-50 cursor-not-allowed")}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHeaderClick}
          className="font-medium"
        >
          {getHeaderText()}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={!canGoNext()}
          className={cn(!canGoNext() && "opacity-50 cursor-not-allowed")}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 w-70">
        {view === "year" && (
          <YearGrid
            date={displayDate}
            onSelect={handleYearSelect}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            disablePast={disablePast}
            locale={locale}
          />
        )}
        {view === "month" && (
          <MonthGrid
            date={displayDate}
            onSelect={handleMonthSelect}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            disablePast={disablePast}
            locale={locale}
          />
        )}
        {view === "day" && (
          <DayGrid
            date={displayDate}
            value={value}
            onChange={handleDateSelect}
            holidays={holidays}
            showHolidays={showHolidays}
            minDate={minDate}
            maxDate={maxDate}
            disableFuture={disableFuture}
            disablePast={disablePast}
            showToday={showToday}
            locale={locale}
          />
        )}
      </div>

      {view === "day" && value && !isSameDay(value, new Date()) && (
        <div className="flex justify-center items-center p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTodayClick}
            disabled={
              !isDateSelectable(
                new Date(),
                minDate,
                maxDate,
                disableFuture,
                disablePast
              )
            }
            className={cn(
              "w-full",
              !isDateSelectable(
                new Date(),
                minDate,
                maxDate,
                disableFuture,
                disablePast
              ) && "opacity-50 cursor-not-allowed"
            )}
          >
            {locale.today}
          </Button>
        </div>
      )}
    </div>
  );
}

// DatePicker Component
export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  displayFormat?: string;
  showHolidays?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  showToday?: boolean;
  holidays?: HolidaysData;
  locale?: Partial<DatePickerLocale>;
}

export function DatePicker({
  value,
  onChange,
  displayFormat,
  showHolidays = true,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  showToday = false,
  holidays = {},
  locale: localePartial = {},
}: DatePickerProps) {
  const locale: DatePickerLocale = {
    ...defaultLocale,
    ...localePartial,
  };

  const formatStr = displayFormat || locale.dateFormat;

  const [inputValue, setInputValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setInputValue(format(value, formatStr));
      setIsInvalid(false);
    } else {
      setInputValue("");
    }
  }, [value, formatStr]);

  const extractNumbers = (str: string): string => {
    return str.replace(/\D/g, "");
  };

  const parseDateFromString = (input: string): Date | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    for (const pattern of locale.parsePatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        if (
          year >= 1900 &&
          year <= 2100 &&
          month >= 1 &&
          month <= 12 &&
          day >= 1 &&
          day <= 31
        ) {
          const date = new Date(year, month - 1, day);
          if (
            isValid(date) &&
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          ) {
            return date;
          }
        }
      }
    }

    return null;
  };

  const parseAndFormatDate = (
    input: string
  ): { formatted: string; date: Date | null } => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { formatted: "", date: null };
    }

    const parsedDate = parseDateFromString(trimmed);
    if (parsedDate) {
      return {
        formatted: format(parsedDate, formatStr),
        date: parsedDate,
      };
    }

    const numbers = extractNumbers(trimmed);
    if (numbers.length === 0) {
      return { formatted: "", date: null };
    }

    if (numbers.length === 8) {
      const year = parseInt(numbers.slice(0, 4), 10);
      const month = parseInt(numbers.slice(4, 6), 10);
      const day = parseInt(numbers.slice(6, 8), 10);

      if (
        year >= 1900 &&
        year <= 2100 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        const date = new Date(year, month - 1, day);
        if (
          isValid(date) &&
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          return {
            formatted: format(date, formatStr),
            date,
          };
        }
      }
    }

    if (numbers.length === 7) {
      const year = parseInt(numbers.slice(0, 4), 10);
      const rest = numbers.slice(4);

      if (year < 1900 || year > 2100) {
        return { formatted: numbers, date: null };
      }

      const monthFirstDigit = parseInt(rest[0], 10);
      const dayFirstDigit = parseInt(rest[2], 10);

      if (monthFirstDigit >= 2) {
        const month = monthFirstDigit;
        const day = parseInt(rest[2], 10);
        if (day >= 1 && day <= 9) {
          const date = new Date(year, month - 1, day);
          if (
            isValid(date) &&
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          ) {
            return {
              formatted: format(date, formatStr),
              date,
            };
          }
        }
      } else if (monthFirstDigit === 1) {
        const month = parseInt(rest.slice(0, 2), 10);
        if (month >= 10 && month <= 12) {
          const day = parseInt(rest[2], 10);
          if (day >= 1 && day <= 9) {
            const date = new Date(year, month - 1, day);
            if (
              isValid(date) &&
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            ) {
              return {
                formatted: format(date, formatStr),
                date,
              };
            }
          }
        }
      }

      if (monthFirstDigit >= 2) {
        const month = monthFirstDigit;
        const day = parseInt(rest.slice(1), 10);
        if (day >= 1 && day <= 31) {
          const date = new Date(year, month - 1, day);
          if (
            isValid(date) &&
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          ) {
            return {
              formatted: format(date, formatStr),
              date,
            };
          }
        }
      } else if (monthFirstDigit === 1) {
        if (dayFirstDigit >= 4) {
          const month = 1;
          const day = parseInt(rest.slice(1), 10);
          if (day >= 1 && day <= 31) {
            const date = new Date(year, month - 1, day);
            if (
              isValid(date) &&
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            ) {
              return {
                formatted: format(date, formatStr),
                date,
              };
            }
          }
        } else {
          const month = 1;
          const day = parseInt(rest.slice(1), 10);
          if (day >= 1 && day <= 31) {
            const date = new Date(year, month - 1, day);
            if (
              isValid(date) &&
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            ) {
              return {
                formatted: format(date, formatStr),
                date,
              };
            }
          }
        }
      }
    }

    if (numbers.length === 6) {
      const year = parseInt(numbers.slice(0, 4), 10);
      const month = parseInt(numbers.slice(4, 6), 10);

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12) {
        const date = new Date(year, month - 1, 1);
        if (isValid(date)) {
          return {
            formatted: format(date, formatStr),
            date,
          };
        }
      }
    }

    if (numbers.length === 5) {
      const year = parseInt(numbers.slice(0, 4), 10);
      const firstDigit = parseInt(numbers[4], 10);

      if (year >= 1900 && year <= 2100) {
        if (firstDigit >= 2 && firstDigit <= 9) {
          const month = firstDigit;
          const date = new Date(year, month - 1, 1);
          if (isValid(date)) {
            return {
              formatted: format(date, formatStr),
              date,
            };
          }
        } else if (firstDigit === 1) {
          const date = new Date(year, 0, 1);
          if (isValid(date)) {
            return {
              formatted: format(date, formatStr),
              date,
            };
          }
        }
      }
    }

    return { formatted: numbers, date: null };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsInvalid(false);
  };

  const handleInputBlur = () => {
    if (!inputValue.trim()) {
      setIsInvalid(false);
      return;
    }

    const { formatted, date } = parseAndFormatDate(inputValue);
    if (date) {
      setInputValue(formatted);
      setIsInvalid(false);
      if (onChange) {
        onChange(date);
      }
    } else {
      setIsInvalid(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const { formatted, date } = parseAndFormatDate(inputValue);
      if (date) {
        setInputValue(formatted);
        setIsInvalid(false);
        if (onChange) {
          onChange(date);
        }
      } else {
        setIsInvalid(true);
      }
      e.currentTarget.blur();
    }
  };

  const handleCalendarSelect = (date: Date) => {
    setInputValue(format(date, formatStr));
    setIsInvalid(false);
    if (onChange) {
      onChange(date);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <InputGroup className={cn(isInvalid && "border-destructive")}>
        <InputGroupInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={locale.placeholder}
          aria-invalid={isInvalid}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton type="button" size="icon-xs">
                <CalendarIcon className="w-4 h-4" />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="end">
              <CalendarPopover
                value={value}
                onChange={handleCalendarSelect}
                isOpen={open}
                showHolidays={showHolidays}
                minDate={minDate}
                maxDate={maxDate}
                disableFuture={disableFuture}
                disablePast={disablePast}
                showToday={showToday}
                holidays={holidays}
                locale={locale}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && (
        <p className="mt-1 text-destructive text-sm">
          {locale.errorMessage}
        </p>
      )}
    </div>
  );
}

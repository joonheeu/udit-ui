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

type HolidaysData = {
  [year: string]: {
    [date: string]: string[];
  };
};

// Holiday data (2018-2035)
async function fetchHolidays(): Promise<HolidaysData> {
  return {
    "2018": {
      "2018-01-01": ["1월 1일"],
      "2018-02-15": ["설날 전날"],
      "2018-02-16": ["설날"],
      "2018-02-17": ["설날 다음 날"],
      "2018-03-01": ["3ㆍ1절"],
      "2018-05-05": ["어린이날"],
      "2018-05-07": ["대체공휴일(어린이날)"],
      "2018-05-22": ["부처님 오신 날"],
      "2018-06-06": ["현충일"],
      "2018-06-13": ["전국동시지방선거"],
      "2018-08-15": ["광복절"],
      "2018-09-23": ["추석 전날"],
      "2018-09-24": ["추석"],
      "2018-09-25": ["추석 다음 날"],
      "2018-09-26": ["대체공휴일(추석)"],
      "2018-10-03": ["개천절"],
      "2018-10-09": ["한글날"],
      "2018-12-25": ["기독탄신일"],
    },
    "2019": {
      "2019-01-01": ["1월 1일"],
      "2019-02-04": ["설날 전날"],
      "2019-02-05": ["설날"],
      "2019-02-06": ["설날 다음 날"],
      "2019-03-01": ["3ㆍ1절"],
      "2019-05-05": ["어린이날"],
      "2019-05-06": ["대체공휴일(어린이날)"],
      "2019-05-12": ["부처님 오신 날"],
      "2019-06-06": ["현충일"],
      "2019-08-15": ["광복절"],
      "2019-09-12": ["추석 전날"],
      "2019-09-13": ["추석"],
      "2019-09-14": ["추석 다음 날"],
      "2019-10-03": ["개천절"],
      "2019-10-09": ["한글날"],
      "2019-12-25": ["기독탄신일"],
    },
    "2020": {
      "2020-01-01": ["1월 1일"],
      "2020-01-24": ["설날 전날"],
      "2020-01-25": ["설날"],
      "2020-01-26": ["설날 다음 날"],
      "2020-01-27": ["대체공휴일(설날)"],
      "2020-03-01": ["3ㆍ1절"],
      "2020-04-15": ["제21대 국회의원선거"],
      "2020-04-30": ["부처님 오신 날"],
      "2020-05-05": ["어린이날"],
      "2020-06-06": ["현충일"],
      "2020-08-15": ["광복절"],
      "2020-08-17": ["임시공휴일"],
      "2020-09-30": ["추석 전날"],
      "2020-10-01": ["추석"],
      "2020-10-02": ["추석 다음 날"],
      "2020-10-03": ["개천절"],
      "2020-10-09": ["한글날"],
      "2020-12-25": ["기독탄신일"],
    },
    "2021": {
      "2021-01-01": ["1월 1일"],
      "2021-02-11": ["설날 전날"],
      "2021-02-12": ["설날"],
      "2021-02-13": ["설날 다음 날"],
      "2021-03-01": ["3ㆍ1절"],
      "2021-05-05": ["어린이날"],
      "2021-05-19": ["부처님 오신 날"],
      "2021-06-06": ["현충일"],
      "2021-08-15": ["광복절"],
      "2021-08-16": ["대체공휴일(광복절)"],
      "2021-09-20": ["추석 전날"],
      "2021-09-21": ["추석"],
      "2021-09-22": ["추석 다음 날"],
      "2021-10-03": ["개천절"],
      "2021-10-04": ["대체공휴일(개천절)"],
      "2021-10-09": ["한글날"],
      "2021-10-11": ["대체공휴일(한글날)"],
      "2021-12-25": ["기독탄신일"],
    },
    "2022": {
      "2022-01-01": ["1월 1일"],
      "2022-01-31": ["설날 전날"],
      "2022-02-01": ["설날"],
      "2022-02-02": ["설날 다음 날"],
      "2022-03-01": ["3ㆍ1절"],
      "2022-03-09": ["대통령선거"],
      "2022-05-05": ["어린이날"],
      "2022-05-08": ["부처님 오신 날"],
      "2022-06-01": ["전국동시지방선거"],
      "2022-06-06": ["현충일"],
      "2022-08-15": ["광복절"],
      "2022-09-09": ["추석 전날"],
      "2022-09-10": ["추석"],
      "2022-09-11": ["추석 다음 날"],
      "2022-09-12": ["대체공휴일(추석)"],
      "2022-10-03": ["개천절"],
      "2022-10-09": ["한글날"],
      "2022-10-10": ["대체공휴일(한글날)"],
      "2022-12-25": ["기독탄신일"],
    },
    "2023": {
      "2023-01-01": ["1월 1일"],
      "2023-01-21": ["설날 전날"],
      "2023-01-22": ["설날"],
      "2023-01-23": ["설날 다음 날"],
      "2023-01-24": ["대체공휴일(설날)"],
      "2023-03-01": ["3ㆍ1절"],
      "2023-05-05": ["어린이날"],
      "2023-05-27": ["부처님 오신 날"],
      "2023-05-29": ["대체공휴일(부처님 오신 날)"],
      "2023-06-06": ["현충일"],
      "2023-08-15": ["광복절"],
      "2023-09-28": ["추석 전날"],
      "2023-09-29": ["추석"],
      "2023-09-30": ["추석 다음 날"],
      "2023-10-02": ["임시공휴일"],
      "2023-10-03": ["개천절"],
      "2023-10-09": ["한글날"],
      "2023-12-25": ["기독탄신일"],
    },
    "2024": {
      "2024-01-01": ["1월 1일"],
      "2024-02-09": ["설날 전날"],
      "2024-02-10": ["설날"],
      "2024-02-11": ["설날 다음 날"],
      "2024-02-12": ["대체공휴일(설날)"],
      "2024-03-01": ["3ㆍ1절"],
      "2024-04-10": ["제22대국회의원선거"],
      "2024-05-05": ["어린이날"],
      "2024-05-06": ["대체공휴일(어린이날)"],
      "2024-05-15": ["부처님 오신 날"],
      "2024-06-06": ["현충일"],
      "2024-08-15": ["광복절"],
      "2024-09-16": ["추석 전날"],
      "2024-09-17": ["추석"],
      "2024-09-18": ["추석 다음 날"],
      "2024-10-01": ["임시공휴일"],
      "2024-10-03": ["개천절"],
      "2024-10-09": ["한글날"],
      "2024-12-25": ["기독탄신일"],
    },
    "2025": {
      "2025-01-01": ["1월 1일"],
      "2025-01-27": ["임시공휴일"],
      "2025-01-28": ["설날 전날"],
      "2025-01-29": ["설날"],
      "2025-01-30": ["설날 다음 날"],
      "2025-03-01": ["3ㆍ1절"],
      "2025-03-03": ["대체공휴일(3ㆍ1절)"],
      "2025-05-05": ["어린이날", "부처님 오신 날"],
      "2025-05-06": ["대체공휴일(부처님 오신 날)"],
      "2025-06-03": ["임시공휴일(대통령선거)"],
      "2025-06-06": ["현충일"],
      "2025-08-15": ["광복절"],
      "2025-10-03": ["개천절"],
      "2025-10-05": ["추석 전날"],
      "2025-10-06": ["추석"],
      "2025-10-07": ["추석 다음 날"],
      "2025-10-08": ["대체공휴일(추석)"],
      "2025-10-09": ["한글날"],
      "2025-12-25": ["기독탄신일"],
    },
    "2026": {
      "2026-01-01": ["1월 1일"],
      "2026-02-16": ["설날 전날"],
      "2026-02-17": ["설날"],
      "2026-02-18": ["설날 다음 날"],
      "2026-03-01": ["3ㆍ1절"],
      "2026-03-02": ["대체공휴일(3ㆍ1절)"],
      "2026-05-05": ["어린이날"],
      "2026-05-24": ["부처님 오신 날"],
      "2026-05-25": ["대체공휴일(부처님 오신 날)"],
      "2026-06-03": ["전국동시지방선거"],
      "2026-06-06": ["현충일"],
      "2026-08-15": ["광복절"],
      "2026-08-17": ["대체공휴일(광복절)"],
      "2026-09-24": ["추석 전날"],
      "2026-09-25": ["추석"],
      "2026-09-26": ["추석 다음 날"],
      "2026-10-03": ["개천절"],
      "2026-10-05": ["대체공휴일(개천절)"],
      "2026-10-09": ["한글날"],
      "2026-12-25": ["기독탄신일"],
    },
    "2027": {
      "2027-01-01": ["1월 1일"],
      "2027-02-06": ["설날 전날"],
      "2027-02-07": ["설날"],
      "2027-02-08": ["설날 다음 날"],
      "2027-02-09": ["대체공휴일(설날)"],
      "2027-03-01": ["3ㆍ1절"],
      "2027-05-05": ["어린이날"],
      "2027-05-13": ["부처님 오신 날"],
      "2027-06-06": ["현충일"],
      "2027-08-15": ["광복절"],
      "2027-08-16": ["대체공휴일(광복절)"],
      "2027-09-14": ["추석 전날"],
      "2027-09-15": ["추석"],
      "2027-09-16": ["추석 다음 날"],
      "2027-10-03": ["개천절"],
      "2027-10-04": ["대체공휴일(개천절)"],
      "2027-10-09": ["한글날"],
      "2027-10-11": ["대체공휴일(한글날)"],
      "2027-12-25": ["기독탄신일"],
      "2027-12-27": ["대체공휴일(기독탄신일)"],
    },
    "2028": {},
    "2029": {},
    "2030": {},
    "2031": {},
    "2032": {},
    "2033": {},
    "2034": {},
    "2035": {},
  };
}

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
}: DayGridProps) {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
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
        {weekDays.map((day) => {
          const isSun = day === "일";
          const isSat = day === "토";
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
}

function MonthGrid({
  date,
  onSelect,
  value,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
}: MonthGridProps) {
  return (
    <div className="gap-2 grid grid-cols-4">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month, index) => {
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
            key={month}
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
            {month}월
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
}

function YearGrid({
  date,
  onSelect,
  value,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
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
            {year}년
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
}: CalendarPopoverProps) {
  const [displayDate, setDisplayDate] = useState(value || new Date());
  const [view, setView] = useState<CalendarView>("day");
  const [holidays, setHolidays] = useState<HolidaysData>({});

  useEffect(() => {
    fetchHolidays().then(setHolidays);
  }, []);

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
      return `${years[0]}년 - ${years[years.length - 1]}년`;
    } else if (view === "month") {
      return `${displayDate.getFullYear()}년`;
    } else {
      return format(displayDate, "yyyy년 M월");
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
            오늘
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
}

export function DatePicker({
  value,
  onChange,
  displayFormat = "yyyy년 M월 dd일",
  showHolidays = true,
  minDate = null,
  maxDate = null,
  disableFuture = false,
  disablePast = false,
  showToday = false,
}: DatePickerProps) {
  const [inputValue, setInputValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setInputValue(format(value, displayFormat));
      setIsInvalid(false);
    } else {
      setInputValue("");
    }
  }, [value, displayFormat]);

  const extractNumbers = (str: string): string => {
    return str.replace(/\D/g, "");
  };

  const parseDateFromString = (input: string): Date | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const patterns = [
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/,
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,
      /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})$/,
    ];

    for (const pattern of patterns) {
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

    const formatStr = displayFormat;
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
    setInputValue(format(date, displayFormat));
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
          placeholder="날짜를 입력해주세요"
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
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {isInvalid && (
        <p className="mt-1 text-destructive text-sm">
          올바른 날짜 형식을 입력해주세요 (예: 20240112, 2025-01-01,
          2025년1월1일)
        </p>
      )}
    </div>
  );
}

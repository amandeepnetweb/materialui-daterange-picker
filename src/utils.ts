import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isBefore,
  addDays,
  isSameDay,
  isWithinRange,
  isSameMonth,
  addMonths,
  parse,
  isValid,
  min,
  max,
} from 'date-fns';

// eslint-disable-next-line no-unused-vars
import { DateRange } from './types';

export const identity = <T>(x: T) => x;

export const chunks = <T>(array: ReadonlyArray<T>, size: number): T[][] => (
  Array.from(
    { length: Math.ceil(array.length / size) },
    (_v, i) => array.slice(i * size, i * size + size),
  )
);

export const combine = (...args: any[]): string => args.filter(identity).join(' ');

// Date
export const getDaysInMonth = (date: Date) => {
  const startWeek = startOfWeek(startOfMonth(date));
  const endWeek = endOfWeek(endOfMonth(date));
  const days = [];
  for (let curr = startWeek; isBefore(curr, endWeek);) {
    days.push(curr);
    curr = addDays(curr, 1);
  }
  return days;
};

export const isStartOfRange = ({ startDate }: DateRange, day: Date) => (
  (startDate && isSameDay(day, startDate)) as boolean
);

export const isEndOfRange = ({ endDate }: DateRange, day: Date) => (
  (endDate && isSameDay(day, endDate)) as boolean
);

export const inDateRange = ({ startDate, endDate }: DateRange, day: Date) => (
  startDate
  && endDate
  && (isWithinRange(day, startDate, endDate)
  || isSameDay(day, startDate)
  || isSameDay(day, endDate))
) as boolean;

export const isRangeSameDay = ({ startDate, endDate }: DateRange) => {
  if (startDate && endDate) {
    return isSameDay(startDate, endDate);
  }
  return false;
};

type Falsy = false | null | undefined | 0 | '';

export const parseOptionalDate = (date: Date | string | Falsy, defaultValue: Date) => {
  if (date) {
    const parsed = parse(date);
    if (isValid(parsed)) return parsed;
  }
  return defaultValue;
};

export const getValidatedMonths = (range: DateRange, minDate: Date, maxDate: Date) => {
  const { startDate, endDate } = range;
  if (startDate && endDate) {
    const newStart = max(startDate, minDate);
    const newEnd = min(endDate, maxDate);

    // If dates are in same month, return previous month and current month
    if (isSameMonth(newStart, newEnd)) {
      return [addMonths(newEnd, -1), newEnd];
    }
    return [newStart, newEnd];
  }
  return [startDate, endDate];
};

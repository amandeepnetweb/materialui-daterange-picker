/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */

import * as React from 'react';
import {
  addMonths,
  isSameDay,
  isWithinRange,
  isAfter,
  isBefore,
  isSameMonth,
  addYears,
  max,
  min,
} from 'date-fns';

// eslint-disable-next-line no-unused-vars, object-curly-newline
import { DateRange, NavigationAction, DefinedRange, SameMonth } from '../types';
import { parseOptionalDate } from '../utils';

import { defaultRanges } from '../defaults';

import Menu from './Menu';

type Marker = symbol;

export const MARKERS: { [key: string]: Marker } = {
  FIRST_MONTH: Symbol('firstMonth'),
  SECOND_MONTH: Symbol('secondMonth'),
};

interface DateRangePickerProps {
  open: boolean;
  initialDateRange?: DateRange;
  definedRanges?: DefinedRange[];
  minDate?: Date | string;
  maxDate?: Date | string;
  sameMonth?: SameMonth;
  onChange: (dateRange: DateRange) => void;
}

const DateRangePicker: React.FunctionComponent<DateRangePickerProps> = (
  props: DateRangePickerProps,
) => {
  const today = new Date();

  const {
    open,
    onChange,
    initialDateRange,
    minDate,
    maxDate,
    definedRanges = defaultRanges,
    sameMonth = 'end',
  } = props;

  const minDateValid = parseOptionalDate(minDate, addYears(today, -10));
  const maxDateValid = parseOptionalDate(maxDate, addYears(today, 10));

  const [dateRange, setDateRange] = React.useState<DateRange>({
    ...initialDateRange,
  });
  const [hoverDay, setHoverDay] = React.useState<Date>();

  // Helper function to get months based on sameMonth prop
  const getMonthsForSameMonth = (date: Date): [Date, Date] => {
    if (sameMonth === 'start') {
      return [addMonths(date, -1), date];
    }
    return [date, addMonths(date, 1)];
  };

  // Initialize months based on initialDateRange or defaults
  const [firstMonth, setFirstMonth] = React.useState<Date>(() => {
    if (initialDateRange?.startDate && initialDateRange?.endDate) {
      // If initial dates are in the same month
      if (isSameMonth(initialDateRange.startDate, initialDateRange.endDate)) {
        const [first] = getMonthsForSameMonth(initialDateRange.startDate);
        return first;
      }
      return initialDateRange.startDate;
    }
    // Default behavior based on sameMonth prop
    const [first] = getMonthsForSameMonth(today);
    return first;
  });

  const [secondMonth, setSecondMonth] = React.useState<Date>(() => {
    if (initialDateRange?.startDate && initialDateRange?.endDate) {
      // If initial dates are in the same month
      if (isSameMonth(initialDateRange.startDate, initialDateRange.endDate)) {
        const [, second] = getMonthsForSameMonth(initialDateRange.startDate);
        return second;
      }
      return initialDateRange.endDate;
    }
    // Default behavior based on sameMonth prop
    const [, second] = getMonthsForSameMonth(today);
    return second;
  });

  const { startDate, endDate } = dateRange;

  // handlers
  const setFirstMonthValidated = (date: Date) => {
    if (isBefore(date, secondMonth)) {
      setFirstMonth(date);
    }
  };

  const setSecondMonthValidated = (date: Date) => {
    if (isAfter(date, firstMonth)) {
      setSecondMonth(date);
    }
  };

  const setDateRangeValidated = (range: DateRange) => {
    let { startDate: newStart, endDate: newEnd } = range;

    if (newStart && newEnd) {
      range.startDate = newStart = max(newStart, minDateValid);
      range.endDate = newEnd = min(newEnd, maxDateValid);

      setDateRange(range);
      onChange(range);

      // When dates are in same month, use sameMonth prop to determine which months to show
      if (isSameMonth(newStart, newEnd)) {
        const [first, second] = getMonthsForSameMonth(newStart);
        setFirstMonth(first);
        setSecondMonth(second);
      } else {
        setFirstMonth(newStart);
        setSecondMonth(newEnd);
      }
    } else {
      const emptyRange = {};

      setDateRange(emptyRange);
      onChange(emptyRange);

      // Show months based on sameMonth prop when range is empty
      const [first, second] = getMonthsForSameMonth(today);
      setFirstMonth(first);
      setSecondMonth(second);
    }
  };

  const onDayClick = (day: Date) => {
    if (startDate && !endDate && !isBefore(day, startDate)) {
      const newRange = { startDate, endDate: day };
      onChange(newRange);
      setDateRange(newRange);
      // Only shift months if dates are in same month AND not currently visible properly
      if (isSameMonth(startDate, day)) {
        // Check if both dates are already visible in current view
        const startInFirstMonth = isSameMonth(startDate, firstMonth);
        const startInSecondMonth = isSameMonth(startDate, secondMonth);
        const dayInFirstMonth = isSameMonth(day, firstMonth);
        const dayInSecondMonth = isSameMonth(day, secondMonth);

        // If both dates are already visible in current months, don't shift
        if ((startInFirstMonth || startInSecondMonth) && (dayInFirstMonth || dayInSecondMonth)) {
          // Keep current view - both dates are visible
          return;
        }
        // Otherwise, apply sameMonth behavior
        const [first, second] = getMonthsForSameMonth(day);
        setFirstMonth(first);
        setSecondMonth(second);
      } else {
        setFirstMonth(startDate);
        setSecondMonth(day);
      }
    } else {
      setDateRange({ startDate: day, endDate: undefined });
      // When selecting start date, don't shift months
    }
    setHoverDay(day);
  };

  const onMonthNavigate = (marker: Marker, action: NavigationAction) => {
    if (marker === MARKERS.FIRST_MONTH) {
      const firstNew = addMonths(firstMonth, action);
      if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew);
    } else {
      const secondNew = addMonths(secondMonth, action);
      if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew);
    }
  };

  const onDayHover = (date: Date) => {
    if (startDate && !endDate) {
      if (!hoverDay || !isSameDay(date, hoverDay)) {
        setHoverDay(date);
      }
    }
  };

  // helpers
  const inHoverRange = (day: Date) => (startDate
      && !endDate
      && hoverDay
      && isAfter(hoverDay, startDate)
      && isWithinRange(day, startDate, hoverDay)) as boolean;

  const helpers = {
    inHoverRange,
  };

  const handlers = {
    onDayClick,
    onDayHover,
    onMonthNavigate,
  };

  return open ? (
    <Menu
      dateRange={dateRange}
      minDate={minDateValid}
      maxDate={maxDateValid}
      ranges={definedRanges}
      firstMonth={firstMonth}
      secondMonth={secondMonth}
      setFirstMonth={setFirstMonthValidated}
      setSecondMonth={setSecondMonthValidated}
      setDateRange={setDateRangeValidated}
      helpers={helpers}
      handlers={handlers}
    />
  ) : null;
};

export default DateRangePicker;

import * as React from 'react';
import { DateRange, DefinedRange, CurrentMonth } from '../types';
export interface DateRangePickerWrapperProps {
    open: boolean;
    toggle: () => void;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Date | string;
    maxDate?: Date | string;
    currentMonth?: CurrentMonth;
    onChange: (dateRange: DateRange) => void;
    closeOnClickOutside?: boolean;
    wrapperClassName?: string;
}
declare const DateRangePickerWrapper: React.FunctionComponent<DateRangePickerWrapperProps>;
export default DateRangePickerWrapper;

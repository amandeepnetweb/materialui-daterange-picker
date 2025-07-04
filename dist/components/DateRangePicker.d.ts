import * as React from 'react';
import { DateRange, DefinedRange, CurrentMonth } from '../types';
declare type Marker = symbol;
export declare const MARKERS: {
    [key: string]: Marker;
};
interface DateRangePickerProps {
    open: boolean;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Date | string;
    maxDate?: Date | string;
    currentMonth?: CurrentMonth;
    onChange: (dateRange: DateRange) => void;
}
declare const DateRangePicker: React.FunctionComponent<DateRangePickerProps>;
export default DateRangePicker;

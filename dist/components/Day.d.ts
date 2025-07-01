import * as React from 'react';
interface DayProps {
    filled?: boolean;
    outlined?: boolean;
    highlighted?: boolean;
    disabled?: boolean;
    startOfRange?: boolean;
    endOfRange?: boolean;
    onClick?: () => void;
    onHover?: () => void;
    value: number | string;
}
declare const Day: React.FunctionComponent<DayProps>;
export default Day;

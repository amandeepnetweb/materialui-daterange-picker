import React from 'react';
interface HeaderProps {
    date: Date;
    setDate: (date: Date) => void;
    nextDisabled: boolean;
    prevDisabled: boolean;
    onClickNext: () => void;
    onClickPrevious: () => void;
}
declare const Header: React.FunctionComponent<HeaderProps>;
export default Header;

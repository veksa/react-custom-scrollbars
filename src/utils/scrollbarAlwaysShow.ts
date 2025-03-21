import {getActualScrollbarWidth} from './getScrollbarWidth';

let isScrollbarAlwaysShow: boolean;

export function scrollbarAlwaysShow(rootId?: string) {
    if (isScrollbarAlwaysShow === undefined) {
        isScrollbarAlwaysShow = Boolean(getActualScrollbarWidth(rootId));
    }

    return isScrollbarAlwaysShow;
}

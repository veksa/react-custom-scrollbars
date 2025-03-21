import {getScrollbarWidth} from './getScrollbarWidth';
import {scrollbarAlwaysShow} from './scrollbarAlwaysShow';

export function getMarginBottom(rootId?: string, hasHorizontalScroll: boolean = false) {
    const scrollbarWidth = getScrollbarWidth(rootId);
    if (hasHorizontalScroll) {
        return -scrollbarWidth;
    }
    return scrollbarAlwaysShow(rootId) ? -scrollbarWidth : 0;
}

import css from 'dom-css';

let scrollbarWidth: number | undefined = undefined;
let updateScrollbarWidth: VoidFunction | undefined = undefined;

export const OSX_FAKE_SCROLLBAR_WIDTH = 20;

export function getActualScrollbarWidth(rootId?: string) {
    const root: HTMLElement = rootId
        ? document.getElementById(rootId) ?? document.body
        : document.body;

    if (scrollbarWidth) {
        return scrollbarWidth;
    }

    if (updateScrollbarWidth) {
        updateScrollbarWidth();
        return scrollbarWidth;
    }

    const innerOverflow = document.createElement('div');
    css(innerOverflow, {
        position: 'relative',
        width: 200,
        height: 200,
        margin: 0,
        padding: 0,
        border: 0
    });

    const innerMeasure = document.createElement('div');
    css(innerMeasure, {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        border: 0
    });

    const outer = document.createElement('div');
    css(outer, {
        position: 'absolute',
        overflow: 'auto',
        top: -10000,
        left: -10000,
        width: 100,
        height: 100,
        margin: 0,
        padding: 0,
        border: 0
    });

    root.appendChild(outer);
    outer.appendChild(innerOverflow);
    outer.appendChild(innerMeasure);

    window.addEventListener('resize', function updateScrollbarWidthOnResize() {
        scrollbarWidth = undefined;
    });

    updateScrollbarWidth = () => {
        const bcrInner = innerMeasure.getBoundingClientRect();
        const bcrOuter = outer.getBoundingClientRect();

        const diff = bcrOuter.width - bcrInner.width;
        scrollbarWidth = Math.ceil(diff);
    };

    updateScrollbarWidth();
    return scrollbarWidth;
}

export function fixMacOsContentWidth(rootId?: string, width: number = 0) {
    return getActualScrollbarWidth(rootId)
        ? width
        : width - OSX_FAKE_SCROLLBAR_WIDTH;
}

export function getScrollbarWidth(rootId?: string, hasVerticalScroll = true) {
    return hasVerticalScroll
        ? getActualScrollbarWidth(rootId) || OSX_FAKE_SCROLLBAR_WIDTH
        : 0;
}

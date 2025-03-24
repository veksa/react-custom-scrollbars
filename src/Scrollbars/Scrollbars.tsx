import raf, {cancel as caf} from 'raf';
import css from 'dom-css';
import {cloneElement, Component, createElement, CSSProperties, HTMLProps, ReactElement, ReactNode} from 'react';

import {isString} from '../utils/isString';
import {fixMacOsContentWidth, getScrollbarWidth} from '../utils/getScrollbarWidth';
import {returnFalse} from '../utils/returnFalse';
import {getInnerWidth} from '../utils/getInnerWidth';
import {getInnerHeight} from '../utils/getInnerHeight';
import {scrollbarAlwaysShow} from '../utils/scrollbarAlwaysShow';
import {getMarginBottom} from '../utils/getMarginBottom';

import {
    disableSelectStyle,
    disableSelectStyleReset,
    thumbHorizontalStyleDefault,
    thumbVerticalStyleDefault,
    trackHorizontalStyleDefault,
    trackVerticalStyleDefault,
    viewStyleAutoHeight,
    viewStyleDefault,
    viewStyleUniversalInitial
} from './styles';
import {
    renderLayoutDefault,
    renderThumbHorizontalDefault,
    renderThumbVerticalDefault,
    renderTrackHorizontalDefault,
    renderTrackVerticalDefault,
    renderViewDefault
} from "./defaultRenderElements";

export interface IScrollbarValues {
    top: number;
    left: number;

    clientWidth: number;
    clientHeight: number;

    scrollWidth: number;
    scrollHeight: number;

    scrollTop: number;
    scrollLeft: number;
}

export interface IScrollbarLayout {
    view?: ReactElement;
    trackHorizontal?: ReactElement;
    trackVertical?: ReactElement;
    thumbHorizontal?: ReactElement;
    thumbVertical?: ReactElement;
}

export interface IScrollbarsProps {
    rootId?: string;
    universal?: boolean;

    onScroll?: Function;
    onScrollFrame?: Function;
    onScrollStart?: Function;
    onScrollStop?: Function;
    onUpdate?: Function;
    renderView?: (props: HTMLProps<HTMLDivElement>) => ReactElement<any>;
    renderTrackHorizontal?: (props: HTMLProps<HTMLDivElement>) => ReactElement<any>;
    renderTrackVertical?: (props: HTMLProps<HTMLDivElement>) => ReactElement<any>;
    renderThumbHorizontal?: (props: HTMLProps<HTMLDivElement>) => ReactElement<any>;
    renderThumbVertical?: (props: HTMLProps<HTMLDivElement>) => ReactElement<any>;
    renderLayout?: (layout: IScrollbarLayout, props: IScrollbarsProps) => ReactElement<any> | undefined;
    tagName?: string;
    thumbSize?: number;
    thumbMinSize?: number;
    hideTracksWhenNotNeeded?: boolean;
    hasHorizontalScroll?: boolean;
    hasVerticalScroll?: boolean;
    autoHide?: boolean;
    autoHideTimeout?: number;
    autoHideDuration?: number;
    autoHeight?: boolean;
    autoHeightMin?: number | string;
    autoHeightMax?: number | string;
    smoothScroll?: boolean;

    className?: string;
    style?: object;

    children: ReactNode;
}

export class Scrollbars extends Component<IScrollbarsProps> {
    public state = {
        didMountUniversal: false,
    }

    private isUnmounted: boolean = false;

    private requestFrame: number | undefined;

    private hideTracksTimeout: number | undefined;
    private detectScrollingInterval: number | undefined;

    private dragging: boolean = false;
    private scrolling: boolean = false;

    private trackMouseOver: boolean = false;

    private prevPageX?: number;
    private prevPageY?: number;

    public view: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    private trackHorizontal: HTMLElement | null = null;
    private trackVertical: HTMLElement | null = null;
    private thumbHorizontal: HTMLElement | null = null;
    private thumbVertical: HTMLElement | null = null;

    private lastViewScrollTop?: number;
    private lastViewScrollLeft?: number;
    private viewScrollLeft?: number;
    private viewScrollTop?: number;

    public static defaultProps: Partial<IScrollbarsProps> = {
        renderView: renderViewDefault,
        renderLayout: renderLayoutDefault,
        renderTrackHorizontal: renderTrackHorizontalDefault,
        renderTrackVertical: renderTrackVerticalDefault,
        renderThumbHorizontal: renderThumbHorizontalDefault,
        renderThumbVertical: renderThumbVerticalDefault,
        tagName: 'div',
        thumbMinSize: 30,
        hideTracksWhenNotNeeded: false,
        hasHorizontalScroll: true,
        hasVerticalScroll: true,
        autoHide: false,
        autoHideTimeout: 1000,
        autoHideDuration: 200,
        autoHeight: false,
        autoHeightMin: 0,
        autoHeightMax: 200,
        universal: false,
        smoothScroll: false,
    };

    //         this.handleTrackMouseEnter = this.handleTrackMouseEnter.bind(this);
    //         this.handleTrackMouseLeave = this.handleTrackMouseLeave.bind(this);
    //         this.handleHorizontalTrackMouseDown = this.handleHorizontalTrackMouseDown.bind(this);
    //         this.handleVerticalTrackMouseDown = this.handleVerticalTrackMouseDown.bind(this);
    //         this.handleHorizontalThumbMouseDown = this.handleHorizontalThumbMouseDown.bind(this);
    //         this.handleVerticalThumbMouseDown = this.handleVerticalThumbMouseDown.bind(this);
    //         this.handleWindowResize = this.handleWindowResize.bind(this);
    //         this.handleScroll = this.handleScroll.bind(this);
    //         this.handleDrag = this.handleDrag.bind(this);
    //         this.handleDragEnd = this.handleDragEnd.bind(this);

    public componentDidMount() {
        this.addListeners();
        this.update();
        this.componentDidMountUniversal();
    }

    public componentDidMountUniversal() {
        const {universal} = this.props;
        if (!universal) return;
        this.setState({didMountUniversal: true});
    }

    public componentDidUpdate() {
        this.update();
    }

    public componentWillUnmount() {
        this.isUnmounted = true;
        this.removeListeners();
        if (this.requestFrame) {
            caf(this.requestFrame);
        }
        clearTimeout(this.hideTracksTimeout);
        clearInterval(this.detectScrollingInterval);
    }

    public getScrollLeft = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.scrollLeft;
    };

    public getScrollTop = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.scrollTop;
    }

    public getScrollWidth = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.scrollWidth;
    }

    public getScrollHeight = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.scrollHeight;
    }

    public getClientWidth = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.clientWidth;
    }

    public getClientHeight = () => {
        if (!this.view) {
            return 0;
        }
        return this.view.clientHeight;
    }

    private getValues = () => {
        const {
            scrollLeft = 0,
            scrollTop = 0,
            scrollWidth = 0,
            scrollHeight = 0,
            clientWidth = 0,
            clientHeight = 0
        } = this.view || {};
        const {rootId} = this.props;

        return {
            left: (scrollLeft / (scrollWidth - clientWidth)) || 0,
            top: (scrollTop / (scrollHeight - clientHeight)) || 0,
            scrollLeft,
            scrollTop,
            scrollWidth: fixMacOsContentWidth(rootId, scrollWidth),
            scrollHeight,
            clientWidth: fixMacOsContentWidth(rootId, clientWidth),
            clientHeight
        };
    }

    private getThumbHorizontalWidth = () => {
        const {thumbSize, thumbMinSize} = this.props;

        if (!this.view || !this.trackHorizontal) {
            return 0;
        }

        const trackWidth = getInnerWidth(this.trackHorizontal);
        const width = Math.ceil(this.view.clientWidth / this.view.scrollWidth * trackWidth);
        if (trackWidth === width) {
            return 0;
        }
        if (thumbSize) {
            return thumbSize;
        }
        return Math.max(width, thumbMinSize ?? 0 /* TODO: remove when moving to fc */);
    }

    private getThumbVerticalHeight = () => {
        const {thumbSize, thumbMinSize} = this.props;

        if (!this.view || !this.trackVertical) {
            return 0;
        }

        const trackHeight = getInnerHeight(this.trackVertical);
        const height = Math.ceil(this.view.clientHeight / this.view.scrollHeight * trackHeight);
        if (trackHeight === height) {
            return 0;
        }
        if (thumbSize) {
            return thumbSize;
        }
        return Math.max(height, thumbMinSize ?? 0 /* TODO: remove when moving to fc */);
    }

    private getScrollLeftForOffset = (offset: number) => {
        if (!this.view || !this.trackHorizontal) {
            return 0;
        }

        const trackWidth = getInnerWidth(this.trackHorizontal);
        const thumbWidth = this.getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (this.view.scrollWidth - this.view.clientWidth);
    }

    private getScrollTopForOffset = (offset: number) => {
        if (!this.view || !this.trackVertical) {
            return 0;
        }

        const trackHeight = getInnerHeight(this.trackVertical);
        const thumbHeight = this.getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (this.view.scrollHeight - this.view.clientHeight);
    }

    private doScroll(axis: 'top' | 'left', value: number) {
        const {smoothScroll} = this.props;

        if (smoothScroll && this.view && this.view.scrollTo) {
            this.view.scrollTo({
                [axis]: value,
                behavior: 'smooth'
            });
        } else {
            if (this.view) {
                if (axis === 'top') {
                    this.view.scrollTop = value;
                } else if (axis === 'left') {
                    this.view.scrollLeft = value;
                }
            }
        }
    }

    public scrollLeft = (left = 0) => {
        if (!this.view) return;
        this.doScroll('left', left);
    }

    public scrollTop = (top = 0) => {
        if (!this.view) return;
        this.doScroll('top', top);
    }

    public scrollToLeft = () => {
        if (!this.view) return;
        this.doScroll('left', 0);
    }

    public scrollToTop = () => {
        if (!this.view) return;
        this.doScroll('top', 0);
    }

    public scrollToRight = () => {
        if (!this.view) return;
        this.doScroll('left', this.view.scrollWidth);
    }

    public scrollToBottom = () => {
        if (!this.view) return;
        this.doScroll('top', this.view.scrollHeight);
    }

    private addListeners() {
        /* istanbul ignore if */
        if (typeof document === 'undefined' || !this.view) return;

        const {rootId} = this.props;
        this.view.addEventListener('scroll', this.handleScroll);

        if (!getScrollbarWidth(rootId, true)) {
            return;
        }

        this.trackHorizontal?.addEventListener('mouseenter', this.handleTrackMouseEnter);
        this.trackHorizontal?.addEventListener('mouseleave', this.handleTrackMouseLeave);
        this.trackHorizontal?.addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        this.trackVertical?.addEventListener('mouseenter', this.handleTrackMouseEnter);
        this.trackVertical?.addEventListener('mouseleave', this.handleTrackMouseLeave);
        this.trackVertical?.addEventListener('mousedown', this.handleVerticalTrackMouseDown);
        this.thumbHorizontal?.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        this.thumbVertical?.addEventListener('mousedown', this.handleVerticalThumbMouseDown);

        window.addEventListener('resize', this.handleWindowResize);
    }

    private removeListeners() {
        if (typeof document === 'undefined' || !this.view) {
            return;
        }

        const {rootId} = this.props;
        this.view.removeEventListener('scroll', this.handleScroll);

        if (!getScrollbarWidth(rootId, true)) {
            return;
        }

        this.trackHorizontal?.removeEventListener('mouseenter', this.handleTrackMouseEnter);
        this.trackHorizontal?.removeEventListener('mouseleave', this.handleTrackMouseLeave);
        this.trackHorizontal?.removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        this.trackVertical?.removeEventListener('mouseenter', this.handleTrackMouseEnter);
        this.trackVertical?.removeEventListener('mouseleave', this.handleTrackMouseLeave);
        this.trackVertical?.removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
        this.thumbHorizontal?.removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        this.thumbVertical?.removeEventListener('mousedown', this.handleVerticalThumbMouseDown);

        window.removeEventListener('resize', this.handleWindowResize);

        // Possibly setup by `handleDragStart`
        this.teardownDragging();
    }

    private handleScroll = (event: Event) => {
        const {onScroll, onScrollFrame} = this.props;

        onScroll?.(event);

        this.update(values => {
            const {scrollLeft, scrollTop} = values;
            this.viewScrollLeft = scrollLeft;
            this.viewScrollTop = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        this.detectScrolling();
    }

    private handleScrollStart() {
        const {onScrollStart} = this.props;
        if (onScrollStart) onScrollStart();
        this.handleScrollStartAutoHide();
    }

    private handleScrollStartAutoHide() {
        const {autoHide} = this.props;
        if (!autoHide) return;
        this.showTracks();
    }

    private handleScrollStop() {
        const {onScrollStop} = this.props;
        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    }

    private handleScrollStopAutoHide() {
        const {autoHide} = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    private handleWindowResize = () => {
        this.update();
    }

    private handleHorizontalTrackMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        const {target, clientX} = event;
        const {left: targetLeft} = (target as HTMLElement).getBoundingClientRect();
        const thumbWidth = this.getThumbHorizontalWidth();
        const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
        this.scrollLeft(this.getScrollLeftForOffset(offset));
    }

    private handleVerticalTrackMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        const {target, clientY} = event;
        const {top: targetTop} = (target as HTMLElement).getBoundingClientRect();
        const thumbHeight = this.getThumbVerticalHeight();
        const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
        this.scrollTop(this.getScrollTopForOffset(offset));
    }

    private handleHorizontalThumbMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        this.handleDragStart(event);
        const {target, clientX} = event;
        const {offsetWidth} = (target as HTMLElement);
        const {left} = (target as HTMLElement).getBoundingClientRect();
        this.prevPageX = offsetWidth - (clientX - left);
    }

    private handleVerticalThumbMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        this.handleDragStart(event);
        const {target, clientY} = event;
        const {offsetHeight} = (target as HTMLElement);
        const {top} = (target as HTMLElement).getBoundingClientRect();
        this.prevPageY = offsetHeight - (clientY - top);
    }

    private setupDragging() {
        const {rootId} = this.props;
        const root = rootId
            ? document.getElementById(rootId)
            : document.body;

        if (root) {
            css(root, disableSelectStyle);
        }
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = returnFalse;
    }

    private teardownDragging() {
        const {rootId} = this.props;
        const root = rootId
            ? document.getElementById(rootId)
            : document.body;

        if (root) {
            css(root, disableSelectStyleReset);
        }
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = null;
    }

    private handleDragStart = (event: MouseEvent) => {
        this.dragging = true;
        event.stopImmediatePropagation();
        this.setupDragging();
    }

    private handleDrag = (event: MouseEvent) => {
        if (this.prevPageX) {
            const {clientX} = event;
            if (this.trackHorizontal) {
                const {left: trackLeft} = this.trackHorizontal.getBoundingClientRect();
                const thumbWidth = this.getThumbHorizontalWidth();
                const clickPosition = thumbWidth - this.prevPageX;
                const offset = -trackLeft + clientX - clickPosition;
                // don't apply smooth scroll on drag. scroll by drag is smooth enough by itself
                if (this.view) {
                    this.view.scrollLeft = this.getScrollLeftForOffset(offset);
                }
            }
        }
        if (this.prevPageY) {
            const {clientY} = event;
            if (this.trackVertical) {
                const {top: trackTop} = this.trackVertical.getBoundingClientRect();
                const thumbHeight = this.getThumbVerticalHeight();
                const clickPosition = thumbHeight - this.prevPageY;
                const offset = -trackTop + clientY - clickPosition;
                // don't apply smooth scroll on drag. scroll by drag is smooth enough by itself
                if (this.view) {
                    this.view.scrollTop = this.getScrollTopForOffset(offset);
                }
            }
        }
        return false;
    }

    private handleDragEnd = () => {
        this.dragging = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        this.handleDragEndAutoHide();
    }

    private handleDragEndAutoHide() {
        const {autoHide} = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    private handleTrackMouseEnter = () => {
        this.trackMouseOver = true;
        this.handleTrackMouseEnterAutoHide();
    }

    private handleTrackMouseEnterAutoHide() {
        const {autoHide} = this.props;
        if (!autoHide) return;
        this.showTracks();
    }

    private handleTrackMouseLeave = () => {
        this.trackMouseOver = false;
        this.handleTrackMouseLeaveAutoHide();
    }

    private handleTrackMouseLeaveAutoHide() {
        const {autoHide} = this.props;
        if (!autoHide) return;
        this.hideTracks();
    }

    private showTracks() {
        clearTimeout(this.hideTracksTimeout);
        if (this.trackHorizontal) {
            css(this.trackHorizontal, {opacity: 1});
        }
        if (this.trackVertical) {
            css(this.trackVertical, {opacity: 1});
        }
    }

    private hideTracks() {
        if (this.dragging) return;
        if (this.scrolling) return;
        if (this.trackMouseOver) return;
        const {autoHideTimeout} = this.props;
        clearTimeout(this.hideTracksTimeout);
        this.hideTracksTimeout = setTimeout(() => {
            if (this.trackHorizontal) {
                css(this.trackHorizontal, {opacity: 0});
            }
            if (this.trackVertical) {
                css(this.trackVertical, {opacity: 0});
            }
        }, autoHideTimeout);
    }

    private detectScrolling() {
        if (this.scrolling) return;
        this.scrolling = true;
        this.handleScrollStart();
        this.detectScrollingInterval = setInterval(() => {
            if (this.lastViewScrollLeft === this.viewScrollLeft
                && this.lastViewScrollTop === this.viewScrollTop) {
                clearInterval(this.detectScrollingInterval);
                this.scrolling = false;
                this.handleScrollStop();
            }
            this.lastViewScrollLeft = this.viewScrollLeft;
            this.lastViewScrollTop = this.viewScrollTop;
        }, 100);
    }

    private raf(callback?: VoidFunction) {
        if (this.requestFrame) raf.cancel(this.requestFrame);
        this.requestFrame = raf(() => {
            this.requestFrame = undefined;
            callback?.();
        });
    }

    private update(callback?: (values: IScrollbarValues) => void) {
        this.raf(() => this._update(callback));
    }

    private _update(callback?: (values: IScrollbarValues) => void) {
        if (this.isUnmounted) {
            return;
        }
        const {onUpdate, hideTracksWhenNotNeeded, rootId} = this.props;
        const values = this.getValues();
        if (getScrollbarWidth(rootId, true)) {
            const {scrollLeft, clientWidth, scrollWidth} = values;

            if (this.trackHorizontal && this.thumbHorizontal) {
                const trackHorizontalWidth = getInnerWidth(this.trackHorizontal);
                const thumbHorizontalWidth = this.getThumbHorizontalWidth();
                const thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
                const thumbHorizontalStyle = {
                    width: thumbHorizontalWidth,
                    transform: `translateX(${thumbHorizontalX}px)`
                };

                css(this.thumbHorizontal, thumbHorizontalStyle);

                if (hideTracksWhenNotNeeded) {
                    const trackHorizontalStyle = {
                        visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
                    };
                    css(this.trackHorizontal, trackHorizontalStyle);
                }
            }

            const {scrollTop, clientHeight, scrollHeight} = values;

            if (this.trackVertical && this.thumbVertical) {
                const trackVerticalHeight = getInnerHeight(this.trackVertical);
                const thumbVerticalHeight = this.getThumbVerticalHeight();
                const thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
                const thumbVerticalStyle = {
                    height: thumbVerticalHeight,
                    transform: `translateY(${thumbVerticalY}px)`
                };

                css(this.thumbVertical, thumbVerticalStyle);

                if (hideTracksWhenNotNeeded) {
                    const trackVerticalStyle = {
                        visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
                    };

                    css(this.trackVertical, trackVerticalStyle);
                }
            }
        }
        if (onUpdate) {
            onUpdate(values);
        }
        if (typeof callback !== 'function') {
            return;
        }

        callback(values);
    }

    public render() {
        const {
            renderView,
            renderTrackHorizontal,
            renderTrackVertical,
            renderThumbHorizontal,
            renderThumbVertical,
            renderLayout,
            autoHide,
            autoHideDuration,
            universal,
            autoHeight,
            autoHeightMin,
            autoHeightMax,
            children,
            hasHorizontalScroll,
            hasVerticalScroll,
            rootId
        } = this.props;
        const scrollbarWidth = getScrollbarWidth(rootId, true);
        const scrollbarWidthVertical = getScrollbarWidth(rootId, hasVerticalScroll);

        const {didMountUniversal} = this.state;

        const viewStyle: CSSProperties = {
            ...viewStyleDefault,
            // Hide scrollbars by setting a negative margin
            marginRight: -Math.min(scrollbarWidth, scrollbarWidthVertical),
            marginBottom: getMarginBottom(rootId, hasHorizontalScroll),
            ...(autoHeight && {
                ...viewStyleAutoHeight,
                // Add scrollbarWidth to autoHeight in order to compensate negative margins
                minHeight: autoHeightMin !== undefined
                    ? isString(autoHeightMin)
                        ? `calc(${autoHeightMin} + ${scrollbarWidth}px)`
                        : autoHeightMin + scrollbarWidth
                    : undefined,
                maxHeight: autoHeightMax !== undefined
                    ? isString(autoHeightMax)
                        ? `calc(${autoHeightMax} + ${scrollbarWidth}px)`
                        : autoHeightMax + scrollbarWidth
                    : undefined
            }),
            // Override min/max height for initial universal rendering
            ...((autoHeight && universal && !didMountUniversal) && {
                minHeight: autoHeightMin,
                maxHeight: autoHeightMax
            }),
            // Override
            ...((universal && !didMountUniversal) && viewStyleUniversalInitial)
        };

        const trackAutoHeightStyle = {
            transition: `opacity ${autoHideDuration}ms`,
            opacity: 0
        };

        const trackHorizontalStyle = {
            ...trackHorizontalStyleDefault,
            ...(autoHide && trackAutoHeightStyle),
            ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
                display: 'none'
            })
        };

        const trackVerticalStyle = {
            ...trackVerticalStyleDefault,
            ...(autoHide && trackAutoHeightStyle),
            ...((!scrollbarWidth || (universal && !didMountUniversal)) && {
                display: 'none'
            })
        };

        const view: ReactElement<any> | undefined = renderView
            ? cloneElement(
                renderView({style: viewStyle}),
                {
                    key: 'view',
                    ref: (ref: HTMLElement | null) => {
                        this.view = ref;
                    }
                },
                scrollbarAlwaysShow()
                    ? children
                    : createElement(
                        'div',
                        {
                            style: {
                                float: hasHorizontalScroll ? 'left' : 'none',
                                paddingRight: Math.min(scrollbarWidth, scrollbarWidthVertical),
                                paddingBottom: hasHorizontalScroll ? scrollbarWidth : 0,
                                minWidth: '100%',
                            }
                        },
                        children
                    )
            )
            : undefined;

        const thumbHorizontal: ReactElement<any> | undefined = renderThumbHorizontal
            ? cloneElement(
                renderThumbHorizontal({style: thumbHorizontalStyleDefault}),
                {
                    ref: (ref: HTMLElement | null) => {
                        this.thumbHorizontal = ref;
                    }
                }
            )
            : undefined;

        const trackHorizontal: ReactElement<any> | undefined = renderTrackHorizontal
            ? cloneElement(
                renderTrackHorizontal({style: trackHorizontalStyle}),
                {
                    key: 'trackHorizontal',
                    ref: (ref: HTMLElement | null) => {
                        this.trackHorizontal = ref;
                    }
                }
            )
            : undefined;

        const thumbVertical: ReactElement<any> | undefined = renderThumbVertical
            ? cloneElement(
                renderThumbVertical({style: thumbVerticalStyleDefault}),
                {
                    ref: (ref: HTMLElement | null) => {
                        this.thumbVertical = ref;
                    }
                }
            )
            : undefined;

        const trackVertical: ReactElement<any> | undefined = renderTrackVertical
            ? cloneElement(
                renderTrackVertical({style: trackVerticalStyle}),
                {
                    key: 'trackVertical',
                    ref: (ref: HTMLElement | null) => {
                        this.trackVertical = ref;
                    }
                }
            )
            : undefined;

        const layout = renderLayout
            ? renderLayout({
                view,
                thumbHorizontal,
                thumbVertical,
                trackHorizontal,
                trackVertical
            }, this.props)
            : undefined;

        return layout
            ? cloneElement(layout, {
                ref: (ref: HTMLElement | null) => {
                    this.container = ref;
                }
            })
            : null;
    }
}

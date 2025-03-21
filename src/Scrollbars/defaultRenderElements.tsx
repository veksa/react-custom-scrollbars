import React, {createElement, DetailedHTMLProps, HTMLAttributes, ReactNode} from 'react';
import {containerStyleAutoHeight, containerStyleDefault} from './styles';
import {omit} from '../utils/omit';
import {IScrollbarsProps} from "./Scrollbars";

/* eslint-disable react/prop-types */

export function renderViewDefault(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return <div {...props}/>;
}

export interface ILayoutParams {
    view: ReactNode;
    trackHorizontal: ReactNode;
    trackVertical: ReactNode;
    thumbHorizontal: ReactNode;
    thumbVertical: ReactNode;
}

const omitContainerProps = [
    'onScroll',
    'onScrollFrame',
    'onScrollStart',
    'onScrollStop',
    'onUpdate',
    'renderView',
    'renderViewWrapper',
    'renderTrackHorizontal',
    'renderTrackVertical',
    'renderThumbHorizontal',
    'renderThumbVertical',
    'renderLayout',
    'tagName',
    'hideTracksWhenNotNeeded',
    'autoHide',
    'autoHideTimeout',
    'autoHideDuration',
    'thumbSize',
    'thumbMinSize',
    'universal',
    'autoHeight',
    'autoHeightMin',
    'autoHeightMax',
    'style',
    'children',
];

export function renderLayoutDefault(layout: ILayoutParams, props: IScrollbarsProps) {
    const {view, trackHorizontal, trackVertical, thumbHorizontal, thumbVertical} = layout;
    const {tagName, autoHeight, autoHeightMin, autoHeightMax, style} = props;

    const containerStyle = {
        ...containerStyleDefault,
        ...(autoHeight && {
            ...containerStyleAutoHeight,
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }),
        ...style
    };

    const containerProps = {
        ...omit(props, omitContainerProps),
        style: containerStyle,
    };

    return tagName
        ? createElement(
            tagName,
            containerProps,
            view,
            trackVertical,
            thumbVertical,
            trackHorizontal,
            thumbHorizontal
        )
        : undefined;
}

export function renderTrackHorizontalDefault(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const {style, ...restProps} = props;

    const finalStyle = {
        ...style,
        right: 2,
        bottom: 2,
        left: 2,
        borderRadius: 3
    };
    return <div style={finalStyle} {...restProps} />;
}

export function renderTrackVerticalDefault(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const {style, ...restProps} = props;

    const finalStyle = {
        ...style,
        right: 2,
        bottom: 2,
        top: 2,
        borderRadius: 3
    };
    return <div style={finalStyle} {...restProps} />;
}

export function renderThumbHorizontalDefault(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const {style, ...restProps} = props;

    const finalStyle = {
        ...style,
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    };
    return <div style={finalStyle} {...restProps} />;
}

export function renderThumbVerticalDefault(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const {style, ...restProps} = props;

    const finalStyle = {
        ...style,
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    };
    return <div style={finalStyle} {...restProps} />;
}

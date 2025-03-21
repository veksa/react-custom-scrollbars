import {CSSProperties} from "react";

export const containerStyleDefault: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
};

// Overrides containerStyleDefault properties
export const containerStyleAutoHeight: CSSProperties = {
    height: 'auto'
};

export const viewStyleDefault: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch'
};

// Overrides viewStyleDefault properties
export const viewStyleAutoHeight: CSSProperties = {
    position: 'relative',
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined
};

export const viewStyleUniversalInitial: CSSProperties = {
    overflow: 'hidden',
    marginRight: 0,
    marginBottom: 0,
};

export const trackHorizontalStyleDefault: CSSProperties = {
    position: 'absolute',
    height: 6
};

export const trackVerticalStyleDefault: CSSProperties = {
    position: 'absolute',
    width: 6
};

export const thumbHorizontalStyleDefault: CSSProperties = {
    position: 'relative',
    display: 'block',
    height: '100%'
};

export const thumbVerticalStyleDefault: CSSProperties = {
    position: 'relative',
    display: 'block',
    width: '100%'
};

export const disableSelectStyle = {
    userSelect: 'none'
};

export const disableSelectStyleReset = {
    userSelect: '',
};

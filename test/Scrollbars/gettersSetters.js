import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default function createTests(scrollbarWidth, envScrollbarWidth) {
    let node;
    let root;

    let ref;

    const setRef = nextRef => {
        ref = nextRef;
    };

    beforeEach(() => {
        node = document.createElement('div');
        node.setAttribute('id', 'root');
        document.body.appendChild(node);

        root = createRoot(node);
    });

    afterEach(() => {
        root.unmount();
        document.body.removeChild(node);
    });

    describe('getters', () => {
        describe('getScrollLeft', () => {
            it('should return scrollLeft', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollLeft(50);

                    setTimeout(() => {
                        expect(ref.getScrollLeft()).toEqual(50);

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('getScrollTop', () => {
            it('should return scrollTop', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => {
                        expect(ref.getScrollTop()).toEqual(50);

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('getScrollWidth', () => {
            it('should return scrollWidth', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    expect(ref.getScrollWidth()).toEqual(200);

                    done();
                }, 1000);
            });
        });

        describe('getScrollHeight', () => {
            it('should return scrollHeight', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    expect(ref.getScrollHeight()).toEqual(200);

                    done();
                }, 1000);
            });
        });

        describe('getClientWidth', () => {
            it('should return scrollWidth', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    expect(ref.getClientWidth()).toEqual(100 + (scrollbarWidth - envScrollbarWidth));

                    done();
                }, 1000);
            });
        });

        describe('getClientHeight', () => {
            it('should return scrollHeight', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    expect(ref.getClientHeight()).toEqual(100 + (scrollbarWidth - envScrollbarWidth));

                    done();
                }, 1000);
            });
        });
    });

    describe('setters', () => {
        describe('scrollLeft/scrollToLeft', () => {
            it('should scroll to given left value', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollLeft(50);

                    setTimeout(() => {
                        expect(ref.getScrollLeft()).toEqual(50);

                        ref.scrollToLeft();

                        setTimeout(() => {
                            expect(ref.getScrollLeft()).toEqual(0);

                            ref.scrollLeft(50);

                            setTimeout(() => {
                                ref.scrollLeft();

                                setTimeout(() => {
                                    expect(ref.getScrollLeft()).toEqual(0);

                                    done();
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 1000);
            });
        });

        describe('scrollTop/scrollToTop', () => {
            it('should scroll to given top value', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => {
                        expect(ref.getScrollTop()).toEqual(50);

                        ref.scrollToTop();

                        setTimeout(() => {
                            expect(ref.getScrollTop()).toEqual(0);

                            ref.scrollTop(50);

                            setTimeout(() => {
                                ref.scrollTop();

                                setTimeout(() => {
                                    expect(ref.getScrollTop()).toEqual(0);
                                    done();
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 1000);
            });
        });

        describe('scrollToRight', () => {
            it('should scroll to right', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollToRight();

                    setTimeout(() => {
                        expect(Math.ceil(ref.getScrollLeft())).toEqual(100 + (envScrollbarWidth - scrollbarWidth));

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('scrollToBottom', () => {
            it('should scroll to bottom', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollToBottom();

                    setTimeout(() => {
                        expect(Math.ceil(ref.getScrollTop())).toEqual(100 + (envScrollbarWidth - scrollbarWidth));

                        done();
                    }, 100);
                }, 1000);
            });
        });
    });
}

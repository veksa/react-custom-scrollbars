import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';
import simulant from 'simulant';

export default function createTests(scrollbarWidth) {
    // Not for mobile environment
    if (!scrollbarWidth) return;

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
        ref = undefined;
        root.unmount();
        document.body.removeChild(node);
    });

    describe('autoHide', () => {
        describe('when Scrollbars are rendered', () => {
            it('should hide tracks', done => {
                root.render((
                    <Scrollbars autoHide style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const trackVertical = rootNode.getElementsByTagName('div')[2];
                    const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                    expect(trackVertical.style.opacity).toEqual('0');
                    expect(trackHorizontal.style.opacity).toEqual('0');

                    done();
                }, 1000);
            });
        });

        describe('enter/leave track', () => {
            describe('when entering horizontal track', () => {
                it('should show tracks', done => {
                    root.render((
                        <Scrollbars autoHide style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        simulant.fire(trackHorizontal, 'mouseenter');

                        expect(trackHorizontal.style.opacity).toEqual('1');

                        done();
                    }, 1000);
                });

                it('should not hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={0}
                            ref={setRef}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        simulant.fire(trackHorizontal, 'mouseenter');

                        setTimeout(() => ref.hideTracks(), 10);

                        setTimeout(() => {
                            expect(trackHorizontal.style.opacity).toEqual('1');

                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when leaving horizontal track', () => {
                it('should hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={10}
                            autoHideDuration={10}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        simulant.fire(trackHorizontal, 'mouseenter');
                        simulant.fire(trackHorizontal, 'mouseleave');

                        setTimeout(() => {
                            expect(trackHorizontal.style.opacity).toEqual('0');

                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when entering vertical track', () => {
                it('should show tracks', done => {
                    root.render((
                        <Scrollbars autoHide style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];

                        simulant.fire(trackVertical, 'mouseenter');

                        setTimeout(() => {
                            expect(trackVertical.style.opacity).toEqual('1');

                            done();
                        }, 100);
                    }, 1000);
                });

                it('should not hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={0}
                            ref={setRef}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];

                        simulant.fire(trackVertical, 'mouseenter');

                        setTimeout(() => ref.hideTracks(), 10);

                        setTimeout(() => {
                            expect(trackVertical.style.opacity).toEqual('1');

                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when leaving vertical track', () => {
                it('should hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={10}
                            autoHideDuration={10}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];

                        simulant.fire(trackVertical, 'mouseenter');
                        simulant.fire(trackVertical, 'mouseleave');

                        setTimeout(() => {
                            expect(trackVertical.style.opacity).toEqual('0');

                            done();
                        }, 100);
                    }, 1000);
                });
            });
        });

        describe('when scrolling', () => {
            it('should show tracks', done => {
                root.render((
                    <Scrollbars ref={setRef} autoHide style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackHorizontal.style.opacity).toEqual('1');
                        expect(trackVertical.style.opacity).toEqual('1');

                        done();
                    }, 100);
                }, 1000);
            });

            it('should hide tracks after scrolling', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={10}
                        autoHideDuration={10}
                        ref={setRef}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackHorizontal.style.opacity).toEqual('0');
                        expect(trackVertical.style.opacity).toEqual('0');

                        done();
                    }, 300);
                }, 1000);
            });

            it('should not hide tracks', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={0}
                        ref={setRef}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => ref.hideTracks());

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackHorizontal.style.opacity).toEqual('1');
                        expect(trackVertical.style.opacity).toEqual('1');

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('when dragging x-axis', () => {
            it('should show tracks', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={10}
                        autoHideDuration={10}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];
                        const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                        const { left } = thumbHorizontal.getBoundingClientRect();

                        simulant.fire(thumbHorizontal, 'mousedown', {
                            target: thumbHorizontal,
                            clientX: left + 1
                        });
                        simulant.fire(document, 'mousemove', {
                            clientX: left + 100
                        });

                        setTimeout(() => {
                            expect(trackHorizontal.style.opacity).toEqual('1');
                            done();
                        }, 100);
                    }, 100);
                }, 1000);
            });

            it('should hide tracks on end', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={10}
                        autoHideDuration={10}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];
                        const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                        const { left } = thumbHorizontal.getBoundingClientRect();

                        simulant.fire(thumbHorizontal, 'mousedown', {
                            target: thumbHorizontal,
                            clientX: left + 1
                        });
                        simulant.fire(document, 'mouseup');

                        setTimeout(() => {
                            expect(trackHorizontal.style.opacity).toEqual('0');

                            done();
                        }, 100);
                    }, 100);
                }, 1000);
            });

            describe('and leaving track', () => {
                it('should not hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={10}
                            autoHideDuration={10}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const trackHorizontal = rootNode.getElementsByTagName('div')[4];
                            const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                            const { left } = thumbHorizontal.getBoundingClientRect();

                            simulant.fire(thumbHorizontal, 'mousedown', {
                                target: thumbHorizontal,
                                clientX: left + 1
                            });
                            simulant.fire(document, 'mousemove', {
                                clientX: left + 100
                            });
                            simulant.fire(trackHorizontal, 'mouseleave');

                            setTimeout(() => {
                                expect(trackHorizontal.style.opacity).toEqual('1');

                                done();
                            }, 100);
                        }, 100);
                    }, 1000);
                });
            });
        });

        describe('when dragging y-axis', () => {
            it('should show tracks', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={10}
                        autoHideDuration={10}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const thumbVertical = rootNode.getElementsByTagName('div')[3];

                        const { top } = thumbVertical.getBoundingClientRect();

                        simulant.fire(thumbVertical, 'mousedown', {
                            target: thumbVertical,
                            clientY: top + 1
                        });
                        simulant.fire(document, 'mousemove', {
                            clientY: top + 100
                        });

                        setTimeout(() => {
                            expect(trackVertical.style.opacity).toEqual('1');

                            done();
                        }, 100);
                    }, 100);
                }, 1000);
            });

            it('should hide tracks on end', done => {
                root.render((
                    <Scrollbars
                        autoHide
                        autoHideTimeout={10}
                        autoHideDuration={10}
                        style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const thumbVertical = rootNode.getElementsByTagName('div')[3];

                        const { top } = thumbVertical.getBoundingClientRect();

                        simulant.fire(thumbVertical, 'mousedown', {
                            target: thumbVertical,
                            clientY: top + 1
                        });
                        simulant.fire(document, 'mouseup');

                        setTimeout(() => {
                            expect(trackVertical.style.opacity).toEqual('0');

                            done();
                        }, 100);
                    }, 100);
                }, 1000);
            });

            describe('and leaving track', () => {
                it('should not hide tracks', done => {
                    root.render((
                        <Scrollbars
                            autoHide
                            autoHideTimeout={10}
                            autoHideDuration={10}
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const trackVertical = rootNode.getElementsByTagName('div')[2];
                            const thumbVertical = rootNode.getElementsByTagName('div')[3];

                            const { top } = thumbVertical.getBoundingClientRect();

                            simulant.fire(thumbVertical, 'mousedown', {
                                target: thumbVertical,
                                clientY: top + 1
                            });
                            simulant.fire(document, 'mousemove', {
                                clientY: top + 100
                            });
                            simulant.fire(trackVertical, 'mouseleave');

                            setTimeout(() => {
                                expect(trackVertical.style.opacity).toEqual('1');

                                done();
                            }, 100);
                        }, 100);
                    }, 1000);
                });
            });
        });
    });

    describe('when autoHide is disabed', () => {
        describe('enter/leave track', () => {
            describe('when entering horizontal track', () => {
                it('should not call `showTracks`', done => {
                    root.render((
                        <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const spy = spyOn(ref, 'showTracks');

                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        simulant.fire(trackHorizontal, 'mouseenter');

                        setTimeout(() => {
                            expect(spy.calls.length).toEqual(0);
                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when leaving horizontal track', () => {
                it('should not call `hideTracks`', done => {
                    root.render((
                        <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const spy = spyOn(ref, 'hideTracks');

                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        simulant.fire(trackHorizontal, 'mouseenter');
                        simulant.fire(trackHorizontal, 'mouseleave');

                        setTimeout(() => {
                            expect(spy.calls.length).toEqual(0);
                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when entering vertical track', () => {
                it('should not call `showTracks`', done => {
                    root.render((
                        <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const spy = spyOn(ref, 'showTracks');

                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];

                        simulant.fire(trackVertical, 'mouseenter');

                        setTimeout(() => {
                            expect(spy.calls.length).toEqual(0);
                            done();
                        }, 100);
                    }, 1000);
                });
            });

            describe('when leaving vertical track', () => {
                it('should not call `hideTracks`', done => {
                    root.render((
                        <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const spy = spyOn(ref, 'hideTracks');

                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];

                        simulant.fire(trackVertical, 'mouseenter');
                        simulant.fire(trackVertical, 'mouseleave');

                        setTimeout(() => {
                            expect(spy.calls.length).toEqual(0);
                            done();
                        }, 100);
                    }, 1000);
                });
            });
        });
    });
}

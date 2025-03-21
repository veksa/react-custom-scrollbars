import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default function createTests(scrollbarWidth) {
    describe('rendering', () => {
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

        describe('when Scrollbars are rendered', () => {
            it('takes className', done => {
                root.render((
                    <Scrollbars className="foo">
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];

                    expect(rootNode.className).toEqual('foo');

                    done();
                }, 1000);
            });

            it('takes styles', done => {
                root.render((
                    <Scrollbars style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];

                    expect(rootNode.style.width).toEqual('100px');
                    expect(rootNode.style.height).toEqual('100px');
                    expect(rootNode.style.overflow).toEqual('hidden');

                    done();
                }, 1000);
            });

            it('renders view', done => {
                root.render((
                    <Scrollbars style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollView = rootNode.getElementsByTagName('div')[0];

                    expect(scrollView).toBeA(Node);

                    done();
                }, 1000);
            });

            describe('when using custom tagName', () => {
                it('should use the defined tagName', done => {
                    root.render((
                        <Scrollbars
                            tagName="nav"
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const scrollNode = node.getElementsByTagName('nav')[0];

                        expect(scrollNode.tagName.toLowerCase()).toEqual('nav');

                        done();
                    }, 1000);
                });
            });

            describe('when custom `renderView` is passed', () => {
                it('should render custom element', done => {
                    root.render((
                        <Scrollbars
                            style={{ width: 100, height: 100 }}
                            renderView={({ style, ...props }) => <section style={{ ...style, color: 'red' }} {...props}/>}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('SECTION')[0];

                        expect(scrollView.tagName).toEqual('SECTION');
                        expect(scrollView.style.color).toEqual('red');
                        expect(scrollView.style.position).toEqual('absolute');

                        done();
                    }, 1000);
                });
            });

            describe('when native scrollbars have a width', () => {
                if (!scrollbarWidth) return;

                it('hides native scrollbars', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];

                        const width = `-${scrollbarWidth}px`;
                        expect(scrollView.style.marginRight).toEqual(width);
                        expect(scrollView.style.marginBottom).toEqual(width);

                        done();
                    }, 1000);
                });

                it('renders bars', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackHorizontal).toBeA(Node);
                        expect(trackVertical).toBeA(Node);

                        done();
                    }, 1000);
                });

                it('renders thumbs', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const thumbVertical = rootNode.getElementsByTagName('div')[3];
                        const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                        expect(thumbVertical).toBeA(Node);
                        expect(thumbHorizontal).toBeA(Node);

                        done();
                    }, 1000);
                });

                it('renders thumbs with correct size', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const thumbVertical = rootNode.getElementsByTagName('div')[3];
                        const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                        expect(thumbVertical.style.height).toEqual('48px');
                        expect(thumbHorizontal.style.width).toEqual('48px');

                        done();
                    }, 1000);
                });

                it('the thumbs size should not be less than the given `thumbMinSize`', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 2000, height: 2000 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];

                        const thumbVertical = rootNode.getElementsByTagName('div')[3];
                        const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                        expect(thumbVertical.style.height).toEqual('30px');
                        expect(thumbHorizontal.style.width).toEqual('30px');

                        done();
                    }, 1000);
                });

                describe('when thumbs have a fixed size', () => {
                    it('thumbs should have the given fixed size', done => {
                        root.render((
                            <Scrollbars thumbSize={50} style={{ width: 100, height: 100 }}>
                                <div style={{ width: 2000, height: 2000 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const thumbVertical = rootNode.getElementsByTagName('div')[3];
                            const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                            expect(thumbVertical.style.height).toEqual('50px');
                            expect(thumbHorizontal.style.width).toEqual('50px');

                            done();
                        }, 1000);
                    });
                });

                describe('when custom `renderTrackHorizontal` is passed', () => {
                    it('should render custom element', done => {
                        root.render((
                            <Scrollbars
                                style={{ width: 100, height: 100 }}
                                renderTrackHorizontal={({ style, ...props }) => <section style={{ ...style, height: 10, color: 'red' }} {...props}/>}>
                                <div style={{ width: 200, height: 200 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const trackHorizontal = rootNode.getElementsByTagName('SECTION')[0];

                            expect(trackHorizontal.tagName).toEqual('SECTION');
                            expect(trackHorizontal.style.position).toEqual('absolute');
                            expect(trackHorizontal.style.color).toEqual('red');

                            done();
                        }, 1000);
                    });
                });

                describe('when custom `renderTrackVertical` is passed', () => {
                    it('should render custom element', done => {
                        root.render((
                            <Scrollbars
                                style={{ width: 100, height: 100 }}
                                renderTrackVertical={({ style, ...props }) => <section style={{ ...style, width: 10, color: 'red' }} {...props}/>}>
                                <div style={{ width: 200, height: 200 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const trackVertical = rootNode.getElementsByTagName('SECTION')[0];

                            expect(trackVertical.tagName).toEqual('SECTION');
                            expect(trackVertical.style.position).toEqual('absolute');
                            expect(trackVertical.style.color).toEqual('red');

                            done();
                        }, 1000);
                    });
                });

                describe('when custom `renderThumbHorizontal` is passed', () => {
                    it('should render custom element', done => {
                        root.render((
                            <Scrollbars
                                style={{ width: 100, height: 100 }}
                                renderThumbHorizontal={({ style, ...props }) => <section style={{ ...style, color: 'red' }} {...props}/>}>
                                <div style={{ width: 200, height: 200 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const thumbHorizontal = rootNode.getElementsByTagName('SECTION')[0];

                            expect(thumbHorizontal.tagName).toEqual('SECTION');
                            expect(thumbHorizontal.style.position).toEqual('relative');
                            expect(thumbHorizontal.style.color).toEqual('red');

                            done();
                        }, 1000);
                    });
                });

                describe('when custom `renderThumbVertical` is passed', () => {
                    it('should render custom element', done => {
                        root.render((
                            <Scrollbars
                                style={{ width: 100, height: 100 }}
                                renderThumbVertical={({ style, ...props }) => <section style={{ ...style, color: 'red' }} {...props}/>}>
                                <div style={{ width: 200, height: 200 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const thumbVertical = rootNode.getElementsByTagName('SECTION')[0];

                            expect(thumbVertical.tagName).toEqual('SECTION');
                            expect(thumbVertical.style.position).toEqual('relative');
                            expect(thumbVertical.style.color).toEqual('red');

                            done();
                        }, 1000);
                    });
                });

                it('positions view absolute', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];

                        expect(scrollView.style.position).toEqual('absolute');
                        expect(scrollView.style.top).toEqual('0px');
                        expect(scrollView.style.left).toEqual('0px');

                        done();
                    }, 1000);
                });

                it('should not override the scrollbars width/height values', done => {
                    root.render((
                        <Scrollbars
                            style={{ width: 100, height: 100 }}
                            renderTrackHorizontal={({ style, ...props }) =>
                                <div style={{ ...style, height: 10 }} {...props}/>}
                            renderTrackVertical={({ style, ...props }) =>
                                <div style={{ ...style, width: 10 }} {...props}/>}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackVertical.style.width).toEqual('10px');
                        expect(trackHorizontal.style.height).toEqual('10px');

                        done();
                    }, 1000);
                });

                describe('when view does not overflow container', () => {
                    it('should hide scrollbars', done => {
                        root.render((
                            <Scrollbars
                                style={{ width: 100, height: 100 }}
                                renderTrackHorizontal={({ style, ...props }) =>
                                    <div style={{ ...style, height: 10 }} {...props}/>}
                                renderTrackVertical={({ style, ...props }) =>
                                    <div style={{ ...style, width: 10 }} {...props}/>}>
                                <div style={{ width: 90, height: 90 }}/>
                            </Scrollbars>
                        ));

                        setTimeout(() => {
                            const rootNode = node.getElementsByTagName('div')[0];
                            const thumbVertical = rootNode.getElementsByTagName('div')[3];
                            const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                            expect(thumbHorizontal.style.width).toEqual('0px');
                            expect(thumbVertical.style.height).toEqual('0px');

                            done();
                        }, 1000);
                    });
                });
            });

            describe('when native scrollbars have no width', () => {
                if (scrollbarWidth) return;

                it('hides bars', done => {
                    root.render((
                        <Scrollbars style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackVertical.style.display).toEqual('none');
                        expect(trackHorizontal.style.display).toEqual('none');

                        done();
                    }, 1000);
                });
            });
        });

        describe('when rerendering Scrollbars', () => {
            it('should update scrollbars', done => {
                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const spy = spyOn(ref, 'update').andCallThrough();

                    root.render((
                        <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        expect(spy.calls.length).toEqual(1);
                        spy.restore();
                        done();
                    }, 100);
                }, 1000);
            });
        });
    });
}

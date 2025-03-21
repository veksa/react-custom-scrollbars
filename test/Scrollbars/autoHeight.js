import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';

export default function createTests(scrollbarWidth, envScrollbarWidth) {
    describe('autoHeight', () => {
        let node;
        let root;

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

        describe('when rendered', () => {
            it('should have min-height and max-height', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={100}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollRoot = node.getElementsByTagName('div')[1];
                    const scrollView = rootNode.getElementsByTagName('div')[0];

                    expect(scrollRoot.style.position).toEqual('relative');
                    expect(scrollRoot.style.minHeight).toEqual('0px');
                    expect(scrollRoot.style.maxHeight).toEqual('100px');

                    expect(scrollView.style.position).toEqual('relative');
                    expect(scrollView.style.minHeight).toEqual(`${scrollbarWidth}px`);
                    expect(scrollView.style.maxHeight).toEqual(`${100 + scrollbarWidth}px`);

                    done();
                }, 1000);
            });
        });

        describe('when native scrollbars have a width', () => {
            if (!scrollbarWidth) return;
            it('hides native scrollbars', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMax={100}>
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
        });

        describe('when native scrollbars have no width', () => {
            if (scrollbarWidth) return;
            it('hides bars', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMax={100}>
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

        describe('when content is smaller than maxHeight', () => {
            it('should have the content\'s height', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMax={100}>
                        <div style={{ height: 50 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollView = rootNode.getElementsByTagName('div')[0];
                    const thumbVertical = rootNode.getElementsByTagName('div')[3];

                    expect(node.clientHeight).toEqual(50 + (envScrollbarWidth - scrollbarWidth));
                    expect(scrollView.clientHeight).toEqual(50);
                    expect(scrollView.scrollHeight).toEqual(50);

                    expect(thumbVertical.clientHeight).toEqual(0);

                    done();
                }, 1000);
            });
        });

        describe('when content is larger than maxHeight', () => {
            it('should show scrollbars', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMax={100}>
                        <div style={{ height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollView = rootNode.getElementsByTagName('div')[0];
                    const thumbVertical = rootNode.getElementsByTagName('div')[3];

                    expect(node.clientHeight).toEqual(100);
                    expect(scrollView.clientHeight).toEqual(100 - (envScrollbarWidth - scrollbarWidth));
                    expect(scrollView.scrollHeight).toEqual(200);

                    if (scrollbarWidth) {
                        // 100 / 200 * 96 = 48
                        expect(thumbVertical.clientHeight).toEqual(48);
                    }

                    done();
                }, 1000);
            });
        });

        describe('when minHeight is greater than 0', () => {
            it('should have height greater than 0', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMin={100}
                        autoHeightMax={200}>
                        <div/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollView = rootNode.getElementsByTagName('div')[0];
                    const thumbVertical = rootNode.getElementsByTagName('div')[3];

                    expect(node.clientHeight).toEqual(100);
                    expect(scrollView.clientHeight).toEqual(100 - (envScrollbarWidth - scrollbarWidth));
                    expect(thumbVertical.clientHeight).toEqual(0);

                    done();
                }, 1000);
            });
        });

        describe('when using perecentages', () => {
            it('should use calc', done => {
                class Root extends Component {
                    render() {
                        return (
                            <div style={{ width: 500, height: 500 }}>
                                <Scrollbars
                                    autoHeight
                                    autoHeightMin="50%"
                                    autoHeightMax="100%">
                                    <div style={{ width: 200, height: 200 }}/>
                                </Scrollbars>
                            </div>
                        );
                    }
                }
                root.render((<Root/>));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollNode = rootNode.getElementsByTagName('div')[0];
                    const scrollView = scrollNode.getElementsByTagName('div')[0];

                    expect(scrollNode.clientWidth).toEqual(500);
                    expect(scrollNode.clientHeight).toEqual(250);
                    expect(scrollNode.style.position).toEqual('relative');
                    expect(scrollNode.style.minHeight).toEqual('50%');
                    expect(scrollNode.style.maxHeight).toEqual('100%');

                    expect(scrollView.style.position).toEqual('relative');
                    expect(scrollView.style.minHeight).toEqual(`calc(50% + ${scrollbarWidth}px)`);
                    expect(scrollView.style.maxHeight).toEqual(`calc(100% + ${scrollbarWidth}px)`);

                    done();
                }, 1000);
            });
        });

        describe('when using other units', () => {
            it('should use calc', done => {
                root.render((
                    <Scrollbars
                        autoHeight
                        autoHeightMin="10em"
                        autoHeightMax="100em">
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    const rootNode = node.getElementsByTagName('div')[0];
                    const scrollView = rootNode.getElementsByTagName('div')[0];

                    expect(rootNode.style.position).toEqual('relative');
                    expect(rootNode.style.minHeight).toEqual('10em');
                    expect(rootNode.style.maxHeight).toEqual('100em');
                    expect(scrollView.style.position).toEqual('relative');
                    expect(scrollView.style.minHeight).toEqual(`calc(10em + ${scrollbarWidth}px)`);
                    expect(scrollView.style.maxHeight).toEqual(`calc(100em + ${scrollbarWidth}px)`);

                    done();
                }, 1000);
            });
        });
    });
}

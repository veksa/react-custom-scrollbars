import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default function createTests(scrollbarWidth) {
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

    describe('universal', () => {
        describe('default', () => {
            describe('when rendered', () => {
                it('should hide overflow', done => {
                    class ScrollbarsTest extends Scrollbars {
                        // Override componentDidMount, so we can check, how the markup
                        // looks like on the first rendering
                        componentDidMount() {}
                    }
                    root.render((
                        <ScrollbarsTest universal style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </ScrollbarsTest>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(scrollView.style.position).toEqual('absolute');
                        expect(scrollView.style.overflow).toEqual('hidden');
                        expect(scrollView.style.top).toEqual('0px');
                        expect(scrollView.style.bottom).toEqual('0px');
                        expect(scrollView.style.left).toEqual('0px');
                        expect(scrollView.style.right).toEqual('0px');
                        expect(scrollView.style.marginBottom).toEqual('0px');
                        expect(scrollView.style.marginRight).toEqual('0px');

                        expect(trackVertical.style.display).toEqual('none');
                        expect(trackHorizontal.style.display).toEqual('none');

                        done();
                    }, 1000);
                });
            });

            describe('when componentDidMount', () => {
                it('should rerender', done => {
                    root.render((
                        <Scrollbars universal style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];

                        expect(scrollView.style.overflow).toEqual('scroll');
                        expect(scrollView.style.marginBottom).toEqual(`${-scrollbarWidth}px`);
                        expect(scrollView.style.marginRight).toEqual(`${-scrollbarWidth}px`);

                        done();
                    }, 1000);
                });
            });
        });

        describe('when using autoHeight', () => {
            describe('when rendered', () => {
                it('should hide overflow', done => {
                    class ScrollbarsTest extends Scrollbars {
                        // Override componentDidMount, so we can check, how the markup
                        // looks like on the first rendering
                        componentDidMount() {}
                    }
                    root.render((
                        <ScrollbarsTest universal autoHeight autoHeightMax={100}>
                            <div style={{ width: 200, height: 200 }}/>
                        </ScrollbarsTest>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(scrollView.style.position).toEqual('relative');
                        expect(scrollView.style.overflow).toEqual('hidden');
                        expect(scrollView.style.marginBottom).toEqual('0px');
                        expect(scrollView.style.marginRight).toEqual('0px');
                        expect(scrollView.style.minHeight).toEqual('0px');
                        expect(scrollView.style.maxHeight).toEqual('100px');

                        expect(trackVertical.style.display).toEqual('none');
                        expect(trackHorizontal.style.display).toEqual('none');

                        done();
                    }, 1000);
                });
            });

            describe('when componentDidMount', () => {
                it('should rerender', done => {
                    root.render((
                        <Scrollbars universal autoHeight autoHeightMax={100}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const scrollView = rootNode.getElementsByTagName('div')[0];

                        expect(scrollView.style.overflow).toEqual('scroll');
                        expect(scrollView.style.marginBottom).toEqual(`${-scrollbarWidth}px`);
                        expect(scrollView.style.marginRight).toEqual(`${-scrollbarWidth}px`);
                        expect(scrollView.style.minHeight).toEqual(`${scrollbarWidth}px`);
                        expect(scrollView.style.maxHeight).toEqual(`${100 + scrollbarWidth}px`);

                        done();
                    }, 1000);
                });
            });
        });
    });
}

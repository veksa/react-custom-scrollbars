import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';
import simulant from 'simulant';

export default function createTests(scrollbarWidth) {
    // Not for mobile environment
    if (!scrollbarWidth) return;

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

    describe('when dragging horizontal thumb', () => {
        it('should scroll to the respective position', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const scrollView = rootNode.getElementsByTagName('div')[0];
                const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                const { left } = thumbHorizontal.getBoundingClientRect();

                simulant.fire(thumbHorizontal, 'mousedown', {
                    target: thumbHorizontal,
                    clientX: left + 1
                });
                simulant.fire(document, 'mousemove', {
                    clientX: left + 100
                });
                simulant.fire(document, 'mouseup');

                expect(Math.ceil(scrollView.scrollLeft)).toEqual(100);

                done();
            }, 1000);
        });

        it('should disable selection', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const thumbHorizontal = rootNode.getElementsByTagName('div')[5];

                const { left } = thumbHorizontal.getBoundingClientRect();

                simulant.fire(thumbHorizontal, 'mousedown', {
                    target: thumbHorizontal,
                    clientX: left + 1
                });

                expect(document.body.style.webkitUserSelect).toEqual('none');

                simulant.fire(document, 'mouseup');

                expect(document.body.style.webkitUserSelect).toEqual('');

                done();
            }, 1000);
        });
    });

    describe('when dragging vertical thumb', () => {
        it('should scroll to the respective position', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const scrollView = rootNode.getElementsByTagName('div')[0];
                const thumbVertical = rootNode.getElementsByTagName('div')[3];

                const { top } = thumbVertical.getBoundingClientRect();

                simulant.fire(thumbVertical, 'mousedown', {
                    target: thumbVertical,
                    clientY: top + 1
                });
                simulant.fire(document, 'mousemove', {
                    clientY: top + 100
                });
                simulant.fire(document, 'mouseup');

                expect(Math.ceil(scrollView.scrollTop)).toEqual(100);

                done();
            }, 1000);
        });

        it('should disable selection', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const thumbVertical = rootNode.getElementsByTagName('div')[3];

                const { top } = thumbVertical.getBoundingClientRect();

                simulant.fire(thumbVertical, 'mousedown', {
                    target: thumbVertical,
                    clientY: top + 1
                });

                expect(document.body.style.webkitUserSelect).toEqual('none');

                simulant.fire(document, 'mouseup');

                expect(document.body.style.webkitUserSelect).toEqual('');

                done();
            }, 1000);
        });
    });
}

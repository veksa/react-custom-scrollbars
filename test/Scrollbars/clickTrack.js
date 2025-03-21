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

    describe('when clicking on horizontal track', () => {
        it('should scroll to the respective position', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const scrollView = rootNode.getElementsByTagName('div')[0];
                const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                const { left, width } = trackHorizontal.getBoundingClientRect();

                simulant.fire(trackHorizontal, 'mousedown', {
                    target: trackHorizontal,
                    clientX: left + (width / 2)
                });

                expect(scrollView.scrollLeft).toEqual(50);

                done();
            }, 1000);
        });
    });

    describe('when clicking on vertical track', () => {
        it('should scroll to the respective position', done => {
            root.render((
                <Scrollbars style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ), node, function callback() {
                setTimeout(() => {
                    const { view, trackVertical: bar } = this;
                    const { top, height } = bar.getBoundingClientRect();
                    simulant.fire(bar, 'mousedown', {
                        target: bar,
                        clientY: top + (height / 2)
                    });
                    expect(view.scrollTop).toEqual(50);
                    done();
                }, 100);
            });

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const scrollView = rootNode.getElementsByTagName('div')[0];
                const trackVertical = rootNode.getElementsByTagName('div')[2];

                const { top, height } = trackVertical.getBoundingClientRect();

                simulant.fire(trackVertical, 'mousedown', {
                    target: trackVertical,
                    clientY: top + (height / 2)
                });

                expect(scrollView.scrollTop).toEqual(50);

                done();
            }, 1000);
        });
    });
}

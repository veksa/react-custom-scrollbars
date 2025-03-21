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
        root.unmount();
        document.body.removeChild(node);
    });

    describe('when resizing window', () => {
        it('should update scrollbars', done => {
            root.render((
                <Scrollbars ref={setRef} style={{ width: 100, height: 100 }}>
                    <div style={{ width: 200, height: 200 }}/>
                </Scrollbars>
            ));

            setTimeout(() => {
                const spy = spyOn(ref, 'update');

                simulant.fire(window, 'resize');
                expect(spy.calls.length).toEqual(1);

                done();
            }, 1000);
        });
    });
}

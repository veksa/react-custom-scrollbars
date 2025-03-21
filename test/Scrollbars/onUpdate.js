import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default function createTests() {
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

    describe('onUpdate', () => {
        describe('when scrolling x-axis', () => {
            it('should call `onUpdate`', done => {
                const spy = createSpy();

                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }} onUpdate={spy}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollLeft(50);

                    setTimeout(() => {
                        expect(spy.calls.length).toEqual(2);

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('when scrolling y-axis', () => {
            it('should call `onUpdate`', done => {
                const spy = createSpy();

                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }} onUpdate={spy}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    ref.scrollTop(50);

                    setTimeout(() => {
                        expect(spy.calls.length).toEqual(2);

                        done();
                    }, 100);
                }, 1000);
            });
        });

        describe('when resizing window', () => {
            it('should call onUpdate', done => {
                const spy = createSpy();

                root.render((
                    <Scrollbars ref={setRef} style={{ width: 100, height: 100 }} onUpdate={spy}>
                        <div style={{ width: 200, height: 200 }}/>
                    </Scrollbars>
                ));

                setTimeout(() => {
                    setTimeout(() => {
                        expect(spy.calls.length).toEqual(1);

                        done();
                    }, 100);
                }, 1000);
            });
        });
    });
}

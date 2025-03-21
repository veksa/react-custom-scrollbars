import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React from 'react';

export default function createTests(scrollbarWidth) {
    describe('hide tracks', () => {
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

        describe('when native scrollbars have a width', () => {
            if (!scrollbarWidth) return;
            describe('when content is greater than wrapper', () => {
                it('should show tracks', done => {
                    root.render((
                        <Scrollbars
                            hideTracksWhenNotNeeded
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 200, height: 200 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackVertical.style.visibility).toEqual('visible');
                        expect(trackHorizontal.style.visibility).toEqual('visible');

                        done();
                    }, 1000);
                });
            });

            describe('when content is smaller than wrapper', () => {
                it('should hide tracks', done => {
                    root.render((
                        <Scrollbars
                            hideTracksWhenNotNeeded
                            style={{ width: 100, height: 100 }}>
                            <div style={{ width: 50, height: 50 }}/>
                        </Scrollbars>
                    ));

                    setTimeout(() => {
                        const rootNode = node.getElementsByTagName('div')[0];
                        const trackVertical = rootNode.getElementsByTagName('div')[2];
                        const trackHorizontal = rootNode.getElementsByTagName('div')[4];

                        expect(trackVertical.style.visibility).toEqual('hidden');
                        expect(trackHorizontal.style.visibility).toEqual('hidden');

                        done();
                    }, 1000);
                });
            });
        });
    });
}

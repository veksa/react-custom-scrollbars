import { Scrollbars } from 'react-custom-scrollbars';
import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';

export default function createTests() {
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

    describe('when scrollbars are in flexbox environment', () => {
        it('should still work', done => {
            class Root extends Component {
                render() {
                    return (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}>
                            <Scrollbars ref={(ref) => { this.scrollbars = ref; }}>
                                <div style={{ width: 10000, height: 10000 }}/>
                            </Scrollbars>
                        </div>
                    );
                }
            }
            root.render(<Root/>);

            setTimeout(() => {
                const rootNode = node.getElementsByTagName('div')[0];
                const scrollNode = rootNode.getElementsByTagName('div')[0];
                const scrollView = rootNode.getElementsByTagName('div')[0];

                expect(scrollNode.clientHeight).toBeGreaterThan(0);
                expect(scrollView.clientHeight).toBeGreaterThan(0);

                done();
            }, 1000);
        });
    });
}

import React, { useEffect, useState } from 'react';
import parser                         from 'spw-lang/bin/parser';
import Ether                          from 'spw-lang/lang/registry/ether/ether';
import { basicallyEvaluate }          from 'spw-lang/lang/evaluation/basic';
import SpwNote                        from '../packages/notes/SpwNote';
import { Stage }                      from '../packages/staging';
import useToggle                      from '../packages/toggle/hooks/useToggle';
import ColorContextProvider           from '../packages/staging/color/context/context';

export type TreeInputProps = {
    content: string;
    onSave: Function;
    onChange: Function;
};

interface TreeProps {
    events?: {};
    input: TreeInputProps
}


export default function SpwTree(props: TreeProps) {
    const { input }                      = props;
    const { content }                    = input;
    // display
    const displayState                   = useToggle(false);
    const { open }                       = displayState;
    const { displayMode = 'both' }       = props || {};
    const isEditorMode                   = displayMode === 'editor';
    const [resolved, setEtherResolution] = useState();
    const [evaluated, setEvaluated]      = useState();
    const [error, setError]              = useState();
    const [ether, setEther]              = useState();

    const doParse = true;

    useEffect(
        () => {
            if (!doParse) return () => {};

            let cancelled = false;

            const t = setTimeout(
                () => {
                    if (cancelled) return;
                    try {
                        const _ether: Ether = parser.parse(content);
                        const _resolution   = _ether.resolve();
                        window.ether        = _ether;
                        setEther(_ether);
                        setEtherResolution(_resolution);
                        basicallyEvaluate(_resolution)
                            .then(setEvaluated);

                        console.log('ok');
                    } catch (_error) {
                        console.error(_error);
                        setError(_error);
                    }
                },
                1000
            );
            return () => {
                cancelled = true;
                clearTimeout(t);
            };
        },
        [content]
    );

    useEffect(
        () => {
            if (!doParse) return () => {};

            const reparse = b => JSON.parse(JSON.stringify(b || {}));

            const timeout =
                      setTimeout(
                          () => {
                              console.log({
                                  ether,
                                  resolved,
                                  evaluated
                              });

                              console.log(reparse(resolved));
                              console.log(reparse(evaluated));
                          },
                          1000
                      );
            return () => {
                clearTimeout(timeout);
            };
        },
        [resolved, evaluated]
    );

    return (
        <ColorContextProvider colorKey="concept-tree">
            <div className={`spw-tree d-flex ${!open ? 'flex-column' : 'flex-row'}`}>
                {
                    isEditorMode || displayMode === 'both'
                        ? (
                            <SpwNote
                                fullScreen={isEditorMode}
                                content={content}
                                onChange={input.onChange}
                                onSave={input.onSave}
                            />
                        )
                        : null
                }
                <Stage key="stage">
                    {
                        error
                            ? (
                                <div style={{ color: '#8e1b29' }}>
                                    {JSON.stringify(error.message)}
                                </div>
                            )
                            : <div>check the console</div>
                    }
                </Stage>
            </div>
        </ColorContextProvider>
    );
}

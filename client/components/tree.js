import React, { useEffect, useState } from 'react';
import SpwNote                        from '../packages/notes/SpwNote';
import { Stage }                      from '../packages/staging';
import useToggle                      from '../packages/toggle/hooks/useToggle';
import ColorContextProvider           from '../packages/staging/color/context/context';
import parser                         from 'spw-lang/bin/parser';
import Ether                          from 'spw-lang/lang/registry/ether/ether';

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
    const { input }                = props;
    const { content }              = input;
    // display
    const displayState             = useToggle(false);
    const { open }                 = displayState;
    const { displayMode = 'both' } = props || {};
    const isEditorMode             = displayMode === 'editor';
    const [parsed, setParsed]      = useState();

    useEffect(
        () => {
            try {
                const result: Ether = parser.parse(content);
                console.log(result);
                setParsed(result.resolve());
            } catch (e) {
                console.error(e);
            }
        },
        [content]
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
                    <pre>{JSON.stringify(parsed, 0, 3)}</pre>

                </Stage>
            </div>
        </ColorContextProvider>
    );
}

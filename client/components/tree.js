import React, { useCallback, useEffect, useState } from 'react';
import * as parser                                 from 'spw-lang/bin/parser';
import SpwNote                                     from '../packages/notes/SpwNote';
import { Stage }                                   from '../packages/staging';
import useToggle                                   from '../packages/toggle/hooks/useToggle';
import ConceptManager
                                                   from './concept/components/containers/ConceptManager';
import ColorContextProvider                        from '../packages/staging/color/context/context';


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
    const { events }                          = props || {};
    const { input, autoParse }                = props;
    const { content }                         = input;
    // display
    const displayState                        = useToggle(false);
    const { open }                            = displayState;
    const [parsed, setParsed]                 = useState();
    const [symbolResolver, setSymbolResolver] = useState();
    const [renderKey, setRenderKey]           = useState(0);
    const onSymbolRegistryKeyChange           = useCallback(() => setRenderKey(renderKey + 1), [renderKey]);

    useEffect(
        () => {
            parsed && parsed.onKeyChange && parsed.onKeyChange(onSymbolRegistryKeyChange);
            return () => {
                console.log('should remove anchor change event listener');
            };
        },
        [parsed]
    );

    const parse = useCallback(
        () => {
            const registry = parser.parse(content);
            setParsed(registry);
        },
        [content]
    );

    useEffect(
        () => {
            if (autoParse) parse();
        },
        [autoParse, content]
    );

    const { displayMode = 'both' } = props || {};
    const isEditorMode             = displayMode === 'editor';
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
                {displayMode === 'tree' || displayMode === 'both' ? (
                    [
                        !autoParse ? <button key="button" onClick={parse}>Parse</button> : null,
                        <Stage key="stage">
                            <ConceptManager
                                registry={parsed || null}
                                resolver={() => {}}
                                events={events}
                                id={parsed?.key}
                            />
                        </Stage>
                    ]
                ) : null}
            </div>
        </ColorContextProvider>
    );
}

import React                from 'react';
// import * as parser                    from '../../lib/spw-lang/bin/parser';
import SpwNote              from '../packages/notes/SpwNote';
import useToggle            from '../packages/toggle/hooks/useToggle';
import ColorContextProvider from '../packages/staging/color/context/context';

const parser = { parse: () => {} };
console.log(parser);
const { parse } = parser;

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
    return (
        <ColorContextProvider colorKey="concept-tree">
            <div className={`spw-tree d-flex ${!open ? 'flex-column' : 'flex-row'}`}>
                <SpwNote
                    fullScreen
                    content={content}
                    onChange={input.onChange}
                    onSave={input.onSave}
                />
            </div>
        </ColorContextProvider>
    );
}

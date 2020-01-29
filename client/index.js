import React, { useEffect, useState }     from 'react';
import io                                 from 'socket.io-client/dist/socket.io';
import ReactDOM                           from 'react-dom';
import type { TreeInputProps }            from './components/tree';
import SpwTree                            from './components/tree';
import { useLocalStorage, useThump }      from './util/hooks/hooks';
import { useReadContent, useSaveContent } from './packages/storage/hooks/useSaveHook';

type TreeInputModeOptions = 'props' | 'local-storage' | 'api' | 'local-db';
type ConnectedTreeProps =
    TreeInputProps
    | (
    {
        inputMode?: TreeInputModeOptions,
        displayMode?: 'both' | 'editor' | 'tree'
    }
    & (
    {
        label?: string
    }
    )
    );

function useInputFromProps(props: ConnectedTreeProps) {
    const { content, onChange, onSave } = props;
    return {
        content,
        onChange,
        onSave
    };
}

function useInputFromSocket(props: ConnectedTreeProps) {
    const [content, setContent] = useState('');
    const { label = 'test' }    = props;

    const onSave   = undefined;
    const onChange = () => {};
    useEffect(
        () => {
            fetch('http://localhost:3050/api/concept/example')
                .then(
                    r => r
                        .json()
                        .then(({ label }) => setContent(label))
                );
        },
        [label]
    );
    useEffect(
        () => {
            const socket = io('http://localhost:3050');
            socket
                .on(
                    'content-changed',
                    data => {
                        if (data.label !== content) setContent(data.label);
                    }
                );
        },
        []
    );

    return {
        content,
        onChange,
        onSave
    };
}

function useInputFromLocalStorage(props: ConnectedTreeProps) {
    const { label = 'test' } = props;
    const [input, onChange]  = useLocalStorage(label, '');
    return {
        content: input,
        onChange
    };
}

function useInputFromLocalDB(props: ConnectedTreeProps) {
    const { label = 'test' } = props;
    const beat               = useThump(15000);

    const fetched                             = useReadContent(label, label);
    const [fetchedContent, setFetchedContent] = useState();
    const [content, setContent]               = useState(fetchedContent);
    useEffect(
        () => { if (!fetchedContent) setFetchedContent(fetched); },
        [fetchedContent, label]
    );
    useEffect(
        () => { if (fetchedContent && !content) setContent(fetchedContent); },
        [fetchedContent, content]
    );


    useSaveContent(label, content, [beat, content], { active: !!content });

    return {
        content,
        onChange: setContent,
        onSave:   undefined
    };
}

function useInput(mode: TreeInputModeOptions, props) {
    let input = {
        onChange: undefined,
        content:  undefined,
        onSave:   undefined,
    };

    switch (mode) {
        case 'props':
            input = useInputFromProps(props);
            break;
        case 'api':
            input = useInputFromSocket(props);
            break;
        case 'local-storage':
            input = useInputFromLocalStorage(props);
            break;
        case 'local-db':
            input = useInputFromLocalDB(props);
            break;
        default:
            break;
    }
    return input;
}

function ConnectedSpwTree(props: ConnectedTreeProps = {}) {
    const { inputMode = 'local-storage' } = props;
    const { displayMode = 'editor' }      = props || {};
    const { parseMode = 'manual' }        = props || {};
    const input                           = useInput(inputMode, props);
    return (
        <SpwTree
            input={input}
            displayMode={displayMode}
            autoParse={parseMode === 'auto'}
        />
    );
}

export default ConnectedSpwTree;
const App =
          () => {
              const queryString = window.location.search;
              const urlParams   = new URLSearchParams(queryString);


              const inputMode   = urlParams.get('input')
                                  || ['local-storage', 'local-db', 'api'][0];
              const displayMode = urlParams.get('display')
                                  || ['editor', 'tree', 'both'][0];
              const parseMode   = urlParams.get('parse')
                                  || ['manual', 'auto'][0];
              const conceptName = urlParams.get('label')
                                  || ['test', 'other'][0];

              return (
                  <ConnectedSpwTree
                      label={conceptName}
                      inputMode={inputMode}
                      parseMode={parseMode}
                      displayMode={displayMode}
                  />
              );
          };
ReactDOM.render(
    <App />,
    document.getElementById('spw-root')
);

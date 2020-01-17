import React, { useCallback, useRef, useState } from 'react';
import MonacoEditor, { monaco } from '@monaco-editor/react';
import type { editor as MonacoNS } from 'monaco-editor';
import getLanguageInitializer from './language/spw/spw';
import { initVimMode } from 'monaco-vim';

interface NoteProps {
    fullScreen?: boolean,
    content: string,
    onSave: Function,
    onChange: Function,
}

type EditorProps = {
    fullScreen?: boolean,
    content: string,
    onChange: Function,
    onSave: Function
};


function Editor({ content, onChange, fullScreen = false }: EditorProps) {
    const [theme, setTheme]                            = useState('vs');
    const editorRef: { current: MonacoNS.ICodeEditor } = useRef();
    const statusBarRef                                 = useRef();
    const getEditorValue                               = () => editorRef.current.getValue();
    const handleContentUpdate                          = () => onChange(getEditorValue());
    const listenToEditorChanges                        = () => editorRef.current.onDidChangeModelContent(handleContentUpdate);
    const setCurrentEditor                             = editor => (editorRef.current = editor);
    const handleEditorDidMount                         = (p, editor: MonacoNS.ICodeEditor) => {
        setCurrentEditor(editor);
        listenToEditorChanges();
        monaco
            .init()
            .then(getLanguageInitializer)
            .then(({ theme }) => setTheme(theme));
        initVimMode(editor, statusBarRef.current);
    };

    const width    = '1000px';
    const fontSize = 17;
    const height   =
              Math
                  .min(
                      Math
                          .max(
                              ((content || '').split('\n').length || 0) + 2,
                              7
                          ) * (fontSize + 7),
                      500
                  );
    return (
        <div className="d-block w-100">
            <div className="editor-wrapper">
                <MonacoEditor
                    theme={theme}
                    language="spw"
                    value={content}
                    height={fullScreen ? '90vh' : height}
                    width={fullScreen ? '100%' : width}
                    options={
                        {
                            fontSize,
                            fontFamily:            'Fira Code, monospace',
                            fontLigatures:         true,
                            quickSuggestionsDelay: 300,
                            showFoldingControls:   'always',
                            minimap:               { enabled: false },
                            scrollBeyondLastLine:  false,
                        }
                    }
                    defaultValue={content}
                    editorDidMount={handleEditorDidMount}
                />
                <div className="status-bar" ref={statusBarRef} />
            </div>
        </div>
    );
}


export default function SpwNote(props: NoteProps) {
    const { content, onChange, onSave } = props;
    const [buffer, setBuffer]           = useState(content);
    const plain                         = !true;
    const save                          = useCallback(() => onSave(content), [content]);
    const handleSave                    = plain ? () => onChange(buffer) : (e => (e.preventDefault() || save()));
    return (
        <div tabIndex={0} className="note ">
            <div className="content-wrapper d-flex flex-column" onKeyUp={event => event.stopPropagation()}>
                <div className="button-container d-flex">
                    {onSave || plain ? <button type="button" onClick={handleSave}>Save</button> : null}
                </div>
                {
                    plain
                    ? <textarea key="input" onChange={e => setBuffer(e.target.value)} value={buffer || content} />
                    : <Editor fullScreen={props.fullScreen} content={content} onChange={onChange} onSave={save} />
                }
            </div>
        </div>
    );
}

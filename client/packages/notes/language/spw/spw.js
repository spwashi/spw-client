import { Monaco }             from '@monaco-editor/react';
import { attributes, tokens } from 'spw-lang/monaco/tokens';

const tokenizer =
          {
              ...tokens,
          };

export default function getLanguageInitializer(monaco: Monaco) {
    const LANGUAGE_NAME = 'spw';
    const THEME_NAME    = `${LANGUAGE_NAME}-theme`;
    monaco.languages.register({ id: LANGUAGE_NAME });
    monaco.languages.setMonarchTokensProvider(
        LANGUAGE_NAME,
        {
            ...attributes,
            tokenizer
        }
    );
    monaco
        .editor
        .defineTheme(THEME_NAME, {
            base:  'vs-dark',
            // inherit: true,
            rules: [
                { token: 'delimiter.bracket', foreground: '#7f7f40' },
                { token: 'delimiter.angle', foreground: '#c2c29b' },
                { token: 'delimiter.curly', foreground: '#6f91aa' },
                { token: 'delimiter.comment', foreground: '#cccccc' },
                { token: 'comment', foreground: '#a0a0a0' },
                { token: 'stop', foreground: '#ffffff' },
                { token: 'analog', foreground: '#ffffff' },
                { token: 'register', foreground: '#ffffff' },
                { token: 'concept', foreground: '#4ec7c3' },
                { token: 'arrow', foreground: '#f05599' },
                { token: 'essentialization', foreground: '#119966' },
                { token: 'perspective', foreground: '#ffdc4e' },
                { token: 'performance', foreground: '#00f3ff' },
                { token: 'evaluation', foreground: '#8280bd' },
                { token: 'invocation', foreground: '#d3775e' },
                { token: 'string', foreground: '#aa2f29' },
            ]
        });
    return {
        theme: THEME_NAME
    };
}

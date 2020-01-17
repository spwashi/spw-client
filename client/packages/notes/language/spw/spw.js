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
                { token: 'delimiter.bracket', foreground: '7f7f40' },
                { token: 'delimiter.curly', foreground: 'eeeeee' },
                { token: 'stop', foreground: 'ffffff' },
                { token: 'concept', foreground: '65a2a6' },
                { token: 'arrow', foreground: 'f05599' },
                { token: 'essentialization', foreground: '119966' },
                { token: 'string', foreground: 'aa2f29' },
            ]
        });
    return {
        theme: THEME_NAME
    };
}

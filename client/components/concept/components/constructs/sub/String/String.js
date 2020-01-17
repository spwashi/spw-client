import React                from 'react';
import { StringConstruct }  from 'spw-lang/lang/constructs/sub/string/def';
import useLatest            from '../../../../../../util/hooks/useLatest';
import { RendererRegistry } from '../../../../../../util/rendererRegistry';
import DelimitedConstruct   from '../../DelimitedConstruct';
import ConceptAnchor        from '../Anchor';

type StringConcept = { anchor: StringConstruct };

interface StrParams {
    concept: StringConcept;
}

export const strConceptRegistry = new RendererRegistry();

strConceptRegistry.register(
    (() => true),
    (params: StrParams) => (
        <ConceptAnchor
            concept={params.concept}
            contextualization={false}
        />
    )
);

export default function StrConcept(props: StrParams): * | null {
    const { concept } = props;
    const string      = strConceptRegistry.render({ concept });
    const anchor      = `${concept}`;
    const components  = useLatest(
        () => ({
            open:  <span key="quote-start">"</span>,
            body:  string,
            close: <span key="quote-end">"</span>
        }),
        [anchor]
    );
    return <DelimitedConstruct name="spw-string" construct={concept} components={components} data={concept} />;
}

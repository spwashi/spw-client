import React                                      from 'react';
import { Construct }                              from 'spw-lang/lang/constructs/def/construct/construct';
import type { IConcept }                          from 'spw-lang/lang/constructs/def/types/types';
import ColorContextProvider, { useColor }         from '../../../../../packages/staging/color/context/context';
import { ConceptWidget, usePrimeConceptCallback } from '../../../context/Provider';

type ContextProps = { context: IConcept };

export function ConceptContextAnchor(props: ContextProps): React.Children | null {
    const { context, Anchor } = props;
    if (!context || !context.anchor) return null;
    return (
        <div className="spw-concept-context">
            <ConceptWidget key="anchor" concept={context} />
            <div key="period" className="stage period">.</div>
        </div>
    );
}

type ConceptAnchorProps = {
    concept: Construct,
    display?: 'label' | 'full',
    children?: any
};

function AnchorBody(
    { concept }: { concept: IConcept }
) {
    if (Construct.isConstruct(concept.anchor)) {
        return <ConceptWidget concept={concept.anchor} />;
    }

    const toStr                        = `${concept?.label}`;
    let { body }: { body: string | * } = concept || {};

    body = body || concept.label;
    return (
        <span className="spw-label" data-spw={toStr} style={{ color: useColor(`${body}`)?.color?.hex() }}>
            {`${body}`}
        </span>
    );
}

export default function ConceptAnchor(props: ConceptAnchorProps) {
    const { concept, children, display } = props;
    const handleConceptClick             = usePrimeConceptCallback(concept);
    if (!concept) return children || null;
    // todo watch out for recursion, bud...
    const isAnchor = `${concept?.label}` === '&_';

    if (isAnchor === '&_') {
        return <ConceptAnchor concept={concept?.crystallize('&_')} />;
    }
    return (
        <ColorContextProvider colorKey={concept.label} inherit>
            <div className="concept-anchor-wrapper">
                <ConceptContextAnchor context={concept?.context} key={concept?.context?.anchor} />
                <div
                    className="spw-concept-anchor"
                    onClick={handleConceptClick}
                    key={concept?.anchor}
                >
                    {
                        children || (
                            <AnchorBody
                                concept={concept}
                                display={display}
                                key={concept?.anchor}
                            />
                        )
                    }
                </div>
            </div>
        </ColorContextProvider>
    );
}

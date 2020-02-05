import React, { useState }                       from 'react';
import type { ISymmetricallyDelimitedConstruct } from 'spw-lang/lang/constructs/def/token/types/delimited-construct';
import type { IConcept }                         from 'spw-lang/lang/constructs/def/types/types';
import SpaceNode                                 from '../../../../../packages/staging/space/components/SpaceNode';
import useToggle                                 from '../../../../../packages/toggle/hooks/useToggle';
import randomString                              from '../../../../../util/random';
import Body                                      from './components/Body';
import ConceptToken                          from './components/Token';
import TriConstructStyle                         from './Styled';
import useLatest                                 from '../../../../../util/hooks/useLatest';
import { usePrimeConceptCallback }               from '../../../context/Provider';
import { useSensitiveParentSpace }               from '../../../../../packages/staging/space/components/SpaceNode/hooks/useSpaceContext';

interface DelimitedConstructProps {
    components: {
        body: Array<IConcept>;
        open: React.ReactNode;
        close: React.ReactNode;
    };
    bodyDisplay?: 'flex' | 'block' | 'inline' | 'inline-block';
    construct: ISymmetricallyDelimitedConstruct;
    name: string;
}

export default function DelimitedConstruct(props: DelimitedConstructProps) {
    const { components, bodyDisplay } = props; // Components
    const { name }                    = props; // identity
    const { construct }               = props; // mainly for debugging

    const [id]                      = useState(props.id || `${name || 'tri-construct'}--${construct?.key || randomString()}`);
    const { open, setOpen, toggle } = useToggle(true, { cacheKey: `${construct}` });
    const spaceElProps              = useLatest(() => ({
        id,
        className: `${name}-construct`
    }), [id, name]);
    const conceptClickHandler       = usePrimeConceptCallback(construct);
    useSensitiveParentSpace([open])
    if (!construct) return null;

    return (
        <SpaceNode Component={TriConstructStyle} elProps={spaceElProps} position="center" sentinel={false}>
            <ConceptToken
                key="open"
                body={components?.open}
                handleInteraction={conceptClickHandler}
                data={construct.opener}
                position="open"
            />

            <Body
                key="body"
                display={bodyDisplay}
                colorKey={components.label || components.body}
                body={components?.body}
                className={`${name}-body-wrapper`}
                toggler={{ setOpen, open, toggle }}
                data={construct.body}
            />

            <ConceptToken
                key="close"
                body={components?.close}
                handleInteraction={toggle}
                data={construct.closer}
                position="close"
            />
        </SpaceNode>
    );
}

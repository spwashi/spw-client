import type { IConcept }                                                       from 'spw-lang/lang/constructs/def/types/types';
import React, { useContext }                                                   from 'react';
import type { ConceptDisplayContextValue }                                     from '../../../context/Provider';
import { ConceptDisplayContext, ConceptDisplayContextProvider, ConceptWidget } from '../../../context/Provider';
import ConceptDisplayFactory                                                   from '../../../Factory';
import SpaceNode
                                                                               from '../../../../../packages/staging/space/components/SpaceNode';

interface ConceptListItemProps {
    concept: IConcept
}

export function ConceptListItem(props: ConceptListItemProps) {
    const { concept } = props;

    const parentContext = useContext(ConceptDisplayContext) || {};

    const
        { ConceptDisplayFactory: Factory = ConceptDisplayFactory }: ConceptDisplayContextValue =
            parentContext;

    return (
        <li className="spw-concept-list-item">
            <SpaceNode position="item" sentinel={false}>
                <ConceptDisplayContextProvider Factory={Factory}>
                    <ConceptWidget concept={concept} key={concept?.anchor} />
                </ConceptDisplayContextProvider>
            </SpaceNode>
        </li>
    );
}

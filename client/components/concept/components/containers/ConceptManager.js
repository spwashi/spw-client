import React                   from 'react';
import { ConceptList }         from './concept-list/ConceptList';
import { ParserErrorBoundary } from '../../../error';
import { SymbolRegistry }      from 'spw-lang/lang/registry/symbolRegistry';
import { SymbolResolver }      from 'spw-lang/lang/registry/symbolResolver';


function getConceptList(display: 'root' | 'all-roots', { root, concepts = new Map, roots = [] }) {
    switch (display) {
        case 'root':
            return root ? [root] : [];
        case 'all-roots':
            return Object.values(
                roots.reduce((all, c) => ({ ...all, [`${c}`]: c }), {})
            );
        default:
            return Object.values(
                []
                    .concat(...[...concepts.values()])
                    .reduce((all, c) => ({ ...all, [`${c}`]: c }), {})
            );
    }
}

export default function ConceptManager(props: { registry: SymbolRegistry, resolver: SymbolResolver, id: string }) {
    const { registry,resolver, id } = props;
    if (!registry) return null;
    const { concepts = new Map(), roots, root, } = registry;
    window.spw_concepts                          = concepts;
    window.spw_roots                             = roots;
    const cList                                  = getConceptList('all-roots', { roots, concepts, root });
    return (
        <ParserErrorBoundary>
            <ConceptList registry={registry} resolver={resolver} key={registry.key} id={id} />
        </ParserErrorBoundary>
    );
}

import React, { useCallback, useContext, useRef, useState }                                                 from 'react';
import { SymbolRegistry }                                                                                   from 'spw-lang/lang/registry/symbolRegistry';
import { ConceptDisplayContextProvider, ConceptInteractionContextProvider, ConceptInteractionStateContext } from '../../../context/Provider';
import BoonFactory                                                                                          from '../../factories/boon';
import UserRegistryFactory                                                                                  from '../../factories/registry';
import { SymbolResolver }                                                                                   from 'spw-lang/lang/registry/symbolResolver';
import { ConceptListItem }                                                                                  from './Item';
import { Construct }                                                                                        from 'spw-lang/lang/constructs/def/construct/construct';


interface ConceptListProps {
    registry: SymbolRegistry,
    concepts: Array
}


function ClickedConceptList(props: { registry: SymbolRegistry, resolver: SymbolResolver }) {
    const { registry, resolver }    = props;
    const { prime = [] }            = useContext(ConceptInteractionStateContext) || {};
    const [renderKey, setRenderKey] = useState(0);

    const { current: ids } = useRef({});
    const getKey           = concept => {
        const id = `${concept?.id || concept}`;
        ids[id]  = ids[id] ? 1 + ids[id] : 1;
        return `${id} -- ${ids[id]}`;
    };

    const conceptMap = registry.concepts;

    const handleConceptClick =
              useCallback(
                  ({ concept }) => {
                      const occurrences =
                                {
                                    anchor: new Set([...conceptMap.get(`${concept}`) || []]),
                                    label:  new Set([...conceptMap.get(concept?.label) || []])
                                };

                      const resolved = resolver.resolve(concept?.label);
                      resolved
                          .then(() => {
                              console.group();
                              console.log('Generation:', concept.generation);
                              console.log('Anchor:', concept.fullAnchor);
                              console.log('Anchor:', concept.anchor);
                              console.log('Label:', concept.label);
                              console.log('Concept:', concept);
                              console.log('Crystallized Concept:', concept.crystallize());
                              console.log('Occurrences (by anchor):', conceptMap.get(`${concept}`));
                              console.log('Occurrences (by label):', conceptMap.get(concept.label));

                              console.log('resolved:', { x: resolved, y: concept?.label, registry });
                              console.groupEnd();
                              setRenderKey(renderKey + 1);
                          });
                  },
                  [conceptMap, prime]
              );
    return (
        <ConceptInteractionContextProvider
            registry={registry}
            resolver={resolver}
            onConceptClick={handleConceptClick}
            key={renderKey}
        >
            <ConceptDisplayContextProvider Factory={UserRegistryFactory || BoonFactory}>
                <ul className="spw-concept-list border">
                    {
                        [...new Set([...prime].reverse())]
                            .map(
                                (props: { concept: Construct }) => {
                                    const { concept } = props;
                                    const key         = getKey(concept) + concept?.anchor;
                                    return (
                                        <div className="d-flex">
                                            <div className="anchor full" style={{ color: 'darkred' }}>{concept?.fullAnchor}</div>
                                            <ConceptListItem concept={concept} key={key} />
                                        </div>
                                    );
                                }
                            )
                    }
                </ul>
            </ConceptDisplayContextProvider>
        </ConceptInteractionContextProvider>
    );
}

export function ConceptList(props: ConceptListProps) {
    const { registry, resolver, id } = props || {};
    const wrapperStyle               = {
        minWidth:    500,
        marginLeft:  'auto',
        marginRight: 'auto',
        overflow:    'auto',
        resize:      'vertical'
    };
    const conceptList                = Object.values(
        registry
            .roots
            .reduce(
                (all, c) => ({
                    ...all,
                    [`${c}`]: c
                }),
                {}
            )
    );
    return (
        <ConceptInteractionContextProvider registry={registry} resolver={resolver} key={id}>
            <div style={wrapperStyle}>
                <ul className="spw-concept-list">
                    {
                        [...conceptList]
                            .map(
                                concept => (
                                    <ConceptListItem
                                        concept={concept}
                                        key={`${concept.id}`}
                                    />
                                )
                            )
                    }
                </ul>
            </div>
            <div style={wrapperStyle}>
                <ClickedConceptList registry={registry} resolver={resolver} />
            </div>
        </ConceptInteractionContextProvider>
    );
}

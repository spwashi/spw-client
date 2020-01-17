import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import type { IConceptDisplayFactory }                                     from '../components/def/types/factory';
import { Delimiter }                                                       from 'spw-lang/lang/constructs/def/delimiter/delimiter';
import { SymbolRegistry }                                                  from 'spw-lang/lang/registry/symbolRegistry';
import { SymbolResolver }                                                  from 'spw-lang/lang/registry/symbolResolver';
import { Construct }                                                       from 'spw-lang/lang/constructs/def/construct/construct';

export const ConceptInteractionStateContext    = React.createContext();
export const ConceptInteractionDispatchContext = React.createContext();

const spwConceptReducer = (state, action) => {
    switch (action?.type) {
        case 'prime-concept':
            if (state?.prime?.find(({ concept }) => concept === action?.payload?.concept)) return state;
            return {
                ...state,
                prime: [action.payload, ...state.prime || []],
            };
        case 'flush-prime':
            return {
                ...state,
                prime: []
            };
    }
    return state;
};

export function ConceptInteractionContextProvider(
    { children, registry, resolver, onConceptClick }: {
        children: any,
        registry: SymbolRegistry,
        resolver: SymbolResolver
    }
) {
    const concepts = registry.concepts;

    const [state, dispatch] = useReducer(
        spwConceptReducer,
        {
            concepts,
            resolver,
            prime: []
        }
    );
    const { prime }         = state;
    useEffect(
        () => {
            const clicked = state.prime;
            if (clicked[0] && onConceptClick) onConceptClick(clicked[0]);
        },
        [prime]
    );
    const onClick = () => dispatch({ type: 'flush-prime' });
    return (
        <ConceptInteractionStateContext.Provider value={state}>
            <ConceptInteractionDispatchContext.Provider value={dispatch}>
                {!!prime?.length && <button onClick={onClick}>Flush</button>}
                {children}
            </ConceptInteractionDispatchContext.Provider>
        </ConceptInteractionStateContext.Provider>
    );
}

export type ConceptDisplayContextValue = { ConceptDisplayFactory: IConceptDisplayFactory, contextualization: string };
export const ConceptDisplayContext: ConceptDisplayContextValue = React.createContext();

export function usePrimeConceptCallback(concept: Construct): Function {
    const dispatch = useContext(ConceptInteractionDispatchContext);
    return useCallback(
        () => {
            // no one cares about delimiters
            if (Delimiter.isDelimiter(concept?.context)) return;
            dispatch({ type: 'prime-concept', payload: { concept } });
        },
        [concept]
    );
}

export function ConceptDisplayContextProvider({ children, Factory, contextualization = 'recursive' } = {}) {
    const [context, setContext] =
              useState(
                  {
                      ConceptDisplayFactory: Factory,
                      FallbackFactory:       () => null,
                      contextualization
                  }
              );
    const parentContext         = useContext(ConceptDisplayContext);
    useEffect(
        () => {
            setContext(
                {
                    ...context,
                    FallbackFactory: parentContext?.Factory
                }
            );
        },
        [parentContext?.Factory]
    );

    return (
        <ConceptDisplayContext.Provider value={context}>
            {children}
        </ConceptDisplayContext.Provider>
    );
}

export function ConceptWidget({ concept }) {
    const context = useContext(ConceptDisplayContext);
    if (!context) return 'oops no context';
    const { ConceptDisplayFactory: Factory, contextualization = 'recursive' }: { ConceptDisplayFactory: IConceptDisplayFactory } = context;
    return <Factory concept={concept} contextualization={contextualization} key={concept?.anchor} />;
}

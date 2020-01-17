import React, { useCallback, useEffect, useState } from 'react';
import queryString                                 from 'query-string';
import { Construct }                               from 'spw-lang/lang/constructs/def/construct/construct';
import type { IConcept }                           from 'spw-lang/lang/constructs/def/types/types';
import ConnectedSpwTree                            from '../../index';

interface ConceptProps {
    concept: { label: string, content: string } | IConcept
}

function resolveNoteContent(concept) {
    if (!concept) return '';
    if (concept.label && !Construct.isConstruct(concept)) return concept.anchor || '';
    return `${concept}`;
}

export function useConceptSavingCallback(label, anchor) {
    return useCallback(
        () => {
            fetch(
                `/api/concept/save?${queryString.stringify({ label: label || '&_ccpt' })}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    method:  'post',
                    body:    JSON.stringify({ anchor })
                }
            )
                .then(r => r.json())
                .then(console.log);
        },
        [label, anchor]
    );
}

export function useConceptResolvingCallback(whenFound) {
    return useCallback(
        label => {
            console.log('FETCHING CONCEPT', label);
            return fetch(
                `/api/concept/prime?${queryString.stringify({ label: label || '&_ccpt' })}`,
            )
                .then(r => r.json())
                .then(({ concept } = {}) => {
                    concept && whenFound(concept);
                });
        },
        [whenFound]
    );
}

export default function ConceptNote(props: ConceptProps) {
    const [description, setDescription]           = useState();
    const resolveConcept                          = useConceptResolvingCallback(setDescription);
    const [anchor, setNoteContent]                = useState(resolveNoteContent(description));
    const label                                   = props?.concept?.label || props?.label;
    const [attemptedResolve, setAttemptedResolve] = useState(false);
    const [conceptIdentity, setConceptIdentity]   = useState(description);
    const saveConcept                             = useConceptSavingCallback(label, anchor);
    const [fetchKey, setFetchKey]                 = useState(0);

    useEffect(
        () => {
            setAttemptedResolve(fetchKey);
            if (fetchKey !== attemptedResolve) resolveConcept(label);
        },
        [fetchKey]
    );

    useEffect(
        () => {
            if (conceptIdentity !== description) {
                setNoteContent(resolveNoteContent(description));
                setConceptIdentity(description);
            }
        },
        [description, conceptIdentity]
    );
    const onChange  = text => setNoteContent(text);
    const urlParams = new URLSearchParams(window.location.search);
    const mode      = urlParams.get('mode') || 'tree';
    const autoParse = typeof urlParams.get('auto') === 'string';

    useEffect(
        () => {
            const resetDocument =
                      () => {
                          if (mode !== 'tree') return;
                          console.log('RESET');
                          setFetchKey(Math.random());
                          setAttemptedResolve(null);
                      };
            window.addEventListener('focus', resetDocument);
            return () => window.removeEventListener('focus', resetDocument);
        },
        []
    );

    return (
        <div className="concept-note-wrapper">
            <div className="d-flex flex-column">
                <div className="">
                    <ConnectedSpwTree
                        displayMode={mode || 'tree'}
                        parseMode={autoParse ? 'auto' : 'manual'}
                        inputMode="props"
                        content={anchor}
                        onChange={onChange}
                        onSave={saveConcept}
                    />
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState }                              from 'react';
import { ConceptConstruct }                                        from 'spw-lang/lang/constructs/sub/concept/def';
import { Essence }                                                 from 'spw-lang/lang/constructs/sub/essence/def';
import type { IConcept }                                           from 'spw-lang/lang/constructs/def/types/types';
import { registerInstantiationScheme, resolveInstantiatedConcept } from './registry';
import { ConceptWidget }                                           from '../../../../context/Provider';
import objToSpw                                                    from 'spw-lang/util/objToSpw';
import { useSensitiveParentSpace }                                 from '../../../../../../packages/staging/space/components/SpaceNode/hooks/useSpaceContext';

[
    {
        testLabel:
            label => label === '{url',
        render:
            (p: { concept: InstanceConstruct } = {}) => {
                const { concept = {} } = p;
                let target             = '_blank';
                if (concept?.opener?.concept?.essence?.body?.find(concept => concept?.label === 'same-tab')) {
                    target = '_self';
                }
                return (
                    <a href={`${resolveInstantiatedConcept(concept)?.label}`} target={target}>[ go ]</a>
                );
            }
    },
    {
        testLabel:
            label => label === '{example',
        testConcept:
            ({ label }: ConceptConstruct = {}) => /abc-[a-z]{3,4}-\d+/i.test(`${label}`),
        testScheme:
            (essence: Essence) => true,
        render:
            ({ concept = {} }: { concept: IConcept } = {}) => (
                <a href={`https://example.com/${resolveInstantiatedConcept(concept)?.label}`}>example.com</a>
            )
    },
    {
        testLabel:
            label => label === '{git',
        testScheme:
            (essence: Essence) => {
                if (!essence) return false;
                let found = false;
                for (const concept of essence.body) {
                    if (`${concept?.label}` === '&_c') found = true;
                }
                return found;
            },
        render:
            ({ concept = {} }: { concept: IConcept } = {}) => {
                const [state, setState] = useState();
                const [body, setBody]   = useState();

                useEffect(
                    () => {
                        if (state) return () => {};
                        setState('fetching');
                        let canceled = false;
                        fetch('https://httpbin.org/get')
                            .then(r => r.json())
                            .then(b => {
                                setState('done');
                                setBody(objToSpw(b));
                                return !canceled && [];
                            });
                        return () => {
                            canceled = true;
                        };
                    }
                );
                useEffect(
                    () => {
                        if (state !== 'fetching') return;
                    },
                    [state]
                );
                useSensitiveParentSpace([body]);
                return !state ? '...' : (state === 'fetching' ? 'fetching' : <ConceptWidget concept={body} />);
            }
    },
].forEach(registerInstantiationScheme);

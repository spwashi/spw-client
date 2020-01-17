import React                                           from 'react';
import { InvocationConstruct }                         from 'spw-lang/lang/constructs/sub/invocation/def';
import { registerInvocationScheme, resolveInvocation } from './registry';
import { ConceptWidget }                               from '../../../../context/Provider';

[
    {
        testLabel: label => `${label}` === '~context',
        render:    (p: { concept: InvocationConstruct } = {}) => {
            const { concept = {} } = p;
            const resolved         = resolveInvocation(concept);
            return <ConceptWidget concept={resolved.source} />;
        }
    },
    {
        testLabel: label => `${label}` === '~related',
        render:    (p: { concept: InvocationConstruct } = {}) => {
            const { concept = {} } = p;
            const resolved         = resolveInvocation(concept);
            console.log(resolved);
            return <ConceptWidget concept={resolved.source} />;
        }
    }
].forEach(registerInvocationScheme);

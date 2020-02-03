import React                                                  from 'react';
import ConceptDisplayFactory                                  from '../../Factory';
import type { IConcept }                                      from 'spw-lang/lang/constructs/def/types/types';
import ConceptAnchor                                          from '../constructs/sub/Anchor';
import { RendererRegistry }                                   from '../../../../util/rendererRegistry';
import { InstanceConstruct }                                  from 'spw-lang/lang/constructs/sub/instance/def';
import { instantiationSchemeRegistry, isInstantiationScheme } from './registry/instantiation-schemes';
import { InvocationConstruct }                                from 'spw-lang/lang/constructs/sub/invocation/def';
import { invocationSchemeRegistry }                           from './registry/invocation-schemes';

type UserRegistryFactoryProps = { concept: IConcept };

export const userConceptDisplayRegistry = new RendererRegistry();


userConceptDisplayRegistry
    .register(
        ((p: { concept: InstanceConstruct }) => {
            const { concept } = p;
            return isInstantiationScheme(concept);
        }),
        p => instantiationSchemeRegistry.render(p) || <ConceptDisplayFactory concept={p.concept} />
    );

userConceptDisplayRegistry
    .register(
        ((p: { concept: InvocationConstruct }) => {
            const { concept } = p;
            const isInvocationScheme           = `${concept?.label}`.indexOf('~') === 0;
            return isInvocationScheme;
        }),
        p => invocationSchemeRegistry.render(p) || <ConceptDisplayFactory concept={p.concept} />
    );

userConceptDisplayRegistry
    .register(
        (() => false),
        ({ concept }: UserRegistryFactoryProps) => <ConceptAnchor concept={concept} />
    );


export default function UserRegistryFactory({ concept }: UserRegistryFactoryProps) {
    const attempt = userConceptDisplayRegistry.render({ concept });
    return attempt || <ConceptDisplayFactory concept={concept} />;
}

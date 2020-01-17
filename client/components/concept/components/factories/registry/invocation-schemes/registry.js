import React                   from 'react';
import { InvocationConstruct } from 'spw-lang/lang/constructs/sub/invocation/def';
import { RendererRegistry }    from '../../../../../../util/rendererRegistry';
import { Analog }              from 'spw-lang/lang/constructs/sub/analog/def';
import { Essence }             from 'spw-lang/lang/constructs/sub/essence/def';

export const invocationSchemeRegistry = new RendererRegistry();

export function isInvocationScheme(concept) {
    return InvocationConstruct.isInvocation(concept) && concept.opener.concept.label !== '{';
}


export function resolveInvocation(concept: InvocationConstruct) {
    const parentIsAnalog       = Analog.isAnalog(concept?.scene);
    const grandparent          = concept?.scene?.scene;
    const grandparentIsEssence = Essence.isEssence(grandparent);
    console.log(grandparent);
    if (!(parentIsAnalog && grandparentIsEssence)) return { source: null, target: null };

    const ampersand        = concept?.scene?.right?.label === '&' || !concept.essence?.implicit?.size;
    const target           = ampersand && parentIsAnalog && concept?.scene?.right;
    const essentialConcept = grandparent?.context;
    return {
        source: essentialConcept?.label?.isAmbiguous
                ? grandparent?.context?.scene?.left
                : essentialConcept,
        target: target
    };
}

export const registerInvocationScheme =
                 ({ testConcept, testLabel, testScheme, render }) => {
                     invocationSchemeRegistry
                         .register(
                             ((p: { concept: InvocationConstruct }) => {
                                 const { concept } = p;

                                 if (testScheme && !testScheme(concept?.opener?.essence)) {
                                     return false;
                                 }

                                 if (testLabel && !testLabel(concept?.opener?.label)) {
                                     return false;
                                 }

                                 return true;
                             }),
                             render
                         );
                 };


;

import React                 from 'react';
import { InstanceConstruct } from 'spw-lang/lang/constructs/sub/instance/def';
import { RendererRegistry }  from '../../../../../../util/rendererRegistry';
import { Analog }            from 'spw-lang/lang/constructs/sub/analog/def';

export const instantiationSchemeRegistry = new RendererRegistry();

export function isInstantiationScheme(concept) {
    return InstanceConstruct.isInstance(concept) && concept.opener.concept.label !== '{';
}

function instantiatesReference(concept) {
    return concept.body?.label === '&_';
}

export function resolveInstantiatedConcept(concept) {
// If there's an obvious reference
    const isAnalogObvious = Analog.isAnalog(concept?.scene?.scene);
    const ampersand       = instantiatesReference(concept);

    // If we're instantiating
    return ampersand && isAnalogObvious
           ? concept?.scene?.scene.left
           : concept.body;
}

export const registerInstantiationScheme =
                 ({ testConcept, testLabel, testScheme, render }) => {
                     instantiationSchemeRegistry
                         .register(
                             ((p: { concept: InstanceConstruct }) => {
                                 const { concept } = p;

                                 if (testScheme && !testScheme(concept?.opener?.concept?.essence)) {
                                     return false;
                                 }

                                 if (testLabel && !testLabel(concept?.opener?.concept?.label)) {
                                     return false;
                                 }

                                 if (testConcept && !testConcept(resolveInstantiatedConcept(concept))) {
                                     return false;
                                 }

                                 return true;
                             }),
                             render
                         );
                 };

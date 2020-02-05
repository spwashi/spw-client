import React                         from 'react';
import { Analog as AnalogConstruct } from 'spw-lang/lang/constructs/sub/analog/def';
import type { IConcept }             from 'spw-lang/lang/constructs/def/types/types';
import { InstanceConstruct }         from 'spw-lang/lang/constructs/sub/instance/def';
import { StringConstruct }           from 'spw-lang/lang/constructs/sub/string/def';
import Analog                        from './components/constructs/sub/Analog';
import ConceptAnchor                 from './components/constructs/sub/Anchor';
import EssenceDisplay                from './components/constructs/sub/Essence/Essence';
import InstanceDisplay               from './components/constructs/sub/Instance/Instance';
import StrConcept                    from './components/constructs/sub/String/String';
import './scss/_concept.scss';
import { Essence }                   from 'spw-lang/lang/constructs/sub/essence/def';
import useLatest                     from '../../util/hooks/useLatest';
import DelimitedConstruct from './components/constructs/DelimitedConstruct';
import { Token }          from 'spw-lang/lang/constructs/def/token/token';

interface Props {
    concept: IConcept | Analog
}

function ConceptDisplayFactory(props: Props) {
    const { concept, contextualization = 'recursive' } = props;

    if (InstanceConstruct.isInstance(concept)) return <InstanceDisplay instance={concept} />;
    if (AnalogConstruct.isAnalog(concept)) return <Analog analog={concept} />;
    if (StringConstruct.isString(concept)) return <StrConcept concept={concept} />;
    if (Essence.isEssence(concept)) return <EssenceDisplay essence={concept?.essence} />;
    if (Token.isToken(concept)) return <ConceptAnchor concept={concept} />;
    const components =
              useLatest(
                  () => ({
                      open:
                          '',
                      body:
                          (
                              <div className="spw-concept">
                                  <ConceptAnchor
                                      concept={concept}
                                      display="label"
                                      contextualization={contextualization}
                                      key={concept?.anchor}
                                  />
                                  <EssenceDisplay essence={concept?.essence} />
                              </div>
                          ),
                      close:
                          ''
                  }),
                  [concept, concept?.anchor]
              );

    return (
        <DelimitedConstruct name="spw-analog" construct={concept} components={components} />
    );
}

export default ConceptDisplayFactory;

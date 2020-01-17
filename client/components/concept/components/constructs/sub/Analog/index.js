import classnames                    from 'classnames';
import React, { useState }           from 'react';
import { Analog as AnalogConstruct } from 'spw-lang/lang/constructs/sub/analog/def';
import type { IConcept }             from 'spw-lang/lang/constructs/def/types/types';
import DelimitedConstruct            from '../../DelimitedConstruct';
import AnalogComponent               from './AnalogComponent';
import AnalogWrapper                 from './styles/Styled';
import useLatest                     from '../../../../../../util/hooks/useLatest';
import ConceptAnchor                 from '../Anchor';
import { useColor }                  from '../../../../../../packages/staging/color/context/context';

interface AnalogProps {
    analog: IConcept & AnalogConstruct
}

interface AnalogAnchorProps {
    analog: null;
    color: null;
}

function AnalogAnchor({ analog, color }: AnalogAnchorProps) {
    const [style] = useState({ fontSize: '1em', color: color ? color.hex() : undefined });
    return (
        <div className="stage center">
            <ConceptAnchor concept={analog} contextualization={false}>
                <div className="mx-2 " style={style}>
                    {'<-&->'}
                </div>
            </ConceptAnchor>
        </div>
    );
}

export default function Analog(props: AnalogProps) {
    const { analog, Factory } = props;
    const className           = classnames('spw-analog-components', {});
    const { color }           = useColor();
    const components          =
              useLatest(
                  () => ({
                      open:
                          <span className="analog-delimiter analog-opener">{'<'}</span>,
                      body:
                          (
                              <AnalogWrapper className={className}>
                                  <AnalogComponent analog={analog} position="left" />
                                  <AnalogAnchor color={color} analog={analog} />
                                  <AnalogComponent analog={analog} position="right" />
                              </AnalogWrapper>
                          ),
                      close:
                          <span className="analog-delimiter analog-closer">{'>'}</span>,
                  }),
                  [className, analog, Factory]
              );
    return (
        <DelimitedConstruct
            name="spw-analog"
            construct={analog}
            components={components}
            bodyDisplay="flex"
        />
    );
}

import React, { useState }           from 'react';
import { Analog as AnalogConstruct } from 'spw-lang/lang/constructs/sub/analog/def';
import type { IConcept }             from 'spw-lang/lang/constructs/def/types/types';
import SpaceNode                     from '../../../../../../packages/staging/space/components/SpaceNode';
import { ConceptWidget }             from '../../../../context/Provider';
import useGroupthink                 from '../../../../../../packages/groupthink/hooks/useGroupthink';

function analogAligner([...data]) {
    console.log(data.map(({ payload: { spaceState } = {} }) => spaceState?.id))
    return data
        .reduce(
            (prev, { id, payload: curr }) => {
                console.log(curr);
                const { spaceState: { rect } = {} } = curr || {};
                if (!rect) return prev;

                return {
                    minWidth: Math.max(rect.width, prev?.minWidth || 0)
                };
            }, null
        );
}

export default function AnalogComponent(props: {
    position: 'left' | 'right',
    analog: IConcept & AnalogConstruct
}) {
    const { position, analog } = props;
    const concept              = analog[position];
    if (!concept) {
        console.error('no empty', props);
        return null;
    }

    const [data, setData] = useState({});

    const { state: constraints } =
              useGroupthink(
                  data,
                  {
                      id:        `${analog?.scene?.id}--analog--${position}`,
                      processor: analogAligner
                  }
              );
    // constraints && console.log(constraints);
    return (
        <SpaceNode
            sentinel={false}
            key={`analog-component-${position}-wrapper`}
            position={position}
            display="flex"
            constraints={constraints}
            className={`spw-analog-${position}-wrapper spw-analog-component-wrapper`}
        >
            <SpaceNode
                sentinel={true}
                key={`analog-component-${position}`}
                data={concept}
                onStateChange={spaceState => setData({ spaceState, scene: analog?.scene })}
                position={position}
                display="inline-flex"
                className={`spw-analog-${position}`}
            >
                <div className={`spw-analog-component spw-analog-${position}`}>
                    <ConceptWidget concept={concept} />
                </div>
            </SpaceNode>
        </SpaceNode>
    );
}

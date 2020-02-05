import classNames   from 'classnames';
import React        from 'react';
import styled       from 'styled-components';
import SpaceNode    from '../../../../../../packages/staging/space/components/SpaceNode';
import useLatest    from '../../../../../../util/hooks/useLatest';
import { useColor } from '../../../../../../packages/staging/color/context/context';

interface TokenProps {
    body: any;
    handleInteraction: Function;
    position: string;
}


const StyledToken =
          styled.div`
  svg path {
    stroke: ${p => p.tokenColor};
  }
  min-width: 6px;
  position: relative;
  display: block;
  flex-wrap: nowrap;
  height: 100%;
  color: ${p => p.tokenColor};

  svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    path {
      stroke-width: 3;
    }
  }
`;


export default function ConceptToken(props: TokenProps) {
    const
        {
            handleInteraction,
            body,
            data,
            position,
        }       = props;
    const onKey = e => (e.key === ' ' ? handleInteraction() : null);

    const className    = classNames('stage', `spw-${position}`, 'spw-token');
    const { color }    = useColor('bracket');
    const spaceElProps = useLatest(() => ({ tokenColor: color ? color.hex() : 'green' }), []);
    if (!body) return null;
    return (
        <SpaceNode

            data={(data)}
            position={position}
            elProps={{ tokenColor: color ? color.hex() : 'green' }}
            Component={StyledToken}
            sentinel={false}
        >
            <div
                tabIndex={0}
                className={className}
                onKeyUp={onKey}
                onClick={handleInteraction}
            >
                {body}
            </div>
        </SpaceNode>
    );
}

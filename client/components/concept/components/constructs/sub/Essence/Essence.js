import React, { useEffect, useState } from 'react';
import type { IEssence }              from 'spw-lang/lang/constructs/def/types/types';
import { Essence }                    from 'spw-lang/lang/constructs/sub/essence/def';
import SpaceNode                      from '../../../../../../packages/staging/space/components/SpaceNode';
import type { SpaceNodeState }        from '../../../../../../packages/staging/space/components/SpaceNode/context/types';
import DelimitedConstruct             from '../../DelimitedConstruct';
import StyledEssence                  from './Styled';
import { BodyContent }                from '../../DelimitedConstruct/components/Body';
import { useColor }                   from '../../../../../../packages/staging/color/context/context';
import useLatest                      from '../../../../../../util/hooks/useLatest';

interface Props {
    direction: 'left' | 'right';
    width: number;
    height: number;
}

function getPath(rev, width, height) {
    const leftPath  =
              [
                  ...[[0, 0], [width, 0]],
                  ...[[0, height], [-width, 0]]
              ].join(' ');
    const rightPath =
              [
                  ...[[width, 0], [-width, 0]],
                  ...[[0, height], [width, 0]]
              ].join(' ');
    return { leftPath, rightPath };
}

function Bracket(props: Props) {
    const { direction = 'left' }    = props;
    const rev                       = direction === 'right';
    const { width = 0, height = 0 } = props;
    const { leftPath, rightPath }   = getPath(rev, width, height);

    return (
        <svg
            version="1.1"
            height={height}
            style={{ bottom: -height / 2, top: 'auto' }}
            viewBox={[0, 0, width, height].join(' ')}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <path
                    style={{ fill: 'none', }}
                    d={`m ${!rev ? leftPath : rightPath}`}
                />
            </g>
        </svg>
    );
}

type EssenceDisplayProps = { essence: IEssence };

interface EssenceDisplayBodyParams {
    essence: null;
    height?: null;
    width?: null;
    anchor: null;
}

function EssenceDisplayBody(
    {
        essence, height, width, anchor
    }: EssenceDisplayBodyParams
) {
    const components =
              useLatest(
                  () => ({
                      open:
                          <Bracket
                              key="bracket-right"
                              direction="right"
                              height={height}
                              width={width}
                              id={`${anchor}-open`}
                          />,
                      body:
                          <BodyContent
                              key="body content open"
                              body={essence.body}
                              display="block"
                          />,
                      close:
                          <Bracket
                              key="bracket-left"
                              direction="left"
                              height={height}
                              width={width}
                              id={`${anchor}-close`}
                          />
                  }),
                  [height, width, anchor, essence.body]
              );
    const { color }  = useColor();
    return (
        <StyledEssence color={color}>
            <DelimitedConstruct
                name="spw-essence"
                bodyDisplay="flex"
                construct={essence}
                components={components}
            />
        </StyledEssence>
    );
}

export default function EssenceDisplay(props: EssenceDisplayProps): null | * {
    const { essence } = props;

    if (Essence.isEssenceEmpty(essence)) return null;

    const [spaceState: SpaceNodeState, setSpaceState] = useState();

    const width             = 6;
    const height            = spaceState?.rect?.height;
    const { anchor }        = essence;
    // const [local, setLocal] = useLocalStorage(`${anchor}-essence-height`, { width: 9, height: 0 });
    const [local, setLocal] = useState({ width: 9, height: 0 });
    useEffect(() => { setLocal({ width, height }); }, [width, height]);
    return (
        <SpaceNode
            position="center"
            data={`${essence?.key}--wrapper`}
            className={'essence--wrapper'}
            onStateChange={setSpaceState}
            key={anchor}
            sentinel={!(height || local.height)}
        >
            <EssenceDisplayBody
                essence={essence}
                anchor={anchor}
                width={width || local.width}
                height={height || local.height}
            />
        </SpaceNode>
    );
}

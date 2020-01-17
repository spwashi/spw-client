import React, { useState } from 'react';
import SpaceNode from '../../../../../../packages/staging/space/components/SpaceNode';
import type { SpaceNodeState } from '../../../../../../packages/staging/space/components/SpaceNode/context/types';
import { Toggler } from '../../../../../../packages/toggle/component';
import { ConceptWidget } from '../../../../context/Provider';


export function BodyContent(props) {
    const
        {
            body,
            className,
            display,
            data
        } = props;


    const [space: SpaceNodeState, setSpaceState] = useState();
    const groupID                                = {
        type: 'delimited-construct-body-item',
        data,
        space
    };

    const [catScheme]   = useState({ type: 'fill-constraints', });
    const [constraints] = useState([])


    // console.log(constraints);
    const renderConcept =
              concept => (
                  <SpaceNode
                      position="center"
                      className="delimited-construct-body-item"
                      key={concept?.id || concept?.anchor}
                      constraints={constraints}
                      display={display}
                      onStateChange={setSpaceState}
                      sentinel={false}
                  >
                      <ConceptWidget concept={concept} key="item" />
                  </SpaceNode>
              );


    if (!Array.isArray(body)) return renderConcept(body);

    return (
        <SpaceNode
            key="delimited-item-list"
            position="body"
            data={data}
            display={display}
            className={`spw-essence-body-wrapper delimited-construct-body-item-list`}
        >
            {
                body
                    .map(
                        renderConcept
                    )
            }
        </SpaceNode>
    );
}

interface BodyProps {
    body: null;
    className: null;
    Factory: null;

    toggler: {
        open: null,
        setOpen: null,
    }
}


export default function Body(props: BodyProps) {
    const
        {
            body,
            data,
            display   = 'inline-flex',
            className = '',
            toggler:
                {
                    open,
                    setOpen
                }
        } = props;

    return (open ? body : <Toggler key="toggler" open={open} setOpen={setOpen}>...</Toggler>);
}

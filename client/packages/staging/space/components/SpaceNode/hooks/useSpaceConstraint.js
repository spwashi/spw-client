import React from 'react';
import useStageContext from '../../../../stage/Stage/hooks/useStageContext';

const noop = () => null;
export default function useSpaceConstraint({ id }) {
    const [canUpdate, setCanUpdate]     = React.useState(true);
    const [constraints, setConstraints] = React.useState({});
    const stageContext                  = useStageContext({ doThrow: false });
    const { state: stage }              = stageContext;

    React
        .useEffect(
            () => {
                if (canUpdate) return noop;
                const timeout = setTimeout(() => !canUpdate && setCanUpdate(true), 900);
                return () => clearTimeout(timeout);
            },
            [canUpdate, id]
        );

    React
        .useEffect(
            () => {
                if (!canUpdate) return;
                const relationship = stage?.relationships?.sizeConstraints?.[id];

                if (relationship) {
                    setCanUpdate(false);
                    setConstraints(relationship);
                }
            },
            [stage.renderKey]
        );
    return constraints;
}

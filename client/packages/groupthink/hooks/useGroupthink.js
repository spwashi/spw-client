import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import randomString                                                    from '../../../util/random';


export const GroupThinkContext = React.createContext();

export default function useGroupthink(data: any, scheme: { id: string, processor: Function }) {
    const { state, dispatch } = useContext(GroupThinkContext);
    const [key, setKey]       = useState(0);
    const datum               = useRef({}).current;
    const id                  = datum.id || randomString(10);
    datum.id                  = id;
    datum.payload             = data;
    datum.key                 = key;

    const dispatchDataUpdate =
              useCallback(
                  () => (
                      dispatch({ type: 'update-data', payload: { id, datum, scheme } })
                  ),
                  [data, id]
              );

    useEffect(dispatchDataUpdate, [data]);
    useEffect(
        () =>
            () => {
                datum.payload = undefined;
            },
        []
    );
    return {
        state: state.schemes?.get(scheme?.id)?.state
    };
}

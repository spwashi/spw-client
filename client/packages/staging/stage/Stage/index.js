import classNames from 'classnames';
import React, { useCallback, useReducer, useState } from 'react';
import { StageDispatchContext, StageStateContext } from './hooks/useStageContext';

import reducer, { reset }        from './reducer/reducer';
import GroupthinkContextProvider from '../../../groupthink/context/Provider';

interface StageProps {
    children: React.ReactChildren
}

function useBatchedDispatch(dispatch, flushInterval = 500, maxStack = 200) {
    const [batch_t, setBatchTimer] = useState(0);
    const [batch, setBatch]        = useState({ round: 0, actions: new Map });
    const [dispatchedBatches]      = useState(new Set);

    return useCallback(
        action => {
            let timeout        = batch_t;
            let timeoutCleared = false;

            batch.actions.set(
                (action.payload?.id ? `${action.payload.id}|${action.type}` : action),
                action
            );

            function clear() {
                clearTimeout(batch_t);
                clearTimeout(timeout);
                timeoutCleared = true;
                setBatchTimer(null);
            }

            const flush =
                      () => {
                          clear();
                          if (dispatchedBatches.has(batch.round) || !batch.actions.size) return;
                          setBatch({ round: (batch.round || 0) + 1, actions: new Map() });

                          dispatch(
                              {
                                  type:    'BATCH',
                                  batch,
                                  payload: [...batch.actions.values()]
                              }
                          );

                          dispatchedBatches.add(batch.round);
                      };

            timeout = (!timeoutCleared && timeout) || setTimeout(flush, flushInterval);
            setBatchTimer(timeout);

            if (batch.actions.size > maxStack) flush();

            return () => !timeoutCleared && clear();
        },
        [dispatch, batch, batch_t]
    );
}

function Stage(props: StageProps) {
    const { children, id }  = props;
    const className         = classNames('stage');
    const [state, dispatch] = useReducer(reducer, reset());
    const batchedDispatch   = useBatchedDispatch(dispatch, 50);
    return (
        <GroupthinkContextProvider>
            <StageStateContext.Provider value={state}>
                <StageDispatchContext.Provider value={batchedDispatch}>
                    <div className={className}>
                        {children}
                    </div>
                </StageDispatchContext.Provider>
            </StageStateContext.Provider>
        </GroupthinkContextProvider>
    );
}

export default Stage;

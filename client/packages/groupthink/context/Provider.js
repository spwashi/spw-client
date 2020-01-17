import React, { useReducer } from 'react';
import { GroupThinkContext } from '../hooks/useGroupthink';

const reduceDataUpdate = (state, { payload: { id, datum, scheme } }) => {
    const { id: schemeID, processor } = scheme;
    const schemeState                 = state.schemes.get(schemeID) || {};
    const nextData                    = new Set([...schemeState.data || [], datum]);
    return (
        {
            ...state,
            schemes:
                state
                    .schemes
                    .set(
                        schemeID,
                        {
                            ...schemeState,
                            processor,
                            data:  nextData,
                            state: processor ? processor(nextData) : undefined
                        }
                    )
        }
    );
};


const reducer =
          (state = {}, action) => {
              const { type, payload } = action || {};
              switch (type) {
                  case 'update-data':
                      return reduceDataUpdate(state, { payload });
                  default:
                      return state;
              }
          };

const reset = ({ scheme }: { scheme?: null }) => ({
    scheme,
    data:    new Set,
    schemes: new Map
});

export default function GroupthinkContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, reset({}));

    return (
        <GroupThinkContext.Provider value={{ state, dispatch }}>
            {children}
        </GroupThinkContext.Provider>
    );
}

import { useContext, useReducer }                                      from 'react';
import randomString                                                    from '../../../../../util/random';
import type { RegisterChild, SpaceFound, SpaceNodeAction, UpdateData } from './action';
import type { SpaceNodeContextValue, SpaceNodeState }                  from './context/types';
import { SpaceNodeContext }                                            from './hooks/useSpaceContext';

function spaceFound(state: SpaceNodeState, action: SpaceFound) {
    const { payload } = action;
    return {
        ...state,
        rect:        payload.rect,
        renderKey:   state.renderKey + 1,
        invalidated: false
    };
}

function registerChild(state: SpaceNodeState, action: RegisterChild) {
    const { payload } = action;
    const { id }      = payload;

    const set = new Set(state.children || []);
    set.add(id);
    const next    = state;
    next.children = [...set];
    return { ...next, renderKey: state.renderKey + 1 };
}

function unregisterChild(state: SpaceNodeState, action: RegisterChild) {
    const { payload } = action;
    const { id }      = payload;
    const set         = new Set(state.children || []);
    if (!set.has(id)) return state;
    set.delete(id);
    return {
        ...state,
        children:  Array.from(set),
        renderKey: state.renderKey + 1
    };
}

function updateData(state: SpaceNodeState, action: UpdateData) {
    return {
        ...state,
        data: action.payload.data
    };
}

function makeNodeID() {
    return `node-${randomString(7, 'abcddefghi-1234567q_')}`;
}

export const reset =
                 ({ position, data, parent = null, sentinel }): SpaceNodeState => (
                     {
                         id:          makeNodeID(position),
                         data,
                         position,
                         parent,
                         sentinel,
                         intent:      'initialize',
                         invalidated: null,
                         rect:        undefined,
                         children:    [],
                         renderKey:   0
                     }
                 );


function reducer(state: SpaceNodeState, action: SpaceNodeAction) {
    let next;
    const { type } = action || {};
    switch (type) {
        case 'refresh-children':
            return {
                ...state,
                children:  [...state.children || []],
                renderKey: state.renderKey + 1
            };
        case 'space-found':
            return spaceFound(state, action);
        case 'register-child':
            return registerChild(state, action);
        case 'unregister-child':
            return unregisterChild(state, action);
        case 'update-data':
            return updateData(state, action);
        case 'activate':
            return {
                ...state,
                intent:      !state?.sentinel ? 'constrain' : 'report',
                invalidated: false
            };
        case 'queue-rerender':
            next = state;
            return {
                ...state,
                intent:      'rerender',
                invalidated: true,
                rect:        undefined
            };

        default:
            return state;
    }
}

const wrappedReducer = (state, action) => {
    const next = reducer(state, action);
    // if (state && (next.renderKey !== state?.renderKey)) console.log(next);
    return next;
};

type SpaceNodeReducerSeed = { id: null, position: null, data: null, parent?: null, sentinel: boolean };
type Reduced = { state: SpaceNodeState, dispatch: Function };
export default function useSpaceNodeReducer(seed: SpaceNodeReducerSeed): Reduced {
    const parent: SpaceNodeContextValue     = useContext(SpaceNodeContext);
    const [state: SpaceNodeState, dispatch] =
              useReducer(
                  wrappedReducer,
                  reset(
                      {
                          ...seed,
                          parent: (parent || null)?.state
                      }
                  )
              );
    return { state, dispatch };
}

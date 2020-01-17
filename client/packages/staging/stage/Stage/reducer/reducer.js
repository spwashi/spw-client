import type { RegisterStagingNode, StageAction, UnregisterStagingNode, UpdateStagingNodeState } from '../action';
import type { StageStateContextValue }                                                          from '../hooks/useStageContext';


const registerNode    = (state: StageStateContextValue, action: RegisterStagingNode) => {
    const { payload }                       = action;
    const { id, state: nodeState, context } = payload;
    if (!context?.reporter || state.nodes?.[id]) return state;
    return {
        ...state,
        renderKey: 1 + (state.renderKey || 0),
        nodes:     {
            ...state.nodes,
            [id]: nodeState
        }
    };
};
const unregisterNode  = (state: StageStateContextValue, action: UnregisterStagingNode) => {
    const { payload } = action;
    const { id }      = payload;
    const next        = { ...state, nodes: { ...state.nodes } };
    if (next.nodes[id]) delete next.nodes[id];
    next.renderKey = 1 + (next.renderKey || 0);
    return next;
};
const updateNodeState = (state: StageStateContextValue, action: UpdateStagingNodeState) => {
    const { payload }              = action;
    const { id, state: nodeState } = payload;
    const next                     = state;
    const { nodes }                = next;
    if (!nodeState?.rect) return next;

    const prev                 = nodes[id];
    nodes[id]                  = nodeState;
    nodes[id].stageUpdateCount = (nodes[id].stageUpdateCount || 0) + 1;
    return next;
};


export const reset: StageStateContextValue = () => ({
    nodes:         {},
    relationships: {},
    renderKey:     0
});

const reducer = (state: StageStateContextValue, action: StageAction) => {
    switch (action.type) {
        case 'register-node':
            return registerNode(state, action);
        case 'unregister-node':
            return unregisterNode(state, action);
        case 'update-node-state':
            return updateNodeState(state, action);
        default:
            return state;
    }
};


export default (state: StageStateContextValue, action: StageAction) => {
    let next = state;

    if (action.type === 'BATCH') {
        for (const subAction of action.payload) {
            next = reducer(next, subAction);
        }
        return next;
    }

    next = reducer(state, action);
    return next;
};

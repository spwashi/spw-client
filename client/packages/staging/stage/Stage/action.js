type StagingNodeState = * | {};
type StagingNodeContext = any;

interface NodeStateActionPayload {
    id: string;
    state: StagingNodeState;
    context: StagingNodeContext;
}

interface NodeUnregisterPayload {
    id: null;
}

export type RegisterStagingNode = { type: 'register-node', payload: NodeStateActionPayload };
export type UpdateStagingNodeState = { type: 'update-node-state', payload: NodeStateActionPayload };
export type UnregisterStagingNode = { type: 'unregister-node', payload: { id: string } };

export type StageAction = RegisterStagingNode | UnregisterStagingNode | UpdateStagingNodeState;


const action  = (type, payload) => ({ type, payload });
const actions =
          {
              createUpdateNode(payload: NodeStateActionPayload): UpdateStagingNodeState {
                  return action('update-node-state', payload);
              },

              createRegisterNode(payload: NodeStateActionPayload): RegisterStagingNode {
                  return action('register-node', payload);
              },

              createUnregisterNode(payload: NodeUnregisterPayload): UnregisterStagingNode {
                  return action('unregister-node', payload);
              }
          };

export default actions;

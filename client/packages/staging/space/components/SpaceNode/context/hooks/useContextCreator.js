import { useEffect, useReducer }      from 'react';
import { action }                     from '../../../../../../../util/action';
import type { StageContextValue }     from '../../../../../stage/Stage/hooks/useStageContext';
import useStageContext                from '../../../../../stage/Stage/hooks/useStageContext';
import type { SpaceNodeContextValue } from '../types';

interface GetContextValueParams {
    reporter: null;
    dispatch: null;
}

type SpaceNodeContextState = SpaceNodeContextValue & { context: SpaceNodeContextValue };

const reset = () => {

};


function updateStage(stageContext: StageContextValue, contextState: SpaceNodeContextState) {
    const updateNodeAction =
              stageContext
                  .actions
                  .createUpdateNode(contextState);
    stageContext.dispatch(updateNodeAction);
}

function initializeContext(id, state, reporter, stage, contextStateDispatch): SpaceNodeContextValue {
    const registerChild =
              function (childID) {
                  contextStateDispatch(action('register-child', { id: childID }));
                  if (this.isValid) updateStage(stage, this.contextState);
              };

    const unregisterChild = childID => contextStateDispatch(action('unregister-child', { id: childID }));
    const queueUpdate     = () => contextStateDispatch(action('queue-rerender'));
    return {
        id,
        state,
        reporter,

        get isValid() { return stage.dispatch && this.reporter && state.rect; },
        get contextState(): SpaceNodeContextState { return ({ id: this.id, state: this.state }); },

        registerChild,
        unregisterChild,
        queueUpdate,
    };
}

export function useSpaceContextValue(props: GetContextValueParams): SpaceNodeContextValue {
    const { id, reporter, }   = props;
    const { state, dispatch } = props;
    const stage               = useStageContext({ doThrow: false });

    const [context: SpaceNodeContextValue, contextDispatch] =
              useReducer(
                  (cState, cAction) => {
                      let next;
                      switch (cAction?.type) {
                          case 'update-state':
                              next       = cState;
                              next.state = cAction.payload.state;
                              return next;
                          case 'update-space-reporter':
                              next          = cState;
                              next.reporter = cAction.payload.reporter;
                              return next;
                          default:
                              return cState;
                      }
                  },
                  initializeContext(id, state, reporter, stage, dispatch)
              );

    useEffect(
        () => {
            contextDispatch({ type: 'update-space-reporter', payload: { reporter } });
        },
        [reporter]
    );

    useEffect(
        () => {
            contextDispatch({ type: 'update-state', payload: { state } });
        },
        [state]
    );

    return context;
}

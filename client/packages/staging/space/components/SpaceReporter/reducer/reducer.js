import type { SpaceReporterAction } from '../action/action';
import type { SpaceReporterState } from '../def/types';

export const reset = (): SpaceReporterState => ({ rect: undefined });

function reduceSpaceFound(state, action) {
    const start            = state;
    const { rect } = action.payload;
    const widthDifference  = (rect?.width || 0) - (state.rect?.width || 0);
    const heightDifference = (rect?.height || 0) - (state.rect?.height || 0);
    if ((state.renderCount || 0) > 50) return state;
    if (Math.abs(widthDifference) < 5 && Math.abs(heightDifference) < 5) {
        return state;
    }
    return {
        ...state,
        rect
    };
}

const reducer                     =
          (state = {}, action: SpaceReporterAction) => {
              switch (action?.type) {
                  case 'space-found':
                      return reduceSpaceFound(state, action);
                  case 'reset':
                      return reset();
                  default:
                      return state;
              }
          };
export const spaceReporterReducer = (state = {}, action: SpaceReporterAction) => {
    const next = reducer(state, action);
    if (next !== state) {
        next.renderCount = (next.renderCount || 0) + 1;
    }
    return next;
};

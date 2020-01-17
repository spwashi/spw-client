import { createContext, useContext } from 'react';
import actions from '../action';

export interface StageStateContextValue {
    nodes: {};
    relationships: Object<string, Object<string, Array<string>>>;
    renderKey?: number;
}

export type DispatchContextValue = Function;
const resetState    = () => ({});
const resetDispatch = () => (() => {
});


export const StageStateContext    = createContext(resetState());
export const StageDispatchContext = createContext(resetDispatch());

export type StageContextValue =
    {
        state: StageStateContextValue,
        dispatch: DispatchContextValue,
        actions: typeof actions
    };

export default function useStageContext(options: { doThrow: boolean }): StageContextValue {
    const { doThrow = true } = options || {};

    const state    = useContext(StageStateContext);
    const dispatch = useContext(StageDispatchContext);

    if (state && dispatch) return { state, dispatch, actions };
    if (doThrow) throw new Error('Expected to be in StageContextProvider');

    return {
        state:    {},
        dispatch: () => {
        },
        actions
    };
}

import { useReducer }                  from 'react';
import type { SpaceReporterState }     from '../def/types';
import { reset, spaceReporterReducer } from '../reducer/reducer';


export function useSpaceReporterReducer(): [SpaceReporterState, Function] {
    return useReducer(spaceReporterReducer, reset());
}

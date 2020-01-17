import { createContext, useContext, useEffect, useState } from 'react';
import type { SpaceNodeContextValue } from '../context/types';

export const SpaceNodeContext: SpaceNodeContextValue = createContext();

export function useSensitiveParentSpace(key) {
    const [hasInitialized, setHasInitialized] = useState(false);
    const context: SpaceNodeContextValue      = useContext(SpaceNodeContext);
    useEffect(
        () => {
            if (!hasInitialized) {
                setHasInitialized(true);
                return;
            }
            return context?.queueUpdate();
        },
        key
    );
}

import { useCallback,  useState } from 'react';
import { useLocalStorage }        from '../../../util/hooks/hooks';
import useLatest                  from '../../../util/hooks/useLatest';

export default function useToggle(initial = true, { cacheKey = false } = {}) {
    const hook            = cacheKey ? () => useLocalStorage(cacheKey, initial) : useState;
    const [open, setOpen] = hook(initial);
    const toggle          = useCallback(() => setOpen(s => !s), [open]);

    return useLatest(() => ({ open, setOpen, toggle }), [toggle]);
}

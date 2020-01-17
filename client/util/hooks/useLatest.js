import { useEffect, useRef, useState } from 'react';

export default function useLatest(calculator, key) {
    const run                       = useRef(0);
    const [lastValue, setLastValue] = useState(calculator());

    useEffect(
        () => {
            run.current += 1;
            if (run === 1) return;
            const next = calculator();
            if (next !== lastValue) setLastValue(next);
        },
        key
    );

    return lastValue;
};

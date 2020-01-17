// Hook
import { useEffect, useState } from 'react';


export function useThump(interval = 5000) {
    const [beat, setBeat] = useState(0);
    const thump           = () => setBeat(beat => (beat + 1) % 4);

    useEffect(
        () => {
            const timeout = setInterval(thump, interval);
            return () => clearInterval(timeout);
        },
        [interval]
    );
    return beat;
}

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = value => {
        try {
            const valueToStore =
                      value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

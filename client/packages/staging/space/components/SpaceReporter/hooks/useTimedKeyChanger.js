import { useEffect, useState } from 'react';

export default function useTimedKeyChanger(setPollKey, timeout = 200, { loop = false, loseInterest } = {}) {
    const [lastChanged, setLastChanged] = useState(0);
    const [pollKey, set]                = useState(0);
    const [t, setT]                     = useState(timeout);
    useEffect(
        () => {
            const k =
                      setInterval(
                          () => {
                              if (lastChanged >= 4 && !loop) return;
                              set(pollKey + 1);
                              setPollKey(pollKey + 1);
                              setLastChanged(lastChanged + 1);
                              if (loseInterest) setT(t * 4)
                          },
                          t
                      );
            return () => {
                clearInterval(k);
            };
        },
        [timeout]
    );
}

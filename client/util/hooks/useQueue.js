import { useEffect, useRef, useState } from 'react';

const qMap = new Map;

export default function useQueue(callback, name, gap = 10) {
    const usePromises  = gap === 0;
    const ref          = useRef();
    const cancellation = useRef(false);
    ref.current        = callback;

    const queueItem =
              qMap.get(name)
              || qMap.set(name, { queue: [], i: 0 },)
                     .get(name);


    useEffect(
        () => {
            if (usePromises) return;
            if (queueItem.interval) { return; }

            function runQueueItem() {
                if (!queueItem.queue.length) {
                    return;
                }
                let fn = queueItem.queue.shift();
                if (fn) {
                    // console.log('interval queue item', name, gap);
                    queueItem.i += 1;
                    fn(queueItem.i);
                    runQueueItem();
                }
            }

            const interval = queueItem.interval = setInterval(() => { runQueueItem(); }, gap);

            return () => {
                cancellation.current = true;
                clearInterval(interval)
            };
        },
        []
    );


    if (!usePromises) {
    }

    const [added, setAdded] = useState(false);

    let run = false;

    const executor =
              (...args) => {
                  if (run || cancellation.current || (typeof ref.current !== 'function')) return;
                  ref.current(...args);
                  run = true;
              };

    useEffect(
        () => {
            if (!callback) return;
            if (!added) {
                if (usePromises) {
                    queueItem.active =
                        (queueItem.active || Promise.resolve())
                            .then(() => {
                                queueItem.i += 1;
                                // console.log('promised queue item', name);
                                return executor(queueItem.i);
                            });
                } else {
                    queueItem.queue.push(executor);
                }
                setAdded(true);
            }
            return () => {
            };
        },
        [callback]
    );

}

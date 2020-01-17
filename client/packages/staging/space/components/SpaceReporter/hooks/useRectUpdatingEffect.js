import { useEffect, useRef, useState } from 'react';
import type { Action_SpaceFound }      from '../action/action';

const noop = () => null;

export default function useRectUpdatingEffect(el: HTMLElement, pollKey: string, dispatch: Function) {
    const [prev, setPrev] = useState();
    const elRef           = useRef();
    elRef.current         = { el, dispatch };

    useEffect(
        () => {
            const { el, dispatch } = elRef.current;
            if (!el) return noop;

            const rect = el.getBoundingClientRect();

            const hasMoved =
                      ['width', 'height']
                          .reduce(
                              (solved, key) => {
                                  if (solved) return true;
                                  const change = Math.abs(((prev?.[key] || 0) - (rect?.[key] || 0)));
                                  return (change > 10);
                              },
                              false
                          );

            if (!hasMoved) return noop;

            const spaceFound: Action_SpaceFound = { type: 'space-found', payload: { rect } };

            setPrev(rect);
            dispatch(spaceFound);

            return noop;
        },
        [pollKey]
    );
}

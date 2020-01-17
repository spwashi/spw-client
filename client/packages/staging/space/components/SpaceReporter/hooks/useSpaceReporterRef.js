import { useRef } from 'react';

export default function useSpaceReporterRef(ref) {
    const localRef: { current?: HTMLElement } = useRef();
    return ref || localRef;
}


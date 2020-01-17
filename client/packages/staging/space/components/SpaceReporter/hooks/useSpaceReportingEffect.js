import { useEffect } from 'react';

export default function useSpaceReportingEffect(state: DOMRect, [send, revoke], reportKey) {
    const teardown = revoke || (() => null);
    useEffect(
        () => {
            if (send) send(state);
            return teardown;
        },
        reportKey
    );
}

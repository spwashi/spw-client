export interface SpaceNodeState {
    id: string;
    position?: string;
    data: any;
    rect: DOMRect | undefined;
    children: {};

    renderKey: number | any;

    // Does it report?
    sentinel: boolean;
    parent: SpaceNodeState;
}

export interface SpaceNodeContextValue {
    reporter: HTMLElement;
    state: SpaceNodeState;

    queueUpdate(id: string): *;

    registerChild(id: string): *;

    unregisterChild(id: string): *;
}

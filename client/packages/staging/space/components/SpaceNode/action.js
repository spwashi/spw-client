export type SpaceFound = {
    type: 'space-found',
    payload: { rect: DOMRect }
};

export type RefreshChildren = {
    type: 'refresh-children'
}

export type RegisterChild = {
    type: 'register-child',
    payload: { id: string }
};

export type UpdateData = {
    type: 'update-data',
    payload: {
        data: *
    }
}

export type Destroy = {
    type: 'destroy',
};
export type SpaceNodeAction = SpaceFound | RegisterChild | UpdateData | RefreshChildren | Destroy;

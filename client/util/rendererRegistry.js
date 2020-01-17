import React from 'react';

export class RendererRegistry {

    #registry;

    constructor() {
        this.#registry = new Map;
    }

    get registry() {
        return this.#registry;
    }

    register(test, renderer) { return this.registry.set(test, renderer); }

    render({ concept }) {
        return [...this.registry.entries()]
            .reverse()
            .reduce(
                (previousValue, [test, Renderer]) => {
                    if (previousValue) return previousValue;
                    if (!test({ concept })) return null;
                    return <Renderer key="string-body" concept={concept} />;
                },
                null
            );
    }
}


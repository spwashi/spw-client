export class CacheMap {
    #map: Map;

    #oldestEntries: Set;

    limit;

    constructor() {
        this.#map           = new Map();
        this.#oldestEntries = new Set();
        this.limit          = 5;
    }

    get size() {
        return this.#map.size;
    }

    entries() {
        return this.#map.entries(); 
    }

    get(key) { return this.#map.get(key); }

    delete(key) { return this.#map.delete(key); }

    set(key, val) {
        if (this.#oldestEntries.size > this.limit) {
            for (const item of this.#oldestEntries) {
                this.delete(item);
            }
            this.#oldestEntries.clear();
        }
        return this.#map.set(key, val);
    }

    clear(key) { return this.#map.clear(key); }

    has(key) { return this.#map.has(key); }
}

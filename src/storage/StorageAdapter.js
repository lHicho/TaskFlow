
export class StorageAdapter {

    save(key, data) {
        throw new Error("Method 'save()' must be inplemented.");
    }
    load(key) {
        throw new Error("Method 'load()' must be inplemented.");
    }
    clear(key) {
        throw new Error("Method 'clear()' must be inplemented.");
    }
}
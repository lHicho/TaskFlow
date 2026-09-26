
import { StorageAdapter } from "./StorageAdapter";

export class LocalStorageAdapter extends StorageAdapter {

    save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            window.localStorage.setItem(key, serialized);
        } catch(err) {
            console.error(`LocalStorageAdapter: failed to save key "${key}. "`, err);
        }
    }
    load(key) {
        try {
            const raw = window.localStorage.getItem(key);
            if(!raw) return null;
            return JSON.parse(raw);
        } catch(err) {
            console.error(`LocalStorageAdapter: failed to parse key "${key}"`, err);
            return null;
        }
    }
    clear(key) {
        try {
            window.localStorage.removeItem(key);
        } catch(err) {
            console.error(`LocalStorageAdapter: Failed to clear key "${key}"`, err);
        }
    }
}
// Tiny in-memory SSE pub/sub keyed by songId.
// Single-process only. For multi-instance setups, swap to Redis pub/sub.

const subscribers = new Map(); // songId -> Set<res>
const lastEvent = new Map(); // songId -> snapshot

const writeEvent = (res, payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const subscribe = (songId, res) => {
    let set = subscribers.get(songId);
    if (!set) {
        set = new Set();
        subscribers.set(songId, set);
    }
    set.add(res);

    // Replay last known snapshot to new client
    const snap = lastEvent.get(songId);
    if (snap) writeEvent(res, snap);
};

export const unsubscribe = (songId, res) => {
    const set = subscribers.get(songId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) subscribers.delete(songId);
};

export const emit = (songId, payload) => {
    const snapshot = { ...payload, songId };
    lastEvent.set(songId, snapshot);
    const set = subscribers.get(songId);
    if (!set) return;
    for (const res of set) {
        try {
            writeEvent(res, snapshot);
        } catch {
            /* ignore */
        }
    }
    // Drop snapshot once terminal state reached so we don't leak memory
    if (snapshot.status === "ready" || snapshot.status === "failed") {
        setTimeout(() => lastEvent.delete(songId), 60_000);
    }
};

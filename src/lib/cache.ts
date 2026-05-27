"use client";

import { useEffect, useState } from "react";

type Entry<T> = { data: T; ts: number };
const store = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<() => void>>();

const DEFAULT_TTL_MS = 30_000;

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

export function invalidate(...keys: string[]) {
  for (const k of keys) {
    store.delete(k);
    notify(k);
  }
}

export function setCached<T>(key: string, data: T) {
  store.set(key, { data, ts: Date.now() });
  notify(key);
}

export function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): { data: T | undefined; loading: boolean; error: unknown; refresh: () => void } {
  const cached = store.get(key) as Entry<T> | undefined;
  const [data, setData] = useState<T | undefined>(cached?.data);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;

    const subscribers = listeners.get(key) ?? new Set();
    const sync = () => {
      if (!alive) return;
      const c = store.get(key) as Entry<T> | undefined;
      setData(c?.data);
    };
    subscribers.add(sync);
    listeners.set(key, subscribers);

    const current = store.get(key) as Entry<T> | undefined;
    const fresh = current && Date.now() - current.ts < ttlMs;

    if (!fresh) {
      let p = inflight.get(key) as Promise<T> | undefined;
      if (!p) {
        p = fetcher()
          .then((res) => {
            store.set(key, { data: res, ts: Date.now() });
            notify(key);
            return res;
          })
          .finally(() => inflight.delete(key));
        inflight.set(key, p);
      }
      p.then(
        () => alive && setLoading(false),
        (err) => {
          if (!alive) return;
          setError(err);
          setLoading(false);
        },
      );
    }

    return () => {
      alive = false;
      subscribers.delete(sync);
    };
  }, [key, ttlMs, fetcher]);

  const refresh = () => invalidate(key);
  return { data, loading, error, refresh };
}

export const CacheKeys = {
  screens: "screens",
  playlists: "playlists",
  media: "media",
} as const;

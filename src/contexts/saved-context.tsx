import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "fringe_saved_ids";
const INITIAL_SAVED_IDS = ["1", "2", "5"];

function getStorage() {
  if (Platform.OS === "web") {
    return {
      async get(key: string): Promise<string | null> {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      async set(key: string, value: string): Promise<void> {
        try {
          localStorage.setItem(key, value);
        } catch {
          // ignore
        }
      },
    };
  }

  let cached: Record<string, string> = {};
  return {
    async get(key: string): Promise<string | null> {
      try {
        const FileSystem = require("expo-file-system");
        const path = FileSystem.documentDirectory + key + ".json";
        const info = await FileSystem.getInfoAsync(path);
        if (info.exists) {
          const raw = await FileSystem.readAsStringAsync(path);
          cached[key] = raw;
          return raw;
        }
      } catch {
        // fall through
      }
      return cached[key] ?? null;
    },
    async set(key: string, value: string): Promise<void> {
      cached[key] = value;
      try {
        const FileSystem = require("expo-file-system");
        const path = FileSystem.documentDirectory + key + ".json";
        await FileSystem.writeAsStringAsync(path, value);
      } catch {
        // ignore
      }
    },
  };
}

const store = getStorage();

interface SavedContextValue {
  savedIds: Set<string>;
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(INITIAL_SAVED_IDS));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    store.get(STORAGE_KEY).then((raw) => {
      if (raw !== null) {
        try {
          const parsed: string[] = JSON.parse(raw);
          setSavedIds(new Set(parsed));
        } catch {
          // keep defaults
        }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      store.set(STORAGE_KEY, JSON.stringify([...savedIds]));
    }
  }, [savedIds, loaded]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.has(id),
    [savedIds],
  );

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}

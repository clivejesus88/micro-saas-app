import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ScrollContextValue {
  onScrollBeginDrag: () => void;
  onScrollEndDrag: () => void;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  isNavVisible: boolean;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isDragging = useRef(false);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  }, []);

  const scheduleShow = useCallback(() => {
    clearHideTimeout();
    hideTimeout.current = setTimeout(() => {
      setIsNavVisible(true);
    }, 600);
  }, [clearHideTimeout]);

  const onScrollBeginDrag = useCallback(() => {
    isDragging.current = true;
    clearHideTimeout();
    setIsNavVisible(false);
  }, [clearHideTimeout]);

  const onScrollEndDrag = useCallback(() => {
    isDragging.current = false;
    scheduleShow();
  }, [scheduleShow]);

  const onMomentumScrollBegin = useCallback(() => {
    clearHideTimeout();
  }, [clearHideTimeout]);

  const onMomentumScrollEnd = useCallback(() => {
    if (!isDragging.current) {
      scheduleShow();
    }
  }, [scheduleShow]);

  return (
    <ScrollContext.Provider
      value={{
        onScrollBeginDrag,
        onScrollEndDrag,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        isNavVisible,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    return {
      onScrollBeginDrag: () => {},
      onScrollEndDrag: () => {},
      onMomentumScrollBegin: () => {},
      onMomentumScrollEnd: () => {},
      isNavVisible: true,
    };
  }
  return ctx;
}

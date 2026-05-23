"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AppStateContextProps {
  bookmarks: string[];
  compareList: string[];
  toggleBookmark: (id: string) => void;
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isBookmarked: (id: string) => boolean;
  isComparing: (id: string) => boolean;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state from localStorage after hydration
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("cdp_bookmarks");
      const savedCompare = localStorage.getItem("cdp_compare");
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      if (savedCompare) setCompareList(JSON.parse(savedCompare));
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when bookmarks changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("cdp_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks", e);
    }
  }, [bookmarks, isHydrated]);

  // Save to localStorage when compareList changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("cdp_compare", JSON.stringify(compareList));
    } catch (e) {
      console.error("Failed to save comparison list", e);
    }
  }, [compareList, isHydrated]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCompare = (id: string): boolean => {
    if (compareList.includes(id)) return true;
    if (compareList.length >= 3) {
      return false; // Limit exceeded
    }
    setCompareList((prev) => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isBookmarked = (id: string): boolean => {
    return bookmarks.includes(id);
  };

  const isComparing = (id: string): boolean => {
    return compareList.includes(id);
  };

  return (
    <AppStateContext.Provider
      value={{
        bookmarks,
        compareList,
        toggleBookmark,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isBookmarked,
        isComparing,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

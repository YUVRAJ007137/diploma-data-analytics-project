"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * Global state for parsed semester data (CO1K, CO3K, CO5K).
 * Used by Upload page to store parsed Excel data and by Dashboard to display analysis.
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [semesterData, setSemesterDataState] = useState({
    CO1K: null,
    CO3K: null,
    CO5K: null,
  });

  const setSemesterData = useCallback((key, data) => {
    setSemesterDataState((prev) => ({ ...prev, [key]: data }));
  }, []);

  const setAllSemesterData = useCallback((data) => {
    setSemesterDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const clearData = useCallback(() => {
    setSemesterDataState({ CO1K: null, CO3K: null, CO5K: null });
  }, []);

  const hasAnyData = Boolean(
    semesterData.CO1K?.students?.length ||
      semesterData.CO3K?.students?.length ||
      semesterData.CO5K?.students?.length
  );

  return (
    <DataContext.Provider
      value={{
        semesterData,
        setSemesterData,
        setAllSemesterData,
        clearData,
        hasAnyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

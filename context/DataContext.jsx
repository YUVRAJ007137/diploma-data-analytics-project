"use client";

import { createContext, useContext, useMemo, useState } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([]);

  const addDataset = (incomingDataset) => {
    setDatasets((prev) => {
      const next = prev.filter(
        (item) =>
          !(
            item.year === incomingDataset.year &&
            item.session === incomingDataset.session &&
            item.branch === incomingDataset.branch &&
            item.institutionName === incomingDataset.institutionName
          )
      );

      return [...next, incomingDataset].sort((a, b) => `${a.year}${a.session}`.localeCompare(`${b.year}${b.session}`));
    });
  };

  const allStudents = useMemo(() => {
    return datasets.flatMap((dataset) => {
      return Object.entries(dataset.semesters || {}).flatMap(([semester, students]) =>
        students.map((student) => ({
          ...student,
          semester,
          year: dataset.year,
          branch: dataset.branch,
          session: dataset.session,
          institutionName: dataset.institutionName
        }))
      );
    });
  }, [datasets]);

  const value = useMemo(
    () => ({
      datasets,
      addDataset,
      allStudents
    }),
    [datasets, allStudents]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
}

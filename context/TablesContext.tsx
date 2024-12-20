"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Document {
  _id?: string;
  schemaName: string;
  tables: string[];
}

interface DataContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedSchema: number;
  setSelectedSchema: (schema: number) => void;
  selectedTable: string | null;
  setSelectedTable: (table: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const TableDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<number>(0);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {        
        const response = await fetch("http://localhost:8000/tables");
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await response.json();
        const tableData = Object.entries(data.tables);
        const finalData: Document[] = [];
        tableData.forEach(([key, value]) => {
          const doc: Document = {
            schemaName: key,
            tables: value as string[],
          };
          finalData.push(doc);
        });
        setDocuments(finalData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <DataContext.Provider value={{ documents, loading, error, selectedTable, setSelectedTable, selectedSchema, setSelectedSchema }}>
      {children}
    </DataContext.Provider>
  );
};

export const useTableDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a TableDataProvider");
  }
  return context;
};

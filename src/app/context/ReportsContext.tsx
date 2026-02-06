import { createContext, useContext, useState, ReactNode } from "react";

export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  table: string;
  columns: Array<{ id: string; name: string; type: string }>;
  filters: Array<{ id: string; column: string; operator: string; value: string }>;
  drillDownLevels: Array<{ id: string; column: string }>;
  chartType: string;
  dashboards: string[];
  createdAt: Date;
  lastModified: Date;
}

interface ReportsContextType {
  reports: SavedReport[];
  addReport: (report: Omit<SavedReport, "id" | "createdAt" | "lastModified">) => void;
  updateReport: (id: string, report: Partial<SavedReport>) => void;
  deleteReport: (id: string) => void;
  getReportsByDashboard: (dashboardId: string) => SavedReport[];
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<SavedReport[]>([
    {
      id: "r1",
      name: "Revenue Trend Analysis",
      description: "Monthly revenue tracking",
      table: "sales",
      columns: [
        { id: "1", name: "Month", type: "date" },
        { id: "2", name: "Revenue", type: "number" },
      ],
      filters: [],
      drillDownLevels: [{ id: "1", column: "Region" }],
      chartType: "area",
      dashboards: ["1", "2"],
      createdAt: new Date("2025-01-15"),
      lastModified: new Date("2025-02-01"),
    },
    {
      id: "r2",
      name: "Sales by Category",
      description: "Product category breakdown",
      table: "sales",
      columns: [
        { id: "1", name: "Category", type: "string" },
        { id: "2", name: "Sales", type: "number" },
      ],
      filters: [],
      drillDownLevels: [{ id: "1", column: "Product" }],
      chartType: "pie",
      dashboards: ["1", "2"],
      createdAt: new Date("2025-01-20"),
      lastModified: new Date("2025-01-28"),
    },
    {
      id: "r3",
      name: "Regional Performance",
      description: "Sales by region with state drill-down",
      table: "sales",
      columns: [
        { id: "1", name: "Region", type: "string" },
        { id: "2", name: "Sales", type: "number" },
      ],
      filters: [],
      drillDownLevels: [{ id: "1", column: "State" }],
      chartType: "bar",
      dashboards: ["1", "2"],
      createdAt: new Date("2025-01-18"),
      lastModified: new Date("2025-02-02"),
    },
  ]);

  const addReport = (report: Omit<SavedReport, "id" | "createdAt" | "lastModified">) => {
    const newReport: SavedReport = {
      ...report,
      id: `r${Date.now()}`,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setReports([...reports, newReport]);
  };

  const updateReport = (id: string, update: Partial<SavedReport>) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, ...update, lastModified: new Date() } : r
    ));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const getReportsByDashboard = (dashboardId: string) => {
    return reports.filter(r => r.dashboards.includes(dashboardId));
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      updateReport,
      deleteReport,
      getReportsByDashboard,
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within ReportsProvider");
  }
  return context;
}

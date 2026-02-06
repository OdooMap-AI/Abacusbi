import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DataSources } from "./pages/DataSources";
import { ReportBuilder } from "./pages/ReportBuilder";
import { Dashboard } from "./pages/Dashboard";
import { Scheduling } from "./pages/Scheduling";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "data-sources", Component: DataSources },
      { path: "report-builder", Component: ReportBuilder },
      { path: "dashboard", Component: Dashboard },
      { path: "scheduling", Component: Scheduling },
    ],
  },
]);
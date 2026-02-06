import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { ReportsProvider } from "./context/ReportsContext";

export default function App() {
  return (
    <ReportsProvider>
      <RouterProvider router={router} />
    </ReportsProvider>
  );
}
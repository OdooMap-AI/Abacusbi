import { useState } from "react";
import { useReports } from "../context/ReportsContext";
import {
  Table,
  Columns,
  Filter,
  ChevronDown,
  Plus,
  X,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Play,
  Save,
  LayoutDashboard,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

interface Column {
  id: string;
  name: string;
  type: "string" | "number" | "date";
  table: string;
}

interface FilterRule {
  id: string;
  column: string;
  operator: string;
  value: string;
}

interface DrillDownLevel {
  id: string;
  column: string;
}

const availableDashboards = [
  { id: "1", name: "Executive Overview", team: "Leadership" },
  { id: "2", name: "Sales Performance", team: "Sales" },
  { id: "3", name: "Marketing Analytics", team: "Marketing" },
  { id: "4", name: "Operations Dashboard", team: "Operations" },
];

export function ReportBuilder() {
  const { addReport } = useReports();
  const [selectedTable, setSelectedTable] = useState("sales");
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([
    { id: "1", name: "Product Name", type: "string", table: "sales" },
    { id: "2", name: "Revenue", type: "number", table: "sales" },
  ]);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [drillDownLevels, setDrillDownLevels] = useState<DrillDownLevel[]>([
    { id: "1", column: "Region" },
  ]);
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const availableTables = [
    { name: "sales", label: "Sales Data" },
    { name: "customers", label: "Customers" },
    { name: "products", label: "Products" },
    { name: "orders", label: "Orders" },
  ];

  const availableColumns: Record<string, Column[]> = {
    sales: [
      { id: "s1", name: "Product Name", type: "string", table: "sales" },
      { id: "s2", name: "Revenue", type: "number", table: "sales" },
      { id: "s3", name: "Quantity", type: "number", table: "sales" },
      { id: "s4", name: "Region", type: "string", table: "sales" },
      { id: "s5", name: "Date", type: "date", table: "sales" },
      { id: "s6", name: "Category", type: "string", table: "sales" },
    ],
    customers: [
      { id: "c1", name: "Customer Name", type: "string", table: "customers" },
      { id: "c2", name: "Email", type: "string", table: "customers" },
      { id: "c3", name: "Total Spent", type: "number", table: "customers" },
    ],
  };

  const chartTypes = [
    { type: "bar", icon: BarChart3, label: "Bar Chart" },
    { type: "line", icon: LineChart, label: "Line Chart" },
    { type: "pie", icon: PieChart, label: "Pie Chart" },
    { type: "area", icon: Activity, label: "Area Chart" },
  ];

  const handleAddColumn = (column: Column) => {
    if (!selectedColumns.find((c) => c.id === column.id)) {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    setSelectedColumns(selectedColumns.filter((c) => c.id !== columnId));
  };

  const handleAddDrillDown = (column: string) => {
    const newLevel: DrillDownLevel = {
      id: Date.now().toString(),
      column,
    };
    setDrillDownLevels([...drillDownLevels, newLevel]);
  };

  const handleAddFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      column: selectedColumns[0]?.name || "",
      operator: "equals",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter((f) => f.id !== filterId));
  };

  const toggleDashboard = (dashboardId: string) => {
    if (selectedDashboards.includes(dashboardId)) {
      setSelectedDashboards(selectedDashboards.filter(id => id !== dashboardId));
    } else {
      setSelectedDashboards([...selectedDashboards, dashboardId]);
    }
  };

  const handleSaveReport = () => {
    // In a real app, this would save the report configuration
    addReport({
      name: reportName,
      description: reportDescription,
      table: selectedTable,
      columns: selectedColumns,
      filters,
      drillDownLevels,
      chartType: selectedChartType,
      dashboards: selectedDashboards,
    });
    setShowSaveModal(false);
    setReportName("");
    setReportDescription("");
    setSelectedDashboards([]);
    // Show success message
    alert(`Report "${reportName}" saved successfully!`);
  };

  const handleExport = (format: string) => {
    // In a real app, this would trigger the export
    console.log(`Exporting report as ${format}`);
    alert(`Exporting report as ${format.toUpperCase()}...`);
    setShowExportModal(false);
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Left Sidebar - Data Selection */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Data Source</h3>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {availableTables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Columns className="w-4 h-4" />
            Available Columns
          </h3>
          <div className="space-y-2">
            {(availableColumns[selectedTable] || []).map((column) => (
              <button
                key={column.id}
                onClick={() => handleAddColumn(column)}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{column.name}</span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {column.type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Report Builder</h2>
              <p className="text-sm text-slate-600">Create custom reports with drill-down analysis</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                Save to Dashboard
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4" />
                Run Report
              </button>
            </div>
          </div>

          {/* Selected Columns */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Selected Columns</label>
            <div className="flex flex-wrap gap-2">
              {selectedColumns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center gap-2 px-3 py-2 bg-violet-100 text-violet-900 rounded-lg"
                >
                  <span className="text-sm font-medium">{column.name}</span>
                  <button
                    onClick={() => handleRemoveColumn(column.id)}
                    className="hover:bg-violet-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedColumns.length === 0 && (
                <p className="text-sm text-slate-500 italic">
                  Click columns from the left panel to add them
                </p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Filters</label>
              <button
                onClick={handleAddFilter}
                className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Filter
              </button>
            </div>
            {filters.length > 0 ? (
              <div className="space-y-2">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2">
                    <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm flex-1">
                      {selectedColumns.map((col) => (
                        <option key={col.id} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                    <select className="px-3 py-2 rounded-lg border border-slate-300 text-sm">
                      <option value="equals">Equals</option>
                      <option value="contains">Contains</option>
                      <option value="greater">Greater Than</option>
                      <option value="less">Less Than</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      className="px-3 py-2 rounded-lg border border-slate-300 text-sm flex-1"
                    />
                    <button
                      onClick={() => handleRemoveFilter(filter.id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No filters applied</p>
            )}
          </div>

          {/* Drill-Down Levels */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Drill-Down Hierarchy
            </label>
            <div className="flex items-center gap-2">
              {drillDownLevels.map((level, index) => (
                <div key={level.id} className="flex items-center gap-2">
                  {index > 0 && <ChevronDown className="w-4 h-4 text-slate-400" />}
                  <div className="px-3 py-2 bg-indigo-100 text-indigo-900 rounded-lg text-sm font-medium">
                    {level.column}
                  </div>
                </div>
              ))}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddDrillDown(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
              >
                <option value="">+ Add Level</option>
                {selectedColumns.map((col) => (
                  <option key={col.id} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6 h-full">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">Visualization Type</h3>
              <div className="flex gap-3">
                {chartTypes.map((chart) => {
                  const Icon = chart.icon;
                  return (
                    <button
                      key={chart.type}
                      onClick={() => setSelectedChartType(chart.type)}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                        ${
                          selectedChartType === chart.type
                            ? "border-violet-600 bg-violet-50 text-violet-900"
                            : "border-slate-200 hover:border-slate-300"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{chart.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Report Preview</p>
                <p className="text-sm text-slate-500">
                  Click "Run Report" to generate visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save to Dashboard Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Save Report to Dashboard</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Report Name *
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Regional Sales Analysis"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Brief description of this report"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Add to Dashboards *
                </label>
                <p className="text-xs text-slate-500 mb-3">Select which dashboards should display this report</p>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {availableDashboards.map((dashboard) => (
                    <label
                      key={dashboard.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDashboards.includes(dashboard.id)}
                        onChange={() => toggleDashboard(dashboard.id)}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{dashboard.name}</div>
                        <div className="text-xs text-slate-500">{dashboard.team}</div>
                      </div>
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    </label>
                  ))}
                </div>
              </div>

              {selectedDashboards.length > 0 && (
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                  <p className="text-sm text-violet-900">
                    <strong>{selectedDashboards.length}</strong> dashboard{selectedDashboards.length > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setReportName("");
                  setReportDescription("");
                  setSelectedDashboards([]);
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                disabled={!reportName || selectedDashboards.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Export Report</h3>
            <p className="text-sm text-slate-600 mb-6">Choose a format to export this report</p>

            <div className="space-y-3">
              <button
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                <FileText className="w-6 h-6 text-red-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">PDF Document</div>
                  <div className="text-xs text-slate-600">Best for reports and presentations</div>
                </div>
              </button>

              <button
                onClick={() => handleExport("excel")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">Excel Spreadsheet</div>
                  <div className="text-xs text-slate-600">Editable data with formatting</div>
                </div>
              </button>

              <button
                onClick={() => handleExport("csv")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-900">CSV File</div>
                  <div className="text-xs text-slate-600">Raw data for analysis</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-6 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
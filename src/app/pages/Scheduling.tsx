import { useState } from "react";
import { useReports } from "../context/ReportsContext";
import {
  Calendar,
  Clock,
  Mail,
  Link as LinkIcon,
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";

interface Schedule {
  id: string;
  contentType: "report" | "dashboard";
  contentId: string;
  contentName: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  format: "pdf" | "excel" | "csv";
  recipients: string[];
  time: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun: Date;
  includeInsights: boolean;
  includeRawData: boolean;
  includeCharts: boolean;
}

const availableDashboards = [
  { id: "1", name: "Executive Overview", team: "Leadership" },
  { id: "2", name: "Sales Performance", team: "Sales" },
  { id: "3", name: "Marketing Analytics", team: "Marketing" },
  { id: "4", name: "Operations Dashboard", team: "Operations" },
];

export function Scheduling() {
  const { reports } = useReports();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      contentType: "dashboard",
      contentId: "2",
      contentName: "Sales Performance",
      name: "Weekly Sales Summary",
      frequency: "weekly",
      format: "pdf",
      recipients: ["sales@company.com", "manager@company.com"],
      time: "09:00",
      enabled: true,
      lastRun: new Date("2025-01-27"),
      nextRun: new Date("2025-02-10"),
      includeInsights: true,
      includeRawData: false,
      includeCharts: true,
    },
    {
      id: "2",
      contentType: "report",
      contentId: "r1",
      contentName: "Revenue Trend Analysis",
      name: "Monthly Revenue Report",
      frequency: "monthly",
      format: "excel",
      recipients: ["finance@company.com"],
      time: "08:00",
      enabled: true,
      lastRun: new Date("2025-01-01"),
      nextRun: new Date("2025-03-01"),
      includeInsights: true,
      includeRawData: true,
      includeCharts: true,
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    contentType: "dashboard" as "report" | "dashboard",
    contentId: "",
    name: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    format: "pdf" as "pdf" | "excel" | "csv",
    recipients: "",
    time: "09:00",
    includeInsights: true,
    includeRawData: false,
    includeCharts: true,
  });

  const aiInsights = [
    {
      type: "increase",
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      title: "Revenue increased by 22%",
      description: "Compared to last week, your revenue has grown significantly driven by the Electronics category.",
      timestamp: "Based on data from Feb 3, 2026",
    },
    {
      type: "alert",
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-50",
      title: "Customer churn rate rising",
      description: "There's a 5% increase in customer churn. Consider reviewing your retention strategies.",
      timestamp: "Based on data from Feb 3, 2026",
    },
    {
      type: "success",
      icon: CheckCircle,
      color: "text-blue-600 bg-blue-50",
      title: "Regional performance balanced",
      description: "All regions are performing within expected ranges with East region leading.",
      timestamp: "Based on data from Feb 3, 2026",
    },
  ];

  const handleCreateSchedule = () => {
    if (newSchedule.name && newSchedule.contentId && newSchedule.recipients) {
      const contentName = newSchedule.contentType === "dashboard"
        ? availableDashboards.find(d => d.id === newSchedule.contentId)?.name || ""
        : reports.find(r => r.id === newSchedule.contentId)?.name || "";

      const schedule: Schedule = {
        id: Date.now().toString(),
        contentType: newSchedule.contentType,
        contentId: newSchedule.contentId,
        contentName,
        name: newSchedule.name,
        frequency: newSchedule.frequency,
        format: newSchedule.format,
        recipients: newSchedule.recipients.split(",").map((r) => r.trim()),
        time: newSchedule.time,
        enabled: true,
        nextRun: new Date(Date.now() + 86400000), // Tomorrow
        includeInsights: newSchedule.includeInsights,
        includeRawData: newSchedule.includeRawData,
        includeCharts: newSchedule.includeCharts,
      };
      setSchedules([...schedules, schedule]);
      setShowCreateModal(false);
      setNewSchedule({
        contentType: "dashboard",
        contentId: "",
        name: "",
        frequency: "weekly",
        format: "pdf",
        recipients: "",
        time: "09:00",
        includeInsights: true,
        includeRawData: false,
        includeCharts: true,
      });
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Scheduling & Exports</h2>
          <p className="text-slate-600">
            Automate your reports and get AI-powered insights delivered on schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Scheduled Reports */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Schedule */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Schedule a New Export</h3>
                  <p className="text-violet-100 text-sm">
                    Automate report or dashboard exports and delivery to your team
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-white text-violet-600 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Schedule
                </button>
              </div>
            </div>

            {/* Scheduled Reports List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Active Schedules</h3>
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {schedule.contentType === "dashboard" ? (
                          <LayoutDashboard className="w-5 h-5 text-violet-600" />
                        ) : (
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        )}
                        <h4 className="font-semibold text-slate-900">{schedule.name}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            schedule.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {schedule.enabled ? "active" : "paused"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        <span className="font-medium capitalize">{schedule.contentType}:</span> {schedule.contentName}
                      </p>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="capitalize">{schedule.frequency} at {schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Next run: {schedule.nextRun.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{schedule.recipients.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>Format: {schedule.format.toUpperCase()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {schedule.includeCharts && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">📊 Charts</span>
                          )}
                          {schedule.includeInsights && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">✨ AI Insights</span>
                          )}
                          {schedule.includeRawData && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">📁 Raw Data</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleSchedule(schedule.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all text-sm font-medium">
                      Run Now
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Export */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Export</h3>
              <p className="text-sm text-slate-600 mb-4">
                Export current dashboard data instantly
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all">
                  <FileText className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-sm">PDF</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-sm">Excel</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-sm">CSV</span>
                </button>
              </div>
            </div>

            {/* Dashboard Links */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Share Dashboard</h3>
              <p className="text-sm text-slate-600 mb-4">
                Generate secure links to share your dashboards with stakeholders
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  readOnly
                  value="https://abacus.app/shared/abc123xyz"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 text-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold text-lg">AI Insights</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Automated analysis of your latest data changes
              </p>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${insight.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {insight.description}
                        </p>
                        <p className="text-xs text-slate-500">{insight.timestamp}</p>
                      </div>
                    </div>
                  </div>
                );
              })}</div>

            {/* AI Settings */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Insight Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Enable AI insights in reports</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Anomaly detection</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Trend predictions</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Create Schedule Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Create New Schedule</h3>

              <div className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    What do you want to schedule? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setNewSchedule({ ...newSchedule, contentType: "dashboard", contentId: "" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        newSchedule.contentType === "dashboard"
                          ? "border-violet-600 bg-violet-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <LayoutDashboard className={`w-6 h-6 mb-2 ${
                        newSchedule.contentType === "dashboard" ? "text-violet-600" : "text-slate-400"
                      }`} />
                      <div className="font-semibold text-slate-900 mb-1">Dashboard</div>
                      <div className="text-xs text-slate-600">Export an entire dashboard with all its reports</div>
                    </button>

                    <button
                      onClick={() => setNewSchedule({ ...newSchedule, contentType: "report", contentId: "" })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        newSchedule.contentType === "report"
                          ? "border-violet-600 bg-violet-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <BarChart3 className={`w-6 h-6 mb-2 ${
                        newSchedule.contentType === "report" ? "text-violet-600" : "text-slate-400"
                      }`} />
                      <div className="font-semibold text-slate-900 mb-1">Individual Report</div>
                      <div className="text-xs text-slate-600">Export a specific report visualization</div>
                    </button>
                  </div>
                </div>

                {/* Content Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select {newSchedule.contentType === "dashboard" ? "Dashboard" : "Report"} *
                  </label>
                  <select
                    value={newSchedule.contentId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, contentId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Choose a {newSchedule.contentType}...</option>
                    {newSchedule.contentType === "dashboard" ? (
                      availableDashboards.map((dashboard) => (
                        <option key={dashboard.id} value={dashboard.id}>
                          {dashboard.name} ({dashboard.team})
                        </option>
                      ))
                    ) : (
                      reports.map((report) => (
                        <option key={report.id} value={report.id}>
                          {report.name} - {report.chartType}
                        </option>
                      ))
                    )}
                  </select>
                  {newSchedule.contentId && (
                    <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      {newSchedule.contentType === "dashboard" ? (
                        <>
                          <strong>Dashboard export includes:</strong> All reports, KPIs, and visualizations from this dashboard
                        </>
                      ) : (
                        <>
                          <strong>Report export includes:</strong> The selected visualization and its underlying data
                        </>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Schedule Name *
                  </label>
                  <input
                    type="text"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    placeholder="e.g., Weekly Sales Summary"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={newSchedule.frequency}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          frequency: e.target.value as "daily" | "weekly" | "monthly",
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Export Format *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["pdf", "excel", "csv"].map((format) => (
                      <button
                        key={format}
                        onClick={() =>
                          setNewSchedule({
                            ...newSchedule,
                            format: format as "pdf" | "excel" | "csv",
                          })
                        }
                        className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all ${
                          newSchedule.format === format
                            ? "border-violet-600 bg-violet-50 text-violet-900"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Recipients *
                  </label>
                  <input
                    type="text"
                    value={newSchedule.recipients}
                    onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                    placeholder="email1@company.com, email2@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">Separate multiple emails with commas</p>
                </div>

                {/* Export Options */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    What to include in the export
                  </label>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.includeCharts}
                        onChange={(e) => setNewSchedule({ ...newSchedule, includeCharts: e.target.checked })}
                        className="w-5 h-5 mt-0.5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">Charts & Visualizations</div>
                        <div className="text-xs text-slate-600">Include all graphs, charts, and visual elements</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.includeInsights}
                        onChange={(e) => setNewSchedule({ ...newSchedule, includeInsights: e.target.checked })}
                        className="w-5 h-5 mt-0.5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          AI Insights & Analysis
                          <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-xs text-slate-600">Include automated insights about data changes, trends, and anomalies</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSchedule.includeRawData}
                        onChange={(e) => setNewSchedule({ ...newSchedule, includeRawData: e.target.checked })}
                        className="w-5 h-5 mt-0.5 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">Raw Dataset</div>
                        <div className="text-xs text-slate-600">Include the underlying data tables (Excel/CSV only)</div>
                      </div>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    💡 Tip: Including raw data is helpful for stakeholders who want to perform their own analysis
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSchedule({
                      contentType: "dashboard",
                      contentId: "",
                      name: "",
                      frequency: "weekly",
                      format: "pdf",
                      recipients: "",
                      time: "09:00",
                      includeInsights: true,
                      includeRawData: false,
                      includeCharts: true,
                    });
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSchedule}
                  disabled={!newSchedule.name || !newSchedule.contentId || !newSchedule.recipients}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
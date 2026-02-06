import { useState } from "react";
import { Plus, Database, Check, Settings, Trash2 } from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected";
  lastSync?: string;
}

const availableDataSources = [
  { type: "Supabase", icon: "🟢", color: "from-green-500 to-emerald-600" },
  { type: "PostgreSQL", icon: "🐘", color: "from-blue-500 to-blue-600" },
  { type: "MySQL", icon: "🐬", color: "from-orange-500 to-orange-600" },
  { type: "Odoo", icon: "🟣", color: "from-purple-500 to-purple-600" },
  { type: "Redshift", icon: "🔴", color: "from-red-500 to-red-600" },
  { type: "Snowflake", icon: "❄️", color: "from-cyan-500 to-blue-600" },
  { type: "BigQuery", icon: "📊", color: "from-blue-400 to-indigo-600" },
  { type: "MongoDB", icon: "🍃", color: "from-green-600 to-green-700" },
];

export function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Production DB",
      type: "PostgreSQL",
      status: "connected",
      lastSync: "2 minutes ago",
    },
    {
      id: "2",
      name: "Analytics Warehouse",
      type: "Snowflake",
      status: "connected",
      lastSync: "5 minutes ago",
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [connectionName, setConnectionName] = useState("");

  const handleAddDataSource = () => {
    if (connectionName && selectedType) {
      const newSource: DataSource = {
        id: Date.now().toString(),
        name: connectionName,
        type: selectedType,
        status: "connected",
        lastSync: "Just now",
      };
      setDataSources([...dataSources, newSource]);
      setShowAddModal(false);
      setConnectionName("");
      setSelectedType("");
    }
  };

  const handleDelete = (id: string) => {
    setDataSources(dataSources.filter((ds) => ds.id !== id));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Data Sources</h2>
          <p className="text-slate-600">
            Connect and manage your data sources for reporting and analytics
          </p>
        </div>

        {/* Connected Data Sources */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900">Connected Sources</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Data Source
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source) => {
              const sourceConfig = availableDataSources.find((s) => s.type === source.type);
              return (
                <div
                  key={source.id}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sourceConfig?.color} flex items-center justify-center text-2xl shadow-md`}
                      >
                        {sourceConfig?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{source.name}</h4>
                        <p className="text-sm text-slate-500">{source.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <Settings className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        source.status === "connected" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-slate-600">
                      {source.status === "connected" ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  {source.lastSync && (
                    <p className="text-xs text-slate-500 mt-2">Last sync: {source.lastSync}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Data Sources */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Available Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableDataSources.map((source) => (
              <button
                key={source.type}
                onClick={() => {
                  setSelectedType(source.type);
                  setShowAddModal(true);
                }}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all text-center"
              >
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-br ${source.color} flex items-center justify-center text-3xl shadow-md mx-auto mb-3`}
                >
                  {source.icon}
                </div>
                <p className="font-medium text-slate-900 text-sm">{source.type}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Add Data Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Add Data Source</h3>
              <p className="text-slate-600 mb-6">Connect a new data source to Abacus</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Data Source Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Select a type...</option>
                    {availableDataSources.map((source) => (
                      <option key={source.type} value={source.type}>
                        {source.icon} {source.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Connection Name
                  </label>
                  <input
                    type="text"
                    value={connectionName}
                    onChange={(e) => setConnectionName(e.target.value)}
                    placeholder="e.g., Production Database"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Connection String
                  </label>
                  <input
                    type="text"
                    placeholder="postgresql://user:pass@host:5432/db"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDataSource}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

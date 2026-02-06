import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity, Plus, LayoutDashboard, Edit, Trash2, Star, ChevronRight, ArrowLeft, GripVertical, Save } from "lucide-react";

interface DashboardConfig {
  id: string;
  name: string;
  team: string;
  description: string;
  favorite: boolean;
}

interface DrillDownLevel {
  level: string;
  value?: string;
}

interface WidgetPosition {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const salesData = [
  { month: "Jan", revenue: 45000, orders: 234, customers: 189 },
  { month: "Feb", revenue: 52000, orders: 267, customers: 215 },
  { month: "Mar", revenue: 48000, orders: 245, customers: 198 },
  { month: "Apr", revenue: 61000, orders: 312, customers: 251 },
  { month: "May", revenue: 55000, orders: 289, customers: 234 },
  { month: "Jun", revenue: 67000, orders: 342, customers: 278 },
];

// Drill-down data for category breakdown
const categoryDrillDownData: Record<string, any[]> = {
  Electronics: [
    { product: "Laptops", value: 45 },
    { product: "Phones", value: 30 },
    { product: "Tablets", value: 25 },
  ],
  Clothing: [
    { product: "Shirts", value: 40 },
    { product: "Pants", value: 35 },
    { product: "Shoes", value: 25 },
  ],
  "Home & Garden": [
    { product: "Furniture", value: 50 },
    { product: "Decor", value: 30 },
    { product: "Tools", value: 20 },
  ],
  Sports: [
    { product: "Equipment", value: 60 },
    { product: "Apparel", value: 40 },
  ],
};

const categoryData = [
  { name: "Electronics", value: 35, color: "#8b5cf6" },
  { name: "Clothing", value: 28, color: "#3b82f6" },
  { name: "Home & Garden", value: 22, color: "#06b6d4" },
  { name: "Sports", value: 15, color: "#10b981" },
];

const regionData = [
  { region: "North", sales: 125000 },
  { region: "South", sales: 98000 },
  { region: "East", sales: 142000 },
  { region: "West", sales: 118000 },
];

// Regional drill-down data
const regionDrillDownData: Record<string, any[]> = {
  North: [
    { state: "NY", sales: 65000 },
    { state: "MA", sales: 38000 },
    { state: "PA", sales: 22000 },
  ],
  South: [
    { state: "TX", sales: 48000 },
    { state: "FL", sales: 35000 },
    { state: "GA", sales: 15000 },
  ],
  East: [
    { state: "NJ", sales: 72000 },
    { state: "VA", sales: 45000 },
    { state: "NC", sales: 25000 },
  ],
  West: [
    { state: "CA", sales: 78000 },
    { state: "WA", sales: 28000 },
    { state: "OR", sales: 12000 },
  ],
};

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  position: WidgetPosition;
  isEditMode: boolean;
  onMove: (id: string, x: number, y: number) => void;
}

function DraggableWidget({ id, children, position, isEditMode, onMove }: DraggableWidgetProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'widget',
    item: { id, x: position.x, y: position.y },
    canDrag: isEditMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'widget',
    hover: (item: { id: string; x: number; y: number }, monitor) => {
      if (!isEditMode) return;
      
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      // Grid snapping (24px grid)
      const gridSize = 24;
      const x = Math.round((item.x + delta.x) / gridSize) * gridSize;
      const y = Math.round((item.y + delta.y) / gridSize) * gridSize;

      if (x !== position.x || y !== position.y) {
        onMove(item.id, Math.max(0, x), Math.max(0, y));
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (isEditMode) {
          drag(drop(node));
        }
      }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
      }}
      className={isEditMode ? 'cursor-move' : ''}
    >
      {isEditMode && (
        <div className="absolute -top-2 -left-2 bg-violet-600 text-white p-1 rounded z-10">
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      {children}
    </div>
  );
}

export function Dashboard() {
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([
    { id: "1", name: "Executive Overview", team: "Leadership", description: "High-level KPIs and trends", favorite: true },
    { id: "2", name: "Sales Performance", team: "Sales", description: "Revenue, orders, and customer metrics", favorite: false },
    { id: "3", name: "Marketing Analytics", team: "Marketing", description: "Campaign performance and ROI", favorite: false },
    { id: "4", name: "Operations Dashboard", team: "Operations", description: "Inventory and fulfillment metrics", favorite: false },
  ]);
  const [activeDashboard, setActiveDashboard] = useState<string>("1");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDashboardList, setShowDashboardList] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: "", team: "", description: "" });
  const [drillDownPath, setDrillDownPath] = useState<DrillDownLevel[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [widgetPositions, setWidgetPositions] = useState<Record<string, WidgetPosition>>({
    revenue: { id: 'revenue', x: 0, y: 0, w: 1, h: 1 },
    category: { id: 'category', x: 1, y: 0, w: 1, h: 1 },
    orders: { id: 'orders', x: 0, y: 1, w: 1, h: 1 },
    regional: { id: 'regional', x: 1, y: 1, w: 1, h: 1 },
  });

  const currentDashboard = dashboards.find(d => d.id === activeDashboard);

  const handleCreateDashboard = () => {
    if (newDashboard.name && newDashboard.team) {
      const dashboard: DashboardConfig = {
        id: Date.now().toString(),
        ...newDashboard,
        favorite: false,
      };
      setDashboards([...dashboards, dashboard]);
      setActiveDashboard(dashboard.id);
      setShowCreateModal(false);
      setNewDashboard({ name: "", team: "", description: "" });
    }
  };

  const handleDeleteDashboard = (id: string) => {
    setDashboards(dashboards.filter(d => d.id !== id));
    if (activeDashboard === id) {
      setActiveDashboard(dashboards[0]?.id || "");
    }
  };

  const toggleFavorite = (id: string) => {
    setDashboards(dashboards.map(d => 
      d.id === id ? { ...d, favorite: !d.favorite } : d
    ));
  };

  const handleCategoryClick = (data: any) => {
    if (data && data.name) {
      setDrillDownPath([...drillDownPath, { level: "category", value: data.name }]);
    }
  };

  const handleRegionClick = (data: any) => {
    if (data && data.region) {
      setDrillDownPath([...drillDownPath, { level: "region", value: data.region }]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setDrillDownPath(drillDownPath.slice(0, index));
  };

  const handleWidgetMove = (id: string, x: number, y: number) => {
    setWidgetPositions(prev => ({
      ...prev,
      [id]: { ...prev[id], x, y },
    }));
  };

  const getCategoryDisplayData = () => {
    const categoryDrill = drillDownPath.find(d => d.level === "category");
    if (categoryDrill && categoryDrill.value) {
      const drillData = categoryDrillDownData[categoryDrill.value] || [];
      return drillData.map((item, index) => ({
        ...item,
        name: item.product,
        color: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981"][index % 4],
      }));
    }
    return categoryData;
  };

  const getRegionalDisplayData = () => {
    const regionDrill = drillDownPath.find(d => d.level === "region");
    if (regionDrill && regionDrill.value) {
      return regionDrillDownData[regionDrill.value] || [];
    }
    return regionData;
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Top Bar with Dashboard Selector */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDashboardList(!showDashboardList)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
            >
              <LayoutDashboard className="w-5 h-5 text-violet-600" />
              <div className="text-left">
                <div className="font-semibold text-slate-900">{currentDashboard?.name}</div>
                <div className="text-xs text-slate-500">{currentDashboard?.team}</div>
              </div>
            </button>
            {currentDashboard?.favorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          
          <div className="flex gap-3">
            {isEditMode ? (
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                Save Layout
              </button>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Layout
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Dashboard
            </button>
          </div>
        </div>

        {/* Dashboard List Dropdown */}
        {showDashboardList && (
          <div className="max-w-[1600px] mx-auto mt-4 bg-white border border-slate-200 rounded-xl shadow-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  onClick={() => {
                    setActiveDashboard(dashboard.id);
                    setShowDashboardList(false);
                  }}
                  className={`text-left p-4 rounded-lg transition-all cursor-pointer ${
                    activeDashboard === dashboard.id
                      ? "bg-violet-50 border-2 border-violet-300"
                      : "hover:bg-slate-50 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 mb-1">{dashboard.name}</div>
                      <div className="text-xs text-violet-600 font-medium mb-1">{dashboard.team}</div>
                      <div className="text-xs text-slate-600">{dashboard.description}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(dashboard.id);
                        }}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Star className={`w-4 h-4 ${dashboard.favorite ? "text-yellow-500 fill-yellow-500" : "text-slate-400"}`} />
                      </button>
                      {dashboards.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDashboard(dashboard.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {drillDownPath.length > 0 && (
              <>
                <button
                  onClick={() => setDrillDownPath([])}
                  className="text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Overview
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Overview</span>
                  {drillDownPath.map((drill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <button
                        onClick={() => handleBreadcrumbClick(index + 1)}
                        className="hover:text-violet-600"
                      >
                        {drill.value}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <p className="text-slate-600">{currentDashboard?.description}</p>
          {isEditMode && (
            <div className="mt-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Edit Mode:</strong> Drag widgets to reposition them. Changes snap to a 24px grid for perfect alignment.
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +12.5%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">$328,000</h3>
            <p className="text-sm text-slate-600">Total Revenue</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +8.2%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">1,689</h3>
            <p className="text-sm text-slate-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +15.3%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">1,365</h3>
            <p className="text-sm text-slate-600">Total Customers</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                <TrendingDown className="w-4 h-4" />
                -2.4%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">$194</h3>
            <p className="text-sm text-slate-600">Avg Order Value</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <DraggableWidget
            id="revenue"
            position={widgetPositions.revenue}
            isEditMode={isEditMode}
            onMove={handleWidgetMove}
          >
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </DraggableWidget>

          {/* Sales by Category */}
          <DraggableWidget
            id="category"
            position={widgetPositions.category}
            isEditMode={isEditMode}
            onMove={handleWidgetMove}
          >
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Sales by Category</h3>
              {drillDownPath.length === 0 && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Click to drill down
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryDisplayData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handleCategoryClick}
                  cursor="pointer"
                >
                  {getCategoryDisplayData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          </DraggableWidget>

          {/* Orders & Customers */}
          <DraggableWidget
            id="orders"
            position={widgetPositions.orders}
            isEditMode={isEditMode}
            onMove={handleWidgetMove}
          >
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Orders & Customers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="customers"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </DraggableWidget>

          {/* Regional Performance */}
          <DraggableWidget
            id="regional"
            position={widgetPositions.regional}
            isEditMode={isEditMode}
            onMove={handleWidgetMove}
          >
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Regional Performance</h3>
              {drillDownPath.length === 0 && (
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Click bars to drill down
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRegionalDisplayData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={drillDownPath.find(d => d.level === "region") ? "state" : "region"} stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]}
                  onClick={handleRegionClick}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </DraggableWidget>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "New order received", detail: "Order #4521 - $1,234.00", time: "2 min ago", color: "bg-blue-100 text-blue-700" },
              { action: "Report generated", detail: "Q1 Sales Report", time: "15 min ago", color: "bg-green-100 text-green-700" },
              { action: "Data source synced", detail: "PostgreSQL - Production DB", time: "1 hour ago", color: "bg-purple-100 text-purple-700" },
              { action: "New customer registered", detail: "john.doe@example.com", time: "2 hours ago", color: "bg-orange-100 text-orange-700" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${activity.color.replace('100', '500')}`} />
                  <div>
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.detail}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Create Dashboard Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Create New Dashboard</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dashboard Name *
                </label>
                <input
                  type="text"
                  value={newDashboard.name}
                  onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                  placeholder="e.g., Sales Performance"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Team/Department *
                </label>
                <select
                  value={newDashboard.team}
                  onChange={(e) => setNewDashboard({ ...newDashboard, team: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Select a team...</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Product">Product</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newDashboard.description}
                  onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                  placeholder="Brief description of this dashboard's purpose"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDashboard({ name: "", team: "", description: "" });
                }}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDashboard}
                disabled={!newDashboard.name || !newDashboard.team}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DndProvider>
  );
}
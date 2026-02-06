import { Link, Outlet, useLocation } from "react-router";
import { Database, BarChart3, LayoutDashboard, Clock, Zap } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Top Nav Bar */}
      <nav className="border-b-4 border-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-[1800px] mx-auto px-8 py-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 border-3 border-black flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform">
                  <Zap className="w-6 h-6 text-black" fill="currentColor" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Abacus
                </h1>
                <p className="text-xs text-cyan-300 font-bold uppercase tracking-widest">BI Platform</p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/data-sources"
                className={`
                  flex items-center gap-2 px-5 py-2.5 font-bold uppercase text-sm tracking-wide
                  border-3 border-black transition-all transform
                  ${
                    isActive("/data-sources")
                      ? "bg-cyan-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0"
                      : "bg-slate-900 text-white hover:bg-cyan-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  }
                `}
              >
                <Database className="w-4 h-4" />
                <span>Sources</span>
              </Link>

              <Link
                to="/report-builder"
                className={`
                  flex items-center gap-2 px-5 py-2.5 font-bold uppercase text-sm tracking-wide
                  border-3 border-black transition-all transform
                  ${
                    isActive("/report-builder")
                      ? "bg-pink-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0"
                      : "bg-slate-900 text-white hover:bg-pink-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Builder</span>
              </Link>

              <Link
                to="/dashboard"
                className={`
                  flex items-center gap-2 px-5 py-2.5 font-bold uppercase text-sm tracking-wide
                  border-3 border-black transition-all transform
                  ${
                    isActive("/dashboard")
                      ? "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0"
                      : "bg-slate-900 text-white hover:bg-yellow-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  }
                `}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/scheduling"
                className={`
                  flex items-center gap-2 px-5 py-2.5 font-bold uppercase text-sm tracking-wide
                  border-3 border-black transition-all transform
                  ${
                    isActive("/scheduling")
                      ? "bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0"
                      : "bg-slate-900 text-white hover:bg-green-400 hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
                  }
                `}
              >
                <Clock className="w-4 h-4" />
                <span>Schedule</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Animated grid background */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
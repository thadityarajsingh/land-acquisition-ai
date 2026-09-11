import React, { useState } from "react";
import { TopNav } from "./components/layout/TopNav";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { DashboardSkeleton } from "./components/dashboard/SkeletonLoader";
import { LoginPage } from "./components/auth/LoginPage";
import { useProjects } from "./hooks/useProjects";
import { usePredict } from "./hooks/usePredict";
import { useWhatIf } from "./hooks/useWhatIf";
import { PanelLeft } from "lucide-react";

export function App() {
  // Authentication session state with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bhoomiiq_auth_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sidebar sliding window drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clear any legacy pinned preference so left panel is always a sliding window
  React.useEffect(() => {
    try {
      localStorage.removeItem("bhoomiiq_sidebar_pinned");
    } catch {
      // ignore
    }
  }, []);

  const [activeTab, setActiveTab] = useState("cadastral");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    projectData,
    loading: projectsLoading,
  } = useProjects();

  const {
    prediction,
    loading: predictionLoading,
  } = usePredict(projectData);

  const {
    whatIfResult,
    simulating,
    runSimulation,
    resetSimulation,
  } = useWhatIf();

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem("bhoomiiq_auth_session", JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to persist auth session", err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("bhoomiiq_auth_session");
    } catch (err) {
      console.error("Failed to clear auth session", err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // If officer is not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isLoading = projectsLoading || predictionLoading;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
      <TopNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          resetSimulation();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        onSelectTab={setActiveTab}
        onReturnToTop={() => {
          setActiveTab("cadastral");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mainEl = document.querySelector('main');
          if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Edge Trigger to open sliding window */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#080D1A] hover:bg-slate-800 text-slate-400 hover:text-white border border-l-0 border-slate-700/80 px-1.5 py-3.5 rounded-r-xl shadow-xl z-30 transition-all duration-150 group flex flex-col items-center gap-1.5 cursor-pointer hover:pl-2"
          title="Open Modules (Sliding Window)"
        >
          <PanelLeft className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 [writing-mode:vertical-rl] rotate-180">
            Modules
          </span>
        </button>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectData={projectData}
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            {isLoading ? (
              <DashboardSkeleton />
            ) : (
              <Dashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                projectData={projectData}
                prediction={prediction}
                whatIfResult={whatIfResult}
                onRunSimulation={runSimulation}
                simulating={simulating}
                onResetSimulation={resetSimulation}
                searchQuery={searchQuery}
                currentUser={currentUser}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from "react";
import { TopNav } from "./components/layout/TopNav";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { GISMap } from "./components/dashboard/GISMap";
import { DashboardSkeleton } from "./components/dashboard/SkeletonLoader";
import { LoginPage } from "./components/auth/LoginPage";
import { useProjects } from "./hooks/useProjects";
import { usePredict } from "./hooks/usePredict";
import { useWhatIf } from "./hooks/useWhatIf";
import { useRecommendations } from "./hooks/useRecommendations";
import { PanelLeft } from "lucide-react";

export function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { const saved = localStorage.getItem("bhoomiiq_auth_session"); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cadastral");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    projectData,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const { prediction, loading: predictionLoading, error: predictionError } = usePredict(projectData);
  const { recommendations, loading: recommendationsLoading } = useRecommendations(selectedProjectId);
  const { whatIfResult, simulating, runSimulation, resetSimulation } = useWhatIf(projectData);

  React.useEffect(() => { try { localStorage.removeItem("bhoomiiq_sidebar_pinned"); } catch { /* ignore */ } }, []);

  const handleLogin = (userData) => { setCurrentUser(userData); try { localStorage.setItem("bhoomiiq_auth_session", JSON.stringify(userData)); } catch (err) { console.error(err); } };
  const handleLogout = () => { setCurrentUser(null); try { localStorage.removeItem("bhoomiiq_auth_session"); } catch (err) { console.error(err); } };
  const handleProjectSelect = (id) => { setSelectedProjectId(id); resetSimulation(); };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;
  const isLoading = projectsLoading || predictionLoading || recommendationsLoading;
  const backendError = projectsError || predictionError;

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex flex-col font-sans relative">
      <div className="relative z-[1000] shrink-0">
        <TopNav projects={projects} selectedProjectId={selectedProjectId} onSelectProject={handleProjectSelect} searchQuery={searchQuery} onSearchChange={setSearchQuery} currentUser={currentUser} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} onSelectTab={setActiveTab} onReturnToTop={() => { setActiveTab("cadastral"); document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      </div>
      {!isSidebarOpen && <button type="button" onClick={() => setIsSidebarOpen(true)} className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#080D1A] hover:bg-slate-800 text-slate-400 hover:text-white border border-l-0 border-slate-700/80 px-1.5 py-3.5 rounded-r-xl shadow-xl z-30 transition-all duration-150 group flex flex-col items-center gap-1.5 cursor-pointer" title="Open Modules"><PanelLeft className="w-4 h-4 text-[#F97316]" /><span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 [writing-mode:vertical-rl] rotate-180">Modules</span></button>}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} projectData={projectData} currentUser={currentUser} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto space-y-5">
            {isLoading ? <DashboardSkeleton /> : backendError ? (
              <section className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Backend connection required</h2>
                <p className="mt-2 text-sm text-slate-600">BhoomiIQ is configured to use the live FastAPI project and ML services. No mock project data is shown when the backend is unavailable.</p>
                <p className="mt-3 rounded-lg bg-rose-50 p-3 font-mono text-xs text-rose-700">{backendError}</p>
                <p className="mt-3 text-xs text-slate-500">Start FastAPI on http://localhost:8000 and refresh this page.</p>
              </section>
            ) : (
              <>
                <GISMap projects={projects} selectedProjectId={selectedProjectId} onSelectProject={handleProjectSelect} baselineRisk={prediction?.riskScore} selectedRisk={whatIfResult?.simulatedScore} parcels={projectData?.parcels || []} />
                <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} projectData={projectData} prediction={prediction} recommendations={recommendations} whatIfResult={whatIfResult} onRunSimulation={runSimulation} simulating={simulating} onResetSimulation={resetSimulation} searchQuery={searchQuery} currentUser={currentUser} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

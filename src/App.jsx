import React, { useState } from "react";
import { TopNav } from "./components/layout/TopNav";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { DashboardSkeleton } from "./components/dashboard/SkeletonLoader";
import { useProjects } from "./hooks/useProjects";
import { usePredict } from "./hooks/usePredict";
import { useWhatIf } from "./hooks/useWhatIf";

export function App() {
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

  const isLoading = projectsLoading || predictionLoading;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <TopNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          resetSimulation();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectData={projectData}
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
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

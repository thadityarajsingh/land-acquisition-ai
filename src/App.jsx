import React, { useState } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { useProjects } from './hooks/useProjects';
import { usePredict } from './hooks/usePredict';
import { useWhatIf } from './hooks/useWhatIf';

export function App() {
  const [activeTab, setActiveTab] = useState('cadastral');
  
  // Custom API & State Hooks
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation Bar with Indian Government theme */}
      <TopNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(id) => {
          setSelectedProjectId(id);
          resetSimulation();
        }}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          projectData={projectData}
        />

        {/* Center Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            <Dashboard
              projectData={projectData}
              prediction={prediction}
              whatIfResult={whatIfResult}
              onRunSimulation={runSimulation}
              simulating={simulating}
              onResetSimulation={resetSimulation}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

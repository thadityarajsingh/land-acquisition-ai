import apiClient from './client';
import { MOCK_PROJECTS, MOCK_PROJECT_DATA } from '../mockData';

function normalizeProject(project) {
  if (!project) return project;

  return {
    ...project,
    id: project.project_id,
    name: `${project.project_type} Land Acquisition — ${project.district}`,
    corridor: project.project_type,
    district: `${project.district}, ${project.state}`,
  };
}

function normalizeProjectDetails(project) {
  if (!project) return project;

  return {
    ...project,
    id: project.project_id,
    name: `${project.project_type} Land Acquisition — ${project.district}`,
    corridor: project.project_type,
    district: project.district,
    totalAreaHa:
      typeof project.land_area_acres === 'number'
        ? Number((project.land_area_acres * 0.404686).toFixed(2))
        : null,
    simulationDefaults: {
      land_area_acres: project.land_area_acres,
      affected_families: project.affected_families,
      approval_delay_days: project.approval_delay_days,
      legal_disputes: project.legal_disputes,
      rehab_progress_pct: project.rehab_progress_pct,
      stakeholder_responsiveness_pct: project.stakeholder_responsiveness_pct,
      historical_performance_score: project.historical_performance_score,
      departments_involved: project.departments_involved,
      historical_delay_count: project.historical_delay_count,
      state: project.state,
      district: project.district,
      project_type: project.project_type,
      compensation_status: project.compensation_status,
      possession_status: project.possession_status,
      documentation_status: project.documentation_status,
      notification_status: project.notification_status,
      acquisition_stage: project.acquisition_stage,
    },
  };
}

export async function fetchProjects() {
  try {
    const response = await apiClient.get('/projects');
    const projects = response.data?.projects || [];
    return projects.map(normalizeProject);
  } catch (error) {
    console.warn('[BhoomiIQ API] Fallback to mock projects list:', error.message);
    return MOCK_PROJECTS;
  }
}

export async function fetchProjectById(projectId) {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return normalizeProjectDetails(response.data);
  } catch (error) {
    console.warn(`[BhoomiIQ API] Fallback to mock project details for ${projectId}:`, error.message);
    const found = MOCK_PROJECTS.find(p => p.id === projectId);
    return {
      ...MOCK_PROJECT_DATA,
      id: projectId,
      name: found ? found.name : MOCK_PROJECT_DATA.name,
      corridor: found ? found.corridor : MOCK_PROJECT_DATA.corridor,
      riskScore: found ? found.baseRiskScore : MOCK_PROJECT_DATA.riskScore,
    };
  }
}

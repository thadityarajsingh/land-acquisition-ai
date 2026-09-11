import { useState, useEffect } from 'react';
import { fetchProjects, fetchProjectById } from '../api/projects';

export function useProjects(initialProjectId = "IN-MH-PUN-2024-0094B") {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    async function loadProjectDetails() {
      if (!selectedProjectId) return;
      try {
        setLoading(true);
        const data = await fetchProjectById(selectedProjectId);
        setProjectData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProjectDetails();
  }, [selectedProjectId]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    projectData,
    setProjectData,
    loading,
    error,
  };
}

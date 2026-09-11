import { useState, useEffect } from 'react';
import { fetchProjects, fetchProjectById } from '../api/projects';

export function useProjects(initialProjectId = 'LA-0001') {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProjects();
        setProjects(data);

        if (data.length > 0 && !data.some(p => p.id === selectedProjectId)) {
          setSelectedProjectId(data[0].id);
        }
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
        setError(null);
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

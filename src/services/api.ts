export const api = {
  getProjects: async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createProject: async (project: { name: string; type: string }) => {
    try {
       const response = await fetch('/api/projects', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(project)
       });
       return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  uploadFile: async (file: File) => {
    try {
      const response = await fetch(`/api/upload?file=${encodeURIComponent(file.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }
};

import projectData from "@/services/mockData/projects.json";

export const projectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projectData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = projectData.find(item => item.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...projectData.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    projectData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projectData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    projectData[index] = { ...projectData[index], ...data };
    return { ...projectData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = projectData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    const deletedProject = projectData.splice(index, 1)[0];
    return { ...deletedProject };
  }
};
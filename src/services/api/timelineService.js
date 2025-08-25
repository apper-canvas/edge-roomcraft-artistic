import timelineData from "@/services/mockData/timelines.json";

export const timelineService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...timelineData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const timeline = timelineData.find(item => item.Id === id);
    if (!timeline) {
      throw new Error("Timeline not found");
    }
    return { ...timeline };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...timelineData.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    timelineData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = timelineData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Timeline not found");
    }
    timelineData[index] = { ...timelineData[index], ...data };
    return { ...timelineData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = timelineData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Timeline not found");
    }
    const deletedTimeline = timelineData.splice(index, 1)[0];
    return { ...deletedTimeline };
  }
};
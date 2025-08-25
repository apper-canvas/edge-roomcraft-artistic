import briefData from "@/services/mockData/briefs.json";

export const briefService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...briefData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const brief = briefData.find(item => item.Id === id);
    if (!brief) {
      throw new Error("Brief not found");
    }
    return { ...brief };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...briefData.map(b => b.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    briefData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = briefData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Brief not found");
    }
    briefData[index] = { ...briefData[index], ...data };
    return { ...briefData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = briefData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Brief not found");
    }
    const deletedBrief = briefData.splice(index, 1)[0];
    return { ...deletedBrief };
  }
};
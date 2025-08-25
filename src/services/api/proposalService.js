import proposalData from "@/services/mockData/proposals.json";

export const proposalService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...proposalData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const proposal = proposalData.find(item => item.Id === id);
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    return { ...proposal };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...proposalData.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    proposalData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = proposalData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Proposal not found");
    }
    proposalData[index] = { ...proposalData[index], ...data };
    return { ...proposalData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = proposalData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Proposal not found");
    }
    const deletedProposal = proposalData.splice(index, 1)[0];
    return { ...deletedProposal };
  }
};
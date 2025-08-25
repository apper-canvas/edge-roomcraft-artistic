import documentData from "@/services/mockData/documents.json";

export const documentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...documentData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const document = documentData.find(item => item.Id === id);
    if (!document) {
      throw new Error("Document not found");
    }
    return { ...document };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...documentData.map(d => d.Id)) + 1,
      uploadedAt: new Date().toISOString()
    };
    documentData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = documentData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Document not found");
    }
    documentData[index] = { ...documentData[index], ...data };
    return { ...documentData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = documentData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Document not found");
    }
    const deletedDocument = documentData.splice(index, 1)[0];
    return { ...deletedDocument };
  }
};
import messageData from "@/services/mockData/messages.json";

export const messageService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...messageData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const message = messageData.find(item => item.Id === id);
    if (!message) {
      throw new Error("Message not found");
    }
    return { ...message };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...messageData.map(m => m.Id)) + 1,
      timestamp: new Date().toISOString()
    };
    messageData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = messageData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Message not found");
    }
    messageData[index] = { ...messageData[index], ...data };
    return { ...messageData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = messageData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Message not found");
    }
    const deletedMessage = messageData.splice(index, 1)[0];
    return { ...deletedMessage };
  }
};
import ticketData from "@/services/mockData/tickets.json";

export const ticketService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...ticketData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const ticket = ticketData.find(item => item.Id === id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return { ...ticket };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...ticketData.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ticketData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = ticketData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    ticketData[index] = { 
      ...ticketData[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return { ...ticketData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = ticketData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Ticket not found");
    }
    const deletedTicket = ticketData.splice(index, 1)[0];
    return { ...deletedTicket };
  }
};
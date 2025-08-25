import paymentData from "@/services/mockData/payments.json";

export const paymentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...paymentData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const payment = paymentData.find(item => item.Id === id);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return { ...payment };
  },

  async getSummary() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const totalPaid = paymentData
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalPending = paymentData
      .filter(p => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalBudget = paymentData.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalPaid,
      totalPending,
      totalBudget
    };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...paymentData.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    paymentData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = paymentData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Payment not found");
    }
    paymentData[index] = { ...paymentData[index], ...data };
    return { ...paymentData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = paymentData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Payment not found");
    }
    const deletedPayment = paymentData.splice(index, 1)[0];
    return { ...deletedPayment };
  }
};
import siteVisitData from "@/services/mockData/siteVisits.json";

export const siteVisitService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...siteVisitData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const siteVisit = siteVisitData.find(item => item.Id === id);
    if (!siteVisit) {
      throw new Error("Site visit not found");
    }
    return { ...siteVisit };
  },

  async getByTimelineId(timelineId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return siteVisitData.filter(visit => visit.timelineId === timelineId);
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...item,
      Id: Math.max(...siteVisitData.map(v => v.Id)) + 1,
      createdAt: new Date().toISOString(),
      status: item.status || "scheduled"
    };
    siteVisitData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = siteVisitData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Site visit not found");
    }
    siteVisitData[index] = { ...siteVisitData[index], ...data };
    return { ...siteVisitData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = siteVisitData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Site visit not found");
    }
    const deletedVisit = siteVisitData.splice(index, 1)[0];
    return { ...deletedVisit };
  },

  async getUpcoming(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const upcoming = siteVisitData
      .filter(visit => new Date(visit.date) > new Date() && visit.status !== "cancelled")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
    return [...upcoming];
  },

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return siteVisitData.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate >= new Date(startDate) && visitDate <= new Date(endDate);
    });
  }
};
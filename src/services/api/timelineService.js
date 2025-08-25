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
  },

  // Site visit management methods
  async getSiteVisits(timelineId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock site visits linked to timeline
    const siteVisits = [
      {
        Id: 1,
        timelineId,
        title: "Initial Site Visit",
        description: "Measurements and assessment",
        date: "2024-03-28T10:00:00Z",
        endDate: "2024-03-28T12:00:00Z",
        status: "confirmed",
        phase: "consultation",
        attendees: ["client", "designer"]
      },
      {
        Id: 2,
        timelineId,
        title: "Progress Review",
        description: "Design phase inspection",
        date: "2024-04-05T14:00:00Z",
        endDate: "2024-04-05T16:00:00Z",
        status: "scheduled",
        phase: "design",
        attendees: ["client", "designer"]
      }
    ];
    return [...siteVisits];
  },

  async scheduleSiteVisit(timelineId, visitData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newVisit = {
      ...visitData,
      Id: Date.now(), // Simple ID generation
      timelineId,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    return { ...newVisit };
  },

  async updateSiteVisit(visitId, data) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { Id: visitId, ...data };
  },

  async cancelSiteVisit(visitId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { Id: visitId, status: "cancelled" };
  }
};
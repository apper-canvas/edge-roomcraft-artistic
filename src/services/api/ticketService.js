const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const ticketService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "annotations_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('ticket_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "photos_c"}},
          {"field": {"Name": "annotations_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.getRecordById('ticket_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Ticket not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      throw new Error("Ticket not found");
    }
  },

  async create(item) {
    try {
      const params = {
        records: [{
          title_c: item.title,
          description_c: item.description,
          priority_c: item.priority,
          status_c: item.status || "open",
          category_c: item.category,
          photos_c: JSON.stringify(item.photos || []),
          annotations_c: JSON.stringify(item.annotations || []),
          assigned_to_c: item.assignedTo
        }]
      };
      
      const response = await apperClient.createRecord('ticket_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tickets:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = {};
      if (data.title) updateData.title_c = data.title;
      if (data.description) updateData.description_c = data.description;
      if (data.priority) updateData.priority_c = data.priority;
      if (data.status) updateData.status_c = data.status;
      if (data.category) updateData.category_c = data.category;
      if (data.photos) updateData.photos_c = JSON.stringify(data.photos);
      if (data.annotations) updateData.annotations_c = JSON.stringify(data.annotations);
      if (data.assignedTo) updateData.assigned_to_c = data.assignedTo;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('ticket_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tickets:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('ticket_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tickets:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      throw error;
    }
  }
};
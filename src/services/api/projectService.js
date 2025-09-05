const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "project_name_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "designer_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "budget_c"}},
          {"field": {"Name": "estimated_completion_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "rooms_c"}},
          {"field": {"Name": "progress_percentage_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "actual_completion_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "project_name_c"}},
          {"field": {"Name": "client_id_c"}},
          {"field": {"Name": "designer_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "budget_c"}},
          {"field": {"Name": "estimated_completion_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "rooms_c"}},
          {"field": {"Name": "progress_percentage_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "actual_completion_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.getRecordById('project_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Project not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw new Error("Project not found");
    }
  },

  async create(item) {
    try {
      const params = {
        records: [{
          project_name_c: item.name,
          client_id_c: item.clientId,
          designer_id_c: item.designerId,
          status_c: item.status,
          budget_c: item.budget,
          estimated_completion_c: item.estimatedCompletion,
          description_c: item.description,
          address_c: item.address,
          rooms_c: JSON.stringify(item.rooms),
          progress_percentage_c: item.progressPercentage || 0,
          start_date_c: item.startDate
        }]
      };
      
      const response = await apperClient.createRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = {};
      if (data.name) updateData.project_name_c = data.name;
      if (data.clientId) updateData.client_id_c = data.clientId;
      if (data.designerId) updateData.designer_id_c = data.designerId;
      if (data.status) updateData.status_c = data.status;
      if (data.budget) updateData.budget_c = data.budget;
      if (data.estimatedCompletion) updateData.estimated_completion_c = data.estimatedCompletion;
      if (data.description) updateData.description_c = data.description;
      if (data.address) updateData.address_c = data.address;
      if (data.rooms) updateData.rooms_c = JSON.stringify(data.rooms);
      if (data.progressPercentage !== undefined) updateData.progress_percentage_c = data.progressPercentage;
      if (data.startDate) updateData.start_date_c = data.startDate;
      if (data.actualCompletion) updateData.actual_completion_c = data.actualCompletion;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }
};
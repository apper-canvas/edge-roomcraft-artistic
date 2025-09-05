const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const proposalService = {
  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "room_name_c"}},
          {"field": {"Name": "preview_image_c"}},
          {"field": {"Name": "color_palette_c"}},
          {"field": {"Name": "total_cost_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "furniture_items_c"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "client_feedback_c"}},
          {"field": {"Name": "designer_notes_c"}},
          {"field": {"Name": "approval_date_c"}},
          {"field": {"Name": "revision_count_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('proposal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching proposals:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "room_name_c"}},
          {"field": {"Name": "preview_image_c"}},
          {"field": {"Name": "color_palette_c"}},
          {"field": {"Name": "total_cost_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "furniture_items_c"}},
          {"field": {"Name": "comments_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "client_feedback_c"}},
          {"field": {"Name": "designer_notes_c"}},
          {"field": {"Name": "approval_date_c"}},
          {"field": {"Name": "revision_count_c"}},
          {"field": {"Name": "CreatedDate"}},
          {"field": {"Name": "LastModifiedDate"}}
        ]
      };
      
      const response = await apperClient.getRecordById('proposal_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Proposal not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching proposal ${id}:`, error);
      throw new Error("Proposal not found");
    }
  },

  async create(item) {
    try {
      const params = {
        records: [{
          room_name_c: item.roomName,
          preview_image_c: item.previewImage,
          color_palette_c: JSON.stringify(item.colorPalette),
          total_cost_c: item.totalCost,
          status_c: item.status || "pending",
          furniture_items_c: JSON.stringify(item.furniture),
          comments_c: JSON.stringify(item.comments || []),
          room_id_c: item.roomId,
          client_feedback_c: item.clientFeedback,
          designer_notes_c: item.designerNotes
        }]
      };
      
      const response = await apperClient.createRecord('proposal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} proposals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const updateData = {};
      if (data.roomName) updateData.room_name_c = data.roomName;
      if (data.previewImage) updateData.preview_image_c = data.previewImage;
      if (data.colorPalette) updateData.color_palette_c = JSON.stringify(data.colorPalette);
      if (data.totalCost) updateData.total_cost_c = data.totalCost;
      if (data.status) updateData.status_c = data.status;
      if (data.furniture) updateData.furniture_items_c = JSON.stringify(data.furniture);
      if (data.comments) updateData.comments_c = JSON.stringify(data.comments);
      if (data.roomId) updateData.room_id_c = data.roomId;
      if (data.clientFeedback) updateData.client_feedback_c = data.clientFeedback;
      if (data.designerNotes) updateData.designer_notes_c = data.designerNotes;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('proposal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} proposals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('proposal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} proposals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting proposal:", error);
      throw error;
    }
  }
};
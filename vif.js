/**
 * Utility functions for video processing
 * 
 * A JavaScript utility library for video processing operations.
 * This library provides methods for managing video processing tasks.
 */

class MediaProcessor {
    /**
     * Create a new MediaProcessor instance
     * @param {Object} options - Configuration options
     * @param {string} options.baseUrl - Service base URL (default: 'https://vider.ai')
     * @param {string} options.taskType - Task type for API endpoints
     */
    constructor(options = {}) {
      this.baseUrl = options.baseUrl || 'https://api.vider.ai/api/freev1';
      this.taskType = options.taskType || 'free-ai-image-to-video-generator'; // Default task type
    }
  
    /**
     * Make a service request
     * @param {string} endpoint - Service endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Service response
     * @private
     */
    async _request (endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint}`;
  
      try {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: options.body ? JSON.stringify(options.body) : undefined
        });
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Service request failed:', error);
        throw error;
      }
    }
  
    /**
     * Create a new img2video task
     * @param {Object} params - Task parameters
     * @returns {Promise<Object>} - Service response with taskId
     */
  
    async createTask (params) {
      const res = await this._request(`/task_create/${this.taskType}`, {
        method: 'POST',
        body: { params }
      });
      console.log('createTask ---------------01', params, res);
      return res;
    }
  
    /**
     * Check the status of the current user's task
     * @returns {Promise<Object>} - Service response with task details
     */
    async getTaskStatus () {
      return this._request(`/task_status/${this.taskType}`);
    }
  
    /**
     * Check the status of a specific task by ID
     * @param {string} taskId - The ID of the task to check
     * @returns {Promise<Object>} - Service response with task details
     */
    async getTask (taskId) {
      return this._request(`/task_get/${taskId}`);
    }
  
    /**
     * Get a list of tasks for a specific task type
     * @param {string} taskName - The name of the task type
     * @param {Object} options - Pagination options
     * @param {number} options.skip - Number of items to skip (default: 0)
     * @param {number} options.limit - Number of items to return (default: 20)
     * @returns {Promise<Object>} - Service response with task list
     */
    async getTaskList (options = {}) {
      const skip = options.skip !== undefined ? options.skip : 0;
      const limit = options.limit !== undefined ? options.limit : 20;
  
      return this._request(`/task_list/image2video/${skip}/${limit}`);
    }
  
    /**
     * Cancel a task by ID
     * @param {string} taskId - The ID of the task to cancel
     * @returns {Promise<Object>} - Service response
     */
    async cancelTask (taskId) {
      return this._request(`/task_cancel/${taskId}`);
    }
  
    /**
     * Speed up a task by upgrading to pro
     * @param {string} taskId - The ID of the task to speed up
     * @returns {Promise<Object>} - Service response
     */
    async speedUpTask (taskId) {
      return this._request(`/task_2pro/${taskId}`);
    }
  
  }
  
  
  window.MediaProcessor = MediaProcessor;
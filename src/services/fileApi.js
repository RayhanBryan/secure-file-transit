/**
 * File Management API Service
 * Handles file operations including upload, download, and status tracking
 */

class FileApiService {
  constructor() {
    this.baseURL = "http://20.64.235.232:8087";
  }

  // Get authentication token from sessionStorage
  getAuthToken() {
    return sessionStorage.getItem("authToken");
  }

  // Make authenticated HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get all files
  async getFiles() {
    return this.request("/files", {
      method: "GET",
    });
  }

  // Get all file report names
  async getAllFileReportNames() {
    return this.request("/file/get-all-file-report-name", {
      method: "GET",
    });
  }

  // Get file status with pagination
  async getFileStatus(limit = 20, offset = 0) {
    return this.request(`/file/get-status?limit=${limit}&offset=${offset}`, {
      method: "GET",
    });
  }

  // Upload file
  async uploadFile(fileData) {
    return this.request("/files/upload", {
      method: "POST",
      body: fileData, // FormData object
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  // Download file
  async downloadFile(fileId) {
    return this.request(`/files/download/${fileId}`, {
      method: "GET",
    });
  }
}

// Export singleton instance
export default new FileApiService();

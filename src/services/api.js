// API Configuration
const API_BASE_URL = "http://20.64.235.232:8087";

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem("authToken", token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem("authToken");
  }

  // Generic request method
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

      // For successful responses (200-299), return data even if response.ok might be false in some cases
      if (response.status >= 200 && response.status < 300) {
        return data;
      }

      // For error responses
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

  // Authentication endpoints
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Configuration endpoints
  async setConfig(configData) {
    return this.request("/config/set", {
      method: "POST",
      body: JSON.stringify(configData),
    });
  }

  async getConfig() {
    return this.request("/config/get-all", {
      method: "GET",
    });
  }

  // File management endpoints
  async getFiles() {
    return this.request("/files", {
      method: "GET",
    });
  }

  async getAllFileReportNames() {
    return this.request("/file/get-all-file-report-name", {
      method: "GET",
    });
  }

  async getFileStatus(limit = 20, offset = 0) {
    return this.request(`/file/get-status?limit=${limit}&offset=${offset}`, {
      method: "GET",
    });
  }

  async uploadFile(fileData) {
    return this.request("/files/upload", {
      method: "POST",
      body: fileData, // FormData object
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  async downloadFile(fileId) {
    return this.request(`/files/download/${fileId}`, {
      method: "GET",
    });
  }

  // User management endpoints
  async getUserProfile() {
    return this.request("/user/profile", {
      method: "GET",
    });
  }

  async updateUserProfile(userData) {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Get all users
  async getUsers() {
    return this.request("/auth/get-all-user", {
      method: "GET",
    });
  }

  // Get CSV file
  async getCsv() {
    return this.request("/file/get-csv", {
      method: "GET",
    });
  }

  // Get CSV file with specific usernames
  async getCsvWithUsernames(usernames) {
    if (!usernames || usernames.length === 0) {
      throw new Error("At least one username is required");
    }

    // Build query string with multiple usernames parameters
    const queryParams = usernames
      .map((username) => `usernames=${encodeURIComponent(username)}`)
      .join("&");

    return this.request(`/file/get-csv-username?${queryParams}`, {
      method: "GET",
    });
  }

  // Get CSV file for all usernames
  async getCsvAllUsernames() {
    return this.request("/file/get-csv-all-username", {
      method: "GET",
    });
  }

  // Download voltage key cache
  async downloadVoltageKeyCache() {
    const url = `${this.baseURL}/voltage-key-cache/download`;
    const token = this.getAuthToken();

    const config = {
      method: "GET",
      headers: {
        Accept: "application/zip, application/octet-stream, */*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob with proper content type
      const blob = await response.blob();

      // Ensure the blob has the correct MIME type for ZIP files
      const zipBlob = new Blob([blob], { type: "application/zip" });

      return {
        success: true,
        data: zipBlob,
        filename:
          this.getFilenameFromResponse(response) || "voltage-key-cache.zip",
      };
    } catch (error) {
      throw error;
    }
  }

  // Download installer agent
  async downloadInstallerAgent() {
    const url = `${this.baseURL}/voltage-key-cache/installer/download`;
    const token = this.getAuthToken();

    const config = {
      method: "GET",
      headers: {
        Accept: "application/octet-stream, */*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob
      const blob = await response.blob();

      return {
        success: true,
        data: blob,
        filename:
          this.getFilenameFromResponse(response) || "installer-agent.exe",
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper method to extract filename from response headers
  getFilenameFromResponse(response) {
    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        contentDisposition
      );
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, "");
      }
    }
    return null;
  }

  // Delete user
  async deleteUser(userId) {
    return this.request(`/auth/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Update user
  async updateUser(userId, userData) {
    return this.request(`/auth/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }
}

// Export singleton instance
export default new ApiService();

// Named exports for specific functions
export const {
  login,
  register,
  setConfig,
  getConfig,
  getFiles,
  getAllFileReportNames,
  getFileStatus,
  uploadFile,
  downloadFile,
  downloadInstallerAgent,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getCsv,
  getCsvWithUsernames,
  getCsvAllUsernames,
  deleteUser,
  updateUser,
} = new ApiService();

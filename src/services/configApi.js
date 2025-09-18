/**
 * Configuration API Service
 * Handles application configuration operations
 */

class ConfigApiService {
  constructor() {
    this.baseURL = "http://20.64.235.232:8087";
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem("authToken");
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

  // Set configuration
  async setConfig(configData) {
    return this.request("/config/set", {
      method: "POST",
      body: JSON.stringify(configData),
    });
  }

  // Get all configurations
  async getConfig() {
    return this.request("/config/get-all", {
      method: "GET",
    });
  }
}

// Export singleton instance
export default new ConfigApiService();

/**
 * User Management API Service
 * Handles user profile operations and user listing
 */

class UserApiService {
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

  // Get current user profile
  async getUserProfile() {
    return this.request("/user/profile", {
      method: "GET",
    });
  }

  // Update current user profile
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
}

// Export singleton instance
export default new UserApiService();

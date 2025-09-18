/**
 * Authentication API Service
 * Handles login, registration, user management and token operations
 */

class AuthApiService {
  constructor() {
    this.baseURL = "http://20.64.235.232:8087";
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  // Set authentication token in localStorage
  setAuthToken(token) {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  // Clear authentication token
  clearAuthToken() {
    localStorage.removeItem("authToken");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
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

  // Login user
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Register new user
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
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
export default new AuthApiService();

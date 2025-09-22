/**
 * Authentication API Service
 * Handles login, registration, user management and token operations
 */

class AuthApiService {
  constructor() {
    this.baseURL = "http://20.64.235.232:8087";
    this.inactivityTimer = null;
    this.inactivityTimeout = 15 * 60 * 1000; // 30 seconds for testing (change to 15 * 60 * 1000 for production)
    this.warningTimeout = 14 * 60 * 1000; // 20 seconds for testing (change to 14 * 60 * 1000 for production)
    this.warningTimer = null;
    this.onLogoutCallback = null;
    this.onWarningCallback = null;

    // Activity events to track
    this.activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    this.handleActivity = this.handleActivity.bind(this);
  }

  // Get authentication token from sessionStorage
  getAuthToken() {
    return sessionStorage.getItem("authToken");
  }

  // Set authentication token in sessionStorage
  setAuthToken(token) {
    console.log("Setting auth token:", token ? "token provided" : "no token");
    if (token) {
      sessionStorage.setItem("authToken", token);
      // Start activity monitoring when token is set
      this.startActivityMonitoring();
    } else {
      sessionStorage.removeItem("authToken");
      this.stopActivityMonitoring();
    }
  }

  // Clear authentication token
  clearAuthToken() {
    sessionStorage.removeItem("authToken");
    this.stopActivityMonitoring();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    console.log(
      "Checking authentication, token:",
      token ? "exists" : "not found"
    );
    return !!token;
  }

  // Set callback functions for logout and warning
  setCallbacks(onLogout, onWarning) {
    this.onLogoutCallback = onLogout;
    this.onWarningCallback = onWarning;
  }

  // Start monitoring user activity
  startActivityMonitoring() {
    if (!this.isAuthenticated()) {
      console.log("User not authenticated, skipping monitoring");
      return;
    }

    // Add activity event listeners
    this.activityEvents.forEach((event) => {
      document.addEventListener(event, this.handleActivity, true);
    });

    // Start the timers
    this.resetInactivityTimer();
  }

  // Stop monitoring user activity
  stopActivityMonitoring() {
    // Remove event listeners
    this.activityEvents.forEach((event) => {
      document.removeEventListener(event, this.handleActivity, true);
    });

    // Clear timers
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  // Handle user activity
  handleActivity() {
    this.resetInactivityTimer();
  }

  // Reset the inactivity timer
  resetInactivityTimer() {
    // Clear existing timers
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Set warning timer (1 minute before logout)
    this.warningTimer = setTimeout(() => {
      console.log("Warning timer triggered!");
      if (this.onWarningCallback) {
        this.onWarningCallback();
      }
    }, this.warningTimeout);

    // Set logout timer (15 minutes)
    this.inactivityTimer = setTimeout(() => {
      console.log("Logout timer triggered!");
      this.performAutoLogout();
    }, this.inactivityTimeout);
  }

  // Perform automatic logout
  performAutoLogout() {
    this.stopActivityMonitoring();
    this.clearAuthToken();

    if (this.onLogoutCallback) {
      this.onLogoutCallback();
    }
  }

  // Extend session (reset timer)
  extendSession() {
    this.resetInactivityTimer();
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

/**
 * CSV Export API Service
 * Handles CSV file generation and download operations
 */

class CsvApiService {
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
}

// Export singleton instance
export default new CsvApiService();

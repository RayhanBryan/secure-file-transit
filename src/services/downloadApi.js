/**
 * Download API Service
 * Handles file downloads including voltage key cache and installer agent
 */

class DownloadApiService {
  constructor() {
    this.baseURL = "http://20.64.235.232:8087";
  }

  // Get authentication token from localStorage
  getAuthToken() {
    return localStorage.getItem("authToken");
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
}

// Export singleton instance
export default new DownloadApiService();

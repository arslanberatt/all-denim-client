const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://all-denim-server-production.up.railway.app/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getCompanies() {
    const response = await this.request("/companies");
    return response.data || response;
  }

  async createCompany(companyData) {
    return this.request("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
  }

  async createCalculation(calculationData) {
    const response = await this.request("/calculations", {
      method: "POST",
      body: JSON.stringify(calculationData),
    });
    return response.data || response;
  }

  async getCalculations(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await this.request(`/calculations?${params}`);
    return response.data || response;
  }

  async getCalculationById(id) {
    const response = await this.request(`/calculations/${id}`);
    return response.data || response;
  }

  // Settings
  async getSettings() {
    return this.request("/settings");
  }

  async getExchangeRate() {
    const response = await this.request("/exchange-rate");
    return response.data || response;
  }

  async healthCheck() {
    return this.request("/");
  }
}

export const apiService = new ApiService();

// Individual function exports
export const getCompanies = () => apiService.getCompanies();
export const createCompany = (companyData) =>
  apiService.createCompany(companyData);
export const createCalculation = (calculationData) =>
  apiService.createCalculation(calculationData);
export const getCalculations = (page, limit, filters) =>
  apiService.getCalculations(page, limit, filters);
export const getCalculationById = (id) => apiService.getCalculationById(id);
export const getSettings = () => apiService.getSettings();
export const getExchangeRate = () => apiService.getExchangeRate();
export const healthCheck = () => apiService.healthCheck();

export default apiService;

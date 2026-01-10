const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : '';

class ApiClient {
  private baseURL: string;
  private getClinicCode: () => string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.getClinicCode = () => {
      if (typeof window !== 'undefined') {
        const clinic = localStorage.getItem('pawcare_clinic');
        if (clinic) {
          try {
            return JSON.parse(clinic).code;
          } catch {
            return null;
          }
        }
      }
      return '00000000'; // Default clinic code fallback
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    const clinicCode = this.getClinicCode();
    console.log('API Request - Clinic Code:', clinicCode);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'x-clinic-code': clinicCode,
        ...options.headers,
      },
      ...options,
    };
    console.log('API Request Headers:', config.headers);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        
        // Try to parse error response for better error messages
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If parsing fails, use the raw error text or default message
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('paynova_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('paynova_refresh_token');
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('paynova_token', token);
    localStorage.setItem('paynova_refresh_token', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('paynova_token');
    localStorage.removeItem('paynova_refresh_token');
    localStorage.removeItem('paynova_user');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (response.status === 401 && token) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry the original request
            return this.request<T>(endpoint, options);
          }
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      if (data.success && data.data) {
        this.setTokens(data.data.token, data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, full_name: string) {
    const response = await this.request<{
      userId: string;
      email: string;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
    return response;
  }

  async signin(email: string, password: string) {
    const response = await this.request<{
      token?: string;
      refreshToken?: string;
      user?: {
        id: string;
        email: string;
        full_name: string;
      };
      requires2FA?: boolean;
      tempToken?: string;
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      if (response.data.token && response.data.refreshToken) {
        this.setTokens(response.data.token, response.data.refreshToken);
        if (response.data.user) {
          localStorage.setItem('paynova_user', JSON.stringify(response.data.user));
        }
      }
    }

    return response;
  }

  async verify2FA(token: string, tempToken: string) {
    const response = await this.request<{
      token: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        full_name: string;
      };
    }>('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ token, tempToken }),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.token, response.data.refreshToken);
      localStorage.setItem('paynova_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async setup2FA() {
    return this.request<{
      secret: string;
      qrCode: string;
    }>('/auth/setup-2fa', {
      method: 'POST',
    });
  }

  // Wallet endpoints
  async getWallets() {
    return this.request('/wallets');
  }

  async getWalletByCurrency(currency: string) {
    return this.request(`/wallets/${currency}`);
  }

  // Transaction endpoints
  async getTransactions(limit = 50, offset = 0) {
    return this.request(`/transactions?limit=${limit}&offset=${offset}`);
  }

  async getTransaction(id: string) {
    return this.request(`/transactions/${id}`);
  }

  async createExchange(fromCurrency: string, toCurrency: string, fromAmount: number, exchangeRate: number) {
    return this.request('/transactions/exchange', {
      method: 'POST',
      body: JSON.stringify({
        fromCurrency,
        toCurrency,
        fromAmount,
        exchangeRate
      }),
    });
  }

  async createTransfer(recipient: string, amount: number, currency: string, transferType: string, speed: string) {
    return this.request('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify({
        recipient,
        amount,
        currency,
        transferType,
        speed
      }),
    });
  }

  // Settlement endpoints
  async uploadSettlementProof(transactionId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('transactionId', transactionId);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/settlement/upload`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user
  getCurrentUser(): any {
    const userStr = localStorage.getItem('paynova_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();


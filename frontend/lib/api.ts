// API Client Abstraction for Todo Application

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Authentication API Methods
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  created_at: string;
}

// Task API Methods
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Authentication API methods
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Login failed',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  register: async (userData: RegisterCredentials): Promise<ApiResponse<RegisterResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Registration failed',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    // Logout is typically a client-side operation (removing token from storage)
    return {
      success: true,
      data: undefined,
      status: 200
    };
  }
};

// Task API methods
export const taskApi = {
  getAll: async (token: string): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to fetch tasks',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  getById: async (taskId: string, token: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to fetch task',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  create: async (taskData: CreateTaskRequest, token: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to create task',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  update: async (taskId: string, taskData: UpdateTaskRequest, token: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to update task',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  delete: async (taskId: string, token: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          data: undefined,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to delete task',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  },

  toggleCompletion: async (taskId: string, token: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status
        };
      } else {
        const errorData = await response.text();
        return {
          success: false,
          error: errorData || 'Failed to toggle task completion',
          status: response.status
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error occurred',
        status: 500
      };
    }
  }
};

// Generic API utility functions
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

// Utility to add auth header
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
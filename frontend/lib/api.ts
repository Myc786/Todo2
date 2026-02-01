// API Client Abstraction for Todo Application

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Add API version suffix for all requests
const getApiUrl = (endpoint: string): string => {
  // Ensure the API_BASE_URL ends with a slash and doesn't have /api/v1 already
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  // If the base URL doesn't already include the API version, append it
  const finalBaseUrl = baseUrl.includes('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
  return `${finalBaseUrl}${endpoint}`;
};

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

// Tag API Methods
export interface Tag {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}

export interface TagResponse extends Tag {}

// Task API Methods
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  due_date?: string;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  tags?: TagResponse[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  due_date?: string;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  tag_ids?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  due_date?: string;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  tag_ids?: string[];
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
      const response = await fetch(getApiUrl('/auth/signin'), {
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
      const response = await fetch(getApiUrl('/auth/'), {
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
  getAll: async (token: string, search?: string, status?: string, priority?: string, date_from?: string, date_to?: string, sort_by?: string, sort_order?: string, tag_ids?: string[]): Promise<ApiResponse<Task[]>> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (date_from) params.append('date_from', date_from);
      if (date_to) params.append('date_to', date_to);
      if (sort_by) params.append('sort_by', sort_by);
      if (sort_order) params.append('sort_order', sort_order);
      if (tag_ids && tag_ids.length > 0) {
        tag_ids.forEach(tagId => params.append('tag_ids', tagId));
      }

      const queryString = params.toString();
      const url = `${getApiUrl('/tasks/')}${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
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
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
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
      const response = await fetch(getApiUrl('/tasks/'), {
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
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
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
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
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
      const response = await fetch(getApiUrl(`/tasks/${taskId}/complete`), {
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
  },

  getUpcoming: async (token: string, hours: number = 24): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await fetch(getApiUrl(`/tasks/upcoming/${hours}`), {
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
          error: errorData || 'Failed to fetch upcoming tasks',
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

// Tag API methods
export const tagApi = {
  getAll: async (token: string): Promise<ApiResponse<Tag[]>> => {
    try {
      const response = await fetch(getApiUrl('/tags/'), {
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
          error: errorData || 'Failed to fetch tags',
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

  getById: async (tagId: string, token: string): Promise<ApiResponse<Tag>> => {
    try {
      const response = await fetch(getApiUrl(`/tags/${tagId}`), {
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
          error: errorData || 'Failed to fetch tag',
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

  create: async (tagData: CreateTagRequest, token: string): Promise<ApiResponse<Tag>> => {
    try {
      const response = await fetch(getApiUrl('/tags/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
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
          error: errorData || 'Failed to create tag',
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

  update: async (tagId: string, tagData: UpdateTagRequest, token: string): Promise<ApiResponse<Tag>> => {
    try {
      const response = await fetch(getApiUrl(`/tags/${tagId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
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
          error: errorData || 'Failed to update tag',
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

  delete: async (tagId: string, token: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(getApiUrl(`/tags/${tagId}`), {
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
          error: errorData || 'Failed to delete tag',
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
/**
 * API Client for E-Commerce Backend
 * Base URL uses Vite proxy in development, direct URL in production
 */

const COM_API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_COM_API_URL || 'https://your-api-url.com')
  : ''; // Empty string uses Vite proxy

const AUTH_API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_AUTH_API_URL || 'https://your-api-url.com')
  : ''; // Empty string uses Vite proxy

  

// Must match the key used in AuthContext.tsx
const LS_TOKEN = "Feedle_token_v1";

/**
 * Helper function to make authenticated requests
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem(LS_TOKEN);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in to continue');
    } else if (response.status === 403) {
      throw new Error('Forbidden: You do not have permission to access this resource');
    } else if (response.status === 404) {
      throw new Error('Not found: The requested resource does not exist');
    }
    
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Products API
 */
export const productsApi = {
  getAll: async (params?: {
    category?: string;
    seller_id?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const url = `${COM_API_BASE_URL}/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetchWithAuth(url);
  },

  getById: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/products/${id}`);
  },

  getCategories: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/products/categories`);
  },

  create: async (data: {
    name: string;
    description?: string;
    category: string;
    original_price: number;
    current_price: number;
    stock: number;
    images?: string[];
  }) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{
    name: string;
    description: string;
    category: string;
    current_price: number;
    stock: number;
    images: string[];
    is_active: boolean;
  }>) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Cart API
 */
export const cartApi = {
  get: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/cart`);
  },

  addItem: async (product_id: string, quantity: number) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/cart/items`, {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity }),
    });
  },

  updateItem: async (itemId: string, quantity: number) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (itemId: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/cart`, {
      method: 'DELETE',
    });
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  create: async (data: {
    address_id: string;
    payment_method?: string;
    notes?: string;
  }) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const url = `${COM_API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetchWithAuth(url);
  },

  getById: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/orders/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Sellers API
 */
export const sellersApi = {
  create: async (data: {
    shop_name: string;
    shop_description?: string;
    shop_logo?: string;
  }) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/sellers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/sellers/${id}`);
  },

  getMyProfile: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/sellers/me/profile`);
  },

  update: async (id: string, data: Partial<{
    shop_name: string;
    shop_description: string;
    shop_logo: string;
  }>) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/sellers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getProducts: async (id: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const url = `${COM_API_BASE_URL}/sellers/${id}/products${queryParams.toString() ? `?${queryParams}` : ''}`;
    return fetchWithAuth(url);
  },
};

/**
 * Reviews API
 */
export const reviewsApi = {
  create: async (data: {
    product_id: string;
    order_id?: string;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
  }) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getByProduct: async (productId: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/reviews/products/${productId}/reviews`);
  },

  getMy: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/reviews/me`);
  },

  update: async (id: string, data: Partial<{
    rating: number;
    title: string;
    comment: string;
    images: string[];
  }>) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Addresses API
 */
export const addressesApi = {
  create: async (data: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    is_default?: boolean;
  }) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return fetchWithAuth(`${COM_API_BASE_URL}/addresses`);
  },

  getById: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/addresses/${id}`);
  },

  update: async (id: string, data: Partial<{
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
  }>) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth(`${COM_API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Combined API export
 */
export const api = {
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  sellers: sellersApi,
  reviews: reviewsApi,
  addresses: addressesApi,
};

export default api;

// Konfigurasi URL API
// Link asli API: https://luxury-store-api-2.vercel.app
// Kita menggunakan '/api' di sini agar diarahkan melalui Proxy Vite (di file vite.config.js)
// Alasan: Menghindari error CORS (Cross-Origin Resource Sharing) saat pengembangan di localhost
// 
// ENDPOINT YANG TERSEDIA:
// - GET  /api/products          - Ambil semua produk
// - POST /api/products          - Tambah produk baru
// - PUT  /api/products/:id      - Update produk
// - DELETE /api/products/:id    - Hapus produk
// - GET  /api/brands            - Ambil semua merek
// - POST /api/brands            - Tambah merek
// - PUT  /api/brands/:id        - Update merek
// - DELETE /api/brands/:id      - Hapus merek
// - GET  /api/users             - Ambil semua user
// - POST /api/users/register    - Registrasi user baru
// - PUT  /api/users/:id         - Update user
// - DELETE /api/users/:id       - Hapus user
// - GET  /api/orders            - Ambil semua order
// - POST /api/orders            - Buat order baru
// - PUT  /api/orders/:id        - Update status order
// - DELETE /api/orders/:id      - Hapus order
// - POST /api/login             - Login user

const API_URL = '/api'

/**
 * Enhanced API client dengan error handling dan logging yang lebih baik
 * @param {string} endpoint - Endpoint API yang dituju
 * @param {object} options - Options fetch (method, body, headers, dll)
 * @returns {Promise<Response>}
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const { skipAuthRedirect = false, headers: customHeaders, ...fetchOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    // Jika token tidak valid / unauthorized, redirect ke login kecuali pemanggil meminta untuk melewatkan redirect
    if (response.status === 401 && endpoint !== '/login' && !skipAuthRedirect) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Log error responses untuk debugging
    if (!response.ok && response.status !== 401) {
      console.warn(`API Error [${response.status}] ${endpoint}:`, response.statusText)
    }

    return response
  } catch (error) {
    console.error(`API Request Failed [${endpoint}]:`, error.message)
    throw error
  }
}

/**
 * Helper function untuk parse API response dengan consistent format
 * @param {Response} response - Response dari API
 * @returns {Promise<any>}
 */
export const parseResponse = async (response) => {
  const data = await response.json()
  // Handle berbagai format response dari API
  // Prioritas: data?.data -> data?.result -> data langsung
  return data?.data || data?.result || data
}

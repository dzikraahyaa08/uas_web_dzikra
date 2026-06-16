// Konfigurasi URL API
// Link asli API: https://luxury-store-api-2.vercel.app
// Kita menggunakan '/api' di sini agar diarahkan melalui Proxy Vite (di file vite.config.js)
// Alasan: Menghindari error CORS (Cross-Origin Resource Sharing) saat pengembangan di localhost
const API_URL = '/api'

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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  // Jika token tidak valid / unauthorized, redirect ke login kecuali pemanggil meminta untuk melewatkan redirect
  if (response.status === 401 && endpoint !== '/login' && !skipAuthRedirect) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return response
}

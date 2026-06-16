# API Integration Documentation

## Overview
Frontend Luxury Store sudah fully integrated dengan API backend di `https://luxury-store-api-2.vercel.app`.

## Konfigurasi

### Development (Localhost)
- **Proxy**: Vite proxy diatur di `vite.config.js`
- **Target**: `/api` → `https://luxury-store-api-2.vercel.app`
- **Tujuan**: Menghindari CORS error saat development

### Production (Vercel)
- **Rewrites**: Diatur di `vercel.json`
- **Target**: `/api/*` → `https://luxury-store-api-2.vercel.app/api/*`
- **Plus**: Client-side routing support

## API Client Setup

File: `src/services/api.js`

```javascript
import { apiClient, parseResponse } from '../services/api'

// Penggunaan
const response = await apiClient('/products')
const data = await response.json()
```

### Features
✅ Automatic Bearer token injection  
✅ Auth redirect pada 401 error  
✅ Error logging  
✅ Support untuk `skipAuthRedirect` option

## Available Endpoints

### Products
```
GET    /api/products           - Get all products
POST   /api/products           - Create new product
PUT    /api/products/:id       - Update product
DELETE /api/products/:id       - Delete product
```

**Required Fields (Create/Update)**
- `name`: string
- `brand_id`: number
- `price`: number
- `stock`: number
- `model_year`: number (optional)

---

### Brands
```
GET    /api/brands             - Get all brands
POST   /api/brands             - Create new brand
PUT    /api/brands/:id         - Update brand
DELETE /api/brands/:id         - Delete brand
```

**Required Fields (Create/Update)**
- `brand_name`: string
- `origin_country`: string (optional)

---

### Users
```
GET    /api/users              - Get all users
POST   /api/users/register     - Register new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

**Required Fields (Create/Update)**
- `username`: string
- `email`: string
- `membership_level`: 'Silver' | 'Gold' | 'Platinum'
- `password`: string (Create only)

---

### Orders
```
GET    /api/orders             - Get all orders
POST   /api/orders             - Create new order
PUT    /api/orders/:id         - Update order status
DELETE /api/orders/:id         - Delete order
```

**Required Fields (Create)**
- `user_id`: number
- `total_amount`: number
- `status`: 'Pending' | 'Selesai' | 'Batal'

---

### Authentication
```
POST   /api/login              - User login
```

**Required Fields**
- `username`: string
- `password`: string

**Response**
```json
{
  "data": {
    "token": "jwt-token-here",
    "user": { "user_id": 1, "username": "...", "email": "..." }
  }
}
```

---

## Response Format

API mengembalikan response dengan format yang konsisten. Frontend handle berbagai variasi:

```javascript
// Format 1: Wrapped in data
{ "data": [...] }

// Format 2: Wrapped in result
{ "result": [...] }

// Format 3: Direct array
[...]
```

Semua ditangani di frontend dengan:
```javascript
const data = await response.json()
const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
```

---

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Server Error

### Frontend Error Handling

Semua components menggunakan try-catch dengan logging:

```javascript
try {
  const res = await apiClient('/products')
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  const data = await res.json()
  // ... process data
} catch (error) {
  console.error('Error:', error)
  showMessage('Gagal mengambil data', 'error')
}
```

---

## Components Integration

### Dashboard (`Dashboard.vue`)
- Fetch products dan users count
- Display di stat cards
- Show latest 5 products

### Products (`Products.vue`)
- CRUD operations
- Bulk loading
- Delete with confirmation

### Brands (`Brands.vue`)
- CRUD operations
- Brand management
- Consistent error handling

### Orders (`Orders.vue`)
- View all orders
- Update status
- Delete orders

### Users (`Users.vue`)
- User management
- Create/Edit users
- Delete users

### Storefront (`Storefront.vue`)
- Public product listing
- Checkout flow
- Sample products fallback

### Login (`Login.vue`)
- Authentication
- Token management
- Error messages

---

## Token Management

Token disimpan di localStorage:
```javascript
// Save after login
localStorage.setItem('token', data.data.token)

// Auto-sent dengan setiap request
// (handled by apiClient)

// Clear on 401
// (handled by apiClient)
```

---

## Best Practices

1. **Always check response.ok** sebelum parsing JSON
2. **Handle berbagai response format** - API mungkin return format berbeda
3. **Log errors untuk debugging** - console.error() di try-catch
4. **Show user-friendly messages** - jangan show raw error messages
5. **Use `skipAuthRedirect: true`** untuk endpoints yang tidak perlu auth

---

## Testing

### Local Development
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Backend harus running di https://luxury-store-api-2.vercel.app
# atau local dengan port berbeda
```

### API Testing Tools
- Postman
- Thunder Client
- curl

---

## Troubleshooting

### CORS Error
- Pastikan Vite proxy di `vite.config.js` sudah benar
- Check: `target: 'https://luxury-store-api-2.vercel.app'`

### 401 Unauthorized
- Check token ada di localStorage
- Check token tidak expired
- Re-login jika perlu

### Empty Data
- Check response format dari API
- Add console.log untuk debugging
- Check network tab di DevTools

### Timeout
- Check koneksi internet
- Check API server status
- Increase timeout jika diperlukan

---

## Version History

**Latest Updates (2026-06-16)**
- ✅ Enhanced error handling di semua endpoints
- ✅ Consistent response parsing
- ✅ Improved error messages
- ✅ Better logging untuk debugging
- ✅ Documentation komplit

---

## Support

Untuk pertanyaan atau issue:
1. Check console.log untuk error details
2. Buka DevTools Network tab
3. Check status code dan response
4. Consult dengan backend team jika API issue

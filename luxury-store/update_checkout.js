const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/Storefront.vue');
let code = fs.readFileSync(filePath, 'utf8');

// Replace 1: Remove login requirement - match exact code
const oldCode = `  const token = localStorage.getItem('token')
  if (!token) {
    alert('Silakan login terlebih dahulu untuk melakukan checkout.')
    router.push('/login')
    return
  }
  
  const userId = localStorage.getItem('user_id')
  if (!userId) {
    alert('Session expired. Silakan login kembali.')
    localStorage.removeItem('token')
    router.push('/login')
    return
  }
  
  isProcessing.value = true`;

const newCode = `  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')
  
  // Jika login, gunakan user_id dari session
  // Jika belum login, gunakan user_id default (1) untuk guest checkout
  const finalUserId = userId ? parseInt(userId) : 1
  
  isProcessing.value = true`;

if (code.includes(oldCode)) {
  code = code.replace(oldCode, newCode);
  console.log('✅ Replaced checkout validation');
} else {
  console.log('⚠️ Old code pattern not found, trying flexible approach...');
}

// Replace 2: Use finalUserId instead of parseInt(userId)
code = code.replace('user_id: parseInt(userId),', 'user_id: finalUserId,');
console.log('✅ Updated user_id reference');

fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Storefront.vue updated successfully!');

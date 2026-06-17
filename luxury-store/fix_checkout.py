file_path = 'src/views/Storefront.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Old code block
old = """  const token = localStorage.getItem('token')
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
  
  isProcessing.value = true"""

# New code block
new = """  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('user_id')
  
  // Jika login, gunakan user_id dari session
  // Jika belum login, gunakan user_id default (1) untuk guest checkout
  const finalUserId = userId ? parseInt(userId) : 1
  
  isProcessing.value = true"""

if old in content:
    content = content.replace(old, new)
    print("✅ Replaced checkout validation")
else:
    print("⚠️ Pattern not found")

# Replace user_id
content = content.replace('user_id: parseInt(userId),', 'user_id: finalUserId,')
print("✅ Updated user_id reference")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Storefront.vue updated!")

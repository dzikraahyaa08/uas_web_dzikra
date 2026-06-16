<template>
  <v-app class="bg-black">
    <v-app-bar color="black" elevation="4" class="border-b-gold">
      <v-container class="d-flex align-center py-0">
        <h2 class="text-primary font-weight-bold tracking-widest">LUXURY STORE</h2>
        <v-spacer></v-spacer>
        <v-btn variant="text" class="text-grey-lighten-1 hover-gold" @click="scrollTo('home')">Home</v-btn>
        <v-btn variant="text" class="text-grey-lighten-1 hover-gold" @click="scrollToProducts">Koleksi</v-btn>
        <v-btn variant="text" class="text-grey-lighten-1 hover-gold" @click="scrollTo('about')">Tentang Kami</v-btn>
        
        <v-btn icon color="primary" class="ml-4" @click="cartDrawer = !cartDrawer">
          <v-badge :content="cart.length" :model-value="cart.length > 0" color="error">
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>
        <v-btn variant="outlined" color="primary" class="ml-4" to="/login">Admin</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Cart Navigation Drawer -->
    <v-navigation-drawer v-model="cartDrawer" location="right" temporary width="400" color="grey-darken-4">
      <div class="d-flex align-center pa-4 border-b-gold">
        <h3 class="text-h6 text-primary font-weight-bold mb-0">Keranjang Belanja</h3>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" color="grey" @click="cartDrawer = false"></v-btn>
      </div>

      <v-container v-if="cart.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey-darken-2" class="mb-4">mdi-cart-outline</v-icon>
        <p class="text-grey">Keranjang belanja Anda masih kosong.</p>
        <v-btn color="primary" class="mt-4" @click="cartDrawer = false; scrollToProducts()">Mulai Belanja</v-btn>
      </v-container>

      <v-list v-else bg-color="transparent" class="pa-4">
        <v-list-item v-for="(item, index) in cart" :key="index" class="mb-4 bg-black rounded-lg border-gold pa-3">
          <template v-slot:prepend>
            <div class="cart-item-img bg-grey-darken-3 d-flex align-center justify-center rounded mr-4">
              <v-icon color="grey">mdi-package-variant</v-icon>
            </div>
          </template>
          
          <v-list-item-title class="font-weight-bold text-white mb-1">{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-primary">{{ formatPrice(item.price) }}</v-list-item-subtitle>
          
          <template v-slot:append>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="removeFromCart(index)"></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append v-if="cart.length > 0">
        <div class="pa-4 border-t-gold bg-black">
          <div class="d-flex justify-space-between mb-4">
            <span class="text-grey">Total:</span>
            <span class="text-h6 text-primary font-weight-bold">{{ formatPrice(cartTotal) }}</span>
          </div>
          <v-btn block color="primary" size="x-large" class="font-weight-bold rounded-lg" @click="openCheckout">
            CHECKOUT SEKARANG
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Checkout Dialog -->
    <v-dialog v-model="checkoutDialog" max-width="600">
      <v-card color="grey-darken-4" class="border-gold">
        <v-card-title class="text-h5 text-primary pa-6 pb-2 border-b-gold font-weight-bold">
          Selesaikan Pembelian
        </v-card-title>
        
        <v-card-text class="pa-6">
          <h4 class="text-white mb-4">Informasi Pengiriman</h4>
          <v-form ref="checkoutForm" v-model="isCheckoutValid">
            <v-text-field
              v-model="checkoutData.nama"
              label="Nama Lengkap"
              variant="outlined"
              color="primary"
              :rules="[v => !!v || 'Nama diperlukan']"
              class="mb-2"
            ></v-text-field>
            
            <v-text-field
              v-model="checkoutData.telepon"
              label="Nomor Telepon"
              variant="outlined"
              color="primary"
              :rules="[v => !!v || 'Nomor telepon diperlukan']"
              class="mb-2"
            ></v-text-field>
            
            <v-textarea
              v-model="checkoutData.alamat"
              label="Alamat Lengkap"
              variant="outlined"
              color="primary"
              rows="3"
              :rules="[v => !!v || 'Alamat diperlukan']"
              class="mb-4"
            ></v-textarea>
          </v-form>

          <v-divider class="mb-4 border-gold"></v-divider>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-grey">Subtotal ({{ cart.length }} produk)</span>
            <span class="text-white">{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <span class="text-grey">Biaya Pengiriman</span>
            <span class="text-white">Gratis</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-h6 text-white">Total Pembayaran</span>
            <span class="text-h5 text-primary font-weight-bold">{{ formatPrice(cartTotal) }}</span>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey" @click="checkoutDialog = false">Batal</v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            class="px-6 font-weight-bold" 
            :disabled="!isCheckoutValid"
            :loading="isProcessing"
            @click="processCheckout"
          >
            BAYAR SEKARANG
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main id="home">
      <!-- Hero Section -->
      <section class="hero-section d-flex align-center justify-center">
        <div class="text-center px-4">
          <h1 class="text-h2 text-sm-h1 font-weight-bold text-white mb-4">
            ELEVATE YOUR <span class="text-primary">STYLE</span>
          </h1>
          <p class="text-h6 text-grey-lighten-1 mb-8 max-w-md mx-auto">
            Temukan koleksi barang mewah eksklusif dari brand ternama dunia dengan kualitas terbaik.
          </p>
          <v-btn size="x-large" color="primary" class="font-weight-bold px-8 rounded-pill" @click="scrollToProducts">
            LIHAT KOLEKSI
          </v-btn>
        </div>
      </section>

      <!-- Products Section -->
      <section id="products" class="py-16">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h4 text-primary font-weight-bold mb-2">Koleksi Terbaru</h2>
            <div class="gold-divider mx-auto"></div>
          </div>

          <v-row v-if="loading">
            <v-col cols="12" class="text-center py-12">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </v-col>
          </v-row>
          
          <v-row v-else-if="products.length === 0">
            <v-col cols="12" class="text-center text-grey py-12">
              Belum ada produk yang tersedia saat ini.
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.product_id">
              <v-card class="product-card bg-grey-darken-4 rounded-xl border-gold h-100 d-flex flex-column" elevation="8">
                <!-- Image Placeholder -->
                <div class="product-image-container bg-black d-flex align-center justify-center">
                  <v-icon size="64" color="grey-darken-2">mdi-package-variant-closed</v-icon>
                </div>
                
                <v-card-text class="flex-grow-1 px-5 pt-5 pb-2">
                  <div class="text-caption text-primary mb-1 text-uppercase tracking-widest">{{ product.brand_name || product.brand_id }}</div>
                  <h3 class="text-h6 font-weight-bold text-white mb-2 text-truncate" :title="product.name">
                    {{ product.name }}
                  </h3>
                  <div class="text-h6 text-primary font-weight-medium">
                    {{ formatPrice(product.price) }}
                  </div>
                </v-card-text>
                
                <v-card-actions class="px-5 pb-5 pt-0">
                  <v-btn block color="primary" variant="elevated" class="rounded-lg font-weight-bold" @click="addToCart(product)">
                    BELI SEKARANG
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- About Section -->
      <section id="about" class="py-16 bg-black border-t-gold">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6">
              <div class="about-image-placeholder bg-grey-darken-4 border-gold rounded-xl d-flex align-center justify-center">
                <v-icon size="80" color="primary">mdi-storefront-outline</v-icon>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="pl-md-8 mt-8 mt-md-0">
              <h2 class="text-h4 text-primary font-weight-bold mb-4">Tentang Kami</h2>
              <div class="gold-divider mb-6"></div>
              <p class="text-body-1 text-grey-lighten-1 mb-4">
                Luxury Store adalah destinasi utama untuk menemukan barang-barang mewah eksklusif. Kami menyediakan platform jual beli produk berkualitas tinggi dari brand-brand ternama di seluruh dunia.
              </p>
              <p class="text-body-1 text-grey-lighten-1 mb-6">
                Dengan komitmen terhadap keaslian dan kualitas, setiap produk yang dijual di platform kami telah melewati proses kurasi yang ketat untuk memastikan kepuasan pelanggan.
              </p>
              <v-btn variant="outlined" color="primary" class="px-8 rounded-pill font-weight-bold">
                PELAJARI LEBIH LANJUT
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>

    <!-- Footer -->
    <v-footer color="black" class="border-t-gold py-8">
      <v-container class="text-center">
        <h3 class="text-primary font-weight-bold mb-4 tracking-widest">LUXURY STORE</h3>
        <p class="text-grey-darken-1 text-body-2">
          &copy; {{ new Date().getFullYear() }} Luxury Store. All rights reserved.
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiClient } from '../services/api'

const products = ref([])
const loading = ref(true)

// Cart State
const cart = ref([])
const cartDrawer = ref(false)

// Checkout State
const checkoutDialog = ref(false)
const isCheckoutValid = ref(false)
const isProcessing = ref(false)
const checkoutData = ref({
  nama: '',
  telepon: '',
  alamat: ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + Number(item.price), 0)
})

const addToCart = (product) => {
  cart.value.push(product)
  cartDrawer.value = true
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const openCheckout = () => {
  cartDrawer.value = false
  checkoutDialog.value = true
}

const processCheckout = async () => {
  if (!isCheckoutValid.value) return
  
  isProcessing.value = true
  
  try {
    const payload = {
      user_id: 2, // Memakai user_id dari database (budi_luxury) sebagai representasi pembeli
      total_amount: cartTotal.value,
      status: 'Pending'
    }
    
    const res = await apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      checkoutDialog.value = false
      cart.value = []
      checkoutData.value = { nama: '', telepon: '', alamat: '' }
      alert('Pesanan berhasil dibuat! Pesanan ini sekarang akan muncul di panel Admin (Kelola Pesanan).')
    } else {
      const errorData = await res.json()
      alert('Gagal: ' + (errorData.meta?.message || errorData.message || 'Gagal menyimpan pesanan ke server'))
    }
  } catch (error) {
    console.error(error)
    alert('Terjadi kesalahan jaringan saat mencoba membuat pesanan.')
  } finally {
    isProcessing.value = false
  }
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToProducts = () => {
  scrollTo('products')
}

const fetchProducts = async () => {
  loading.value = true

  // Fallback sample products to show if API requires authentication
  const sampleProducts = [
    { product_id: 'sample-1', name: 'Jaket Kulit Premium', brand_name: 'Maison Luxe', price: 2500000 },
    { product_id: 'sample-2', name: 'Sepatu Formal Classic', brand_name: 'Elegance Co.', price: 1750000 },
    { product_id: 'sample-3', name: 'Tas Tangan Eksklusif', brand_name: 'Aurora', price: 3200000 },
    { product_id: 'sample-4', name: 'Kemeja Sutra', brand_name: 'Silken', price: 950000 }
  ]

  try {
    const res = await apiClient('/products')

    if (res.status === 401) {
      // Backend requires authentication — use local sample data so storefront still shows collections
      console.warn('API requires authentication; showing sample products on storefront.')
      products.value = sampleProducts
    } else {
      const data = await res.json()
      products.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = sampleProducts
  } finally {
    loading.value = false
    // Extra guard: if products still empty (edge cases / timing), show sample products
    if (!products.value || products.value.length === 0) {
      products.value = sampleProducts
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.border-b-gold {
  border-bottom: 1px solid rgba(255, 215, 0, 0.2) !important;
}
.border-t-gold {
  border-top: 1px solid rgba(255, 215, 0, 0.2) !important;
}
.border-gold {
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
}
.tracking-widest {
  letter-spacing: 0.1em;
}
.hover-gold:hover {
  color: #FFD700 !important;
}

.hero-section {
  min-height: 70vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), 
              url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
}

.gold-divider {
  height: 3px;
  width: 60px;
  background-color: #FFD700;
  border-radius: 2px;
}

.product-image-container {
  height: 250px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.cart-item-img {
  width: 50px;
  height: 50px;
}

.about-image-placeholder {
  height: 400px;
  width: 100%;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.15) !important;
  border-color: rgba(255, 215, 0, 0.5);
}
</style>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-background">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-0 rounded-xl luxury-login-card pb-4">
              <v-card-title class="text-center pt-10 pb-2 text-h4 font-weight-bold luxury-title">
                LUXURY
              </v-card-title>
              <v-card-subtitle class="text-center pb-8 text-secondary font-weight-medium tracking-widest">
                ADMIN PORTAL
              </v-card-subtitle>
              
              <v-card-text class="px-10">
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginData.username"
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    color="primary"
                    class="mb-4"
                    :disabled="loading"
                  ></v-text-field>

                  <v-text-field
                    v-model="loginData.password"
                    label="Password"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    color="primary"
                    class="mb-6"
                    :disabled="loading"
                  ></v-text-field>

                  <v-alert
                    v-if="errorMsg"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mb-6 rounded-lg"
                  >
                    {{ errorMsg }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    color="primary"
                    size="x-large"
                    block
                    class="font-weight-bold rounded-lg mt-2 mb-2 text-none"
                    :loading="loading"
                  >
                    Masuk
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '../services/api'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const loginData = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginData.value.username || !loginData.value.password) {
    errorMsg.value = 'Silakan masukkan username dan password'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const response = await apiClient('/login', {
      method: 'POST',
      body: JSON.stringify(loginData.value)
    })
    
    const data = await response.json()
    
    if (response.ok && data.data?.token) {
      localStorage.setItem('token', data.data.token)
      router.push('/admin/dashboard')
    } else {
      errorMsg.value = data.message || 'Login gagal'
    }
  } catch (error) {
    errorMsg.value = 'Koneksi ke server gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-background {
  background-color: #F5F2ED !important;
  background-image: radial-gradient(circle at 50% -20%, #ffffff 0%, transparent 70%);
}

.luxury-login-card {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05) !important;
  transition: box-shadow 0.4s ease, transform 0.4s ease;
  position: relative;
  overflow: hidden;
}

.luxury-login-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

.luxury-login-card:hover {
  box-shadow: 0 20px 45px rgba(184, 134, 11, 0.08) !important;
  transform: translateY(-2px);
}

.luxury-title {
  letter-spacing: 6px;
  background: linear-gradient(45deg, #B8860B, #D4AF37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(184, 134, 11, 0.15);
}

.tracking-widest {
  letter-spacing: 3px;
}
</style>

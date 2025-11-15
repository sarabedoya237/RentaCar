<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="register-section">
      <div class="nav-tabs">
        <router-link to="/login" class="nav-tab">Login</router-link>
        <span class="nav-tab active">Registro</span>
      </div>

      <h1 class="form-title">Crea tu cuenta</h1>
      <p>Completa el formulario para comenzar</p>

      <form @submit.prevent="register">
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input type="text" id="nombre" v-model="nombre" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input type="email" id="email" v-model="email" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="contraseña">Contraseña</label>
          <input type="password" id="contraseña" v-model="contraseña" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="rol">Rol</label>
          <select id="rol" v-model="rol" class="form-control">
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        <button type="submit" class="btn-register">Registrarse</button>
        <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión</router-link></p>
      </form>
    </div>

    <!-- Carrusel reemplaza el div car-image -->
    <div class="carousel-container">
      <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000">
        <Slide v-for="(img, index) in images" :key="index">
          <img :src="img" alt="Auto" class="carousel-image" />
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'

export default {
  components: { Carousel, Slide },
  data() {
    return {
      nombre: '',
      email: '',
      contraseña: '',
      rol: 'Cliente',
  images: [
  require('@/components/imagenes/ferrari.jpg'),
  require('@/components/imagenes/lamborghini.jpg'),
  require('@/components/imagenes/porsche.jpg')
]


    }
  },
  methods: {
    async register() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: this.nombre,
            email: this.email,
            contraseña: this.contraseña,
            rol: this.rol
          })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al registrarse')

        alert('Registro exitoso. Por favor inicia sesión.')
        this.$router.push('/login')
      } catch (error) {
        alert(error.message)
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* --- Lado del formulario --- */
.register-section {
  width: 40%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  color: #333333;
}

/* --- Carrusel --- */
.carousel-container {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000; /* Fondo oscuro para resaltar el carrusel */
}

.carousel-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

/* Tabs */
.nav-tabs {
  display: flex;
  margin-bottom: 40px;
}

.nav-tab {
  margin-right: 20px;
  font-size: 14px;
  text-decoration: none;
  color: #777777;
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;
}

.nav-tab.active {
  color: #FF7A00;
  font-weight: bold;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FF7A00;
}

/* Títulos */
.form-title {
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #FF7A00;
}

.register-section p {
  font-size: 14px;
  color: #555555;
  margin-bottom: 30px;
}

/* Inputs */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #333333;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 12px;
  color: #333;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #FF7A00;
  outline: none;
}

/* Botón */
.btn-register {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #FF7A00, #FFB347);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  transition: opacity 0.3s;
}

.btn-register:hover {
  opacity: 0.9;
}

/* Enlace inferior */
.register-section a {
  color: #FF7A00;
  text-decoration: none;
}

.register-section a:hover {
  text-decoration: underline;
}

@media (max-width: 770px) {
  .container {
    flex-direction: column;
  }

  .carousel-container {
    width: 100%;
    height: 40vh;
  }

  .register-section {
    width: 100%;
    padding: 20px;
  }

  .carousel-image {
    height: 40vh;
  }
}
</style>
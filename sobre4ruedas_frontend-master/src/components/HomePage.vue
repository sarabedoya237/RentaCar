<template>
  <div class="home-container">
    <!-- Encabezado con navegación fija -->
    <header class="header">
      <h1>ELITE RENTAR CAR</h1>
      <nav>
        <div class="nav-links">
          <a href="#inicio" class="nav-link">Inicio</a>
          <a href="#catalogo" class="nav-link">Catálogo</a>
          <a href="#contacto" class="nav-link">Contacto</a>
          <router-link v-if="user" to="/mis-reservas" class="nav-link"
            >Mis Reservas</router-link
          >
          <router-link v-else to="/login" class="nav-link"
            >Reservar</router-link
          >
        </div>
        <div class="auth-links">
          <span v-if="user">Bienvenido, {{ user.nombre }}</span>
          <router-link v-if="!user" to="/login" class="auth-link"
            >Iniciar Sesión</router-link
          >
          <router-link v-if="!user" to="/register" class="auth-link"
            >Registrarse</router-link
          >
          <button v-if="user" @click="logout" class="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>

    <!-- Secciones apiladas verticalmente -->
    <main>
      <!-- Sección Inicio -->
      <section id="inicio" class="inicio-section">
        <div class="inicio-content">
          <h2>Bienvenido a <span>ELITE RENTAR CAR</span></h2>
          <p>
            Viaja con nosotros y descubre nuevas experiencias en cada destino.
            Tu camino hacia la libertad, la comodidad y la aventura comienza
            aquí.
          </p>
          <p class="sub-msg">¡Inicia sesión para comenzar a reservar!</p>
        </div>
      </section>

      <!-- Sección Catálogo con Carrusel -->
      <section id="catalogo" class="section">
        <h2>Nuestro Catálogo</h2>
        <div class="carousel-container">
          <div class="carousel-title">
            <h3>Vehículos Destacados</h3>
            <div class="carousel-controls">
              <button
                @click="prevSlide"
                class="control-button prev"
                :disabled="isAnimating"
              >
                <span class="arrow">&#10094;</span>
              </button>
              <div class="dots-container">
                <span
                  v-for="(_, index) in Math.ceil(
                    vehicles.length / itemsPerPage
                  )"
                  :key="index"
                  class="dot"
                  :class="{ active: activeDot === index }"
                  @click="goToSlide(index)"
                ></span>
              </div>
              <button
                @click="nextSlide"
                class="control-button next"
                :disabled="isAnimating"
              >
                <span class="arrow">&#10095;</span>
              </button>
            </div>
          </div>

          <div class="carousel-track-container">
            <div
              class="carousel-track"
              :style="{
                transform: `translateX(-${
                  currentSlide * (100 / itemsPerPage)
                }%)`,
              }"
              @transitionend="handleTransitionEnd"
            >
              <div
                v-for="(vehicle, index) in vehicles"
                :key="vehicle.id_vehiculo"
                class="carousel-slide"
                :class="{
                  'current-slide': index === currentSlide,
                  'is-active':
                    index >= currentSlide &&
                    index < currentSlide + itemsPerPage,
                  unavailable: vehicle.estado !== 'Disponible',
                }"
              >
                <div class="vehicle-card">
                  <div
                    class="card-badge"
                    v-if="vehicle.estado === 'Disponible'"
                  >
                    Disponible
                  </div>
                  <div class="card-badge unavailable" v-else>
                    {{ vehicle.estado }}
                  </div>

                  <div class="image-container">
                    <img
                      :src="vehicle.imagen_url"
                      alt="Vehículo"
                      class="vehicle-image"
                      @error="handleImageError"
                    />
                    <div class="image-overlay">
                      <button
                        v-if="vehicle.estado === 'Disponible'"
                        @click="reserveVehicle"
                        class="overlay-button"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>

                  <div class="vehicle-info">
                    <h3>{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
                    <div class="vehicle-features">
                      <span class="feature"
                        >Año: {{ vehicle.año || "2023" }}</span
                      >
                      <span class="feature"
                        >Modelo: {{ vehicle.modelo || "" }}</span
                      >
                      <span class="feature"
                        >Tipo: {{ vehicle.tipo || "" }}</span
                      >
                    </div>
                    <div class="price-container">
                      <p class="price">
                        ${{ vehicle.precio_dia }}<span>/día</span>
                      </p>
                      <button
                        v-if="vehicle.estado === 'Disponible'"
                        @click="reserveVehicle"
                        class="reserve-button"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="more-vehicles">
          <button @click="viewMoreVehicles" class="more-button">
            Ver más vehículos
            <span class="more-icon">&#8594;</span>
          </button>
        </div>
      </section>

      <!-- Sección Contacto -->
      <section id="contacto" class="contacto-section">
        <div class="contacto-wrapper">
          <div class="contacto-content">
            <h2>Contacto</h2>
            <p class="intro">
              ¿Tienes alguna pregunta? Contáctanos y te responderemos lo antes
              posible.
            </p>

            <div class="contact-info">
              <p>
                <strong>Email:</strong>
                <a href="mailto:contacto@sobre4ruedas.com"
                  >contacto@rentarcar.com</a
                >
              </p>
              <p>
                <strong>Teléfono:</strong>
                <a href="tel:+571234567890">+57 305 303 1699</a>
              </p>
            </div>
          </div>

          <div class="contacto-imagen">
            <img src="@/assets/foto.jpg" alt="Carro deportivo" />
          </div>
        </div>
      </section>
    </main>

    <!-- Modal para iniciar sesión/registrarse -->
    <div v-if="showAuthModal" class="modal-overlay">
      <div class="modal">
        <h3>Debes iniciar sesión para reservar</h3>
        <p>Para alquilar un vehículo, por favor inicia sesión o regístrate.</p>
        <div class="modal-buttons">
          <button @click="goToLogin" class="modal-button login">
            Iniciar Sesión
          </button>
          <button @click="goToRegister" class="modal-button register">
            Registrarse
          </button>
          <button @click="closeModal" class="modal-button cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- PARTE DE FUNCIONALIDAD-->
<script>
export default {
  data() {
    return {
      vehicles: [],
      user: JSON.parse(localStorage.getItem("user")) || null,
      showAuthModal: false,
      updateInterval: null,
      currentSlide: 0,
      isAnimating: false,
      itemsPerPage: 3,
      autoplayInterval: null,
      placeholderImage:
        "https://via.placeholder.com/300x200/f0f0f0/cccccc?text=Vehículo",
    };
  },
  computed: {
    activeDot() {
      return Math.floor(this.currentSlide / this.itemsPerPage);
    },
    totalSlides() {
      return Math.ceil(this.vehicles.length / this.itemsPerPage);
    },
  },
  async created() {
    await this.loadVehicles();
    this.updateInterval = setInterval(this.loadVehicles, 30000);
    this.startAutoplay();

    // Ajustar elementos por página según el ancho de la pantalla
    this.updateItemsPerPage();
    window.addEventListener("resize", this.updateItemsPerPage);
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
    window.removeEventListener("resize", this.updateItemsPerPage);
  },
  methods: {
    async loadVehicles() {
      try {
        const response = await fetch("http://localhost:3000/api/vehicles");
        if (!response.ok) throw new Error("Error al cargar vehículos");
        const data = await response.json();
        // Asegurarse de que haya suficientes vehículos para el carrusel
        this.vehicles =
          data.length > 0 ? data : this.generatePlaceholderVehicles();
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
        // Generar datos de muestra en caso de error
        this.vehicles = this.generatePlaceholderVehicles();
      }
    },
    generatePlaceholderVehicles() {
      // Generar datos de muestra para el carrusel
      // return [
      //   { id_vehiculo: 1, marca: 'Toyota', modelo: 'Corolla', precio_dia: '120.000', estado: 'Disponible', imagen_url: this.placeholderImage, año: '2023' },
      //   { id_vehiculo: 2, marca: 'Honda', modelo: 'Civic', precio_dia: '135.000', estado: 'Disponible', imagen_url: this.placeholderImage, año: '2022' },
      //   { id_vehiculo: 3, marca: 'Mazda', modelo: 'CX-5', precio_dia: '150.000', estado: 'En Mantenimiento', imagen_url: this.placeholderImage, año: '2023' },
      //   { id_vehiculo: 4, marca: 'Nissan', modelo: 'Sentra', precio_dia: '110.000', estado: 'Disponible', imagen_url: this.placeholderImage, año: '2022' },
      //   { id_vehiculo: 5, marca: 'Kia', modelo: 'Sportage', precio_dia: '140.000', estado: 'Disponible', imagen_url: this.placeholderImage, año: '2023' },
      //   { id_vehiculo: 6, marca: 'Hyundai', modelo: 'Tucson', precio_dia: '145.000', estado: 'Disponible', imagen_url: this.placeholderImage, año: '2022' }
      // ];
    },
    updateItemsPerPage() {
      const width = window.innerWidth;
      if (width >= 1200) {
        this.itemsPerPage = 3;
      } else if (width >= 768) {
        this.itemsPerPage = 2;
      } else {
        this.itemsPerPage = 1;
      }
    },
    handleImageError(e) {
      e.target.src = this.placeholderImage;
    },
    nextSlide() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const maxSlide = this.vehicles.length - this.itemsPerPage;
      this.currentSlide =
        this.currentSlide >= maxSlide ? 0 : this.currentSlide + 1;
      this.resetAutoplay();
    },
    prevSlide() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const maxSlide = this.vehicles.length - this.itemsPerPage;
      this.currentSlide =
        this.currentSlide <= 0 ? maxSlide : this.currentSlide - 1;
      this.resetAutoplay();
    },
    goToSlide(dotIndex) {
      if (this.isAnimating) return;
      this.isAnimating = true;

      this.currentSlide = dotIndex * this.itemsPerPage;
      this.resetAutoplay();
    },
    handleTransitionEnd() {
      this.isAnimating = false;
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },
    resetAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
      this.startAutoplay();
    },
    reserveVehicle() {
      if (!this.user) {
        this.showAuthModal = true;
        return;
      }
      this.$router.push("/vehicles");
    },
    viewMoreVehicles() {
      this.$router.push("/vehicles");
    },
    goToLogin() {
      this.showAuthModal = false;
      this.$router.push("/login");
    },
    goToRegister() {
      this.showAuthModal = false;
      this.$router.push("/register");
    },
    closeModal() {
      this.showAuthModal = false;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.user = JSON.parse(localStorage.getItem("user")) || null;
      this.showAuthModal = false;
    },
  },
};
</script>

<!-- PARTE DEL CSS-->
<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(to right, #f7fafc, #e6e8eb); /*parte superior */
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 15px 5%;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Parte del titulo grande*/
.header h1 {
  font-size: 2rem;
  font-weight: 700;
  transition: transform 0.3s ease;
  display: flex;
  gap: 10px;

  background: linear-gradient(90deg, #010a29, #ff6b6b, #ffb516); /* 2 colores */

  background-clip: text;
  color: transparent;
}

/* Prte del logo*/
.header h1:before {
  content: " ƎR";
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #2155ce, #000f27);
  border-radius: 50%;
  color: rgb(255, 255, 255);
  font-style: bold;
}

nav {
  display: flex;
  align-items: right;
  gap: 25px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

/* Parte de los ini,cata,contac..*/
.nav-link {
  color: #212529;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-style: bold;
}

/* navegacion de inicio,...*/
.nav-link:hover {
  color: #132973;
  background-color: rgba(133, 177, 248, 0.323);
  transform: translateY(-2px);
}

/* linea de abajo*/
.nav-link:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 3px;
  background-color: #070342;
  border-radius: 3px;
  transition: transform 0.3s ease;
}

.nav-link:hover:after {
  transform: translateX(-50%) scaleX(1);
}

.auth-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* inicion, registro*/
.auth-link {
  color: #212529;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
/* mirar donde esta*/
.auth-links a:first-child {
  border: 2px solid #afad1e;
}

/* mirar donde esta*/
.auth-links a:last-child {
  background-color: #1e40af;
  color: white;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
}

/* mirar donde esta*/
.auth-links a:first-child:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

/* mirar donde esta*/
.auth-links a:last-child:hover {
  background-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(30, 64, 175, 0.35);
}

/*boton de cerrar*/
.logout-button {
  background-color: #516bec96;
  color: #212529;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(184, 40, 112, 0.537);
}

/*sombra*/
.logout-button:hover {
  background-color: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(220, 38, 38, 0.35);
}

/* Estilos para usuario logueado */
.auth-links span {
  background-color: rgba(59, 130, 246, 0.1);
  padding: 8px 18px;
  border-radius: 50px;
  color: #1e40af;
  font-weight: 600;
  display: flex;
  align-items: right;
  gap: 8px;
}

.auth-links span:before {
  content: "👤";
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .header {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding-bottom: 15px;
  }

  nav {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }

  .nav-links,
  .auth-links {
    width: 100%;
    justify-content: center;
  }
}

/*fondo*/
main {
  padding: 20px;
  background: linear-gradient(to right, #f9f9f9, #ffffff);
}

/*fondo nuestro catalogo*/
.section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(to right, #fffefe, #fdfefe);
}
/*Nuestro Catálogo*/
.section h2 {
  font-size: 2.5rem;
  color: #ffffff;
  text-shadow: 0 0 10px rgb(7, 0, 135);
  margin-bottom: 20px;
}

/*cuadro vehiculo*/
.section p {
  font-size: 1.2rem;
  color: #212529;
  margin-bottom: 10px;
}

.inicio-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  min-height: 100vh; /* ocupa toda la pantalla */
  width: 100%;

  /* Fondo del carro */
  background-image: url("@/assets/951.png");
  background-size: cover; /* la imagen cubre todo */
  background-position: center; /* centrada */
  background-repeat: no-repeat;

  color: white; /* texto en blanco para contraste */
  text-align: center;
  position: relative;
}
.inicio-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4); /* overlay oscuro para contraste */
  z-index: 1;
}

.inicio-content {
  position: relative;
  z-index: 2; /* asegura que el texto quede encima del overlay */
}

/*bienvenidos*/
.inicio-section h2 {
  font-size: 4rem;
  color: #ffffff;
  font-weight: 700;
}

/*elite*/
.inicio-section h2 span {
  color: #ffffff; /* amarillo */
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.941);
}

/*alquila...*/
.inicio-section p {
  font-size: 2rem;
  font-style: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(23, 14, 190, 0.734);
  margin-top: 15px;
}

/*inisiar secion*/
.inicio-section .sub-msg {
  margin-top: 25px;
  font-weight: 600;
  color: #ffffff;
}

/* mirar donde esta*/
.btn-iniciar {
  display: inline-block;
  margin-top: 25px;
  padding: 12px 24px;
  background-color: #1e40af;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
}

/* mirar donde esta*/
.btn-iniciar:hover {
  background-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(30, 64, 175, 0.35);
}

/* Nuevo Carrusel */
.carousel-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  padding: 20px 0;
}

.carousel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

/*vehiculos des..*/
.carousel-title h3 {
  font-size: 1.8rem;
  color: #132973;
  text-shadow: 0 0 10px rgba(23, 14, 190, 0.734);
  margin: 0;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.control-button:hover {
  background-color: #e9ecef;
  transform: scale(1.05);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.arrow {
  font-size: 1.2rem;
  line-height: 1;
}

.dots-container {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #007bff;
  transform: scale(1.2);
}

.carousel-track-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 10px 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-slide {
  min-width: calc(100% / 3);
  flex: 0 0 calc(100% / 3);
  padding: 0 10px;
  box-sizing: border-box;
  opacity: 0.7;
  transition: all 0.3s ease;
  transform: scale(0.9);
}

.carousel-slide.is-active {
  opacity: 1;
  transform: scale(1);
}

.vehicle-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vehicle-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.carousel-slide.unavailable .vehicle-card {
  background: #f8f9fa;
  opacity: 0.8;
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #800c1f;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-badge.unavailable {
  background-color: #800c1f;
}

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.vehicle-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.vehicle-card:hover .vehicle-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vehicle-card:hover .image-overlay {
  opacity: 1;
}

.overlay-button {
  background-color: rgba(255, 255, 255, 0.9);
  color: #800c0c;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.overlay-button:hover {
  background-color: white;
  transform: scale(1.05);
}

.vehicle-info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.vehicle-info h3 {
  font-size: 1.5rem;
  color: #132973;
  margin: 0 0 15px;
}

.vehicle-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.feature {
  background-color: #f8f9fa;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #6c757d;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  font-size: 1.3rem;
  color: #28a745;
  font-weight: bold;
  margin: 0;
}

.price span {
  font-size: 0.9rem;
  color: #6c757d;
}

.reserve-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.reserve-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.more-vehicles {
  margin-top: 40px;
}

.more-button {
  background-color: #800c1f;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.more-button:hover {
  background-color: #6de7ae;
  transform: translateX(5px);
}

.more-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.more-button:hover .more-icon {
  transform: translateX(5px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.modal h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.modal p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 25px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.modal-button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.modal-button.login {
  background-color: #007bff;
  color: white;
}

.modal-button.login:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.modal-button.register {
  background-color: #28a745;
  color: white;
}

.modal-button.register:hover {
  background-color: #218838;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.modal-button.cancel {
  background-color: #dc3545;
  color: white;
}

.modal-button.cancel:hover {
  background-color: #c82333;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.contacto-section {
  padding: 80px 5%;
  background: linear-gradient(to right, #ffffff, #ffffff);
  border-top: 1px solid #e2e8f0;
}

.contacto-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.contacto-content {
  flex: 1 1 450px;
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  text-align: center;
}

.contacto-content:hover {
  transform: translateY(-4px);
}

.contacto-content h2 {
  font-size: 2.2rem;
  color: #1e40af;
  font-weight: 700;
  margin-bottom: 20px;
}

.contacto-content .intro {
  font-size: 1.1rem;
  color: #334155;
  margin-bottom: 30px;
  line-height: 1.6;
}

.contact-info p {
  font-size: 1rem;
  color: #1f2937;
  margin: 10px 0;
}

.contact-info a {
  color: #1e40af;
  text-decoration: none;
  font-weight: 600;
}

.contact-info a:hover {
  text-decoration: underline;
}

.btn-contactar {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 24px;
  background-color: #1e40af;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
}

.btn-contactar:hover {
  background-color: #1a365d;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(30, 64, 175, 0.35);
}

.contacto-imagen {
  flex: 0 0 360px; /* ancho del bloque de la imagen */
  max-width: 340px;
  text-align: center;
  align-self: center;
}

.contacto-imagen img {
  width: 100%; /* ocupa todo el ancho del bloque */
  height: 300px; /* 👈 aquí ajustas el largo (más bajo que antes) */
  object-fit: cover; /* recorta sin deformar */
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.contacto-imagen img:hover {
  transform: scale(1.03);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 576px) {
  .header {
    flex-direction: column;
    /* Puedes eliminar esta línea si quieres mantener el nav a la derecha en móviles */
    align-items: center;
    gap: 10px;
    padding-bottom: 15px;
  }

  nav {
    width: 100%;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .header {
    padding: 12px 5%;
  }

  nav {
    gap: 15px;
  }

  .nav-links {
    gap: 5px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 1rem;
  }

  .auth-links {
    gap: 10px;
  }

  .auth-link {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  .logout-button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 1199px) {
  .carousel-slide {
    min-width: 50%;
    flex: 0 0 50%;
  }
}

@media (max-width: 767px) {
  .carousel-slide {
    min-width: 100%;
    flex: 0 0 100%;
  }
}

@media (max-width: 768px) {
  .contacto-wrapper {
    flex-direction: column;
    gap: 30px;
  }

  .contacto-content {
    padding: 30px 20px;
  }

  .contacto-content h2 {
    font-size: 1.8rem;
  }

  .btn-contactar {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}
</style>

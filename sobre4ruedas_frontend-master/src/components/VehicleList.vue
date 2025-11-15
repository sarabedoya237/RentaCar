<template>
  <main>
    <div class="container">
      <div class="header">
        <h1 class="brand-title">ELITE RENTAR CAR</h1>

        <nav class="nav-links">
          <router-link to="/" class="nav-link">Inicio</router-link>
     
       
        </nav>
      </div>
      
      <div class="main-content">
        <h2 class="main-title">Siente la emoción de manejar tu propio camion.</h2>
        
        <!-- Sección de filtros mejorada -->
        <div class="filters-section">
          <h3 class="filters-title">Encuentra tu vehículo ideal</h3>
          <div class="filters-container">
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-text">Marca</span>
                <input 
                  type="text" 
                  v-model="filters.marca" 
                  placeholder="Buscar marca..." 
                  class="filter-input"
                />
              </label>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-text">Tipo de vehículo</span>
                <select v-model="filters.tipo" class="filter-select">
                  <option value="">Todos los tipos</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedán</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Deportivo">Deportivo</option>
                </select>
              </label>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <span class="label-text">Año</span>
                <input 
                  type="number" 
                  v-model="filters.año" 
                  placeholder="Ej: 2023" 
                  min="1990"
                  max="2025"
                  class="filter-input"
                />
              </label>
            </div>
            
            <div class="filter-actions">
              <button @click="resetFilters" class="reset-button">
                <span>🔄</span>
                Limpiar filtros
              </button>
            </div>
          </div>
          
          <!-- Contador de resultados -->
          <div class="results-info">
            <p class="results-count">
              {{ filteredVehicles.length }} vehículo{{ filteredVehicles.length !== 1 ? 's' : '' }} encontrado{{ filteredVehicles.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <!-- Grid de vehículos con estados mejorados -->
        <div class="vehicles-container">
          <!-- Mensaje de no hay resultados -->
          <div v-if="filteredVehicles.length === 0" class="no-results">
            <div class="no-results-icon">🚗</div>
            <h3 class="no-results-title">No se encontraron vehículos</h3>
            <p class="no-results-text">
              Intenta ajustar los filtros para encontrar el vehículo que buscas.
            </p>
            <button @click="resetFilters" class="no-results-button">
              Ver todos los vehículos
            </button>
          </div>

          <!-- Grid de vehículos -->
          <div v-else class="vehicle-grid" :class="{ 'single-result': filteredVehicles.length === 1 }">
            <div 
              v-for="vehicle in filteredVehicles" 
              :key="vehicle.id" 
              class="vehicle-card"
              :class="{ 'unavailable': vehicle.estado !== 'Disponible' }"
            >
              <div class="vehicle-image-container">
                <img :src="vehicle.imagen_url" class="vehicle-image" :alt="`${vehicle.marca} ${vehicle.modelo}`" />
                <div v-if="vehicle.estado !== 'Disponible'" class="unavailable-overlay">
                  <span class="unavailable-text">No disponible</span>
                </div>
              </div>
              
              <div class="vehicle-info">
                <h3 class="vehicle-title">{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
                
                <div class="vehicle-features">
                  <div class="feature-item">
                    <span class="feature-icon">📅</span>
                    <span class="feature-text">{{ vehicle.año || '2023' }}</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🚙</span>
                    <span class="feature-text">{{ vehicle.tipo || 'N/A' }}</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">⚙️</span>
                    <span class="feature-text">{{ vehicle.modelo || 'Estándar' }}</span>
                  </div>
                </div>
                
                <div class="price-container">
                  <div class="price-info">
                    <span class="price">${{ formatPrice(vehicle.precio_dia) }}</span>
                    <span class="price-period">/día</span>
                  </div>
                  
                  <button 
                    v-if="vehicle.estado === 'Disponible'" 
                    @click="showReservationModal(vehicle)"
                    class="reserve-button"
                  >
                    Reservar ahora
                  </button>
                  <button v-else class="reserve-button disabled" disabled>
                    No disponible
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para formulario de reserva -->
      <div v-if="showReservationForm" class="modal-overlay">
        <div class="modal reservation-modal">
          <h3>Reservar {{ selectedVehicle?.marca }} {{ selectedVehicle?.modelo }}</h3>
          <div class="form-group">
            <label>
              Fecha de inicio:
              <input type="date" v-model="reservationData.fechaInicio" required class="date-input" />
            </label>
            <label>
              Fecha de fin:
              <input type="date" v-model="reservationData.fechaFin" required class="date-input" />
            </label>
          </div>
          <div class="form-buttons">
            <button @click="confirmReservation" class="confirm-button">
              Confirmar Reserva
            </button>
            <button @click="closeReservationModal" class="cancel-button">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para iniciar sesión/registrarse -->
      <div v-if="showAuthModal" class="modal-overlay">
        <div class="modal">
          <h3>Debes iniciar sesión para reservar</h3>
          <p>Para alquilar un vehículo, por favor inicia sesión o regístrate.</p>
          <div class="modal-buttons">
            <button @click="goToLogin" class="modal-button login">Iniciar Sesión</button>
            <button @click="goToRegister" class="modal-button register">Registrarse</button>
            <button @click="closeModal" class="modal-button cancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      vehicles: [],
      filters: {
        marca: '',
        tipo: '',
        año: ''
      },
      user: JSON.parse(localStorage.getItem('user')) || null,
      showAuthModal: false,
      showReservationForm: false,
      selectedVehicle: null,
      reservationData: {
        fechaInicio: '',
        fechaFin: '',
      },
      updateInterval: null,
    };
  },
  computed: {
    filteredVehicles() {
      return this.vehicles.filter(vehicle => {
        // Filtro por marca (búsqueda parcial, insensible a mayúsculas)
        const marcaMatch = !this.filters.marca || 
          vehicle.marca.toLowerCase().includes(this.filters.marca.toLowerCase().trim());
        
        // Filtro por tipo (coincidencia exacta)
        const tipoMatch = !this.filters.tipo || vehicle.tipo === this.filters.tipo;
        
        // Filtro por año (coincidencia exacta, convertir a string para comparar)
        const añoMatch = !this.filters.año || 
          String(vehicle.año) === String(this.filters.año).trim();
        
        return marcaMatch && tipoMatch && añoMatch;
      });
    },
  },
  methods: {
    resetFilters() {
      this.filters.marca = '';
      this.filters.tipo = '';
      this.filters.año = '';
    },
    async loadVehicles() {
      try {
        const response = await fetch('http://localhost:3000/api/vehicles');
        if (!response.ok) throw new Error('Error al cargar vehículos');
        this.vehicles = await response.json();
        console.log('Vehículos cargados:', this.vehicles);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    },
    formatPrice(value) {
      return Number(value).toLocaleString();
    },
    showReservationModal(vehicle) {
      if (!this.user) {
        this.showAuthModal = true;
        return;
      }
      this.selectedVehicle = vehicle;
      this.reservationData.fechaInicio = '';
      this.reservationData.fechaFin = '';
      this.showReservationForm = true;
      console.log('Mostrando modal para vehicleId:', vehicle.id);
    },
    closeReservationModal() {
      this.showReservationForm = false;
      this.selectedVehicle = null;
      this.reservationData.fechaInicio = '';
      this.reservationData.fechaFin = '';
    },
    async confirmReservation() {
      try {
        const { fechaInicio, fechaFin } = this.reservationData;
        console.log('Datos de reserva:', { fechaInicio, fechaFin, selectedVehicle: this.selectedVehicle });
        if (!fechaInicio || !fechaFin) {
          alert('Por favor selecciona ambas fechas.');
          return;
        }
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        const today = new Date();
        if (startDate < today) {
          alert('La fecha de inicio no puede ser anterior a hoy.');
          return;
        }
        if (endDate <= startDate) {
          alert('La fecha de fin debe ser posterior a la fecha de inicio.');
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No hay token disponible. Por favor, inicia sesión nuevamente.');
          this.$router.push('/login');
          return;
        }
        if (!this.selectedVehicle || !this.selectedVehicle.id) {
          alert('No se ha seleccionado un vehículo válido.');
          return;
        }
        const payload = {
          id_vehiculo: this.selectedVehicle.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: 'Pendiente',
        };
        console.log('Payload enviado:', payload);
        const response = await fetch('http://localhost:3000/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Error al crear reserva');
        }
        alert('Reserva creada exitosamente: ' + JSON.stringify(result));
        await this.loadVehicles();
        this.closeReservationModal();
      } catch (error) {
        console.error('Error en confirmReservation:', error);
        alert('Error al crear reserva: ' + error.message);
      }
    },
    goToLogin() {
      this.showAuthModal = false;
      this.$router.push('/login');
    },
    goToRegister() {
      this.showAuthModal = false;
      this.$router.push('/register');
    },
    closeModal() {
      this.showAuthModal = false;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push('/login');
    },
  },
  async created() {
    await this.loadVehicles();
    this.updateInterval = setInterval(this.loadVehicles, 30000);
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  watch: {
    '$route'() {
      this.user = JSON.parse(localStorage.getItem('user')) || null;
      this.showAuthModal = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

main {
  padding: 20px;
  background: linear-gradient(to right, #800C1F, #2C2C2C);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.103), rgba(248, 250, 255, 0)),
    url('https://images.unsplash.com/photo-1576661937838-96cafe3f65c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center right;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px 5%;
  min-height: 200px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  margin-bottom: 30px;
}

.brand-title {
  font-size: 3rem;
  color: #ffffff;
  font-weight: bold;
  margin: 0;
  padding-left: 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
  padding-right: 20px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link.login {
  background-color: #007bff;
  color: white;
}

.nav-link.register {
  background-color: #28a745;
  color: white;
}

.nav-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-title {
  font-size: 2.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Sección de filtros mejorada */
.filters-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.filters-title {
  font-size: 1.5rem;
  color: #0c1280;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-text {
  font-weight: 600;
  color: #2C2C2C;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-input,
.filter-select {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2C2C2C;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #800C1F;
  box-shadow: 0 0 0 3px rgba(128, 12, 31, 0.1);
}

.filter-actions {
  display: flex;
  align-items: end;
}

.reset-button {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
}

.results-info {
  margin-top: 20px;
  text-align: center;
}

.results-count {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

/* Contenedor de vehículos */
.vehicles-container {
  min-height: 400px;
}

/* Mensaje de no hay resultados */
.no-results {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-results-title {
  font-size: 1.8rem;
  color: #800C1F;
  margin-bottom: 15px;
  font-weight: bold;
}

.no-results-text {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.no-results-button {
  background: linear-gradient(135deg, #800C1F, #a01729);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.no-results-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(128, 12, 31, 0.3);
}

/* Grid de vehículos */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  padding: 20px 0;
}

.vehicle-grid.single-result {
  grid-template-columns: 1fr;
  max-width: 500px;
  margin: 0 auto;
}

.vehicle-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #800C1F;
}

.vehicle-card.unavailable {
  opacity: 0.7;
}

.vehicle-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.vehicle-card:hover .vehicle-image {
  transform: scale(1.05);
}

.unavailable-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.unavailable-text {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.vehicle-info {
  padding: 25px;
}

.vehicle-title {
  font-size: 1.4rem;
  color: #800C1F;
  margin-bottom: 15px;
  font-weight: bold;
}

.vehicle-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-icon {
  font-size: 1.1rem;
}

.feature-text {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.price {
  font-size: 1.8rem;
  color: #800C1F;
  font-weight: bold;
}

.price-period {
  color: #666;
  font-size: 0.9rem;
}

.reserve-button {
  background: linear-gradient(135deg, #2C2C2C, #1a1a1a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.reserve-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(44, 44, 44, 0.3);
}

.reserve-button.disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 20px;
  max-width: 450px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.reservation-modal {
  max-width: 550px;
}

main {
  padding: 20px;
  background: linear-gradient(to right, #5fd4ec, #090b0c);
  min-height: 100vh;
}



.modal p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
  text-align: left;
}

.form-group label {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #2C2C2C;
  font-weight: 600;
  gap: 8px;
}

.date-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #800C1F;
  box-shadow: 0 0 0 3px rgba(128, 12, 31, 0.1);
}

.form-buttons,
.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.confirm-button,
.modal-button {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.confirm-button,
.modal-button.login {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.modal-button.register {
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
}

.cancel-button,
.modal-button.cancel {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
}

.confirm-button:hover,
.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 30px 20px;
  }

  .brand-title {
    font-size: 2rem;
    padding-left: 0;
  }

  .nav-links {
    padding-right: 0;
  }

  .main-title {
    font-size: 2rem;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .vehicle-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .price-container {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .form-buttons,
  .modal-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .filters-section {
    padding: 20px;
  }

  .modal {
    padding: 20px;
    margin: 20px;
  }
}
</style>
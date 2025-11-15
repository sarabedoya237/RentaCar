<template>
    <div class="admin-container">
      <header class="header">
        <h1>Panel de Administración</h1>
        <button @click="logout" class="logout-button">Cerrar Sesión</button>
      </header>
  
      <!-- Estadísticas -->
      <section class="stats-section">
        <h2>Estadísticas</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total de Reservas</h3>
            <p>{{ totalReservations }}</p>
          </div>
          <div class="stat-card">
            <h3>Vehículos Disponibles</h3>
            <p>{{ availableVehicles }}</p>
          </div>
          <div class="stat-card">
            <h3>Ingresos Generados</h3>
            <p>${{ totalRevenue.toFixed(2) }}</p>
          </div>
        </div>
      </section>
  
      <!-- Gestión de Vehículos -->
      <section class="vehicles-section">
        <h2>Gestión de Vehículos</h2>
        <!-- Formulario para añadir/editar vehículo -->
        <div class="vehicle-form">
          <h3>{{ editingVehicle ? 'Editar Vehículo' : 'Añadir Vehículo' }}</h3>
          <div class="form-group">
            <label>Marca: <input v-model="newVehicle.marca" required /></label>
            <label>Modelo: <input v-model="newVehicle.modelo" required /></label>
            <label>Año: <input v-model.number="newVehicle.año" type="number" required /></label>
            <label>Tipo: <input v-model="newVehicle.tipo" required /></label>
            <label>Precio por día: <input v-model.number="newVehicle.precio_dia" type="number" required /></label>
            <label>Estado: 
              <select v-model="newVehicle.estado">
                <option value="Disponible">Disponible</option>
                <option value="Alquilado">Alquilado</option>
              </select>
            </label>
          </div>
          <div class="form-buttons">
            <button @click="saveVehicle" class="save-button">{{ editingVehicle ? 'Actualizar' : 'Añadir' }}</button>
            <button v-if="editingVehicle" @click="cancelEdit" class="cancel-button">Cancelar</button>
          </div>
        </div>
  
        <!-- Lista de vehículos -->
        <div class="vehicle-grid">
          <div v-for="vehicle in vehicles" :key="vehicle.id_vehiculo" class="vehicle-card">
            <div class="vehicle-info">
              <h3>{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
              <p>Año: {{ vehicle.año }}</p>
              <p>Tipo: {{ vehicle.tipo }}</p>
              <p>Precio por día: ${{ vehicle.precio_dia }}</p>
              <p>Estado: {{ vehicle.estado }}</p>
            </div>
            <div class="vehicle-actions">
              <button @click="editVehicle(vehicle)" class="edit-button">Editar</button>
              <button @click="deleteVehicle(vehicle.id_vehiculo)" class="delete-button">Eliminar</button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Gestión de Reservas -->
      <section class="reservations-section">
        <h2>Gestión de Reservas</h2>
        <div class="reservation-grid">
          <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
            <div class="reservation-info">
              <p><strong>Cliente:</strong> {{ reservation.User.nombre }} ({{ reservation.User.email }})</p>
              <p><strong>Vehículo:</strong> {{ reservation.Vehicle.marca }} {{ reservation.Vehicle.modelo }}</p>
              <p><strong>Fecha de Inicio:</strong> {{ formatDate(reservation.fecha_inicio) }}</p>
              <p><strong>Fecha de Fin:</strong> {{ formatDate(reservation.fecha_fin) }}</p>
              <p><strong>Estado:</strong> {{ reservation.estado }}</p>
            </div>
            <div class="reservation-actions">
              <button
                v-if="reservation.estado === 'Pendiente'"
                @click="approveReservation(reservation.id)"
                class="approve-button"
              >
                Aprobar
              </button>
              <button
                v-if="reservation.estado === 'Pendiente'"
                @click="rejectReservation(reservation.id)"
                class="reject-button"
              >
                Rechazar
              </button>
              <button
                v-if="reservation.estado !== 'Cancelada'"
                @click="cancelReservation(reservation.id)"
                class="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        vehicles: [],
        reservations: [],
        newVehicle: {
          marca: '',
          modelo: '',
          año: null,
          tipo: '',
          precio_dia: null,
          estado: 'Disponible',
        },
        editingVehicle: null,
        updateInterval: null,
      };
    },
    computed: {
      totalReservations() {
        return this.reservations.length;
      },
      availableVehicles() {
        return this.vehicles.filter(v => v.estado === 'Disponible').length;
      },
      totalRevenue() {
        return this.reservations
          .filter(r => r.estado === 'Aprobada')
          .reduce((total, r) => {
            const vehicle = this.vehicles.find(v => v.id_vehiculo === r.id_vehiculo);
            if (!vehicle) return total;
            const startDate = new Date(r.fecha_inicio);
            const endDate = new Date(r.fecha_fin);
            const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
            return total + (days * vehicle.precio_dia);
          }, 0);
      },
    },
    async created() {
      await this.loadData();
  
      // Actualizar datos cada 30 segundos
      this.updateInterval = setInterval(this.loadData, 30000);
    },
    beforeUnmount() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
    },
    methods: {
      async loadData() {
        await Promise.all([this.loadVehicles(), this.loadReservations()]);
      },
      async loadVehicles() {
        try {
          const response = await fetch('http://localhost:3000/api/vehicles');
          if (!response.ok) throw new Error('Error al cargar vehículos');
          this.vehicles = await response.json();
        } catch (error) {
          console.error(error);
          alert('Error al cargar vehículos');
        }
      },
      async loadReservations() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3000/api/admin/reservations', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al cargar reservas');
          this.reservations = await response.json();
        } catch (error) {
          console.error(error);
          alert('Error al cargar reservas');
        }
      },
      async saveVehicle() {
        console.log('Editing vehicle:', this.editingVehicle);
        try {
          const token = localStorage.getItem('token');
          const url = this.editingVehicle
            ? `http://localhost:3000/api/admin/vehicles/${this.editingVehicle.id}`
            : 'http://localhost:3000/api/admin/vehicles';
          const method = this.editingVehicle ? 'PUT' : 'POST';
  
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.newVehicle),
          });
          if (!response.ok) throw new Error('Error al guardar vehículo');
          await this.loadVehicles();
          this.resetVehicleForm();
          alert('Vehículo guardado exitosamente');
        } catch (error) {
          console.error(error);
          alert('Error al guardar vehículo');
        }
      },
      editVehicle(vehicle) {
        this.editingVehicle = vehicle;
        this.newVehicle = { ...vehicle };
        console.log('Selected vehicle for edit:', vehicle);
      },
      cancelEdit() {
        this.resetVehicleForm();
      },
      resetVehicleForm() {
        this.newVehicle = {
          marca: '',
          modelo: '',
          año: null,
          tipo: '',
          precio_dia: null,
          estado: 'Disponible',
        };
        this.editingVehicle = null;
      },
      async deleteVehicle(id_vehiculo) {
        if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/vehicles/${id_vehiculo}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al eliminar vehículo');
          await this.loadVehicles();
          alert('Vehículo eliminado');
        } catch (error) {
          console.error(error);
          alert('Error al eliminar vehículo');
        }
      },
      async approveReservation(id) {
        console.log('Aprobando reserva con ID:', id);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/reservations/${id}/approve`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al aprobar reserva');
          await this.loadReservations();
          alert('Reserva aprobada');
        } catch (error) {
          console.error(error);
          alert('Error al aprobar reserva');
        }
      },
      async rejectReservation(id) {
        if (!confirm('¿Estás seguro de rechazar esta reserva?')) return;
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/reservations/${id}/reject`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al rechazar reserva');
          await this.loadReservations();
          await this.loadVehicles();
          alert('Reserva rechazada');
        } catch (error) {
          console.error(error);
          alert('Error al rechazar reserva');
        }
      },
      async cancelReservation(id) {
        if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/admin/reservations/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Error al cancelar reserva');
          await this.loadReservations();
          await this.loadVehicles();
          alert('Reserva cancelada');
        } catch (error) {
          console.error(error);
          alert('Error al cancelar reserva');
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
    color: #333;
  }
  
  .logout-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .logout-button:hover {
    background-color: #c82333;
  }
  
  /* Estadísticas */
  .stats-section {
    margin-bottom: 40px;
  }
  
  .stats-section h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .stat-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
  }
  
  .stat-card h3 {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 10px;
  }
  
  .stat-card p {
    font-size: 1.5rem;
    color: #333;
    font-weight: bold;
  }
  
  /* Gestión de Vehículos */
  .vehicles-section {
    margin-bottom: 40px;
  }
  
  .vehicles-section h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
  
  .vehicle-form {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .vehicle-form h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 15px;
  }
  
  .form-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #555;
  }
  
  .form-group input,
  .form-group select {
    margin-top: 5px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.9rem;
  }
  
  .form-buttons {
    display: flex;
    gap: 10px;
  }
  
  .save-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .save-button:hover {
    background-color: #218838;
  }
  
  .cancel-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .cancel-button:hover {
    background-color: #c82333;
  }
  
  .vehicle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .vehicle-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .vehicle-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .vehicle-info {
    margin-bottom: 15px;
  }
  
  .vehicle-info h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 10px;
  }
  
  .vehicle-info p {
    font-size: 0.9rem;
    color: #555;
    margin: 5px 0;
  }
  
  .vehicle-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .edit-button:hover {
    background-color: #0056b3;
  }
  
  .delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .delete-button:hover {
    background-color: #c82333;
  }
  
  /* Gestión de Reservas */
  .reservations-section {
    margin-bottom: 40px;
  }
  
  .reservations-section h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
  
  .reservation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .reservation-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .reservation-info p {
    font-size: 0.9rem;
    color: #555;
    margin: 5px 0;
  }
  
  .reservation-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .approve-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .approve-button:hover {
    background-color: #218838;
  }
  
  .reject-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .reject-button:hover {
    background-color: #c82333;
  }
  </style>
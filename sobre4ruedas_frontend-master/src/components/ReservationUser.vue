<template>
  <div class="mis-reservas">
    <h2>Mis Reservas</h2>

    <div class="filtros">
      <label>Filtrar por estado:</label>
      <select v-model="estadoFiltro" @change="fetchReservas">
        <option value="">Todas</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Aprobada">Aprobada</option>
        <option value="Rechazada">Rechazada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
    </div>

    <div v-if="loading">Cargando reservas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Vehículo</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="reservas.length === 0">
          <td colspan="5">No tienes reservas.</td>
        </tr>
        <tr
          v-for="r in reservas"
          :key="r.id || `${r.id_usuario}-${r.id_vehiculo}-${r.fecha_inicio}`"
        >
          <td>{{ r.id || "-" }}</td>
          <td>
            <span v-if="r.Vehicle">
              {{ r.Vehicle.marca }} {{ r.Vehicle.modelo }} ({{
                r.Vehicle.placa
              }})
            </span>
            <span v-else>
              {{ r.id_vehiculo }}
            </span>
          </td>
          <td>{{ formatDate(r.fecha_inicio) }}</td>
          <td>{{ formatDate(r.fecha_fin) }}</td>
          <td>{{ r.estado }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ReservationUser",
  data() {
    return {
      reservas: [],
      loading: true,
      error: null,
      estadoFiltro: "",
    };
  },
  methods: {
    async fetchReservas() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Debes iniciar sesión para ver tus reservas.";
          this.loading = false;
          return;
        }

        const query = this.estadoFiltro
          ? `?estado=${encodeURIComponent(this.estadoFiltro)}`
          : "";
        const res = await fetch(`/api/reservations/me${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error al obtener reservas");
        }

        const data = await res.json();
        this.reservas = data.reservations || [];
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleString();
    },
  },
  mounted() {
    this.fetchReservas();
  },
};
</script>

<style scoped>
.mis-reservas {
  max-width: 1000px;
  margin: 30px auto;
  background: #fff;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.06);
}

.filtros {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error {
  color: #c00;
  font-weight: 600;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  border-bottom: 1px solid #eee;
  padding: 10px 8px;
}
</style>

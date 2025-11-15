import { createRouter, createWebHistory } from "vue-router";
import MisReservas from "../components/ReservationUser.vue";
import HomePage from "../components/HomePage.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import VehicleList from "../components/VehicleList.vue";
import AdminDashboard from "../components/AdminDashboard.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/mis-reservas",
    component: MisReservas,
    meta: { requiresAuth: true },
  },

  {
    path: "/vehicles",
    component: VehicleList,
    // Eliminamos requiresAuth para permitir acceso sin autenticación
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ["Administrador"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return next("/login");
    }
    if (to.meta.roles && !to.meta.roles.includes(user.rol)) {
      return next("/");
    }
  }
  next();
});

export default router;

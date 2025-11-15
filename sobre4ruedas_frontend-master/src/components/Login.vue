<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <!-- Sección Login -->
    <div class="login-section">
      <div class="nav-tabs">
        <span class="nav-tab active">Login</span>
        <router-link to="/register" class="nav-tab">Regístrate</router-link>
      </div>

      <h1 class="form-title">Bienvenido</h1>
      <p class="form-subtitle">Accede a tu cuenta para continuar</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="contraseña"
              class="form-control"
              required
            />
            <span class="password-toggle" @click="togglePassword"> 👁 </span>
          </div>
        </div>

        <div class="forgot-password-link">
          <button
            type="button"
            @click="showResetModal = true"
            class="link-button"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? "Ingresando..." : "Ingresar" }}
        </button>
      </form>
    </div>

    <!-- Imagen -->
    <div class="car-image"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      contraseña: "",
      showPassword: false,
      isLoading: false,
      showResetModal: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.isLoading = true;
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            contraseña: this.contraseña,
          }),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Error al iniciar sesión");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        this.$router.push(
          data.user.rol === "Administrador" ? "/admin" : "/vehicles"
        );
      } catch (error) {
        alert(error.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Layout base */
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Sección izquierda */
.login-section {
  width: 40%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #bebebf;
  background: linear-gradient(
    90deg,
    #c0bebe 0%,
    rgba(240, 204, 204, 0.014) 60%
  );

  color: #333;
}

/* Nav tabs */
.nav-tabs {
  display: flex;
  margin-bottom: 30px;
}
.nav-tab {
  margin-right: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #777;
  cursor: pointer;
  transition: color 0.3s;
}
.nav-tab.active {
  color: #d32f2f;
  border-bottom: 2px solid #d32f2f;
}
.nav-tab:hover {
  color: #d32f2f;
}

/* Títulos */
.form-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #ff6b6b, #ffb516);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.form-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

/* Formulario */
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #444;
}
.form-control {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: 0.3s;
}
.form-control:focus {
  border-color: #ff9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.3);
}

/* Input password */
.password-input {
  position: relative;
}
.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}
.password-toggle:hover {
  opacity: 1;
}

/* Forgot password */
.forgot-password-link {
  text-align: right;
  margin-bottom: 20px;
}
.link-button {
  background: none;
  border: none;
  font-size: 13px;
  color: #d32f2f;
  cursor: pointer;
}
.link-button:hover {
  text-decoration: underline;
}

/* Botón */
.btn-login {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #ff6b6b, #ffb516);
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-login:hover {
  filter: brightness(0.9);
}
.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Imagen derecha */
.car-image {
  width: 60%;
  background: url("https://images.unsplash.com/photo-1738260491272-efb16632d693?q=80&w=1976&auto=format&fit=crop")
    no-repeat center;
  background-size: cover;
  position: relative;
}
.car-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, transparent 40%);
}
</style>

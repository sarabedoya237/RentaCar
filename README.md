# RentaCar – Guía de Instalación y Ejecución
Este proyecto incluye dos partes:
- **Backend** – API REST construida en Node.js / Express / MySQL  
- **Frontend** – Aplicación web construida con Vue.js

## Estructura del Proyecto
```
proyecto/
 ├── sobre4ruedas_backend-master/
 └── sobre4ruedas_frontend-master/
```

## Requisitos Previos
Antes de iniciar, asegúrate de tener instalado:
- **Node.js** (versión 14 o superior)  
- **MySQL**  
- **Git**
- **NPM o Yarn**

# 1. Configurar y ejecutar el Backend
## 1.1 Entrar a la carpeta del backend
```bash
cd sobre4ruedas_backend-master
```

## 1.2 Instalar dependencias
```bash
npm install
```

## 1.3 Crear la base de datos en MySQL
1. Abre MySQL Workbench o tu terminal  
2. Crea la base de datos:
```sql
CREATE DATABASE rentacar;
```

## 1.4 Configurar conexión a MySQL
Configura tus credenciales en el archivo correspondiente (`config.js`, `.env`, o similar):
```
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=TU_CONTRASEÑA  
DB_NAME=rentacar  
```

## 1.5 Ejecutar el backend
```bash
npm start
```
El servidor correrá en:
```
http://localhost:3000
```

# 2. Configurar y ejecutar el Frontend
## 2.1 Entrar a la carpeta del frontend
```bash
cd ../sobre4ruedas_frontend-master
```

## 2.2 Instalar dependencias
```bash
npm install
```

## 2.3 Configurar la URL del backend
Asegúrate de que la URL usada en Axios apunte a:
```
http://localhost:3000
```

## 2.4 Ejecutar el frontend
```bash
npm run serve
```
La app correrá en:
```
http://localhost:8080
```

# 3. Funcionalidades principales
- Autenticación (registro e inicio de sesión)  
- Listado de vehículos  
- Sistema de reservas  
- Consulta de disponibilidad  
- Integración frontend-backend  
- Manejo de imágenes de vehículos  

# 4. Tecnologías utilizadas
## **Frontend**
- Vue.js  
- Vue Router  
- Axios  
- HTML / CSS / JavaScript  

## **Backend**
- Node.js  
- Express  
- MySQL  
- JWT (si usa autenticación)

# 5. Ejecución rápida
```bash
# Backend
cd sobre4ruedas_backend-master
npm install
npm start

# Frontend
cd ../sobre4ruedas_frontend-master
npm install
npm run serve
```

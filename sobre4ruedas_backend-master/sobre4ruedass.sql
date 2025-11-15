CREATE DATABASE  IF NOT EXISTS `sobre4ruedas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sobre4ruedas`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sobre4ruedas
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_vehiculo` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Pendiente','Confirmada','Cancelada','Finalizada') NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_vehiculo` (`id_vehiculo`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,1,1,'2025-05-01','2025-05-03','Pendiente'),(2,1,1,'2025-05-01','2025-05-03','Confirmada'),(3,1,1,'2025-05-01','2025-05-03','Cancelada'),(4,1,1,'2025-05-01','2025-05-03','Cancelada'),(5,1,1,'2025-05-01','2025-05-03','Confirmada');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_vehiculo` int NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'Pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_vehiculo` (`id_vehiculo`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehicles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (2,2,7,'2025-05-03 00:00:00','2025-05-06 00:00:00','Aprobada','2025-05-02 09:30:00','2025-05-20 20:51:09'),(3,2,6,'2025-05-04 00:00:00','2025-05-07 00:00:00','Cancelada','2025-05-02 15:45:00','2025-05-02 15:45:00'),(4,2,8,'2025-05-05 00:00:00','2025-05-10 00:00:00','Confirmada','2025-05-02 16:00:00','2025-05-02 16:00:00'),(5,2,2,'2025-05-06 00:00:00','2025-05-09 00:00:00','Aprobada','2025-05-02 16:30:00','2025-05-20 21:01:21'),(6,2,1,'2025-05-08 00:00:00','2025-05-15 00:00:00','Rechazada','2025-05-06 12:28:59','2025-05-20 21:01:46'),(7,2,4,'2025-05-08 00:00:00','2025-05-21 00:00:00','Aprobada','2025-05-06 12:43:55','2025-05-20 21:07:36'),(8,5,2,'2025-05-14 00:00:00','2025-05-28 00:00:00','Rechazada','2025-05-06 23:49:49','2025-05-22 23:45:51'),(9,1,5,'2025-06-02 00:00:00','2025-06-06 00:00:00','Pendiente','2025-05-20 23:38:48','2025-05-20 23:38:48'),(10,1,12,'2025-05-21 00:00:00','2025-05-30 00:00:00','Pendiente','2025-05-20 23:42:21','2025-05-20 23:42:21'),(11,6,9,'2025-05-27 00:00:00','2025-05-30 00:00:00','Aprobada','2025-05-22 23:44:20','2025-05-22 23:45:11');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL DEFAULT 'Cliente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com','$2b$10$kaHDa4xCm/zMHmriOET7UO./i3nISvD/NSSuTtDHxoImn6tQTWy1e','Administrador','2025-05-02 02:32:38','2025-05-02 02:32:38')
,(2,'Juan Pérez','juan@example.com','$2b$10$vFzOYU7m/TZN5zArq0K52.V.tLFVFXN2b4ZhYIdaqEUiRB2NJCrJC','Cliente','2025-05-02 02:32:38','2025-05-02 02:32:38'),
(5,'Sara','saraccl@gmail.com','$2b$10$0fWODDpGQOs.PaPD0.q5..xl9.sqLZOB6yBTgsJvTPgr2YALHdXmO','Cliente','2025-05-06 23:48:48','2025-05-06 23:48:48'),
(6,'Julieth','julieth@gmail.com','$2b$10$dhxU21gYNMsSWr8WSI.AL.gzxTctJ6JUGbRxqLy.PK89yB3f3dk82','Cliente','2025-05-22 23:40:36','2025-05-22 23:40:36'),
(7,'asd','asd@gma','$2b$10$rwDkHbSQUqIGSeRt2YRcJuNDyvEIlipsvPQsm3PoznJ3BTAb/fXMG','Cliente','2025-05-28 00:49:40','2025-05-28 00:49:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;




--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `año` int NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `precio_dia` float NOT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'Disponible',
  `imagen_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'Toyota','Corolla',2020,'Sedan',5000,'Disponible','https://i.ibb.co/9mL5TLyt/COROLLA-XEI-HEV-PLATA-METALICO.jpg','2025-05-02 02:32:38','2025-05-20 20:22:51'),(2,'Honda','Civic',2019,'Sedan',4500,'Disponible','https://i.ibb.co/0yzMgWv0/honda-civic-type-r-2020-a.webp','2025-05-02 02:32:38','2025-05-21 13:47:21'),(3,'Ford','Focus',2021,'Hatchback',55,'Disponible','https://i.ibb.co/4RYR8TXQ/ford-focus.jpg','2025-05-02 02:32:38','2025-05-02 02:32:38'),(4,'Chevrolet','Tracker',2022,'SUV',60,'Disponible','https://i.ibb.co/cK04FVdR/GVK.png','2025-05-02 02:32:38','2025-05-06 12:43:55'),(5,'Nissan','Versa',2018,'Sedan',40,'Alquilado','https://i.ibb.co/0p756g6G/versa-exc-scaled.jpg','2025-05-02 02:32:38','2025-05-20 23:38:48'),(6,'Kia','Sportage',2023,'SUV',65,'Disponible','https://i.ibb.co/JW36FM9g/Sportage.webp','2025-05-02 02:32:38','2025-05-02 02:32:38'),(7,'Volkswagen','Golf',2020,'Hatchback',50,'Alquilado','https://i.ibb.co/LdDkLC67/medium.jpg','2025-05-02 02:32:38','2025-05-02 02:32:38'),(8,'Hyundai','Elantra',2021,'Sedan',48,'Disponible','https://i.ibb.co/n8r8vStQ/hyundai-ELANTRA.webp','2025-05-02 02:32:38','2025-05-02 02:32:38'),(9,'Renault','Duster',2019,'SUV',52,'Alquilado','https://i.ibb.co/V0yK3hpJ/Duster.png','2025-05-02 02:32:38','2025-05-22 23:44:20'),(10,'Mazda','3',2022,'Sedan',58,'Disponible','https://i.ibb.co/LjqwWHk/mazda3.png','2025-05-02 02:32:38','2025-05-02 02:32:38'),(11,'BMW','IX',2025,'Sedan',10000,'Disponible','https://i.ibb.co/m5KmhFGS/the-new-bmw-ix-xdriv.jpg','2025-05-05 01:11:40','2025-05-22 23:39:15'),(12,'BMW','M3 GTR',2026,'Deportivo',3000000,'Alquilado','https://i.ibb.co/gF36RrMh/BMWM3-GTRNeedfor-Speed.webp','2025-05-06 23:52:27','2025-05-20 23:42:21');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id_vehiculo` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `año` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `precio_dia` decimal(10,2) NOT NULL,
  `estado` enum('Disponible','Alquilado','Mantenimiento') NOT NULL,
  PRIMARY KEY (`id_vehiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (1,'Toyota','Corolla',2020,'Sedan',50.00,'Disponible'),(2,'Honda','Civic',2021,'Sedan',55.00,'Disponible'),(3,'Ford','Escape',2019,'SUV',65.00,'Alquilado'),(4,'Chevrolet','Spark',2022,'Compacto',40.00,'Disponible'),(5,'Nissan','Altima',2020,'Sedan',58.00,'Mantenimiento'),(6,'Kia','Sportage',2021,'SUV',68.00,'Disponible'),(7,'Hyundai','Elantra',2023,'Sedan',60.00,'Disponible'),(8,'Volkswagen','Jetta',2018,'Sedan',52.00,'Alquilado'),(9,'Mazda','CX-5',2022,'SUV',70.00,'Disponible'),(10,'Renault','Logan',2019,'Sedan',45.00,'Mantenimiento'),(11,'Peugeot','208',2021,'Compacto',48.00,'Disponible');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sobre4ruedas'
--

--
-- Dumping routines for database 'sobre4ruedas'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 13:37:47

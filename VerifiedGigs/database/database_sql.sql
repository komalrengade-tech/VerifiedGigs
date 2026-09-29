-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: verifiedgigs
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permissions` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,43,NULL,'2026-09-29 23:04:51'),(2,44,NULL,'2026-09-29 23:37:29'),(3,45,NULL,'2026-09-29 23:37:29'),(4,46,NULL,'2026-09-29 23:37:29'),(5,47,NULL,'2026-09-29 23:37:29'),(6,48,NULL,'2026-09-29 23:37:29'),(7,49,NULL,'2026-09-29 23:37:29'),(8,50,NULL,'2026-09-29 23:37:29'),(9,51,NULL,'2026-09-29 23:37:29'),(10,52,NULL,'2026-09-29 23:37:29');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `gig_id` int NOT NULL,
  `student_id` int NOT NULL,
  `cover_letter` text,
  `proposed_price` decimal(10,2) DEFAULT NULL,
  `estimated_days` int DEFAULT NULL,
  `application_status` enum('PENDING','SHORTLISTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `fk_application_gig` (`gig_id`),
  KEY `fk_application_student` (`student_id`),
  CONSTRAINT `fk_application_gig` FOREIGN KEY (`gig_id`) REFERENCES `gigs` (`gig_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_application_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,5,'I am interested in this project and have relevant development experience.',8000.00,10,'ACCEPTED','2026-09-19 00:58:57','2026-09-19 01:02:23'),(2,1,3,'i want to join',7000.00,14,'ACCEPTED','2026-09-19 16:59:43','2026-09-29 23:42:19');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `company_description` text,
  `company_website` varchar(500) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `client_type` varchar(100) DEFAULT NULL,
  `verification_status` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_client_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,2,'ABC Technologies','Software company','https://example.com','Pune','Company','PENDING','2026-08-22 00:42:30'),(2,83,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 09:16:51'),(3,23,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(4,24,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(5,25,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(6,26,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(7,27,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(8,28,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(9,29,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(10,30,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(11,31,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(12,32,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(13,33,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(14,34,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(15,35,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(16,36,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(17,37,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(18,38,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(19,39,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(20,40,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(21,41,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(22,42,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:31:24'),(34,86,NULL,NULL,NULL,NULL,NULL,'PENDING','2026-08-25 14:49:31');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_gig`
--

DROP TABLE IF EXISTS `favorite_gig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_gig` (
  `student_id` int NOT NULL,
  `gig_id` int NOT NULL,
  `saved_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`,`gig_id`),
  KEY `fk_favorite_gig` (`gig_id`),
  CONSTRAINT `fk_favorite_gig` FOREIGN KEY (`gig_id`) REFERENCES `gigs` (`gig_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorite_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_gig`
--

LOCK TABLES `favorite_gig` WRITE;
/*!40000 ALTER TABLE `favorite_gig` DISABLE KEYS */;
INSERT INTO `favorite_gig` VALUES (3,1,'2026-09-19 17:00:24');
/*!40000 ALTER TABLE `favorite_gig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig_categories`
--

DROP TABLE IF EXISTS `gig_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig_categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig_categories`
--

LOCK TABLES `gig_categories` WRITE;
/*!40000 ALTER TABLE `gig_categories` DISABLE KEYS */;
INSERT INTO `gig_categories` VALUES (1,'Web Development','Website and web application development'),(2,'Mobile Development','Mobile application development'),(3,'UI/UX Design','User interface and user experience design'),(4,'Content Writing','Writing and documentation'),(5,'Graphic Design','Visual and graphic design'),(6,'java','java');
/*!40000 ALTER TABLE `gig_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig_skills`
--

DROP TABLE IF EXISTS `gig_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig_skills` (
  `gig_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `importance_level` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`gig_id`,`skill_id`),
  KEY `fk_gig_skill_skill` (`skill_id`),
  CONSTRAINT `fk_gig_skill_gig` FOREIGN KEY (`gig_id`) REFERENCES `gigs` (`gig_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gig_skill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig_skills`
--

LOCK TABLES `gig_skills` WRITE;
/*!40000 ALTER TABLE `gig_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `gig_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gigs`
--

DROP TABLE IF EXISTS `gigs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gigs` (
  `gig_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `budget_min` decimal(10,2) DEFAULT NULL,
  `budget_max` decimal(10,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `required_experience` varchar(100) DEFAULT NULL,
  `status` enum('OPEN','IN_PROGRESS','COMPLETED','CANCELLED','CLOSED') NOT NULL DEFAULT 'OPEN',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gig_id`),
  KEY `fk_gig_client` (`client_id`),
  KEY `fk_gig_category` (`category_id`),
  CONSTRAINT `fk_gig_category` FOREIGN KEY (`category_id`) REFERENCES `gig_categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_gig_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gigs`
--

LOCK TABLES `gigs` WRITE;
/*!40000 ALTER TABLE `gigs` DISABLE KEYS */;
INSERT INTO `gigs` VALUES (1,34,1,'Build a React Website','We need a responsive website using React.',5000.00,10000.00,'2026-10-15','1 year','OPEN','2026-09-19 00:45:23','2026-09-19 00:45:23');
/*!40000 ALTER TABLE `gigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `message_text` text NOT NULL,
  `attachment_url` varchar(500) DEFAULT NULL,
  `sent_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`message_id`),
  KEY `fk_message_sender` (`sender_id`),
  KEY `fk_message_receiver` (`receiver_id`),
  KEY `fk_message_project` (`project_id`),
  CONSTRAINT `fk_message_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,86,84,1,'hi',NULL,'2026-09-22 21:45:02',0),(2,86,84,1,'hi',NULL,'2026-09-22 23:06:59',0),(3,84,86,1,'hi',NULL,'2026-09-22 23:07:27',0),(4,84,86,1,'hi',NULL,'2026-09-22 23:07:42',0),(5,86,84,1,'hi',NULL,'2026-09-23 09:48:51',0),(6,54,86,2,'hi',NULL,'2026-09-29 22:44:33',0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(100) DEFAULT NULL,
  `related_entity_id` int DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notification_user` (`user_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,54,'Application accepted','A client has accepted your application for \"Build a React Website\".','APPLICATION',2,1,'2026-09-22 15:16:09'),(2,84,'New message','You received a new message: \"hi\"','MESSAGE',1,0,'2026-09-22 21:45:02'),(3,84,'Project status updated','Your project status changed to IN PROGRESS.','PROJECT',1,0,'2026-09-22 23:06:47'),(4,84,'New message','You received a new message: \"hi\"','MESSAGE',2,0,'2026-09-22 23:06:59'),(5,86,'New message','You received a new message: \"hi\"','MESSAGE',3,0,'2026-09-22 23:07:27'),(6,86,'New message','You received a new message: \"hi\"','MESSAGE',4,0,'2026-09-22 23:07:42'),(7,84,'Project status updated','Your project status changed to COMPLETED.','PROJECT',1,0,'2026-09-22 23:07:57'),(8,84,'Payment processed','A payment of ₹5,000 was processed for your project.','PAYMENT',2,0,'2026-09-22 23:08:20'),(9,84,'Payment processed','A payment of ₹5,000 was processed for your project.','PAYMENT',1,0,'2026-09-22 23:08:26'),(10,84,'Milestone completed','Your milestone \"UI Design\" was marked as completed.','MILESTONE',1,0,'2026-09-22 23:08:31'),(11,84,'Milestone completed','Your milestone \"UI Design\" was marked as completed.','MILESTONE',1,0,'2026-09-22 23:08:33'),(12,84,'Report status updated','Your report \"i want to build\" is now under review.','REPORT',1,0,'2026-09-23 09:19:55'),(13,86,'New application received','A student has applied to your gig \"build ad for event\".','APPLICATION',4,1,'2026-09-23 09:42:46'),(14,54,'Application accepted','A client has accepted your application for \"build ad for event\".','APPLICATION',4,1,'2026-09-23 09:47:55'),(15,54,'Application accepted','A client has accepted your application for \"build ad for event\".','APPLICATION',4,1,'2026-09-23 09:48:12'),(16,84,'New message','You received a new message: \"hi\"','MESSAGE',5,0,'2026-09-23 09:48:51'),(17,34,'New application received','A student has applied to your gig \"build an app for college\".','APPLICATION',5,0,'2026-09-29 22:34:58'),(18,54,'Application accepted','A client has accepted your application for \"Build a React Website\".','APPLICATION',2,1,'2026-09-29 22:42:01'),(19,54,'Application accepted','A client has accepted your application for \"Build a React Website\".','APPLICATION',2,1,'2026-09-29 22:42:02'),(20,54,'New project started','A client has created the project \"Build a React Website\" from your accepted application.','PROJECT',2,1,'2026-09-29 22:43:20'),(21,86,'New message','You received a new message: \"hi\"','MESSAGE',6,0,'2026-09-29 22:44:33'),(22,87,'Report status updated','Your report \"something is wrong\" is now under review.','REPORT',2,0,'2026-09-29 22:47:08'),(23,54,'Report status updated','Your report \"hdh\" is now under review.','REPORT',3,0,'2026-09-29 23:26:23'),(24,54,'Report status updated','Your report \"hdh\" is now rejected.','REPORT',3,0,'2026-09-29 23:29:11'),(25,54,'Report status updated','Your report \"hdh\" is now resolved.','REPORT',3,0,'2026-09-29 23:29:14'),(26,54,'Report status updated','Your report \"hdh\" is now under review.','REPORT',3,0,'2026-09-29 23:29:16'),(27,54,'Report status updated','Your report \"hdh\" is now pending.','REPORT',3,0,'2026-09-29 23:29:18'),(28,54,'Verification rejected','Your id document was rejected. Reason: hgb','VERIFICATION',2,0,'2026-09-29 23:33:15'),(29,87,'Verification approved','Your student id document was approved.','VERIFICATION',1,0,'2026-09-29 23:33:17'),(30,54,'Report status updated','Your report \"hdh\" is now under review.','REPORT',3,0,'2026-09-29 23:34:27'),(31,54,'Report status updated','Your report \"hdh\" is now rejected.','REPORT',3,0,'2026-09-29 23:39:17'),(32,54,'Application rejected','A client has declined your application for \"Build a React Website\".','APPLICATION',2,0,'2026-09-29 23:41:57'),(33,54,'Application accepted','A client has accepted your application for \"Build a React Website\".','APPLICATION',2,0,'2026-09-29 23:41:58'),(34,54,'Application shortlisted','A client has shortlisted your application for \"Build a React Website\".','APPLICATION',2,0,'2026-09-29 23:41:59'),(35,54,'Application accepted','A client has accepted your application for \"Build a React Website\".','APPLICATION',2,0,'2026-09-29 23:42:19'),(36,54,'Report status updated','Your report \"hdh\" is now resolved.','REPORT',3,0,'2026-09-29 23:54:16'),(37,54,'Report status updated','Your report \"hdh\" is now rejected.','REPORT',3,0,'2026-09-29 23:59:08');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `milestone_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(150) DEFAULT NULL,
  `payment_status` enum('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `payment_date` datetime DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `fk_payment_project` (`project_id`),
  KEY `fk_payment_milestone` (`milestone_id`),
  CONSTRAINT `fk_payment_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `project_milestone` (`milestone_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,1,5000.00,'UPI','TXN_1790098706217_969','SUCCESS','2026-09-22 23:08:26'),(2,1,NULL,5000.00,'upi','TXN_1790098700827_2768','SUCCESS','2026-09-22 23:08:20');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio` (
  `portfolio_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `project_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`portfolio_id`),
  KEY `fk_portfolio_student` (`student_id`),
  CONSTRAINT `fk_portfolio_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio`
--

LOCK TABLES `portfolio` WRITE;
/*!40000 ALTER TABLE `portfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolios`
--

DROP TABLE IF EXISTS `portfolios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolios` (
  `portfolio_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`portfolio_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `portfolios_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolios`
--

LOCK TABLES `portfolios` WRITE;
/*!40000 ALTER TABLE `portfolios` DISABLE KEYS */;
INSERT INTO `portfolios` VALUES (2,71,'nlp project','i built this','swapnildemo.com','swapnildemo.git','swapnildemo.com','2026-09-29 17:06:21');
/*!40000 ALTER TABLE `portfolios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_milestone`
--

DROP TABLE IF EXISTS `project_milestone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_milestone` (
  `milestone_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `status` enum('PENDING','COMPLETED') DEFAULT 'PENDING',
  PRIMARY KEY (`milestone_id`),
  KEY `fk_milestone_project` (`project_id`),
  CONSTRAINT `fk_milestone_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_milestone`
--

LOCK TABLES `project_milestone` WRITE;
/*!40000 ALTER TABLE `project_milestone` DISABLE KEYS */;
INSERT INTO `project_milestone` VALUES (1,1,'UI Design','Design the complete website interface',5000.00,'2026-09-25','2026-09-22','COMPLETED');
/*!40000 ALTER TABLE `project_milestone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `student_id` int NOT NULL,
  `client_id` int NOT NULL,
  `project_title` varchar(200) NOT NULL,
  `agreed_amount` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `expected_end_date` date DEFAULT NULL,
  `actual_end_date` date DEFAULT NULL,
  `project_status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED','CANCELLED','DISPUTED') NOT NULL DEFAULT 'NOT_STARTED',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `application_id` (`application_id`),
  KEY `fk_project_student` (`student_id`),
  KEY `fk_project_client` (`client_id`),
  CONSTRAINT `fk_project_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_project_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_project_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,5,34,'Website Development Project',15000.00,'2026-09-20','2026-10-10','2026-09-22','COMPLETED','2026-09-19 01:12:36'),(2,2,3,34,'Build a React Website',200.00,'2026-10-10','2026-12-02',NULL,'NOT_STARTED','2026-09-29 22:43:20');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `reporter_id` int NOT NULL,
  `reported_user_id` int DEFAULT NULL,
  `gig_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `reason` varchar(200) NOT NULL,
  `description` text,
  `report_status` enum('PENDING','UNDER_REVIEW','RESOLVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `reported_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_by` int DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `fk_report_reporter` (`reporter_id`),
  KEY `fk_report_reported_user` (`reported_user_id`),
  KEY `fk_report_gig` (`gig_id`),
  KEY `fk_report_project` (`project_id`),
  KEY `fk_report_admin` (`resolved_by`),
  CONSTRAINT `fk_report_admin` FOREIGN KEY (`resolved_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_gig` FOREIGN KEY (`gig_id`) REFERENCES `gigs` (`gig_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_reported_user` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,84,NULL,NULL,NULL,'i want to build','i want to build','UNDER_REVIEW','2026-09-23 09:19:06',NULL,NULL),(2,87,NULL,NULL,NULL,'something is wrong','something is wrong','UNDER_REVIEW','2026-09-29 22:37:04',NULL,NULL),(3,54,NULL,NULL,2,'hdh','bhdnxm','REJECTED','2026-09-29 23:22:46',1,'2026-09-29 23:59:08');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `reviewer_user_id` int NOT NULL,
  `reviewed_user_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `fk_review_project` (`project_id`),
  KEY `fk_review_reviewer` (`reviewer_user_id`),
  KEY `fk_review_reviewed` (`reviewed_user_id`),
  CONSTRAINT `fk_review_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_reviewed` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_review_reviewer` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_review_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Java','Programming',NULL),(2,'React','Web Development',NULL),(3,'Node.js','Web Development',NULL),(4,'MySQL','Database',NULL),(5,'Python','Programming',NULL),(10,'html','web development','html is used for web development'),(11,'dbms','core ','dbms');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_skills`
--

DROP TABLE IF EXISTS `student_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_skills` (
  `student_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `proficiency_level` varchar(50) DEFAULT NULL,
  `years_of_experience` decimal(4,1) DEFAULT NULL,
  PRIMARY KEY (`student_id`,`skill_id`),
  KEY `fk_student_skill_skill` (`skill_id`),
  CONSTRAINT `fk_student_skill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_student_skill_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_skills`
--

LOCK TABLES `student_skills` WRITE;
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
INSERT INTO `student_skills` VALUES (71,1,'BEGINNER',3.0),(71,3,'BEGINNER',2.0);
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `college_name` varchar(200) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `year_of_study` int DEFAULT NULL,
  `bio` text,
  `location` varchar(150) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `availability_status` enum('AVAILABLE','BUSY','UNAVAILABLE') DEFAULT 'AVAILABLE',
  `verification_status` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,1,'Cummins College of Engineering','E&TC',3,'Engineering student interested in web development and cybersecurity.','Pune',600.00,'AVAILABLE','PENDING','2026-08-22 00:39:24'),(2,53,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 00:15:13'),(3,54,'ccoew','entc',3,'my name is komal ','pune',200.00,'AVAILABLE','PENDING','2026-08-25 00:32:30'),(4,82,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 09:14:48'),(5,84,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:24:06'),(7,3,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(8,4,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(9,5,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(10,6,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(11,7,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(12,8,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(13,9,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(14,10,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(15,11,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(16,12,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(17,13,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(18,14,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(19,15,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(20,16,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(21,17,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(22,18,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(23,19,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(24,20,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(25,21,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(26,22,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(27,55,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(28,56,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(29,57,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(30,58,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(31,59,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(32,60,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(33,61,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(34,62,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(35,63,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(36,64,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(37,65,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(38,66,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(39,67,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(40,68,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(41,69,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(42,70,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(43,71,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(44,72,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(45,73,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(46,74,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(47,75,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(48,76,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(49,77,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(50,78,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(51,79,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(52,80,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(53,81,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:29:53'),(70,85,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-08-25 14:46:55'),(71,87,NULL,NULL,NULL,NULL,NULL,NULL,'AVAILABLE','PENDING','2026-09-29 22:34:06');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `role` enum('STUDENT','CLIENT','ADMIN') NOT NULL,
  `account_status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Komal Student','student@test.com','$2b$10$CAADKE0w1YT9.AewgiQUPO9TCjq0.E682isCkBSYFvDJ.xgTGY.Iy','9876543210',NULL,'STUDENT','ACTIVE','2026-08-22 00:39:24','2026-08-22 01:19:23'),(2,'Test Client','client@test.com','$2b$10$/XRG7cV.HitAVjC4yeYEL.1spyGzOXyy6cnOwl/AgF3sEcVI/ojNC','9876543211',NULL,'CLIENT','ACTIVE','2026-08-22 00:42:30','2026-08-22 01:16:58'),(3,'Aarav Sharma','aarav.sharma@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543201',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50','2026-08-25 00:14:42'),(4,'Ananya Patil','ananya.patil@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543202',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(5,'Rohan Deshmukh','rohan.deshmukh@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543203',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(6,'Sneha Kulkarni','sneha.kulkarni@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543204',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(7,'Aditya Joshi','aditya.joshi@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543205',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(8,'Priya Shah','priya.shah@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543206',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(9,'Omkar Jadhav','omkar.jadhav@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543207',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(10,'Isha More','isha.more@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543208',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(11,'Vivek Pawar','vivek.pawar@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543209',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(12,'Neha Gupta','neha.gupta@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543210',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(13,'Kunal Mehta','kunal.mehta@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543211',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(14,'Pooja Nair','pooja.nair@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543212',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(15,'Rahul Chavan','rahul.chavan@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543213',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(16,'Tanvi Bhosale','tanvi.bhosale@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543214',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(17,'Siddharth Kale','siddharth.kale@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543215',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(18,'Riya Desai','riya.desai@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543216',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(19,'Akash Wagh','akash.wagh@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543217',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(20,'Sakshi Pawar','sakshi.pawar@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543218',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(21,'Yash Thakur','yash.thakur@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543219',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(22,'Meera Joshi','meera.joshi@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543220',NULL,'STUDENT','ACTIVE','2026-08-24 23:59:50',NULL),(23,'Arjun Verma','arjun.verma@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543221',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(24,'Kavya Reddy','kavya.reddy@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543222',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(25,'Nikhil Singh','nikhil.singh@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543223',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(26,'Aditi Kapoor','aditi.kapoor@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543224',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(27,'Manish Agarwal','manish.agarwal@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543225',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(28,'Divya Iyer','divya.iyer@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543226',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(29,'Saurabh Jain','saurabh.jain@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543227',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(30,'Nisha Malhotra','nisha.malhotra@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543228',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(31,'Vikram Rao','vikram.rao@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543229',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(32,'Shreya Mishra','shreya.mishra@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543230',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(33,'Raj Malhotra','raj.malhotra@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543231',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(34,'Neel Joshi','neel.joshi@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543232',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50','2026-09-19 17:31:47'),(35,'Maya Kulkarni','maya.kulkarni@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543233',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(36,'Ritesh Patil','ritesh.patil@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543234',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(37,'Komal Shah','komal.shah@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543235',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(38,'Harsh Vora','harsh.vora@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543236',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(39,'Pallavi Naik','pallavi.naik@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543237',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(40,'Abhishek Roy','abhishek.roy@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543238',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(41,'Mitali Sinha','mitali.sinha@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543239',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(42,'Devendra Kumar','devendra.kumar@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543240',NULL,'CLIENT','ACTIVE','2026-08-24 23:59:50',NULL),(43,'Admin One','admin1@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543241',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50','2026-09-29 23:42:53'),(44,'Admin Two','admin2@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543242',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50','2026-09-29 23:40:33'),(45,'Admin Three','admin3@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543243',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(46,'Admin Four','admin4@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543244',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(47,'Admin Five','admin5@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543245',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(48,'Admin Six','admin6@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543246',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(49,'Admin Seven','admin7@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543247',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(50,'Admin Eight','admin8@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543248',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(51,'Admin Nine','admin9@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543249',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(52,'Admin Ten','admin10@verifiedgigs.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876543250',NULL,'ADMIN','ACTIVE','2026-08-24 23:59:50',NULL),(53,'saee','saee@gmail.com','$2b$10$QtgBSi1ROEeLliWPojAn4uUo6RE8W3O3vBBtCHtpdIcUbE6FpXAk.','123456789',NULL,'STUDENT','ACTIVE','2026-08-25 00:15:13','2026-08-25 00:15:31'),(54,'komal','komal@gmail.com','$2b$10$XBJQ4pUWu2FjnB7xxr/Eu.USY1pdX5st0CEl6oLrdwg37QReBkf..','123456789',NULL,'STUDENT','ACTIVE','2026-08-25 00:32:30','2026-09-29 22:52:21'),(55,'Student 24','student24@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500024',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(56,'Student 25','student25@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500025',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(57,'Student 26','student26@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500026',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(58,'Student 27','student27@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500027',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(59,'Student 28','student28@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500028',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(60,'Student 29','student29@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500029',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(61,'Student 30','student30@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500030',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(62,'Student 31','student31@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500031',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(63,'Student 32','student32@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500032',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(64,'Student 33','student33@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500033',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(65,'Student 34','student34@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500034',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(66,'Student 35','student35@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500035',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(67,'Student 36','student36@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500036',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(68,'Student 37','student37@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500037',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(69,'Student 38','student38@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500038',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(70,'Student 39','student39@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500039',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(71,'Student 40','student40@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500040',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(72,'Student 41','student41@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500041',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(73,'Student 42','student42@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500042',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(74,'Student 43','student43@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500043',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(75,'Student 44','student44@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500044',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(76,'Student 45','student45@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500045',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(77,'Student 46','student46@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500046',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(78,'Student 47','student47@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500047',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(79,'Student 48','student48@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500048',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(80,'Student 49','student49@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500049',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(81,'Student 50','student50@gmail.com','$2b$10$LKK62tY/9bxnuq2Jm7MIW.7BzgRakWQ6IISjs8q/jl3bSidZEhvHu','9876500050',NULL,'STUDENT','ACTIVE','2026-08-25 09:07:02',NULL),(82,'gayatri','gayatri@gmail.com','$2b$10$U8lvDXGV/8sczJvvy9jk6uzPGq.fjcm19oyK0q8as0pGrTgKditoW','12345678900',NULL,'STUDENT','ACTIVE','2026-08-25 09:14:48','2026-08-25 09:15:27'),(83,'sakshi','sakshi@gmail.com','$2b$10$5kSB1pCa8yPa8d8fbnbxze0WHvDd.Rn6X2H8m0WDsRGfCWbgLSfIq','12345678900',NULL,'CLIENT','ACTIVE','2026-08-25 09:16:50','2026-08-25 09:17:10'),(84,'ABC','ABC@gmail.com','$2b$10$YDKGhvwbShznklpX/OVFjeBPpNBXy.4xjYfkHHs8HiBxdcUGq7bzO','12345678900',NULL,'STUDENT','ACTIVE','2026-08-25 14:24:06','2026-09-23 09:18:34'),(85,'Mrudul','mdixit@gmail.com','$2b$10$cNg2zbEkBy0Ttu67C3wwCOhSOcWjAZtBPdUxfOGt2tgXBEmu.yMLq','999999999',NULL,'STUDENT','ACTIVE','2026-08-25 14:46:55','2026-08-25 14:48:55'),(86,'XYZ','xyz@gmail.com','$2b$10$zPqwWwZ9q71kUYmjSxtnN.B1zvRDJDHNxWwD1KDvSkHGwsBlhsnPe','1234567899',NULL,'CLIENT','ACTIVE','2026-08-25 14:49:31','2026-09-29 23:41:01'),(87,'swapnil ','swapnil@gmail.com','$2b$10$4KZZjr3tPYmaQL12p/YlG.xvqSGFKmlSppe4GfhTDEZrildjC1lUC','9975605048',NULL,'STUDENT','INACTIVE','2026-09-29 22:34:06','2026-09-29 22:34:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_documents`
--

DROP TABLE IF EXISTS `verification_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `document_url` varchar(500) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_status` enum('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `verified_by` int DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `rejection_reason` text,
  PRIMARY KEY (`document_id`),
  KEY `fk_verification_student` (`student_id`),
  KEY `fk_verification_admin` (`verified_by`),
  CONSTRAINT `fk_verification_admin` FOREIGN KEY (`verified_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_verification_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_documents`
--

LOCK TABLES `verification_documents` WRITE;
/*!40000 ALTER TABLE `verification_documents` DISABLE KEYS */;
INSERT INTO `verification_documents` VALUES (1,71,'student id','http://localhost:5173/student/profile','2026-09-29 22:39:12','VERIFIED',1,'2026-09-29 23:33:17',NULL),(2,3,'id','http://localhost:5173/student/profile','2026-09-29 23:21:38','REJECTED',1,'2026-09-29 23:33:15','hgb');
/*!40000 ALTER TABLE `verification_documents` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-30  0:07:11

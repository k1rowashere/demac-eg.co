-- MariaDB dump 10.19  Distrib 10.6.8-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: demac_eg
-- ------------------------------------------------------
-- Server version	10.6.8-MariaDB-1:10.6.8+maria~focal

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `demac_eg`
--

-- CREATE DATABASE /*!32312 IF NOT EXISTS*/ `demac_eg` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `demac_eg`;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `path` varchar(45) NOT NULL DEFAULT '/',
  `part_no` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb3 NOT NULL,
  `price` decimal(8,2) unsigned zerofill NOT NULL,
  `manufacturer_link` varchar(256) CHARACTER SET utf8mb3 NOT NULL,
  `img_link` varchar(256) CHARACTER SET utf8mb3 NOT NULL,
  PRIMARY KEY (`part_no`),
  UNIQUE KEY `part_no_UNIQUE` (`part_no`),
  KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
LOAD DATA INFILE "/docker-entrypoint-initdb.d/db.csv"
INTO TABLE products
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-25 13:39:12

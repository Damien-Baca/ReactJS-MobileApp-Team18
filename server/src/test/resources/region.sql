-- MySQL dump 10.17  Distrib 10.3.17-MariaDB, for Linux (x86_64)
--
-- Host: faure    Database: cs314
-- ------------------------------------------------------
-- Server version	10.3.17-MariaDB

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
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `region` (
  `index` int(11) NOT NULL,
  `id` varchar(100) NOT NULL,
  `local_code` varchar(10) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `continent` varchar(10) DEFAULT NULL,
  `iso_country` varchar(10) DEFAULT NULL,
  `wikipedia_link` varchar(1000) DEFAULT NULL,
  `keywords` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `regions_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--
-- WHERE:  id in (select iso_region from world where municipality like '%denver%')

LOCK TABLES `region` WRITE;
/*!40000 ALTER TABLE `region` DISABLE KEYS */;
INSERT INTO `region` VALUES (303295,'CA-BC','BC','British Columbia','NA','CA','http://en.wikipedia.org/wiki/British_Columbia',NULL),(306081,'US-CO','CO','Colorado','NA','US','http://en.wikipedia.org/wiki/Colorado',NULL),(306119,'US-TX','TX','Texas','NA','US','http://en.wikipedia.org/wiki/Texas',NULL),(306103,'US-NC','NC','North Carolina','NA','US','http://en.wikipedia.org/wiki/North_Carolina',NULL);
/*!40000 ALTER TABLE `region` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-09 17:05:12

USE `demac_eg`;


START TRANSACTION;
SET autocommit =0;

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

Commit;
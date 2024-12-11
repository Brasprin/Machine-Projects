DROP DATABASE IF EXISTS steamGames;
CREATE DATABASE steamGames;

USE steamGames;

CREATE TABLE steamGames (
    appid INT,
    name TEXT,
    price DECIMAL(10, 2),
    releasedate_cleaned DATE,
    PRIMARY KEY (appid, releasedate_cleaned)  -- Added releasedate_cleaned to the primary key
)
PARTITION BY RANGE (YEAR(releasedate_cleaned)) (
    PARTITION p_before_2010 VALUES LESS THAN (2010),
    PARTITION p_after_2010 VALUES LESS THAN MAXVALUE
);

SELECT * FROM steamGames WHERE price = 4.99;

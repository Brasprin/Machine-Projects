DROP DATABASE IF EXISTS games;
CREATE DATABASE games;
USE games;

-- Create the Dimension Table
CREATE TABLE Dim_Developers (
	developer_id INT PRIMARY KEY,
    developers TEXT
);

CREATE TABLE Dim_Publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    publishers VARCHAR(255) 
);

CREATE TABLE Dim_OS (
    os_id INT PRIMARY KEY,
    os VARCHAR(255) 
);

CREATE TABLE Dim_Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    categories TEXT
);

CREATE TABLE Dim_Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genres VARCHAR(255)
);

-- Create the Fact Table
CREATE TABLE Fact_Steam_Games (
    appid INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT ,
    release_date_cleaned DATE,
    peak_ccu INT,
    price DECIMAL(10, 2),
    metacritic_score DECIMAL(5, 2),
    recommendations INT,
    positive_reviews INT,
    negative_reviews INT,
    avgplaytime_forever INT,
    avgplaytime_twoweeks INT,
    medplaytime_forever INT,
    medplaytime_twoweeks INT,
    estimated_owners TEXT,
    
    developer_id INT,
    publisher_id INT,
    os_id INT,
    genre_id INT,
    category_id INT
);

SELECT YEAR(f.release_date_cleaned) AS Release_Year, GROUP_CONCAT(DISTINCT os.os ORDER BY os.os SEPARATOR ', ') AS Platforms, COUNT(f.appid) AS Number_of_Games_Released FROM Fact_Steam_Games f JOIN Dim_OS os ON f.os_id = os.os_id GROUP BY Release_Year, os.os_id ORDER BY Release_Year ASC, COUNT(f.appid) DESC;


USE games;

-- Base: What’s the average number of positive and negative reviews per publisher? 

SELECT
    p.publishers AS Publisher,
        COUNT(f.appid) AS Games_Published,
	ROUND(AVG(f.positive_reviews),2) AS Avg_Positive_Reviews,
    ROUND( AVG(f.negative_reviews),2) AS Avg_Negative_Reviews
FROM
    Fact_Steam_Games f
JOIN
    Bridge_fact_publishers bp ON f.appid = bp.appid
JOIN
    Dim_Publishers p ON bp.publisher_id = p.publisher_id
GROUP BY
    p.publishers
ORDER BY
    Avg_Positive_Reviews DESC;

-- Refinement 1: Which are the top publishers with the highest average recommendations in terms of the number of games published? 
SELECT
    p.publishers AS Publisher,
    COUNT(f.appid) AS Games_Published,
    ROUND(AVG(f.recommendations), 2) AS Avg_Recommendations
FROM
    Fact_Steam_Games f
JOIN
    Bridge_fact_publishers bp ON f.appid = bp.appid
JOIN
    Dim_Publishers p ON bp.publisher_id = p.publisher_id
GROUP BY
    p.publishers
ORDER BY
    Avg_Recommendations DESC;

    
    
-- Refinement 2: What is the average playtime forever of the games published by the top publishers identified in Refinement 1, and how does this playtime correlate with their average positive and negative reviews
SELECT 
    p.publishers AS Publisher, 
    COUNT(f.appid) AS Games_Published, 
    ROUND(AVG(f.recommendations), 2) AS Avg_Recommendations, 
    ROUND(AVG(f.avgplaytime_forever), 2) AS Avg_Playtime_Forever, 
    ROUND(AVG(f.positive_reviews), 2) AS Avg_Positive_Reviews, 
    ROUND(AVG(f.negative_reviews), 2) AS Avg_Negative_Reviews 
FROM 
    Fact_Steam_Games f 
JOIN 
    Dim_Publishers p 
ON 
    f.publisher_id = p.publisher_id 
GROUP BY 
    p.publishers 
ORDER BY 
    Avg_Recommendations DESC;

   
   
   SELECT * FROM Dim_Publishers 
WHERE publishers LIKE '%rockstar%';



SELECT f.name , bfp.*, p.*
FROM Fact_Steam_Games f
JOIN Bridge_fact_publishers bfp 
    ON f.appid = bfp.appid
JOIN Dim_Publishers p 
    ON bfp.publisher_id = p.publisher_id
WHERE p.publishers LIKE '%rockstar%';

SELECT * FROM Fact_Steam_Games;


   
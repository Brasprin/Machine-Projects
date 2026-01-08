USE games;


-- Referencing fact table and dimension table
ALTER TABLE Fact_Steam_Games
ADD FOREIGN KEY (developer_id) REFERENCES Dim_Developers(developer_id),
ADD FOREIGN KEY (publisher_id) REFERENCES Dim_Publishers(publisher_id),
ADD FOREIGN KEY (os_id) REFERENCES Dim_OS(os_id),
ADD FOREIGN KEY (genre_id) REFERENCES Dim_Genres(genre_id),
ADD FOREIGN KEY (category_id) REFERENCES Dim_Categories(category_id);


CREATE INDEX idx_fact_publisher_id ON Fact_Steam_Games(publisher_id);
CREATE INDEX idx_dim_publisher_id ON Dim_Publishers(publisher_id);

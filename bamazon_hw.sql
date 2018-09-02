CREATE DATABASE IF NOT EXISTS bamazon_cust_db;

USE bamazon_cust_db;

CREATE TABLE IF NOT EXISTS bamazon_store(
id INTEGER(11) AUTO_INCREMENT NOT NULL,
product VARCHAR(50),
department VARCHAR(50),
price DECIMAL(5,2),
quantity INTEGER(11),
PRIMARY KEY(id)
);


SELECT * FROM bamazon_store;
INSERT INTO bamazon_store
(product,department,price,quantity)
VALUES
('Xbox One','Electronics',400.00,10),
('Liverpool Home Kit', 'Clothing & Apparel',140.00,20),
('Red Gatorade','Food & Beverages',5.99,200),
('Playstation 3','Electronics',400.00,20),
('Basketball: and other things','Books & Textbooks',14.99,100),
('Liverpool Away Kit','Clothing & Apparel',140.00,12),
('Soccerball','Sports & Outdoors',50.00,14),
('Football','Sports & Outdoors',30.00,15),
('Basketball','Sports & Outdoors',40.00,13),
('The Rap Yearbook', 'Books & Textbooks',14.99,100),
('Tire Shine','Automotive Parts & Accessories',7.78,1000),
('Coding for Dummies','Books & Textbooks',20.99,200);

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name CHAR (10) NOT NULL,
department_name CHAR (12) NOT NULL,
price INT (10) NOT NULL,
stock_quantity INT (10) NOT NULL,
product_sales INT (10) default 0,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES 
("camera", "electronics", 100, 10, 100),
("phone", "electronics", 800, 3, 100),
("shoes", "clothing", 10, 60, 100),
("toy", "toys", 10, 0, 100),
("plates", "kitchen", 100, 10, 100),
("shirt", "clothing", 10, 10, 100),
("pants", "clothing", 50, 9, 100),
("tv", "electronics", 1000, 5, 100),
("silverware", "kitchen", 20, 3, 100),
("cups", "kitchen", 10, 25, 100);

drop table departments;

CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name CHAR (12) NOT NULL,
over_head_costs INT (10) NOT NULL,
PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 5000),
("toys", 6000),
("clothing", 7000),
("kitchen", 8000);


SELECT * FROM products;
SELECT * FROM departments;

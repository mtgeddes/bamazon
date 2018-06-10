CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name CHAR (10) NOT NULL,
    department_name CHAR (12) NOT NULL,
    price INT (10) NOT NULL,
    stock_quantity INT (10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("camera", "electronics", 100, 10),
("phone", "electronics", 800, 3),
("shoes", "clothing", 10, 60),
("toy", "toys", 10, 0),
("plates", "kitchen", 100, 10),
("shirt", "clothing", 10, 10),
("pants", "clothing", 50, 9),
("tv", "electronics", 1000, 5),
("silverware", "kitchen", 20, 3),
("cups", "kitchen", 10, 25);

SELECT * FROM products;
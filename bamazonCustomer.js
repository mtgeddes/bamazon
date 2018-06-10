require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require('colors');
const { table } = require('table');
const { number } = config.columns[{number}].width

let config,
    data,
    output;

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,                             // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});

connection.connect(function(err) {
    if (err) throw err;                     
    displayProducts();

    function displayProducts() {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            data = [
                ['ID'.underline, 'Name'.underline, 'Price'.underline]
            ];

            config = {
                columns: {
                    2: {
                        alignment: 'right'
                    }
                }
            };

            for (let i in res) {
                data.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2)]);
            }
            output = table(data, config);
            console.log(output);
            start();
        });
    };

    function start() {                  // The app should then prompt users with two messages.
        inquirer.prompt([
            {                           // 1) The first should ask them the ID of the product they would like to buy.
                name: "thisProduct", 
                type: "input",
                message: "What is the " + "ID".underline + " of the product you would like to buy?",
            },

            {                           // 2) The second message should ask how many units of the product they would like to buy.
                name: "thisMany", 
                type: "input", 
                message: "How " + "many".underline + " would you like to buy?",
            }

        ]).then(function(answer) {

            let productID = answer.thisProduct; 
            let howMany = answer.thisMany;
            let stockQuantity; 

            console.log("Checking if available...\n");
            connection.query("SELECT stock_quantity FROM products WHERE item_id=" + productID, function(err, res) {
                
                stockQuantity = res[0].stock_quantity;
                
                if (err) throw err;

                if (stockQuantity < howMany) {
                    console.log('Insufficient quantity')
                } else {

                    console.log('We have enough!');
                    console.log("Completing order...\n");
                    console.log("Your total is: $" + (res[0].price * howMany).toFixed(2))
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (res[0].stock_quantity - howMany)
                            },
                            {
                                item_id: productID
                            }
                        ],
                    );
                };
            });
        }); 
    };
});

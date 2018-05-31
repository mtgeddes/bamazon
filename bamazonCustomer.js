require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");

// Font color variables...
let FgBlack = "\x1b[30m";
let FgRed = "\x1b[31m";
let FgGreen = "\x1b[32m";
let FgYellow = "\x1b[33m";
let FgBlue = "\x1b[34m";
let FgMagenta = "\x1b[35m";
let FgCyan = "\x1b[36m";
let FgWhite = "\x1b[37m";


let order;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,                             // Your port; if not 3306
    user: "root",                           // Your username
    password: process.env.password,         // Your password
    database: "bamazon"                     // The database name
});

connection.connect(function(err) {
    if (err) throw err;                     
    
    displayProducts();

    function displayProducts() {
        console.log("Selecting all products...\n");
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            console.log('------------------------------Products---------------------------------');
            console.log('ID |  Name  |  Price');
            console.log('---------------------');
            for(let i = 0; i < res.length; i ++) {
                console.log(res[i].item_id + "  | " + res[i].product_name + " | " + res[i].price)
            };
            console.log('------------------------------Products---------------------------------');
            start();
        });
    };


    function start() {                  // The app should then prompt users with two messages.
        inquirer.prompt([
            {                           // 1) The first should ask them the ID of the product they would like to buy.
                name: "whatProduct", 
                type: "list",
                message: "What is the ID of the product you would like to buy?",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
            },

            {                           // 2) The second message should ask how many units of the product they would like to buy.
                name: "howMany", 
                type: "list", 
                message: "How many would you like to buy?",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
            }

        ]).then(function(answer) {

            let productID = answer.whatProduct; 
            let howMany = answer.howMany;
            let stockQuantity; 

            console.log("Checking if available...\n");
            connection.query("SELECT * FROM products WHERE item_id=" + productID, function(err, res) {
                
                stockQuantity = res[0].stock_quantity;
                
                if (err) throw err;

                if (stockQuantity < howMany) {
                    console.log('Insufficient quantity')
                } else {

                    console.log('We have enough!');
                    console.log("Completing order...\n");
                    console.log("Your total is: $" + (res[0].price * howMany))
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
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

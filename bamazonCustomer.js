require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const { table } = require('table');
const bamazon = require('./bamazon');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,                             // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});

// Establishes the variables for the table npm to display the information in a clean table...
let config,
    data,
    output;

function bamazonCustomer () {
        
    // Clears the terminal...
    process.stdout.write('\033c'); 

    // Displays the open welcome screen...
    let config,
        data,
        output;
    
    data = [
        ['             ' + 'BAMAZON!'.yellow + '             ']
    ];
    config = {
        columns: {
            0: {
                minWidth: 25
            },
        }
    };
    output = table(data, config);
    console.log(output);
    loadingDisplayProducts(); // <--Starts the app...
    
    // Sets a loading period for the display of products...
    function loadingDisplayProducts() {
        console.log("Loading products...\n");
        setTimeout(displayProducts, 2000);
    };
    
    // Displays the products for the user to purchase from...
    function displayProducts() {
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
            purchaseProduct();
        });
    };

    // Allows user to purchase a product...
    function purchaseProduct() {                 
        inquirer.prompt([
            {                           
                name: "thisProduct", 
                type: "input",
                message: "What is the " + "ID".underline + " of the product you would like to buy?",
                validate: function validateNumber(check){
                    let reg = /^\d+$/;
                    return reg.test(check) || "Input should be a number";
                }
            },

            {                          
                name: "thisMany", 
                type: "input", 
                message: "How " + "many".underline + " would you like to buy?",
                validate: function validateNumber(check){
                    let reg = /^\d+$/;
                    return reg.test(check) || "Input should be a number";
                }
            }

        ]).then(function(answer) {

            let productID = answer.thisProduct; 
            let howMany = answer.thisMany;
            
            console.log("Checking if available...\n");
            connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE item_id=" + productID, function(err, res) {
                
                let productSale = res[0].product_sales;
                let stockQuantity = res[0].stock_quantity;
                
                if (err) throw err;

                if (stockQuantity < howMany) {
                    console.log('Insufficient quantity');

                    inquirer.prompt([
                        {                           
                            name: "continue", 
                            type: "list",
                            message: "Would you like to continue shopping?",
                            choices: ['Yes', 'No']
                        },
                    ]).then(function(yesOrNo) { 
                        let customerContinueResponse = yesOrNo.continue;
                        if (customerContinueResponse === "Yes") {
                            setTimeout(loadingDisplayProducts, 2000);
                        } else {
                            console.log("Thank you for shopping!")
                            setTimeout(bamazon.start, 2000);
                        };   
                    });

                } else {
                    console.log("Completing order...\n");
                    
                    let message = function () {
                        console.log("Your total is: $" + (res[0].price * howMany).toFixed(2) + "\n")
                    };
                    setTimeout(message, 1000);
                    
                    connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?",
                        [
                            res[0].stock_quantity - howMany, 
                            res[0].price * howMany + parseInt(productSale), 
                            productID
                        ]
                    );
                    setTimeout(bamazon.start, 3000);
                };
            });
        }); 
    };
};
    
module.exports.bamazonCustomer = bamazonCustomer;
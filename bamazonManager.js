require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require('colors');
const { table } = require('table');
const bamazon = require('./server');

let connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,         // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});

function bamazonManager () {
    clearTerminal ();
    function clearTerminal () {
        // Clears the terminal...
        //process.stdout.write('\033c'); 
        
        // Establishes the variables for the table npm to display the information in a clean table...
        let config,
            data,
            output;
        
        // Bamazon welcome screen ...   
        data = [
            ['             ' + 'Manager Menu'.yellow + '             ']
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
    }

    
    start(); // <--Starts the bamanzon options...

    // The start function which allows the user to choose between four options.
    function start() {   
        inquirer.prompt([
            {                           
                name: "response", 
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Go Back"]
            }
        ]).then(function(answer) {

            let mgrResponse = answer.response; 

            switch (mgrResponse) {
                case "View Products for Sale":
                    displayProducts();
                    break;
                case "View Low Inventory":
                    lowStock();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    newProduct();
                    break;
                case "Go Back":
                    bamazon.start();
                    break;
                default: 
                    console.log("Not a valid option");
            }
        }); 
    };

    // Displays all products...
    function displayProducts() {
        clearTerminal ();
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;

            data = [
                ['ID'.underline.yellow, 'Name'.underline.yellow, 'Price'.underline.yellow, 'Stock'.underline.yellow]
            ];
            config = {
                columns: {
                    2: {
                        alignment: 'right'
                    },
                    3: {
                        alignment: 'right'
                    }
                }
            };

            for (let i in res) {
                data.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
            }
            output = table(data, config);
            console.log(output);
            start();
        });
    };

    // Displays low stock...
    function lowStock () {
        clearTerminal ();
        connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5", function(err, res) {
            if (err) throw err;

            data = [
                ['ID'.underline.yellow, 'Name'.underline.yellow, 'Price'.underline.yellow, 'Stock'.underline.yellow]
            ];
            config = {
                columns: {
                    2: {
                        alignment: 'right'
                    },
                    3: {
                        alignment: 'right'
                    }
                }
            };

            for (let i in res) {
                data.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
            }
            output = table(data, config);
            console.log(output);
            start();
        });
    };

    // Allows user to add inventory to existing items...
    function addInventory () {

        clearTerminal ();

        connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5", function(err, res) {
            if (err) throw err;

            data = [
                ['ID'.underline.yellow, 'Name'.underline.yellow, 'Price'.underline.yellow, 'Stock'.underline.yellow]
            ];
            config = {
                columns: {
                    2: {
                        alignment: 'right'
                    },
                    3: {
                        alignment: 'right'
                    }
                }
            };

            for (let i in res) {
                data.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
            }
            output = table(data, config);
            console.log(output);
            setTimeout(add, 500);
        });

        function add () {
            inquirer.prompt([
                {                        
                    name: "thisProduct", 
                    type: "input",
                    message: "What is the " + "ID".underline + " of the product you would like to add more stock to?",
                    validate: function validate(check){
                        return check !== '' || "Please enter a valid name";
                    }
                },
                {                        
                    name: "thisMany", 
                    type: "input",
                    message: "How " + "many".underline + " would you like to add?",
                    validate: function validateNumber(check){
                        let reg = /^\d+$/;
                        return reg.test(check) || "Age should be a number!";
                    }
                }
            ]).then(function(answer) {
    
                let productID = answer.thisProduct; 
                let howMany = answer.thisMany;
                let stockQuantity;
    
                connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id=" + productID, function(err, res) {
                    if (err) throw err;
    
                    stockQuantity = parseInt(res[0].stock_quantity) + parseInt(howMany);
    
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (stockQuantity)
                            },
                            {
                                item_id: productID
                            }
                        ],
                    );
                    console.log("\n You added ".grey + howMany.bold.white + " to ".grey + res[0].product_name.bold.white + " stock. The total stock is now ".grey + colors.bold(stockQuantity) + ".\n".grey);
                    setTimeout(start, 3000);
                });
            }); 
        };
    };

    // Allows user to a new product to the stock...
    function newProduct () {
        clearTerminal ();
        inquirer.prompt([
            {                        
                name: "product_name", 
                type: "input",
                message: "Add the product name",
                validate: function validate(check){
                    return check !== '' || "Please enter a valid name";
                }
            },
            {                        
                name: "department_name", 
                type: "input",
                message: "Add the department name?",
                validate: function validate(check){
                    return check !== '' || "Please enter a valid name";
                }
            },
            {                        
                name: "price", 
                type: "input",
                message: "Set the price",
                validate: function validateNumber(check){
                    let reg = /^\d+$/;
                    return reg.test(check) || "Must input a number";
                }
            },
            {                        
                name: "stock_quantity", 
                type: "input",
                message: "How " + "many".underline + " would you like to add?",
                validate: function validateNumber(check){
                    let reg = /^\d+$/;
                    return reg.test(check) || "Must input a number";
                }
            }
        ]).then(function(answer) {

            let productName = answer.product_name; 
            let departmentName = answer.department_name;
            let price = parseFloat(answer.price);
            let stockAmount = parseFloat(answer.stock_quantity);

            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${productName}", "${departmentName}", ${price}, ${stockAmount})`, function(err, res) {
                if (err) throw err;
                start();
            });
        }); 
    };
};

module.exports.bamazonManager = bamazonManager;
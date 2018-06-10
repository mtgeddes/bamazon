require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require('colors');
const { table } = require('table');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,                             // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

connection.connect(function(err) {
    if (err) throw err;                     
    process.stdout.write('\033c'); 
    
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
    start();

    function displayProducts() {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            let config,
                data,
                output;
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

    function lowStock () {
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

    function addInventory () {
        
        inquirer.prompt([
            {                        
                name: "thisProduct", 
                type: "input",
                message: "What is the " + "ID".underline + " of the product you would like to add more stock to?",
            },
            {                        
                name: "thisMany", 
                type: "input",
                message: "How " + "many".underline + " would you like to add?",
            }
        ]).then(function(answer) {

            let productID = answer.thisProduct; 
            let howMany = answer.thisMany;
            let stockQuantity

            connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id=" + productID, function(err, res) {
                if (err) throw err;

                stockQuantity = parseInt(res[0].stock_quantity) + parseInt(howMany)

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
                console.log("\n You added ".grey + howMany.bold.white + " to ".grey + res[0].product_name.bold.white + " stock. The total stock is now ".grey + colors.bold(stockQuantity) + ".\n".grey)
                start();
            });
        }); 
    };
  

    function newProduct () {
        inquirer.prompt([
            {                        
                name: "product_name", 
                type: "input",
                message: "Add the product name",
            },
            {                        
                name: "department_name", 
                type: "input",
                message: "Add the department name?",
            },
            {                        
                name: "price", 
                type: "input",
                message: "Set the price",
            },
            {                        
                name: "stock_quantity", 
                type: "input",
                message: "How " + "many".underline + " would you like to add?",
            }
        ]).then(function(answer) {

            let productName = answer.product_name; 
            let departmentName = answer.department_name;
            let price = answer.price;
            let stockAmount = answer.stock_quantity;

            connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${productName}", "${departmentName}", ${price}, ${stockAmount})`, function(err, res) {
                if (err) throw err;
                start();
            });
        }); 
    };

    function start() {   
       
        inquirer.prompt([
            {                           
                name: "response", 
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
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
                    newProduct()
                    break;
                default: 
                    console.log("Not a valid option")
            }
        }); 
    };
});

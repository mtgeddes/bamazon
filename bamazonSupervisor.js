require("dotenv").config();

const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require('colors');
const { table } = require('table');
const bamazon = require('./bamazon');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,                             // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});

function bamazonSupervisor () {
        
    // Clears the terminal...
    process.stdout.write('\033c'); 
    
    // Establishes the variables for the table npm to display the information in a clean table...
    let config,
        data,
        output;
    
    // Bamazon welcome screen ...   
    data = [
        ['             ' + 'Supervisor Menu'.yellow + '             ']
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
    
    start(); // <--Starts the bamanzon options...

    // The start function which allows the user to choose between four options.
    function start() {   
    
        inquirer.prompt([
            {                           
                name: "response", 
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department", "Go back"]
            }
        ]).then(function(answer) {

            let mgrResponse = answer.response; 

            switch (mgrResponse) {
                case "View Product Sales by Department":
                    displayProductSales();
                    break;
                case "Create New Department":
                    newDepartment ();
                    break;
                case "Go back":
                    bamazon.start();
                    break;
                default: 
                    console.log("Not a valid option");
            }
        }); 
    };

    // Displays all product sales, costs, and profits...
    function displayProductSales() {
        connection.query(        
            "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, " +
            "(products.product_sales-departments.over_head_costs) AS total_profit FROM products INNER JOIN departments " +
            "ON (products.department_name = departments.department_name) GROUP BY department_id;", function(err, res) {
            if (err) throw err;

            data = [
                ['department_id'.underline.yellow, 'department_name'.underline.yellow, 'over_head_costs'.underline.yellow, 
                'product_sales'.underline.yellow, "total_profit".underline.yellow]
            ];
            config = {
                columns: {
                    2: {
                        alignment: 'right'
                    },
                    3: {
                        alignment: 'right'
                    },
                    4: {
                        alignment: 'right'
                    }
                }
            };

            for (let i in res) {
                data.push([res[i].department_id, res[i].department_name, "$" + res[i].over_head_costs.toFixed(2), 
                "$" + res[i].product_sales, "$" + res[i].total_profit]);
            }
            output = table(data, config);
            console.log(output);
            start();
        });
    };

    // Creates a New Department...
    function newDepartment () {
        inquirer.prompt([
            {                        
                name: "department_name", 
                type: "input",
                message: "What is the name of the department you want to add?",
                validate: function validate(check){
                    return check !== '' || "Please enter a valid name";
                }
            },
            {                        
                name: "over_head_costs", 
                type: "input",
                message: "What is the overhead cost for this department?",
                validate: function validateNumber(check){
                let reg = /^\d+$/;
                return reg.test(check) || "Input should be a number";
                }
            }
        ]).then(function(answer) {

            let departmentName = answer.department_name; 
            let overHeadCosts = parseFloat(answer.over_head_costs);

            connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ("${departmentName}", ${overHeadCosts});`, function(err, res) {
                if (err) throw err;
                start();
            });
        }); 
    };
};

module.exports.bamazonSupervisor = bamazonSupervisor
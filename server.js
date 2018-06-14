require("dotenv").config();

const inquirer = require("inquirer");
const { table } = require('table');
const customer = require('./bamazonCustomer');
const manager = require('./bamazonManager');
const supervisor = require('./bamazonSupervisor');
const mysql = require("mysql");

let connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,         // Your port; if not 3306
    user: process.env.DB_USER,              // Your username
    password: process.env.DB_PASS,          // Your password
    database: "bamazon"                     // The database name
});


// Establishes the server connection...
connection.connect(function(err) {
    if (err) throw err; 
});

start(); // <--Starts the bamanzon options...

// The start function which allows the user to choose between four options.
function start() {   

    // Clears the terminal...
    //process.stdout.write('\033c'); 

    // Displays the open welcome screen...
    let config,
        data,
        output;
    
    data = [
        ['             ' + 'Welcome to BAMAZON!'.yellow + '             ']
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

    inquirer.prompt([
        {                           
            name: "response", 
            type: "list",
            message: "Select an option",
            choices: ["Customer options", "Manager options", "Supervisor options"]
        }
    ]).then(function(answer) {

        let mgrResponse = answer.response; 

        switch (mgrResponse) {
            case "Customer options":
                customer.bamazonCustomer();
                break;
            case "Manager options":
                manager.bamazonManager();
                break;
            case "Supervisor options":
                supervisor.bamazonSupervisor();
                break;
            default: 
                console.log("Not a valid option");
        }
    });
};


module.exports.start = start;
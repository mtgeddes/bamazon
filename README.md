# Bamazon
This application utilizes the command terminal interface to demonstrate connectivity of [Node.js](https://nodejs.org/en/) and [MySQL](https://www.mysql.com/). 

* [Features](#features)
* [Demo](#demo)
* [Setup](#setup)
* [NPM](#npm)

# <a name="features"></a>Features

There are three built in options:

- General
    - [x] Handles invalid user input.
    - [x] Streamlined command terminal interface for easy navigation.
- Customer
    - [x] Allows purchasing of items in stock.
    - [x] Allows user to view products.
    - [x] Informs user of insufficent stock upon purchase.
- Manager
    - [x] Allows manager to see products sold and stock.
    - [x] Allows manager to see low stock.
    - [x] Allows manager to add to inventory.
    - [x] Allows manager to add a new product.
- Supervisor
    - [x] Allows supervisor to see profits.
    - [x] Allows supervisor to add a new department.

# <a name="demo"></a>Demo

###Customer Demo
![Customer](/gifs/customer.gif)

###Manager Demo
![Manager](/gifs/manager.gif)

###Supervisor Demo
![Supervisor](/gifs/supervisor.gif)

# <a name="setup"></a>Setup

* Step one: Clone repo
* Step two: Run the following in the command terminal within the directory the repo was cloned to:
```
npm i
```
* Step three: create a `.env` file that stores your password and user:
```
DB_PASS=inputPasswordHere
DB_USER=inputUsernameHere
```
* Step four: Run the following command:
```
node bamazon
```

## <a name="npm"></a>NPM Packages Used
* [mysql] (https://www.npmjs.com/package/mysql) - Handles connections to mysql server.
* [inquirer] (https://www.npmjs.com/package/inquirer) - Handles user inputs.
* [table] (https://www.npmjs.com/package/table) - Creates readable tables for content within the terminal.
* [colors] (https://www.npmjs.com/package/colors) - Addes colors to add distinction to terminal info.
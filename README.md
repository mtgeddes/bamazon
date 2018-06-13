# Bamazon
This application utilizes the command terminal interface to demonstrate connectivity of [Node.js](https://nodejs.org/en/) and [MySQL](https://www.mysql.com/). 

* [Features](#features)
* [Demos](#demo)
    * [Customer](#customer)
    * [Manager](#manager)
    * [Supervisor](#supervisor)
* [Setup](#setup)
* [NPMs](#npm)

# <a name="features"></a>Features

There are three built in options:

- General
    - Handles invalid user input.
- Customer
    - Allows purchasing of items in stock.
    - Allows user to view products.
    - Informs user of insufficent stock upon purchase.
- Manager
    - Allows manager to see products sold and stock.
    - Allows manager to see low stock.
    - Allows manager to add to inventory.
    - Allows manager to add a new product.
- Supervisor
    - Allows supervisor to see profits.
    - Allows supervisor to add a new department.

# <a name="demo"></a>Demos

### <a name="customer">Customer Demo
![Customer](/gifs/customer.gif)

#### <a name="manager">Manager Demo
![Manager](/gifs/manager.gif)

#### <a name="supervisor">Supervisor Demo
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
* Step four: Make sure to create your database within MySQL using the MySQL schema found in bamazon.sql file. 
* Step five: Run the following command:
```
node server
```

## <a name="npm"></a>NPMs Used
* [mysql] (https://www.npmjs.com/package/mysql) - Handles connections to mysql server.
* [inquirer] (https://www.npmjs.com/package/inquirer) - Handles user inputs.
* [table] (https://www.npmjs.com/package/table) - Creates readable tables for content within the terminal.
* [colors] (https://www.npmjs.com/package/colors) - Addes colors to add distinction to terminal info.
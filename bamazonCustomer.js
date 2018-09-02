var mysql = require('mysql');
var inq = require('inquirer');
var Table = require('cli-table');
var chalk = require("chalk");
var searchTerm = '';
var itemQuan = null;
var cart = [];
var itemCount = [];
var itemTotal = 0;
var quanUpdater = null;
var startDisplay = [];

//establish connection to mySQL
connection = mysql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: "bamazon123",
    database: "bamazon_cust_db"
});

//check for connection
connection.connect(function (err) {
    if (err) throw err;
});
populate();

//populate starting selection
function populate() {
    connection.query("SELECT product, quantity FROM bamazon_store", (err, res) => {
        if (err) throw err
        var obj = JSON.parse(JSON.stringify(res));
        // console.log(obj[1].quantity);
        for (i = 1; i < obj.length; i++) {
            if (obj[i].quantity != 0) {
                startDisplay.push(obj[i].product);
            }
        }
        startBam();
    })
}

//master function 
function startBam() {
    inq.prompt([{
        type: "list",
        message: "Welcome to Bamazon! The following items are in stock: " + chalk.magenta(startDisplay.splice(",").join(", ")),
        name: "itemSelect",
        choices: ["Continue"]
    }, {
        type: "input",
        message: "Please enter the item you would like to purchase: ",
        name: "BamSearch"
    }]).then((results) => {
        searchTerm = results.BamSearch;
        // console.log(searchTerm);
        //Use MySQL to return all data related to searched item
        connection.query("SELECT * FROM bamazon_store WHERE ?", {
            product: searchTerm
        }, (err, res) => {
            if (err) throw err;
            else if (res.length === 0) {
                console.log("We are sorry, but we can't find what you are searching for.");
                endSearch();
            } else {
                console.log(JSON.parse(JSON.stringify(res)));
                itemQuan = JSON.parse(JSON.stringify(res))[0].quantity;
                BamFollowUp(searchTerm);
            }
        });
    })
}

function BamFollowUp(searchTerm) {
    inq.prompt([{
        type: "number",
        message: "Please enter the number of items you wish to purchase",
        name: "ItemNumber"
    }]).then((results) => {
        if (results.ItemNumber > itemQuan) {
            console.log("Sorry, but we don't have enough of this item in stock!");
            endSearch();
        } else {
            cart.push(searchTerm);
            itemCount.push(results.ItemNumber);
            console.log(cart);
            console.log(itemCount);
            console.log(results.ItemNumber + " of the stated item(s) has been added to the cart.");
            calculateCost(searchTerm);
            updateInventory(searchTerm, results.ItemNumber);
            endSearch();
        }
    })
}

function calculateCost(searchTerm) {
    connection.query("SELECT price FROM bamazon_store WHERE ?", {
        product: searchTerm
    }, (res, err) => {
        if (err) throw err;
        console.log(res);
        var itemCost = itemCount[itemCount.length - 1] * JSON.parse(JSON.stringify(res))[0].price;
        console.log(itemCost);
        //List all items in the cart, name, quantity, and total cost of each item(s)
        console.log("/n");
        console.log("Item: " + cart[cart.length - 1] + ", " + "Quantity: " + itemCount[itemCount.length - 1] + ", " + "Cost: " + itemCost);
        //add cost of item(s) to the total cost
        itemTotal += itemCost;
    })
}

function updateInventory(userSearch, userItemQuan) {
    connection.query("UPDATE bamazon_store SET ? WHERE ? ", [{
        product: userSearch
    }, {
        quantity: quanUpdater - userItemQuan
    }], (res, err) => {});
}

function endSearch() {
    inq.prompt([{
        type: "list",
        message: "Would you like to make another purchase?",
        choices: ["Search for Another Item", "Go to Cart"],
        name: "decision"
    }]).then((results) => {
        if (results.decision === "Go to Cart") {
            //Calculate sales tax based on total cost
            var salesTax = 0.15 * itemTotal;
            itemTotal += salesTax;
            console.log("\n");
            console.log("Sales Tax: " + salesTax);
            //print total cost
            console.log("\n");
            console.log("Your shopping total is: " + itemTotal);
            console.log("\n");
            console.log("Thank you for shopping at Bamazon!");
            process.exit(0);

        } else {
            populate();
        }
    });
}
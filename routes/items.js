const express = require('express')
const app = express.Router();

const config = require("../config.json");
const adminPassword = config.adminPassword;

const mysql = require("mysql2");
let con = mysql.createConnection({
    user: "root",
    password: "admin",
    host: "localhost",
    database: "restaurant"
});

app.get("/", (req, res) => {
    if(req.query.length == 0) {
        try {
            let sql = "SELECT * FROM items";
            con.query(sql, (err, result, fields) => {
                if(err) {
                    res.statusCode = 400;
                    let myError = {
                        code: 400,
                        message: err
                    }
                    res.send(myError);
                    return;
                }
    
                if(result) {
                    res.statusCode = 200;
                    let items = {
                        "items": null
                    }
                    
                    items.items = result;
                    
                    for(item of items.items) {
                        item.price = parseFloat(item.price);
                    }
    
                    res.send(items);
                    return;
                }
            })
        } catch(error) {
            res.statusCode = 500;
            let err = {
                "code": 500,
                "message": error
            }
            res.send(err);
            return;
        }
    } else {
        let SQL = "SELECT * FROM items WHERE ";
        for(parameter in req.query) {
            if(parameter == "price") {
                SQL += "(" + parameter + "=" + parseFloat(req.query[parameter]) + ") AND "
            }
            else if(parameter == "category_id") {
                SQL += "(" + parameter + "=" + parseInt(req.query[parameter]) + ") AND "
            }
            else {
                SQL += "(" + parameter + "=\"" + req.query[parameter] + "\") AND ";
            }
        }

        SQL = SQL.slice(0, SQL.length-5);

        con.query(SQL, (err, result, fields) => {
            if(err) {
                res.statusCode = 400;
                res.send(err);
                return;
            }

            if(result.length == 0) {
                res.statusCode = 404;
                let myError = {
                    "code": 404,
                    "message": "No item found with the given parameters."
                }
                res.send(myError);
                return;
            } else {
                if(result.length == 1) {
                    res.statusCode = 200;
                    result[0].price = parseFloat(result[0].price);
                    res.send(result[0]);
                } else {
                    res.statusCode = 200;
                    let items = {
                        "items": null
                    }
                    
                    items.items = result;
                    
                    for(item of items.items) {
                        item.price = parseFloat(item.price);
                    }
    
                    res.send(items);
                    return;
                }
            }
        })
    }
})

app.get("/:id", (req, res) => {
    try {
        let sql = `SELECT * FROM items WHERE id=${parseInt(req.params.id)}`;
        con.query(sql, (err, result, fields) => {
            if(err) {
                res.statusCode = 400;
                let myError = {
                    code: 400,
                    message: "Please verify the id you provided is a valid number."
                }
                res.send(myError);
                return;
            }

            if(result) {
                if(result.length == 0) {
                    let myError = {
                        code: 404,
                        message: "This item doesn't exist."
                    }
                    res.statusCode = 404;
                    res.send(myError);
                    return;
                }
                res.statusCode = 200;
                result[0].price = parseFloat(result[0].price);
                res.send(result[0]);
                return;
            }
        });
    } catch(error) {
        res.statusCode = 500;
        let err = {
            "code": 500,
            "message": error
        }
        res.send(err);
        return;
    }
})

app.post("/", (req, res) => {
    if(!req.headers.authorization) {
        let myError = {
            code: 401,
            message: "You're not allowed to do that. Please add an Authorization field to your headers."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }

    if(req.headers.authorization.split(" ")[1] == adminPassword) {

        if("name" in req.body && "price" in req.body && "category_id" in req.body) {
            if(typeof req.body.name == "string" && typeof req.body.price == "number" && typeof req.body.category_id == "number") {
                if("description" in req.body && typeof req.body.description != "string") {
                    let myError = {
                        "code": 400,
                        "message": "Please verify that the description you entered is of type string."
                    }
                    res.statusCode = 400;
                    res.send(myError);
                    return;
                } else if("description" in req.body && typeof req.body.description == "string") {

                    let empty = false;

                    let SQL = `SELECT * FROM categories WHERE id=${req.body.category_id}`;
                    con.query(SQL, (err, result, fields) => {
                        empty = result.length == 0;

                        if(empty) {
                            let myError = {
                                code: 404,
                                message: "This category doesn't exist."
                            }
                            res.statusCode = 404;
                            res.send(myError);
                            return;
                        }

                        try {
                            let sql = "INSERT INTO items (name, price, description, category_id) VALUES (\"" + req.body.name + "\", " + parseFloat(req.body.price) + ", \"" + req.body.description + "\", " + parseInt(req.body.category_id) + ")";
                            con.query(sql, (err, result, fields) => {
                                if(err) {
                                    let myError = {
                                        "code": 500,
                                        "message": err
                                    }
                                    res.statusCode = 500;
                                    res.send(myError);
                                    return;
                                }
    
                                if(result) {
                                    let message = {
                                        code: 200,
                                        message: `Item ${req.body.name} sucessfully created.`
                                    }
                                    res.statusCode = 200;
                                    res.send(message);
                                    return;
                                }
                            })
                        } catch(error) {
                            let myError = {
                                "code": 500,
                                "message": error
                            }
                            res.statusCode = 500;
                            res.send(myError);
                            return;
                        }
                    })
                    
                } else {


                    let empty = false;

                    let SQL = `SELECT * FROM categories WHERE id=${req.body.category_id}`;
                    con.query(SQL, (err, result, fields) => {
                        empty = result.length == 0;

                        if(empty) {
                            let myError = {
                                code: 404,
                                message: "This category doesn't exist."
                            }
                            res.statusCode = 404;
                            res.send(myError);
                            return;
                        }

                        try {
                            let sql = "INSERT INTO items (name, price, category_id) VALUES (\"" + req.body.name + "\", " + parseFloat(req.body.price) + ", " + parseInt(req.body.category_id) + ")";
                            con.query(sql, (err, result, fields) => {
                                if(err) {
                                    let myError = {
                                        "code": 500,
                                        "message": err
                                    }
                                    res.statusCode = 500;
                                    res.send(myError);
                                    return;
                                }
    
                                if(result) {
                                    let message = {
                                        code: 200,
                                        message: `Item ${req.body.name} sucessfully created.`
                                    }
                                    res.statusCode = 200;
                                    res.send(message);
                                    return;
                                }
                            })
                        } catch(error) {
                            let myError = {
                                "code": 500,
                                "message": error
                            }
                            res.statusCode = 500;
                            res.send(myError);
                            return;
                        }
                    })

                }
            }
        } else {
            let myError = {
                "code": 400,
                "message": "Please verify that the content of the item you want to create includes a name, price, category ID (and a description) and is sent in a JSON format."
            }
            res.send(myError);
            return;
        }

    } else {
        let myError = {
            code: 401,
            message: "Wrong admin credentials."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }
})

app.put("/:id", (req, res) => {
    if(!req.headers.authorization) {
        let myError = {
            code: 401,
            message: "You're not allowed to do that. Please add an Authorization field to your headers."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }

    if(req.headers.authorization.split(" ")[1] == adminPassword) {

        if(!("name" in req.body) && !("description" in req.body) && !("price" in req.body) && !("category_id" in req.body)) {
            let error = {
                "code": 400,
                "message": "No name, description, price or category id specified, skipped the request and changed nothing."
            }
            res.statusCode = 400;
            res.send(error);
            return;
        }
        
        let empty = false;
        let name = null;
        let description = null;
        let price = null;
        let category_id = null;
        
        con.query(`SELECT * FROM items WHERE id=${req.params.id}`, (err, result, fields) => {

            if(err) {
                res.statusCode = 400;
                let myError = {
                    code: 400,
                    message: "Please verify the id you provided is a valid number."
                }
                res.send(myError);
                return;
            }

            empty = result.length == 0;
            if(empty) {
                let myError = {
                    code: 404,
                    message: "This item doesn't exist."
                }
                res.statusCode = 404;
                res.send(myError);
                return;
            }
            if("description" in req.body) {
                description = req.body.description;
            } else {
                description = result[0].description;
            }

            name = req.body.name || result[0].name;
            price = parseFloat(req.body.price) || parseFloat(result[0].price);
            category_id = parseInt(req.body.category_id) || parseInt(result[0].category_id);
    
            if(name && description && price && category_id || name && description == "" && price && category_id == 0) {
                let sql = "UPDATE items SET name=\"" + name + "\", description=\"" + description + "\", price=" + price + ", category_id=" + category_id + " WHERE id=" + req.params.id;
                con.query(sql, (err, result, fields) => {
                    if(err) {
                        res.statusCode = 400;
                        res.send("Please verify your request synthax: " + err);
                        return;
                    }
    
                    if(result) {
                        res.statusCode = 200;
                        let message = {
                            "code": 200,
                            "message": `Item ${name} successfully updated.`
                        }
                        res.send(message);
                        return;
                    }
                })
            }else {
                let myError = {
                    "code": 400,
                    "message": "Please verify that the content of the item you want to create includes a name, description, price, category id and is sent in a JSON format."
                }
                res.send(myError);
                return;
            }
        });


    } else {
        let myError = {
            code: 401,
            message: "Wrong admin credentials."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }
})

app.delete("/:id", (req, res) => {
    if(!req.headers.authorization) {
        let myError = {
            code: 401,
            message: "You're not allowed to do that. Please add an Authorization field to your headers."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }
    
    if(req.headers.authorization.split(" ")[1] == adminPassword) {
        if(req.params.id) {
            let name = null;
            let empty = false;
            con.query(`SELECT * FROM items WHERE id=${req.params.id}`, (err, result, fields) => {
                if(result.length == 0) {
                    empty = (result.length == 0);
                } else {
                    name = result[0].name;
                }
            });
            try {
                let sql = `DELETE FROM items WHERE id=${req.params.id}`
                con.query(sql, (err, result, fields) => {
                    if(empty) {
                        let myError = {
                            code: 404,
                            message: "This item doesn't exist."
                        }
                        res.statusCode = 404;
                        res.send(myError);
                        return;
                    }

                    if(result) {
                        res.statusCode = 200;
                        let message = {
                            "code": 200,
                            "message": `Item ${name} successfully deleted.`
                        }
                        res.send(message);
                        return;
                    }
                })
            } catch(error) {
                res.statusCode = 500;
                let err = {
                    "code": 500,
                    "message": error
                }
                res.send(err);
                return;
            }
        } else {
            let myError = {
                code: 401,
                message: "Please provide an item ID."
            }
            res.statusCode = 401;
            res.send(myError);
            return
        }
    } else {
        let myError = {
            code: 401,
            message: "Wrong admin credentials."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }
})

module.exports = app;
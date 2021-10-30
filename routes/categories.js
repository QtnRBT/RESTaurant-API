const express = require("express");
const app = express.Router();

const config = require("../config.json");
const adminPassword = config.adminPassword;

const mysql = require("mysql2");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "restaurant"
})

app.get("/:id", (req, res) => {
    try {
        let sql = `SELECT * FROM categories WHERE id=${parseInt(req.params.id)}`;
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
                        message: "This category doesn't exist."
                    }
                    res.statusCode = 404;
                    res.send(myError);
                    return;
                }
                res.statusCode = 200;
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

app.get("/", (req, res) => {
    try {
        let sql = "SELECT * FROM categories";
        con.query(sql, (err, result, fields) => {
            if(err) {
                res.statusCode = 400;
                res.send(err);
                return;
            }

            if(result) {
                res.statusCode = 200;
                let categories = {
                    "categories": null
                }

                categories.categories = result;
                res.send(categories);
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
        if(req.body) {
            if(req.body.name && req.body.description && typeof req.body.name == "string" && typeof req.body.description == "string") {
                try {
                    let sql = "INSERT INTO categories (name, description) VALUES (\"" + req.body.name + "\", \"" + req.body.description + "\")"
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
                                "message": `Category ${req.body.name} successfully created.`
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
                    "code": 400,
                    "message": "Please verify that the content of the category you want to create includes a name, description and is sent in a JSON format."
                }
                res.send(myError);
                return;
            }
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

        if(!("name" in req.body) && !("description" in req.body)) {
            let error = {
                "code": 400,
                "message": "No name or description specified, skipped the request and changed nothing."
            }
            res.statusCode = 400;
            res.send(error);
            return;
        }
        
        let empty = false;
        let name = null;
        let description = null;
        
        con.query(`SELECT * FROM categories WHERE id=${req.params.id}`, (err, result, fields) => {
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
            if("description" in req.body) {
                description = req.body.description;
            } else {
                description = result[0].description;
            }
            name = req.body.name || result[0].name;
            if(empty) {
                let myError = {
                    code: 404,
                    message: "This category doesn't exist."
                }
                res.statusCode = 404;
                res.send(myError);
                return;
            }
    
            if(name && description || name && description == "") {
                let sql = "UPDATE categories SET name=\"" + name + "\", description=\"" + description + "\" WHERE id=" + req.params.id;
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
                            "message": `Category ${name} successfully updated.`
                        }
                        res.send(message);
                        return;
                    }
                })
            }else {
                let myError = {
                    "code": 400,
                    "message": "Please verify that the content of the category you want to create includes a name, description and is sent in a JSON format."
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
            con.query(`SELECT * FROM categories WHERE id=${req.params.id}`, (err, result, fields) => {
                if(result.length == 0) {
                    empty = (result.length == 0);
                } else {
                    name = result[0].name;
                }
            });
            try {
                let sql = `DELETE FROM categories WHERE id=${req.params.id}`
                con.query(sql, (err, result, fields) => {
                    if(empty) {
                        let myError = {
                            code: 404,
                            message: "This category doesn't exist."
                        }
                        res.statusCode = 404;
                        res.send(myError);
                        return;
                    }

                    if(result) {
                        res.statusCode = 200;
                        let message = {
                            "code": 200,
                            "message": `Category ${name} successfully deleted.`
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
                message: "Please provide a category ID."
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
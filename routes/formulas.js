const express = require("express");
const app = express.Router();
const config = require("../config.json");
const adminPassword = config.adminPassword;

const axios = require("axios");

const mysql = require("mysql2");
const con = mysql.createConnection({
    user:"root",
    password: "admin",
    host: "localhost",
    database: "restaurant"
});

function removeNull(array) {
    return array.filter(x => x !== null)
};

app.get("/:id", (req, res) => {
    try {

        let SQL = `SELECT ID,price,name FROM formulas WHERE id=${req.params.id}`;
        con.query(SQL, (err, result, fields) => {
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
                        message: "This formula doesn't exist."
                    }
                    res.statusCode = 404;
                    res.send(myError);
                    return;
                }
                res.statusCode = 200;
                let formula = result[0];
                
                let SQL = `SELECT f1,f2,f3,f4,f5 FROM category_formulas WHERE id=${formula.ID}`;
                (function(SQL) {
                    con.query(SQL, (err, result, fields) => {
    
                        if(err) {
                            res.statusCode = 500;
                            let error = {
                                "code": 500,
                                "message": err
                            }
                            res.send(error);
                            return;
                        }
    
                        if(result) {
                            let thisResultZero = Object.values(result[0]);
                            arr = [];
                            for(f in result[0]) {
                                let index = f[1];
                                (function(f) {
                                    f = result[0][f];
                                    if(f != null) {
                                        let SQL = `SELECT * FROM categories WHERE id=${f}`
                                        con.query(SQL, (err, result, fields) => {
        
                                            if(err) {
                                                res.statusCode = 500;
                                                let error = {
                                                    "code": 500,
                                                    "message": err
                                                }
                                                res.send(error);
                                                return;
                                            }
        
                                            if(result) {
                                                result[0].index = parseInt(index);
                                                arr.push(result[0]);
                                                formula.price = parseFloat(formula.price);
                                                if(arr.length == removeNull(thisResultZero).length) {
                                                    formula.categories = arr;
                                                    res.statusCode = 200;
                                                    res.send(formula);
                                                    return;
                                                }
                                            }
        
                                        })
                                    }
                                })(f)
                            }
                        }
                        
    
                    })
                })(SQL)

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

// to finish
app.get("/", async (req, res) => {
    if(req.body.length == 0) {
        let SQL = "SELECT * FROM formulas";
        con.query(SQL, async (err, result, fields) => {
            if(err) {
                let myError = {
                    code: 500,
                    message: "Internal server error " + err
                }
                res.statusCode = 500;
                res.send(myError);
            }
    
            if(result) {
                let formulas = {
                    formulas: []
                }
                for(form of result) {
                    await axios.get(`http://localhost:3000/formulas/${form.ID}`).then(response => formulas.formulas.push(response.data));
                }
                res.statusCode = 200;
                res.send(formulas);
                return;
            }
        })
    } else {
        let SQL = "SELECT * FROM formulas WHERE ";
        for(parameter in req.query) {
            if(parameter == "price") {
                SQL += "(" + parameter + "=" + parseFloat(req.query[parameter]) + ") AND "
            }
            else if(parameter == "formula") {
                SQL += "(" + parameter + "=" + parseInt(req.query[parameter]) + ") AND "
            }
            else {
                SQL += "(" + parameter + "=\"" + req.query[parameter] + "\") AND ";
            }
        }

        SQL = SQL.slice(0, SQL.length-5);

        con.query(SQL, async (err, result, fields) => {
            if(err) {
                res.statusCode = 400;
                res.send(err);
                return;
            }

            if(result.length == 0) {
                res.statusCode = 404;
                let myError = {
                    "code": 404,
                    "message": "No formula found with the given parameters."
                }
                res.send(myError);
                return;
            } else {

                if(result.length == 1) {
                    await axios.get(`http://localhost:3000/formulas/${result[0].ID}`)
                    .then(response => {
                        res.statusCode = 200;
                        res.send(response.data);
                    })
                    .catch((err) => {
                        res.statusCode = 404;
                        let myError = {
                            "code": 404,
                            "message": "No formula found with the given parameters."
                        }
                        res.send(myError);
                    })
                } else {
                    let formulas = {
                        "formulas": []
                    }
                    for(formula of result) {
                        await axios.get(`http://localhost:3000/formulas/${formula.ID}`)
                        .then(response => {
                            formulas.formulas.push(response.data);
                            if(formulas.formulas.length == result.length) {
                                res.statusCode = 200;
                                res.send(formulas);
                            }
                        })
                        .catch((err) => {
                            res.statusCode = 404;
                            let myError = {
                                "code": 404,
                                "message": "No formula found with the given parameters."
                            }
                            res.send(myError);
                        })
                    }
                }

            }
        })
    }
})

app.post("/", async (req, res) => {
    if(!req.headers.authorization) {
        let myError = {
            code: 401,
            message: "You're not allowed to do that. Please add an Authorization field to your headers."
        }
        res.statusCode = 401;
        res.send(myError);
        return;
    }


    if (req.headers.authorization.split(" ")[1] == adminPassword) {

            if("category_one" in req.body && "category_two" in req.body && "category_three" in req.body && "category_four" in req.body && "category_five" in req.body && "price" in req.body) {

                let name = req.body.name || null;
                let category_one = parseInt(req.body.category_one) || null;
                let category_two = parseInt(req.body.category_two) || null;
                let category_three = parseInt(req.body.category_three) || null;
                let category_four = parseInt(req.body.category_four) || null;
                let category_five = parseInt(req.body.category_five) || null;
                let price = parseFloat(req.body.price) || null;

                let code1 = null;
                let code2 = null;
                let code3 = null;
                let code4 = null;
                let code5 = null;

                if(category_one != null) {
                    await axios.get("http://localhost:3000/categories/" + category_one, {}).then(response => code1 = response.data)
                    .catch(error => {
                        code1 = 404;
                    })
                } 
                if(category_two != null) {
                    await axios.get("http://localhost:3000/categories/" + category_two, {}).then(response => code2 = response.data)
                    .catch(error => {
                        code2 = 404;
                    })
                }   
                if(category_three != null) {
                    await axios.get("http://localhost:3000/categories/" + category_three, {}).then(response => code3 = response.data)
                    .catch(error => {
                        code3 = 404;
                    })
                }

                if(category_four != null) {
                    await axios.get("http://localhost:3000/categories/" + category_four, {}).then(response => code4 = response.data)
                    .catch(error => {
                        code4 = 404;
                    })
                }

                if(category_five != null) {
                    await axios.get("http://localhost:3000/categories/" + category_five, {}).then(response => code5 = response.data)
                    .catch(error => {
                        code5 = 404;
                    })
                }

                if(code1 == 404 || code2 == 404 || code3 == 404 || code4 == 404 || code5 == 404) {
                    res.statusCode = 404;
                    let myError = {
                        code: 404,
                        message: "One of the categories you provided doesn't exist."
                    }
                    res.send(myError);
                    return;
                } else {
                    
                    let arr = [JSON.stringify(code1), JSON.stringify(code2), JSON.stringify(code3), JSON.stringify(code4), JSON.stringify(code5)]
                    let arr2 = [];
                    
                    for(el of arr) {
                        if(el != "null") {
                            arr2.push(el);
                        }
                    }

                    function hasDuplicates(array) {
                        return (new Set(array)).size !== array.length;
                    }

                    if(!hasDuplicates(arr2)) {
                        if(price == null) {
                            res.statusCode = 400;
                            let myError =  {
                                code: 400,
                                message: "Please verify that the formula you want to create includes categories, (a name), a price and is sent in a JSON format."
                            }
                            res.send(myError);
                        }

                        if(arr2.length >= 2) {
                            let SQL = `INSERT INTO category_formulas (f1, f2, f3, f4, f5) VALUES (${category_one}, ${category_two}, ${category_three}, ${category_four}, ${category_five})`
                            let formulaId = null;
                            con.query(SQL, (err, result, fields) => {
    
                                if(err) {
                                    res.statusCode = 400;
                                    let myError = {
                                        code: 400,
                                        message: "Please verify the categories you provided are valid numbers."
                                    }
                                    res.send(myError);
                                    return;
                                }
    
                                if(result) {
                                    formulaId = result.insertId;
                                    let SQL = `INSERT INTO formulas (formula, price, name) VALUES (${formulaId}, ${parseFloat(price)}, "${name}")`
                                    con.query(SQL, (err, result, fields) => {
                                        if(err) {
                                            res.statusCode = 400;
                                            let myError = {
                                                code: 400,
                                                message: "Please verify the categories and price you provided are valid numbers."
                                            }
                                            res.send(myError);
                                            return;
                                        }
    
                                        if(result) {
                                            let myMessage = {
                                                code: 200,
                                                message: `Formula successfully created.`
                                            }
                                            res.statusCode = 200;
                                            res.send(myMessage);
                                            return;
                                        }
                                    })
                                }
    
                            })
                        } else {
                            res.statusCode = 400;
                            let myError = {
                                code: 400,
                                message: "A formula must have at least 2 categories."
                            }
                            res.send(myError);
                            return;
                        }

                    } else {
                        res.statusCode = 400;
                        let myError = {
                            code: 400,
                            message: "Duplicata in your categories."
                        }
                        res.send(myError);
                        return;
                    }
                }

            } else {
                let myError = {
                    "code": 400,
                    "message": "Please verify that the content of the formula you want to create includes a name (and at least a category) and is sent in a JSON format."
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

app.put("/:id", async (req, res) => {
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

        let code = null;
        await axios.get(`http://localhost:3000/formulas/${req.params.id}`).then(response => code = response.status).catch((error) => code = error.status)

        if(code == 200) {

            let SQL = `SELECT * FROM formulas JOIN category_formulas ON category_formulas.id=${parseInt(req.params.id)} WHERE formulas.id=${parseInt(req.params.id)};`;
            con.query(SQL, async (err, result, fields) => {
                if(err) {
                    let myError = {
                        code: 500,
                        message: "Internal server error " + err
                    }
                    res.statusCode = 500;
                    res.send(myError);
                }

                if(result) {

                    let thisResult = result;

                    let name = req.body.name || result[0].name || null;
                    let price = parseFloat(req.body.price) || parseFloat(result[0].price)

                    let f1 = parseInt(req.body.category_one) || parseInt(result[0].f1) || null;
                    if(req.body.category_one == null && Object.keys(req.body).includes("category_one")) f1=null;
                    let f2 = parseInt(req.body.category_two) || parseInt(result[0].f2) || null;
                    if(req.body.category_two == null && Object.keys(req.body).includes("category_two")) f2=null;
                    let f3 = parseInt(req.body.category_three) || parseInt(result[0].f3) || null;
                    if(req.body.category_three == null && Object.keys(req.body).includes("category_three")) f3=null;
                    let f4 = parseInt(req.body.category_four) || parseInt(result[0].f4) || null;
                    if(req.body.category_four == null && Object.keys(req.body).includes("category_four")) f4=null;
                    let f5 = parseInt(req.body.category_five) || parseInt(result[0].f5) || null;
                    if(req.body.category_five == null && Object.keys(req.body).includes("category_five")) f5=null;

                    let code1 = null;
                    let code2 = null;
                    let code3 = null;
                    let code4 = null;
                    let code5 = null;

                    if(f1 != null) {
                        await axios.get("http://localhost:3000/categories/" + f1, {}).then(response => code1 = response.data)
                        .catch(error => {
                            code1 = 404;
                        })
                    } 
                    if(f2 != null) {
                        await axios.get("http://localhost:3000/categories/" + f2, {}).then(response => code2 = response.data)
                        .catch(error => {
                            code2 = 404;
                        })
                    }   
                    if(f3 != null) {
                        await axios.get("http://localhost:3000/categories/" + f3, {}).then(response => code3 = response.data)
                        .catch(error => {
                            code3 = 404;
                        })
                    }
    
                    if(f4 != null) {
                        await axios.get("http://localhost:3000/categories/" + f4, {}).then(response => code4 = response.data)
                        .catch(error => {
                            code4 = 404;
                        })
                    }
    
                    if(f5 != null) {
                        await axios.get("http://localhost:3000/categories/" + f5, {}).then(response => code5 = response.data)
                        .catch(error => {
                            code5 = 404;
                        })
                    }

                    if(code1 != 404 && code2 != 404 && code3 != 404 && code4 != 404 && code5 != 404) {
                       
                        let arr = [JSON.stringify(code1), JSON.stringify(code2), JSON.stringify(code3), JSON.stringify(code4), JSON.stringify(code5)]
                        let arr2 = [];
                        
                        for(el of arr) {
                            if(el != "null") {
                                arr2.push(el);
                            }
                        }

                        function hasDuplicates(array) {
                            return (new Set(array)).size !== array.length;
                        }


                        if(!hasDuplicates(arr2)) {
                            if(arr2.length >= 2) {
                                let SQL = `UPDATE category_formulas SET f1=${f1}, f2=${f2}, f3=${f3}, f4=${f4}, f5=${f5} WHERE id=${result[0].formula}`;
                                con.query(SQL, (err, result, fields) => {
                                    if(err) {
                                        let myError = {
                                            code: 500,
                                            message: "Internal server error " + err
                                        }
                                        res.statusCode = 500;
                                        res.send(myError);
                                    }
            
                                    if(result) {
                                        let SQL = `UPDATE formulas SET name="${name}", price=${price} WHERE ID=${thisResult[0].ID}`;
                                        con.query(SQL, (err, result, fields) => {
                                            if(err) {
                                                let myError = {
                                                    code: 500,
                                                    message: "Internal server error " + err
                                                }
                                                res.statusCode = 500;
                                                res.send(myError);
                                            }
            
                                            if(result) {
                                                res.statusCode = 200;
                                                let myMessage = {
                                                    code: 200,
                                                    message: "Formula successfully updated."
                                                }
                                                res.send(myMessage);
                                            }
                                        })
                                    }
                                })
                            } else {
                                res.statusCode = 400;
                                let myError = {
                                    code: 400,
                                    message: "A formula must have at least 2 categories."
                                }
                                res.send(myError);
                                return;
                            }
                        } else {
                            res.statusCode = 400;
                            let myError = {
                                code: 400,
                                message: "Duplicata in your categories."
                            }
                            res.send(myError);
                            return;
                        }

                    } else {
                        res.statusCode = 404;
                        let myError = {
                            code: 404,
                            message: "One of the categories you provided doesn't exist."
                        }
                        res.send(myError);
                        return;
                    }


                }
            });

        } else {
            let myError = {
                code: 404,
                message: "This formula doesn't exist."
            }
            res.statusCode = 404;
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

app.delete("/:id", async (req, res) => {
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

        let code = null;
        await axios.get(`http://localhost:3000/formulas/${req.params.id}`).then(response => code = response.status).catch((error) => code = error.status)

        if(code == 200) {

            let SQL = `DELETE FROM formulas WHERE id=${req.params.id}`;
            con.query(SQL, (err, result, fields) => {
                if(err) {
                    let myError = {
                        code: 500,
                        message: "Internal server error " + err
                    }
                    res.statusCode = 500;
                    res.send(myError);
                }

                if(result) {
                    let SQL = `DELETE FROM category_formulas WHERE id=${req.params.id}`;
                    con.query(SQL, (err, result, fields) => {
                        if(err) {
                            let myError = {
                                code: 500,
                                message: "Internal server error " + err
                            }
                            res.statusCode = 500;
                            res.send(myError);
                        }

                        if(result) {
                            res.statusCode = 200;
                            let myMessage = {
                                code: 200,
                                message: "Formula successfully deleted."
                            }
                            res.send(myMessage);
                        }
                    })
                }
            })

        } else {
            let myError = {
                code: 404,
                message: "This formula doesn't exist."
            }
            res.statusCode = 404;
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

module.exports = app;
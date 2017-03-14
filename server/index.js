var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'rachel',
    password: "",
    database: 'Chirper'
});

var app = express();

//path.join is like a cursor. dirname gives the absolute path to the folder we're in. 
var clientPath = path.join(__dirname, "../client");

//express.static is a function 
app.use(express.static(clientPath));
app.use(bodyParser.json());


//function to call SP for all chirps
function getAllChirps() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL GetAllChirps()', function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                        // console.log(resultsets);
                    }
                })
            }
        })
    })
}

//GET SINGLE CHIRP
function getSingleChirp(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL GetSingleChirp(?)', [id], function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                })
            }
        })
    })
}

//INSERT NEW CHIRPS
function insertChirp(message, userid, timestamp) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL InsertChirp(?,?, ?)', [message, userid, timestamp], function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(resultsets);
                        resolve(resultsets);
                    }
                })
            }
        })
    })
}

//UPDATE CHIRP
function updateChirp(id, message) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL UpdateChirp(?, ?)', [id, message], function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                })
            }
        })
    })
}

//DELETE CHIRP 
function deleteChirp(id) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL DeleteChirp(?)', [id], function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                })
            }
        })
    })
}

function getUsers() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL GetUsers()', function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                })
            }
        })
    })
}

//GET REQUEST FOR ALL
app.get('/api/chirps', function (req, res) {
    getAllChirps().then(function (data) {
        console.log(data);
        res.send(data[0]);
    }, function (err) {
        console.log(err);
    })
})
//GET REQUEST FOR ONE
app.get('/api/chirps/:id', function (req, res) {
    getSingleChirp(req.params.id).then(function (data) {
        res.send(data[0]);
    }, function (err) {
        console.log(err);
        // res.sendStatus(500);
    })
})
//post
app.post('/api/chirps', function (req, res) {
    insertChirp(req.body.message, req.body.UserID, req.body.dt).then(function (data) {
        res.send(data[0]);
        res.status(201).end();
    }, function (err) {
        console.log(err);
        // res.sendStatus(500);
    })
})
//update
app.put('/api/chirps/:id', function (req, res) {
    insertChirp(req.params.id, req.body.message).then(function (data) {
        res.send(data[0]);
        res.status(204).end();
    }, function (err) {
        console.log(err);
        // res.sendStatus(500);
    })
})
//delete
app.delete('/api/chirps/:id', function (req, res) {
    deleteChirp(req.params.id).then(function (data) {
        res.send(data[0]);
        res.status(204).end();
    }, function (err) {
        console.log(err);
        // res.sendStatus(500);
    })
})

app.get('/api/users', function (req, res) {
    getUsers().then(function (data) {
        res.send(data[0]);
    }, function (err) {
        console.log(err);
    })
})

app.listen(3000);
console.log("server listening on port 3000");
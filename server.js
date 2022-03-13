/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
db = require('./db')(); //hack
var jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };

        db.save(newUser); //no duplicate checking
        res.json({success: true, msg: 'Successfully created new user.'})
    }
});

router.get('/signup', function(req, res) {
    res.json({success: false, msg: "Does not support the 'GET' method"})
});
router.put('/signup', function(req, res) {
    res.json({success: false, msg: "Does not support the 'PUT' method"})
});
router.delete('/signup', function(req, res) {
    res.json({success: false, msg: "Does not support the 'DELETE' method"})
});
router.patch('/signup', function(req, res) {
    res.json({success: false, msg: "Does not support the 'PATCH' method"})
});

router.post('/signin', function (req, res) {
    var user = db.findOne(req.body.username);

    
    if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
        if (req.body.password == user.password) {
            var userToken = { id: user.id, username: user.username };
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json ({success: true, token: 'JWT ' + token});
        }
        else {
            res.status(401).send({success: false, msg: 'Authentication failed.'});
        }
    }
});

router.get('/signin', function(req, res){
    res.json({success: false, msg: "Does not support the 'GET' method"})
});
router.put('/signin', function(req, res) {
    res.json({success: false, msg: "Does not support the 'PUT' method"})
});
router.delete('/signin', function(req, res) {
    res.json({success: false, msg: "Does not support the 'DELETE' method"})
});
router.patch('/signin', function(req, res) {
    res.json({success: false, msg: "Does not support the 'PATCH' method"})
});


router.route('/movies')
    .get(function(req, res) {
        res = res.status(200);
        res.json({status: 200, msg: 'GET movies', headers: req.headers, query: req.query, env:process.env.UNIQUE_KEY});
    })
    .post(function(req, res) {
        res = res.status(200);
        res.json({status: 200, msg: 'movie saved', headers: req.headers, query: req.query, env:process.env.UNIQUE_KEY});
    })
    .delete(authController.isAuthenticated, function(req, res) {
        res = res.status(200);
        res.json({status: 200, msg: 'movie deleted', headers: req.headers, query: req.query, env:process.env.UNIQUE_KEY});
    })
    .patch(function(req, res) {
        res.json({msg: "Does not support the 'PATCH' method"});
    });


router.put('/movies', authJwtController.isAuthenticated, function(req, res){
    res = res.status(200);
    res.json({status: 200, msg: 'movie updated', headers: req.headers, query: req.query, env:process.env.UNIQUE_KEY});
});
router.route('/')
    .get(function(req, res){
        res.json({msg: "Does not support the 'GET' method"})
    })
    .post(function(req, res){
        res.json({msg: "Does not support the 'POST' method"})
    })
    .put(function(req, res){
        res.json({msg: "Does not support the 'PUT' method"})
    })
    .delete(function(req, res){
        res.json({msg: "Does not support the 'DELETE' method"})
    })
    .patch(function(req, res){
        res.json({msg: "Does not support the 'PATCH' method"})
    })
    
router.route('/testcollection')
    .delete(authController.isAuthenticated, function(req, res) {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    }
    )
    .put(authJwtController.isAuthenticated, function(req, res) {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    }
    );

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only



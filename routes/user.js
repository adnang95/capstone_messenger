var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// importing user model and storing it into User variable
var User = require('../models/user.js');

// if there is 404 error, render index

// post method for signing up user
router.post('/', function (req, res, next) {
    // creating new user using User model
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        // encrypting password using bcrypt package
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result){
        if (err) {
          return res.status(500).json({
              title: 'An error occured',
              error: err
          });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

// post method for signing in user
router.post('/signin', function(req, res, next){
    User.findOne({ email: req.body.email }, function(err, user){
      if (err) {
        return res.status(500).json({
            title: 'An error occured',
            error: err
        });
      }
      if(!user){
        return res.status(401).json({
          title: 'Login failed',
          error: {message: 'Invalid login credentials'}
        });
      }
      // comparing password that user entered with the one in the db using bcrypt package
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'Login failed',
          error: {message: 'Invalid login credentials'}
        });
      }
        // creating user token for verified users to automatically sign in
        // using json web token package
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// importing message model from backend message.js model
var Message = require('../models/message');
var User = require('../models/user');


// router for getting messages
router.get('/', function(req, res, next){
    Message.find()
      .populate('user', 'firstName')
      .exec(function(err, messages){
        if(err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        res.status(200).json({
            message: 'Success',
            obj: messages
        });
      });
});


// router to let only authenticated users post and edit messages
router.use('/', function(req, res, next){
    // check if the token is valid
    jwt.verify(req.query.token, 'secret', function(err, decoded){
        if (err) {
          return res.status(401).json({
            title: 'Not Authenticated',
            error: err
          });
        }
        next();
    });
});


// router for saving messages
router.post('/', function(req, res, next){
  var decoded = jwt.decode(req.query.token);

  User.findById(decoded.user._id, function(err, user){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    // new message variable from message model. It requests content from an angular form on frontend
    var message = new Message({
        content: req.body.content,
        user: user._id,
        userName: user.firstName
    });
    // saving message with function that throws an error message if it happens
    message.save(function(err, result){
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      // push a message into array messages on user collection
      user.messages.push(result);
      user.save();
      var usr = {
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }
      res.status(201).json({
        message: 'Message saved',
        obj: result,
        user: usr
      });
    });
  });
});


// router for editing messages
router.patch('/:id', function(req, res, next){
    var decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function(err, message){
      if(err){
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      if(!message){
        return res.status(500).json({
          title: 'Message not found',
          error: {message: 'Message not found'}
        });
      }

      // if statement to check if the user that's editing the message is the same as the one who created it
      if(message.user != decoded.user._id){
          return res.status(401).json({
            title: 'Not Authenticated',
            error: {message: 'Unauthorized user'}
          });
      }
      message.content = req.body.content;
      message.save(function(err, result){
        if(err){
          return res.status(500).json({
            title: 'An error occurred',
            error: err
          });
        }
        res.status(200).json({
            title: 'Updated message',
            obj: result
          });
      });
    });
});


// router for deleting messages
router.delete('/:id', function(req, res, next){
  var decoded = jwt.decode(req.query.token);

  Message.findById(req.params.id, function(err, message){
    if(err){
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if(!message){
      return res.status(500).json({
        title: 'Message not found',
        error: {message: 'Message not found'}
      });
    }
    if(message.user != decoded.user._id){
        return res.status(401).json({
          title: 'Not Authenticated',
          error: {message: 'Unauthorized user'}
        });
    }
    message.remove(function(err, result){
      if(err){
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
          title: 'Message removed',
          obj: result
        });
    });
  });
});

module.exports = router;

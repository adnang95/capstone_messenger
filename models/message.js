// backend message model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user.js');

// blueprint for a new message schema
var schema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    userName: {type: String, ref: 'UserName'}
});


schema.post('remove', function(message){
    User.findById(message.user, function(err, user){
      user.messages.pull(message._id);
      user.save();
    });
});

//model for message schema, model uzima dva parametra, ime modela i schema koju
//cemo koristiti. Ime collectiona je ime modela u mnozini i sa malim pocetnim sl
module.exports = mongoose.model('Message', schema);

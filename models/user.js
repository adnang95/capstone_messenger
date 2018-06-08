// backend user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

// blueprint for a new message schema
var schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

schema.plugin(mongooseUniqueValidator);

//model for message schema, model uzima dva parametra, ime modela i schema koju
//cemo koristiti. Ime collectiona je ime modela u mnozini i sa malim pocetnim sl
module.exports = mongoose.model('User', schema);

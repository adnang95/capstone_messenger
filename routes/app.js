var express = require('express');
var router = express.Router();

// if there is 404 error, render index
router.get('/', function (req, res, next) {
        // render index.hbs view
        res.render('index');

});

module.exports = router;

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");

const { PythonShell }  = require('python-shell');


// router.get("/recommender", middleware.isLoggedIn, function(req,res){
//     res.render('recommenderForm');
// });


router.get("/tweets", function(req,res){
    // var query = req.query.keywords;
    // let options = {
    //     mode: 'text',
    //     pythonOptions: ['-u'], // get print results in real-time
    //     args: [query]
    //   };

    var pyshell = new PythonShell('twitter_filter/twitter_filter.py');


    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        res.send(message);
      

    });
    


    
   
});

module.exports = router;
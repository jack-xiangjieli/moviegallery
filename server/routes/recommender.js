var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");
var request = require('request');
const path = require('path');
const { PythonShell }  = require('python-shell');


// router.get("/recommender", middleware.isLoggedIn, function(req,res){
//     res.render('recommenderForm');
// });


router.get("/recommender", middleware.isLoggedIn, function(req,res){
    User.findById(req.user._id, function(err, foundUser) {
        if (err) console.log("error");
        else {
            var query = foundUser.recentSearchOrReview;
            let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                args: [query]
              };
        
            var pyshell = new PythonShell('recommender/recommender.py', options);
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                var imdbids = message.split(', ').slice(1, -1);
                var recommendations = [];
                var count = imdbids.length;
        
        
                for (var element of imdbids) {
                     var url = "http://www.omdbapi.com/?i=" + element.slice(1, -1) + "&apikey=485f5d49";
        
                    request(url, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            data = JSON.parse(body);
                            count--;
                            recommendations.push(data);
                            if (count == 0) res.render("recommendations", { recommendations: recommendations });
                        }
                        else console.log("Invalid Search");
                    })
                 }
            });
        }
    });


    // pyshell.on('message', function (message) {
    //     // received a message sent from the Python script (a simple "print" statement)
    //     var imdbids = message.split(', ').slice(1, -1);
    //     var recommendations = [];
    //     var count = imdbids.length;


    //     for (var element of imdbids) {
    //          var url = "http://www.omdbapi.com/?i=" + element.slice(1, -1) + "&apikey=485f5d49";

    //         request(url, function(error, response, body) {
    //             if (!error && response.statusCode == 200) {
    //                 data = JSON.parse(body);
    //                 count--;
    //                 recommendations.push(data);
    //                 if (count == 0) res.render("recommendations", { recommendations: recommendations });
    //             }
    //             else console.log("Invalid Search");
    //         })
    //      }
    // });
    
});

module.exports = router;
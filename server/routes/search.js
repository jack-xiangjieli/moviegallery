var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");
var request = require('request');


router.get("/result", middleware.isLoggedIn, function(req,res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=485f5d49";
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.log(data['Search'][0]['Title']);
            User.updateOne({  "_id" : req.user._id },{ "recentSearchOrReview" : data['Search'][0]['Title']}, function(err, newUser) {
                if (err) console.log(err);
            });
            res.render("results", { data: data });
        }
        else res.send("Invalid Search");
    });
});

module.exports = router;
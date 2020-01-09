var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");
var request = require('request');
const path = require('path')
const { PythonShell }  = require('python-shell');


router.get("/recommender", middleware.isLoggedIn, function(req,res){
    res.render('recommenderForm');
});


router.get("/recommender/recommendations", function(req,res){
    var query = req.query.keywords;
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        args: [query]
      };

    var pyshell = new PythonShell('recommender/recommender.py', options);


    pyshell.on('message', async function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        var imdbids = await message.split(', ').slice(1, -1);
        var recommendations = [];

        async function getMovieData(url) {
            var data;

            const sleep = ms => {
                return new Promise(resolve => setTimeout(resolve, ms))
            }

            request(url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(body);
                    return data;
                }
                else console.log("Invalid Search");
            });
            sleep(2000);
            return data;
        }

        for (var element of imdbids) {
            var url = "http://www.omdbapi.com/?i=" + element.slice(1, -1) + "&apikey=485f5d49";
            var data = await getMovieData(url);
            recommendations.push(data);
        }
        res.send(recommendations);
    });
    


    
   
});

module.exports = router;
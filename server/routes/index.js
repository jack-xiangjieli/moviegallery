var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req,res){
	res.render("landing");
});


//show register form
router.get("/register", function(req, res){
	res.render("register");
})

//handle sign up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username, recentSearchOrReview : "Heat"});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/filmreviews");
		});
	});
});


//show login form
router.get("/login", function(req, res){
	res.render("login");
	
});

// handling login logic
// app.post("/login", middleware, callbackfunc)
router.post("/login", passport.authenticate("local", 
	{
	    successRedirect: "/filmreviews",
	    failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("error", "Logged you out!")
	res.redirect("/filmreviews");
})

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



module.exports = router;
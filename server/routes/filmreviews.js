var express = require("express");
var router = express.Router();
var Filmreview = require("../models/filmreview");
var middleware = require("../middleware/index.js");



router.get("/", (req, res) => {
	Filmreview.find({}, function(err, allFilmreviews){
		if(err) {
			console.log(err);
		} else {
			res.render("filmreviews/index", {filmreviews: allFilmreviews, currentUser: req.user});
		}
	})
});


//create route-add new filmreview to datebase
router.post("/", middleware.isLoggedIn, function(req,res) {
    var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var rating = req.body.rating;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newFilmReview = {name: name, image: image, rating: rating, descripition: desc, author: author};
	
	Filmreview.create(newFilmReview, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/filmreviews");
		}
	})
});

//new-show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("filmreviews/new");
});


router.get("/:id", function(req, res){
	Filmreview.findById(req.params.id).populate("comments").exec(function(err, foundFilmreview) {
		if(err) {
			console.log(err);
		} else {
			res.render("filmreviews/show", {filmreview: foundFilmreview});
		}
	});
});


// Edit filmreview route
router.get("/:id/edit", middleware.checkFilmreviewOwnership, function(req, res){
	Filmreview.findById(req.params.id, function(err, foundFilmreview){
		res.render("filmreviews/edit", {filmreview: foundFilmreview});
	});
});


//Update filmreivew route
router.put("/:id", function(req, res) {
	
	Filmreview.findByIdAndUpdate(req.params.id, req.body.filmreview, function(err, updatedReview){
		if(err){
			res.redirect("/filmreviews");
		} else {
			res.redirect("/filmreviews/" + req.params.id);
		}
	})
})


//Destroy filmreview route
router.delete("/:id", middleware.checkFilmreviewOwnership,function(req, res){
	Filmreview.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/filmreviews");
		} else {
			res.redirect("/filmreviews");
		}
	})
})




module.exports = router;
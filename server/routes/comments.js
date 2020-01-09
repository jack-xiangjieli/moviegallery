var express = require("express");
var router = express.Router({mergeParams: true});
var Filmreview = require("../models/filmreview")
var Comment = require("../models/comments");
var middleware = require("../middleware/index.js");


//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Filmreview.findById(req.params.id, function(err, filmreview){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {filmreview: filmreview});
		}
	});
})


router.post("/", middleware.isLoggedIn, function(req, res) {
	Filmreview.findById(req.params.id, function(err, filmreview) {
		if(err){
			console.log(err);
			redirect("/filmreviews")
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/filmreviews/' + filmreview._id);
				}
			})
		}
	})
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {filmreview_id: req.params.id, comment: foundComment});
		}
	})
});


//comment update

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/cfilmreviews/" + req.params.id);
		}
	})
});


//comment destroy route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/filmreviews/" + req.params.id);
		}
	})
})


module.exports = router;
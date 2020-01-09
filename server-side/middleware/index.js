var middlewareObj = {};
var Filmreview = require("../models/filmreview");
var Comment = require("../models/comments");

middlewareObj.checkFilmreviewOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Filmreview.findById(req.params.id, function(err, foundFilmreview){
		    if(err) {
				req.flash("error", "Filmreview not found");
			    res.redirect("back");
		    } else {
				if(foundFilmreview.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have permission to do that");
					res.redirect("back");
				}
		    }
	    });
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		    if(err) {
			    res.redirect("back");
		    } else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
		    }
	    });
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in first");
	res.redirect("/login");
}

module.exports = middlewareObj
var mongoose = require("mongoose");

var filmreviewSchema = new mongoose.Schema( {
	name: String,
	image: String,
	descripition: String,
	rating: {type: Number, max: 5, min: 0, default: 5},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Filmreview", filmreviewSchema);
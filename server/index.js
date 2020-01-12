var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
	methodOverride   = require("method-override"),
	Filmreview       = require("./models/filmreview"),
	passport         = require("passport"),
	LocalStrategy    = require("passport-local"),
	Comment          = require("./models/comments"),
	User             = require("./models/user"),
	seedDB           = require("./seeds"),
	flash            = require("connect-flash"),
	keys             = require('./config/keys')



//requiring routes
const commentRoutes    = require("./routes/comments"),
      filmreviewRoutes = require("./routes/filmreviews"),
	  indexRoutes      = require("./routes/index"),
	  searchRoutes     = require("./routes/search");
	  recommenderRoutes = require('./routes/recommender');
	  twitterRoutes     = require('./routes/twitter_filter');

seedDB();
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoutes);
app.use("/filmreviews", filmreviewRoutes);
app.use("/filmreviews/:id/comments", commentRoutes);
app.use("/", searchRoutes);
app.use("/", recommenderRoutes);
app.use("/", twitterRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
	console.log("The MovieGallery Server Has Started!!");
});

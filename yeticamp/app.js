require('dotenv').config()

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession = require("express-session"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto"),
    Campground = require("./models/campgrounds.js"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    Notification=require("./models/notification"),
    seedDB = require("./seeds.js")
const path = require('path');
//requiring routes
var commentRoutes = require("./routes/comments"),
    reviewRoutes = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    userRoutes=require("./routes/user"),
    indexRoutes = require("./routes/index")

    const dbUrl = process.env.DB_URL
    // 'mongodb://localhost/yeti-Camp'
    
    mongoose.connect(dbUrl, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:true
    });
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("we're connected!"); 
    });

app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/img/', express.static('./public/img'));
app.set("views",path.join(__dirname,'views'))
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();   //every time we run the server seeds.js runs


app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "This is the yeticamp secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//User.authenticate comes in with the passportlocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function (req, res, next) {
    res.locals.currentUser = req.user;
    if (req.user) {
        try {
            let user=await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
            res.locals.notifications = user.notifications.reverse();
        } catch (err) {
            console.log("hello");
            console.log(err.message);
        }
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:slug/comments", commentRoutes);
app.use("/campgrounds/:slug/reviews", reviewRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("YetiCamp has started");
});
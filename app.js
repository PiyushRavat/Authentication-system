var  express  = require('express'),
	 mongoose = require('mongoose'),
	 passport = require('passport'),
	 Localstrategy = require('passport-local'),
	 localMpassport= require('passport-local-mongoose')
	 bodyParser = require('body-parser'),
	 User		= require('./model/user'),
	 path       = require('path')

mongoose.connect("mongodb://localhost/Autho-app");

var app = express();
app.set('view engine','ejs');

app.use(require('express-session')({
	secret: 'keyboard cat..any string',
  	resave: false,
  	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use('/public',express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());
app.use(passport.initialize())
app.use(passport.session());

//Session
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
 
 //Routes
app.get('/',(req,res)=>{
	res.render("home");
});
app.get('/secret', (req,res)=>{
	res.render("secret");
});

app.get('/register',(req,res)=>{
	res.render("register");
});
app.post('/register',(req,res)=>{     //Register
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
		if(err){
			console.log("Error..."+err)
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect('/secret');
		})
	})
});

app.get('/login',(req,res)=>{
	res.render("login");
});
app.post('/login', passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}), (req,res)=>{
	console.log("User login Success");
});

app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/');
})

app.listen(3000, ()=>{
	console.log("server is started..")
})

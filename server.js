// dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

// custom
const User = require('./models/user');
const Place = require('./models/place');

// express declaration
const app = express();

// mongoose connection
mongoose.connect('mongodb://localhost:27017/mlvndb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database Connected.'))
    .catch(err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'thisissecretpassword',
    resave: false,
    saveUninitialized: false
}))

// method override
app.use(methodOverride('_method'))

// passport initializationn
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new localStrategy(function(username, password, done){
    User.findOne({username: username}, function(err, user){
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'User not found'})

        // decodes password with bcrypt
        bcrypt.compare(password, user.password, function(err, res){
            if (err) return done(err)
            if (res === false) return done(null, false, { message: 'Incorrect password'})
            return done(null, user)
        })
    })
}))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// logged in and logged out middleware
function inLogged(req, res, next){ // kung logged in, tuloy
    if (req.isAuthenticated()) return next()
    res.render('login')
}

function outLogged(req, res, next){ // kung logged out, tuloy
    if (!req.isAuthenticated()) return next()
    res.render('index')
}

// for dates
let monthsInYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// for options
const tagOptions = [
    { tagback: 'home', tagname: 'Home'} ,
    { tagback: 'government', tagname: 'Government' },
    { tagback: 'restaurant', tagname: 'Restaurant' },
    { tagback: 'mall', tagname: 'Mall' },
    { tagback: 'commercial', tagname: 'Commercial Area' },
    { tagback: 'tourist', tagname: 'Tourist' },
    { tagback: 'hotel', tagname: 'Hotel' },
    { tagback: 'school', tagname: 'School' },
    { tagback: 'station', tagname: 'Staion' }
]

// root
app.get('/', async (req, res) => {
    const places = await Place.find({})

    if (req.isAuthenticated()){
        res.render('index', { places, uLogged: true, userdata: req.user})
    }
    else {
        res.render('index', { places, uLogged: false })
    }
})

// profile
app.get('/profile', inLogged, (req, res) => {
    let gender =`${req.user.gender[0].toUpperCase()}${req.user.gender.slice(1)}`
    res.render('profile', { userdata: req.user, uLogged: true, gender })
})

// login
app.get('/login', outLogged, (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=true'
}))

// create
app.get('/create', inLogged, (req, res) => {
    res.render('create', { user: req.user, tagOptions })
})

app.post('/create', inLogged, (req, res) => {
    function date(){
        let today = new Date()
        return `${monthsInYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
    }
    const createPlace = new Place({
        name: req.body.name,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        uploaderFirst: req.body.authorFirst,
        uploaderLast: req.body.authorLast,
        uploaderId: req.user._id,
        tag: req.body.tag,
        imageOne: req.body.imageOne,
        imageTwo: req.body.imageTwo,
        imageThree: req.body.imageThree,
        imageFour: req.body.imageFour,
        dateCreated: date(),
        review: []
    })

    createPlace.save()
    res.redirect('/')
    
})

// register account
app.get('/register', outLogged, (req, res) => {
    res.render('register')
})
app.post('/register', outLogged, async (req, res) => {
    const userExist = await User.exists({ username: req.body.username })
    if (userExist){
        res.redirect('/login')
        return
    }

    // encrypts password with bcrypt
    bcrypt.genSalt(10, function (err, salt) {
		if (err) return res.render('error');
		bcrypt.hash(req.body.password, salt, function (err, hash){
			if (err) return res.render('error');
			
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                birthday: req.body.birthday,
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })

			newUser.save();
			res.redirect('/login');
		});
	});
})

// logout
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err)
        res.redirect('/');
    });
})

// edit
app.get('/view/place/:id/edit', inLogged, async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)

    if(req.user._id.valueOf() !== place.uploaderId){
        res.redirect('/')
    }
    else {
        res.render('edit', { place, userdata: req.user, tagOptions })
    }
})

app.patch('/view/place/:id/edit', inLogged, async (req, res) => {
    const { id } = req.params
    await Place.findByIdAndUpdate(id, {
        name: req.body.name,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        tag: req.body.tag,
        imageOne: req.body.imageOne,
        imageTwo: req.body.imageTwo,
        imageThree: req.body.imageThree,
        imageFour: req.body.imageFour
    })
    res.redirect(`/view/place/${id}`)
})

// delete a post
app.delete('/view/place/:id/edit', inLogged, async (req, res) => {
    const { id } = req.params
    const place = await Place.findById(id)
    
    if(req.user._id.valueOf() !== place.uploaderId){
        res.redirect('/')
    }
    else {
        await Place.findByIdAndDelete(id)
        res.redirect('/')
    }
})

// place individual
app.get('/view/place/:id', async (req, res) => {
    const { id } = req.params
    // needs to be hard coded kase nageerror po yung sa part ng objectId
    const {_id, name, description, lat, lng, uploaderFirst, uploaderLast, uploaderId, tag, imageOne, imageTwo, imageThree, imageFour, review, dateCreated} = await Place.findOne({_id: id})
    let placeObj = { _id: _id.valueOf(), name, description, lat, lng, uploaderFirst, uploaderLast, uploaderId, imageOne, imageTwo, imageThree, imageFour, review, dateCreated }

    let finaltag = `${tag[0].toUpperCase()}${tag.slice(1)}`

    if (req.isAuthenticated()){
        res.render('place', { placeObj, uLogged: true , userdata: req.user, tag: finaltag })
    }
    else {
        res.render('place', { placeObj, uLogged: false, tag: finaltag })
    }
})

app.patch('/view/place/:id', inLogged, async (req, res) => {
    const { id } = req.params
    let allplace = await Place.findOne({_id: id})
    function date(){
        let today = new Date()
        return `${monthsInYear[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()} ${today.toLocaleString([], {hour: '2-digit', minute:'2-digit'})}`
    }
    await Place.findByIdAndUpdate(id, { review: [...allplace.review, {
        id: req.user._id,
        fname: req.body.reviewerf,
        lname: req.body.reviewerl,
        review: req.body.review,
        dateCreated: date()
    }]})
    res.redirect(`/view/place/${id}#place-comment`)
})

// unknown route receiver
app.get('*', (req, res) => res.render('error'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`\nServer Started. Listerning to port ${PORT}.`))


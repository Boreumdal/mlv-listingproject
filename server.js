// dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

// custom
const User = require('./models/user');
const Place = require('./models/place')

// express declaration
const app = express();

mongoose.connect('mongodb://localhost:27017/betaLogin', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected');
    })
    .catch(err => {
        console.log(err);
    })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'thisissecretpassword',
    resave: false,
    saveUninitialized: false
}))

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
        if (err) { return done(err) }
        if (!user) { return done(null, false, { message: 'User not found'})}

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
function inLogged(req, res, next){
    if (req.isAuthenticated()) { // kung logged in, tuloy
        return next()
    }
    res.render('login')
}

function outLogged(req, res, next){
    if (!req.isAuthenticated()) { // kung logged out, tuloy
        return next()
    }
    res.render('index')
}

// for dates
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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

// log
app.get('/login', outLogged, (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=true'
}))

// create
// uses /place future update proofing
app.get('/create', inLogged, (req, res) => {
    const initials = {
        f: req.user.firstname[0],
        l: req.user.lastname[0]
    }
    res.render('create', { user: req.user, initials})
})

app.post('/create', inLogged, (req, res) => {
    function date(){
        let today = new Date()
        return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
    }
    let defaulter = 'https://img.freepik.com/free-vector/internet-network-warning-404-error-page-file-found-web-page-internet-error-page-issue-found-network-404-error-present-by-man-sleep-display_1150-55450.jpg?w=2000'
    let oneImg, twoImg, threeImg, fourImg
    if (req.body.imageOne == ''){
        oneImg = defaulter
    }
    else {
        oneImg = req.body.imageOne
    }
    if (req.body.imageTwo == ''){
        twoImg = defaulter
    }
    else {
        twoImg = req.body.imageTwo
    }
    if (req.body.imageThree == ''){
        threeImg = defaulter
    }
    else {
        threeImg = req.body.imageThree
    }
    if (req.body.imageFour == ''){
        fourImg = defaulter
    }
    else {
        fourImg = req.body.imageFour
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
        imageOne: oneImg,
        imageTwo: twoImg,
        imageThree: threeImg,
        imageFour: fourImg,
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
        if (err) { return next(err); }
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
        res.render('edit', { place })
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
    const {_id, name, description, lat, lng, uploaderFirst, uploaderLast, uploaderId, tag, imageOne, imageTwo, imageThree, imageFour, review, dateCreated} = await Place.findOne({_id: id})
    let pureid = _id.valueOf()
    let placeObj = { _id: pureid, name, description, lat, lng, uploaderFirst, uploaderLast, uploaderId, imageOne, imageTwo, imageThree, imageFour, review, dateCreated }

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
        return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()} ${today.toLocaleString([], {hour: '2-digit', minute:'2-digit'})}`
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
app.get('*', (req, res) => {
    res.render('error')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Listerning to port ${PORT}`))
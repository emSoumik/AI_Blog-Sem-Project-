const articleRouter = require("./routes/articles")
const express = require("express")
const path = require("path")
const Article = require('./models/article')
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash')
const User = require('./models/User')
const app = express()


mongoose.connect('mongodb+srv://abhisheknair616:faceless123@cluster0.8eyay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false})) //to access article from info using req.body
app.use(express.json());
app.use(flash());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/articles", articleRouter)

app.use(methodOverride('_method'))

passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email })
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/articles/new", (req, res) => {
    res.render("articles/new", { article: {} })
})

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render("articles/index", { 
        articles: articles,
        user: req.user
    })
})

app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.get("/register", (req, res) => {
    res.render("register.ejs", { messages: req.flash() });
})

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post("/register", async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        });
        
        await user.save();
        req.flash('success', 'Registration successful! Please login.');
        res.redirect("/login");
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect("/register");
    }
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login')
    })
})

// Serve static files from the "public" directory
app.use(express.static("public"))

// Route to delete an article
app.delete("/articles/:id", async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect("/")
    } catch (e) {
        console.error(e)
        res.redirect("/")
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
const articleRouter = require("./routes/articles")
const express = require("express")
const path = require("path")
const Article = require('./models/article')
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const app = express()

mongoose.connect('mongodb+srv://abhisheknair616:faceless123@cluster0.8eyay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false})) //to access article from info using req.body
app.use(methodOverride('_method'))
app.use("/articles", articleRouter)

// Add this log before using the articleRouter
console.log("Setting up articleRouter");

app.get("/login", (req, res) => {
    res.render("login") 
})

app.get("/articles/new", (req, res) => {
    res.render("articles/new", { article: {} })
})

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc'})
    res.render("articles/index", { articles: articles})
})


app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.get("/register", (req, res) => {
    res.render("register.ejs")
})

app.post("/login", async (req, res) => {
    res.redirect("/")
})

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect("/login")
    } catch  {
        res.redirect("/register")
    }
    console.log(users)
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

// Add a catch-all route at the end
app.use((req, res, next) => {
    console.log(`Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).send('Not Found');
});

app.listen(5000, () => {
    console.log("Server running on port 5000")
})

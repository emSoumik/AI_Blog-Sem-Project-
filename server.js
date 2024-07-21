const articleRouter = require("./routes/articles")
const express = require("express")
const path = require("path")
const app = express()
const bcrypt = require("bcrypt")

app.set('view engine', 'ejs')

app.use("/articles", articleRouter)

app.use(express.urlencoded({ extended: false}))

app.get("/", (req, res) => {
    const articles = [{
        title: "Welcome to my blog",
        createdAt: new Date(),
        description: "This is my first blog post"
    },
    {
        title: "Welcome to my blog2",
        createdAt: new Date(),
        description: "This is my second blog post"
    }]
    res.render("index", { articles: articles})
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

app.listen(5000, () => {
    console.log("Server running on port 5000")
})
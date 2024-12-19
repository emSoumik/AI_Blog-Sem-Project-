const express = require("express")
const router = express.Router()
const Article = require("./../models/article")
const slugify = require('slugify');
const { checkAuthenticated } = require('../middleware/auth')

console.log("Article routes loaded");

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('articles/new', { article: new Article()})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if (article == null){
        res.redirect('/')
    } 
    res.render('articles/show', { article: article })
})

router.post("/", checkAuthenticated, async (req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)        
    } catch (e) {
        console.log(e)
        res.render('articles/new', {article: article })
    }
})

router.delete("/:id", checkAuthenticated, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect("/")
    } catch (e) {
        console.error(e)
        res.redirect("/")
    }
})

router.put("/:slug", async (req, res, next) => {
    console.log("PUT route hit with slug:", req.params.slug);
    console.log("Request body:", req.body);

    try {
        let article = await Article.findOne({ slug: req.params.slug });
        if (article == null) {
            console.log("Article not found");
            return res.redirect('/');
        }
        
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        article.slug = slugify(req.body.title, { lower: true, strict: true });

        article = await article.save();
        console.log("Article updated successfully:", article);
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        console.error("Error updating article:", e);
        res.render(`articles/edit`, { article: req.body });
    }
});

router.get("/edit/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
        return res.redirect("/");
    }
    res.render("articles/edit", { article: article });
});

// Also add a catch-all route to log any requests that don't match other routes
router.use((req, res, next) => {
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    next();
});

// Add this catch-all route at the end of your router
router.use((req, res, next) => {
    console.log(`Unhandled article request: ${req.method} ${req.url}`);
    next();
});

// Add this near the top of your route definitions
router.get('/test', (req, res) => {
    res.send('Article router is working');
});

module.exports = router
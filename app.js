var //expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    blog: String,
    created: {type: Date, default: Date.now}
});

var blog = mongoose.model("blog", blogSchema);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//app.use(expressSanitizer);

app.get("/blogs",function (req,res) {
    blog.find({},function (err,blogs) {
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
        
    });
});

app.get("/blogs/new",function (req,res) {
   res.render("new");
});

app.post("/blogs", function (req,res) {
   //req.body.blog.blog = req.sanitize(req.body.blog.blog);
   blog.create(req.body.blog,function (err, newBlog) {
       if(err){
           console.log(err);
           res.render("new");
       }else {
            res.redirect("/blogs");
       }
   }) 
});

app.get("/blogs/:id", function (req,res) {
    blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("show", {blog:foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",function (req,res) {
    blog.findById(req.params.id,function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit",{blog:foundBlog});
        }
    });
});

app.put("/blogs/:id",function (req,res) {
    //req.body.blog.blog = req.sanitize(req.body.blog.blog);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function (err, updatedBlog) {
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/"+req.params.id);
            console.log(updatedBlog.name);
        }
    });
});

app.delete("/blogs/:id",function (req,res) {
    blog.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});

app.get("/",function (req,res) {
    res.redirect("/blogs");
});

app.listen(3000,function () {
    console.log("server is running..");
});
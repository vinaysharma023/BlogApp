
var express = require("express");
var app = express();

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer= require("express-sanitizer");

//App config
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); 
app.use(methodOverride("_method"));


//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type: Date ,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//Restful Routes


app.get("/",function(req,res){
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        } else{
             res.render("index",{blogs:blogs});
        }
    });
});

//New Route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//Create Route
app.post("/blogs",function(req,res){
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("===========");
    console.log(req.body);
    //create blog
    //then,redirect to the index
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
    
});

//Show route

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
        res.render("show",{blog:foundBlog});
        }
    }); 
});

//Edit Route

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//Update Route

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.params.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            console.log(updatedBlog.title);
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Route

app.delete("/blogs/:id",function(req,res){
    //Destroy the blog
    Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/blogs");
       } else{
           //Redirect somewhere else
           res.redirect("/blogs");
       }
    });
    
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The server has started!");
})
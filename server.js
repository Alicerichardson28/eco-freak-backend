const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config()
const app=express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

mongoose.connection.on("connected", err =>{
    if (err) throw err;
    console.log("Connected to database...")
});

const Schema = mongoose.Schema
//Mongoose Schema
const PostSchema = new Schema({
    title: String,
    content:String,
    author: String,
    timestamp: String
});

const PostModel = mongoose.model("Eco-freak_post", PostSchema);

// Middlware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

// API Routes and test with postman 
app.post("/api/post/new", (req, res) => {
    let payload = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        timestamp: new Date().getTime()
    } 
    let newPost = new PostModel(payload);

    newPost.save((err, result) => {
        if (err) res.send({ success: false, msg: err });

        res.send({ success: true, result: result });
    })
});

app.get("/api/posts/all", (req, res) => {
    PostModel.find((err, result) => {
        if (err) res.send({ success: false, msg: err });

        res.send({ success: true, result: result});
    })
});

app.post("/api/post/update", (req, res) => {
    let id = req.body._id;
    let payload = req.body
    PostModel.findByIdAndUpdate(id, payload, (err, result) => {
        if (err) res.send({ success: false, msg: err });

        res.send({ success: true, result: result });
    })
})

app.post("/api/post/remove", (req, res) => {
    let id = req.body._id;

    PostModel.findById(id).remove ((err, result) => {
        if (err) res.send({ success: false, msg: err });

        res.send({ success: true, result: result });
    })
})



app.listen(process.env.PORT || 4000, err => {
    if (err) console.error;
    console.log("Server has started on port %s", process.env.PORT || 4000)
});
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}

const articleSchema = new mongoose.Schema({
    title : String,
    content: String,
});

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////// Request Targeting All Articles /////////////////////////////////////

app.route("/articles")
.get(async (req, res) => {
    
  try {
    const foundArticles = await Article.find();
    res.send(foundArticles);
  } catch (err) {
    console.log(err);
    res.status(400).json({message: "Something is going wrong"});
  }

})
.post(async (req, res) => {
    
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    await newArticle.save();
    res.send("Successfully added a new article.");
  } catch (error) {
    res.send(error);
  }

})
.delete(async (req, res) => {

  try {
    await Article.deleteMany({});
    res.send("Succesfully deleted all articles.")
  } catch (error) {
    res.send(error);
  }

});

///////////////////////////////////////////// Request Targeting A Specific Article /////////////////////////////////////

app.route("/articles/:articleTitle")
.get(async (req, res) => {

  try {
    const foundArticle = await Article.findOne({title: req.params.articleTitle});
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }  
  } catch (error){
    console.log(error);
    res.status(400).json({message: "Something went wrong"});
  }

})
.put(async (req, res) => {

  try {
    const updatedArticle = await Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {$set: req.body});
    res.send({
      message: "Article updated successfully for:",
      title: req.body.title,
      content: req.body.content
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({message: "Can't update article"})
  }

})
.patch(async (req, res) => {

  try {
    const updatedArticle = await Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title,content: req.body.content},
      {$set: req.body}
    );
    res.send({
      message: "Article updated successfully for:",
      title: req.body.title,
      content: req.body.content
    });

} catch (error) {
    console.log(error);
    res.status(400).json({
        message: "Can`t update article",
    });
}

})
.delete(async (req,res) => {

  try {
    await Article.deleteOne(
      {title: req.params.articleTitle},
      {$set: req.body});
    res.send("Succesfully deleted selected article.");
  } catch (error) {
    res.send(error);
  }

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
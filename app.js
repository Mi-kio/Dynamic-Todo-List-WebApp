//jshint esversion:6
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
// var items= [];
// var workItems= [];
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
    name:String
})

const Item = mongoose.model("Item",itemsSchema);

const listitem1 = new Item({
    name:"Welcome"
});
const listitem2 = new Item({
    name:"hit + button to add items"
});
const listitem3 = new Item({
    name:"Dinner"
});

const defaultItems = [listitem1, listitem2, listitem3];

Item.insertMany(defaultItems,function(err){
    if(err)
    console.log(err);
    else
    console.log("done");
});

app.get("/",function(req,res){
//     let today = new Date();
//    let currentDay = today.getDay();
//    let options={
//        weekday:"long",
//        month:"long",
//        day:"numeric"
//    };
//    let day = today.toLocaleDateString("en-US",options);

   res.render("list", {listTitle:"Today", 
    newlistitems:items});
});

app.post("/",function(req,res){
    let item = req.body.newItem;
    console.log(req.body);
    if(req.body.list === "Work"){
         workItems.push(item);
         res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    } 
});


app.get("/work",function(req,res){
    res.render("list",
    {listTitle:"Work list",
    newlistitems:workItems});
});

app.post("/work",function(req,res){
    console.log(req.body);
      let item = req.body.newItem;
      workItems.push(item);
      res.redirect("/work");
  });

  app.get("/about",function(req,res){
    res.send("I am Sakshi Jain. This is my first time using expressjs. I am loving this framework.");
    })



app.listen(3000,function(){
    console.log("Server at post 3000");
});

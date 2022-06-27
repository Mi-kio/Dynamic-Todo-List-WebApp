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



app.get("/",function(req,res){
//     let today = new Date();
//    let currentDay = today.getDay();
//    let options={
//        weekday:"long",
//        month:"long",
//        day:"numeric"
//    };
//    let day = today.toLocaleDateString("en-US",options);

Item.find({},function(err,foundItems){
    // console.log(foundItems);
   
    if(foundItems.length === 0){
        Item.insertMany(defaultItems,function(err){
            if(err)
            console.log(err);
            else
            console.log("done");
        });
        res.redirect("/");
    }
    else{
    res.render("list", {listTitle:"Today", 
    newlistitems:foundItems});

}
});
   


   
});

app.post("/",function(req,res){
    const itemName = req.body.newItem;
  const item = new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
    // console.log(req.body);
    // if(req.body.list === "Work"){
    //      workItems.push(foundItems);
    //      res.redirect("/work");
    // }
    // else{
    //     items.push(foundItems);
    //     res.redirect("/");
    // } 
});


app.get("/work",function(req,res){
    res.render("list",
    {listTitle:"Work list",
    newlistitems:workItems});
});

app.post("/delete",function(req,res){
const checkedItemBody = req.body.checkbox;

   Item.findByIdAndRemove(checkedItemBody,function(err){
    if(!err)
    console.log("deleted");
   })  
   res.redirect("/");

  })

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

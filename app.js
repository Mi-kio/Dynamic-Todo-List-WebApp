//jshint esversion:6
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
var items= [];
var workItems= [];
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true }));
app.use(express.static("public"));

app.get("/",function(req,res){
    let today = new Date();
   let currentDay = today.getDay();
   let options={
       weekday:"long",
       month:"long",
       day:"numeric"
   };
   let day = today.toLocaleDateString("en-US",options);

   res.render("list", {listTitle:day, 
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



app.listen(3000,function(){
    console.log("Server at post 3000");
});

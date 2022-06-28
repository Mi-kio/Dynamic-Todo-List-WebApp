//jshint esversion:6


const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
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

const listSchema = {
    name:String,
    items:[itemsSchema]
}
const List = mongoose.model("List", listSchema);

app.get("/",function(req,res){

Item.find({},function(err,foundItems){
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

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;
    List.findOne({name:customListName},function(err,foundList){
if(!err){
    if(!foundList){
    const list = new List({
        name:customListName,
        items:defaultItems
    });
    list.save();
    res.redirect("/" + customListName);
}
else{
    res.render("list", {listTitle:foundList.name, 
    newlistitems:foundList.items});

}}
})
});




app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
  const item = new Item({
    name:itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName},function(err,foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
    })
  }
});



app.post("/delete",function(req,res){
const checkedItemBody = req.body.checkbox;

   Item.findByIdAndRemove(checkedItemBody,function(err){
    if(!err)
    console.log("deleted");
   })  
   res.redirect("/");

  })

  app.get("/about",function(req,res){
    res.send("I am Sakshi Jain. This is my first time using expressjs. I am loving this framework.");
    })

app.listen(3000,function(){
    console.log("Server at post 3000");
});

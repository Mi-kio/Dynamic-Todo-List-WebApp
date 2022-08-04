//jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true }));
app.use(express.static("public"));
mongoose.connect("<>",{useNewUrlParser:true});

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
    const customListName = _.capitalize(req.params.customListName);
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
const checkedItemId = req.body.checkbox;
const listName = req.body.listName;

if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }
  })

 

  app.get("/about",function(req,res){
    res.send("I am Sakshi Jain. This is my first time using expressjs. I am loving this framework.");
    })

    let port = process.env.PORT;
    if(port == null || port == ""){
      port = 3000;
    }
    app.listen(port);

app.listen(port,function(){
    console.log("Server has started");
});

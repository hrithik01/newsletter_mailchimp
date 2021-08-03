const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const Mclient = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

Mclient.setConfig({apiKey: "e5d32bc6dfefe46e20348dd901ce7b6f-us6", server: "us6"});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
     const firstName = req.body.fName;
     const secondName = req.body.sName;
     const email = req.body.email;
     const listId = "9575c22a3a";

     const sUser = {
         firstName: firstName,
         secondName: secondName,
         email: email
     };
     async function run(){
         const response = await Mclient.lists.addListMember(listId, {
             email_address: sUser.email,
             status: "subscribed",
             merge_fields:{
                 FNAME: sUser.firstName,
                 LNAME: sUser.secondName
             }
         });
         res.sendFile(__dirname + "/success.html");
         console.log("Successfully added contact");
     }
     run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running");
});


// e5d32bc6dfefe46e20348dd901ce7b6f-us6      api key
// 9575c22a3a                                audience unique id
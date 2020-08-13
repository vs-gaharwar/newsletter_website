require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  console.log(req.body.fName, req.body.lName, req.body.email);

  var email = req.body.email;
  var firstName = req.body.fName;
  var lastName = req.body.lName;

  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

  const jsonData = JSON.stringify(data);

  const url = process.env.DB_URL;
  const options = {
    method: "POST",
    auth: process.env.OPTIONS_AUTH
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening at port 3000");
});

// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');
var util = require('util');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// =============================================================
//Global Variables
let writefileAsync = util.promisify(fs.writeFile);
let appendfileAsync = util.promisify(fs.appendFile);
let readFileAsync = util.promisify(fs.readFile);
let notesList;    // use for pull data from db.json
// =============================================================
// Routes
// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../../index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "../../notes.html"));
});

app.get("/api/notes",function(req, res){
    readFileAsync(path.join(__dirname, "../../../db/db.json"),"utf8")
    .then(function(data){
        console.log(JSON.parse(data));
        return res.json(JSON.parse(data));
    });
});

app.post("/api/notes",function(req, res){
    var newNote = req.body;
    appendfileAsync(path.join(__dirname, "../../../db/db.json"),newNote)
    .then(function(){
        console.log(`${newNote} was added to database!`);
    });
});







// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
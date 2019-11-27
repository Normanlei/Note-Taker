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
// app.use(express.static(path.join(__dirname + "../../../public")));
// console.log(path.join(__dirname + "../../../"));
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

app.get("/api/notes", function (req, res) {
    readFileAsync(path.join(__dirname, "../../../db/db.json"), "utf8")
        .then(function (data) {
            console.log(JSON.parse(data));
            return res.json(JSON.parse(data));
        });
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    console.log(newNote);
    readFileAsync(path.join(__dirname, "../../../db/db.json"), "utf8")
    .then(function(data){
        notesList = JSON.parse(data);
        console.log(notesList);
        notesList.push(newNote);
        console.log(notesList);
        writefileAsync(path.join(__dirname, "../../../db/db.json"),JSON.stringify(notesList))
        .then(function(){
            console.log("new note was writed to db.json");
        })
    });
    res.json(newNote);
});









// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
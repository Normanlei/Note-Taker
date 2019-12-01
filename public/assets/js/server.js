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
app.use(express.static(path.join(__dirname, "../../")));
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
            return res.json(JSON.parse(data));
        });
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    readFileAsync(path.join(__dirname, "../../../db/db.json"), "utf8")
        .then(function (data) {
            notesList = JSON.parse(data);
            if (newNote.id || newNote.id===0) {   // update the existing data
                let currNote = notesList[newNote.id];
                currNote.title = newNote.title;
                currNote.text = newNote.text;
            } else {  // add the new data
                notesList.push(newNote);
            }
            writefileAsync(path.join(__dirname, "../../../db/db.json"), JSON.stringify(notesList))
                .then(function () {
                    console.log("new note was writed to db.json");
                })
        });
    res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    readFileAsync(path.join(__dirname, "../../../db/db.json"), "utf8")
        .then(function (data) {
            notesList = JSON.parse(data);
            notesList.splice(id, 1);
            writefileAsync(path.join(__dirname, "../../../db/db.json"), JSON.stringify(notesList))
                .then(function () {
                    console.log("note was deleted from db.json");
                })
        });
    res.json(id);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
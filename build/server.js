// Importing requirements
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const app = express();

// Setting the PORT number for the server to listen for
const PORT = process.env.PORT || 3001;

// Setting up the middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// Defining path for the database, where the notes will be stored
const dbFilePath = './db/db.json';

// Function to read notes inside db
const getNotesFromDb = () => {
    try {
        const notesData = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(notesData);
    } catch (error) {
        console.error('Error reading notes in json file', error);
        return [];
    }
};

// Function to save new entries into db
const saveNotesToDb = (notes) => {
    try {
        const notesData = JSON.stringify(notes);
        fs.writeFileSync(dbFilePath, notesData);
    } catch (error) {
        console.error('Error saving notes', error);
    }
};

// Grabbing notes on server start up and storing them into a variable
let notes = getNotesFromDb();

// Handlers to return the notes from database as json
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Posts the new notes into the database
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    // New notes are given a unique id for delete functionality
    newNote.id = uuidv4();
    notes.push(newNote);
    saveNotesToDb(notes);
    res.json({message: `Note ${newNote.id} saved`});
});

// Handler to delete notes inside the database
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id.toString();
    notes = notes.filter((note) => note.id.toString() !== noteId);
    saveNotesToDb(notes);
    res.json(notes);
});

// Starting server to listen on PORT
app.listen(PORT);

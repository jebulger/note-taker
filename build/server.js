const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

const dbFilePath = './db/db.json';

const getNotesFromDb = () => {
    try {
        const notesData = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(notesData);
    } catch (error) {
        console.error('Error reading notes in json file', error);
        return [];
    }
};

const saveNotesToDb = (notes) => {
    try {
        const notesData = JSON.stringify(notes);
        fs.writeFileSync(dbFilePath, notesData);
    } catch (error) {
        console.error('Error saving notes', error);
    }
};

let notes = getNotesFromDb();

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    notes.push(newNote);
    saveNotesToDb(notes);
    res.json({message: `Note ${noteId} deleted`});
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

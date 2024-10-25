'use strict';

class Note {
    constructor(title, color, text) {
        this.id = Date.now();
        this.title = title;
        this.color = color;
        this.text = text;
        this.date = new Date().toLocaleString();
    }
}

class NoteModel {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    }

    addNote(title, color, text) {
        const note = new Note(title, color, text);
        this.notes.push(note);
        this.saveNotes();
        return note;
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    getNotes() {
        return this.notes;
    }
}

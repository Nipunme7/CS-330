'use strict';

class NoteController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddNote(this.handleAddNote.bind(this));
        this.view.bindDeleteNote(this.handleDeleteNote.bind(this));

        this.onNotesChanged(this.model.getNotes());
    }

    handleAddNote(title, color, text) {
        this.model.addNote(title, color, text);
        this.onNotesChanged(this.model.getNotes());
    }

    handleDeleteNote(id) {
        this.model.deleteNote(id);
        this.onNotesChanged(this.model.getNotes());
    }

    onNotesChanged(notes) {
        this.view.displayNotes(notes);
    }
}

const app = new NoteController(new NoteModel(), new NoteView());

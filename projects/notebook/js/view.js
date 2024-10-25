'use strict';

class NoteView {
    constructor() {
        this.form = document.getElementById('noteForm');
        this.titleInput = document.getElementById('title');
        this.colorSelect = document.getElementById('color');
        this.textInput = document.getElementById('text');
        this.addNoteButton = document.getElementById('addNote');
        this.notesContainer = document.getElementById('notesContainer');
    }

    bindAddNote(handler) {
        const addNoteHandler = (event) => {
            event.preventDefault();
            const isValid = this.validateForm();
            if (isValid) {
                const title = this.titleInput.value;
                const color = this.colorSelect.value;
                const text = this.textInput.value;
                handler(title, color, text);
                this.clearForm();
            }
        };

        this.form.addEventListener('submit', addNoteHandler);
        this.addNoteButton.addEventListener('click', addNoteHandler);
    }

    validateForm() {
        let isValid = true;
        if (!this.titleInput.value.trim()) {
            this.showError('fieldTitle');
            isValid = false;
        } else {
            this.hideError('fieldTitle');
        }
        if (!this.textInput.value.trim()) {
            this.showError('fieldText');
            isValid = false;
        } else {
            this.hideError('fieldText');
        }
        return isValid;
    }

    showError(fieldId) {
        const field = document.getElementById(fieldId);
        field.querySelector('.help').classList.remove('is-hidden');
    }

    hideError(fieldId) {
        const field = document.getElementById(fieldId);
        field.querySelector('.help').classList.add('is-hidden');
    }

    clearForm() {
        this.titleInput.value = '';
        this.textInput.value = '';
        this.colorSelect.selectedIndex = 0;
        this.hideError('fieldTitle');
        this.hideError('fieldText');
    }

    createNoteElement(note) {
        const noteElement = document.createElement('div');
        noteElement.className = `note message ${note.color} mb-4`;
        noteElement.innerHTML = `
            <div class="message-header">
                <p>${note.title}</p>
                <button class="delete deleteNote" aria-label="delete"></button>
            </div>
            <div class="message-body">
                <p>${note.text}</p>
                <p class="has-text-right has-text-grey-light is-size-7 mt-2">${note.date}</p>
            </div>
        `;
        noteElement.querySelector('.deleteNote').addEventListener('click', () => {
            this.onDeleteNote(note.id);
        });
        return noteElement;
    }

    displayNotes(notes) {
        this.notesContainer.innerHTML = '';
        const groupedNotes = this.groupNotesByColor(notes);
        for (const color in groupedNotes) {
            const colorGroup = document.createElement('div');
            colorGroup.className = 'mb-6';
            groupedNotes[color].forEach(note => {
                colorGroup.appendChild(this.createNoteElement(note));
            });
            this.notesContainer.appendChild(colorGroup);
        }
    }

    groupNotesByColor(notes) {
        return notes.reduce((groups, note) => {
            if (!groups[note.color]) {
                groups[note.color] = [];
            }
            groups[note.color].push(note);
            return groups;
        }, {});
    }

    bindDeleteNote(handler) {
        this.onDeleteNote = handler;
    }
}

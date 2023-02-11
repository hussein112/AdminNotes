/**
 * update bg-danger on update button
 */

import { Note } from './note.js';
import { NoteController } from './noteController.js'; 

// import { NoteController } from './noteController.js'; 

class Notes{
    constructor(container){
        this.container = container;
    }
}

window.onload = function(){
    NoteController.index();
}

document.getElementById('an-save').addEventListener("click", (e)=>{
    e.preventDefault();
    e.stopPropagation();

    const id = Math.round(Math.random() * 1000 + 1);

    let note = new Note(
        id, 
        document.getElementById("an-title").value,
        document.getElementById("an-content").value,
        document.getElementById("an-important").checked
    );

    const saveNote = new NoteController(note);
    saveNote.store();
});
import { NoteModel } from './noteModel.js';
import { Validator } from './validator.js'; 
import { NotesForm } from './noteView.js';
import { Note } from './note.js';

export class NoteController{

    constructor(note){
        this.note = note;
    }


    /**
     * Render all the notes on load
     */
    static index(){
        NotesForm.createForm();
        this.prototype.listen();
        let title = "";
        let important;

        for(let i = 0; i < Object.entries(localStorage).length; i++){
            let entry_title = Object.entries(localStorage)[i][0];
            let entry_content = Object.entries(localStorage)[i][1];

            if(entry_title.includes("an-")){
                if(entry_title.includes("imp__")){
                    title = entry_title.slice(8);
                    important = true;
                }else{
                    title = entry_title.slice(3);
                    important = false;
                }
                this.prototype.renderAll(title, entry_content, important);
            }
        }
    }

    listen(){
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
    }

    /**
     * Validate & Store the created Note
     */
    store(){
        let validator = new Validator();
        let result = validator.validate(this.note);
        if(result['content'].length > 0 || result['title'].length > 0){
            this.displayErrors(result);
        }else{
            let title = `an-${this.note.title}`;
            if(this.note.important){
                title = "an-imp__" + this.note.title.trimEnd();
            }
            NoteModel.add(title, this.note.content);
            this.render(this.note);
        }
    }


    /**
     * Update accordion on update btn click, 
     * Insert Content, assign colors to the header (if important)
     * 
     * @param {*} content 
     * @param {*} content_id 
     * @param {*} important 
     */
    static updateView(content, content_id, important = false){
        const button = document.getElementById(content_id).previousSibling.children[0];
        document.getElementById(content_id).children[0].innerText = content;
        if(important){
            button.classList.add("bg-danger");
            button.classList.add("text-light");
        }else{
            if(button.classList.contains("bg-danger")){
                button.classList.remove("bg-danger");
                button.classList.remove("text-light");
            }
        }
    }

    /**
     * Render The Note Data to the form and update after click
     * 
     * @param {*} deleteb 
     * @param {*} edit 
     */
    static update(deleteb, edit){
        let title = "";
        let rendered_title = "";
        if(deleteb.previousSibling.previousSibling.classList.contains("bg-danger")){
            title = `an-imp__${deleteb.parentElement.innerText}`;
            rendered_title = title.slice(8);
        }else{
            title = `an-${edit.previousElementSibling.innerText}`;
            rendered_title = title.slice(3);
        }
        
        // Fill the form
        const item = NoteModel.get(title);
        this.prototype.fillForm(item, title, rendered_title);
        
        document.getElementById("an-update").addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if(NotesForm.important.checked){
                    NoteController.updateView(NotesForm.content.value, edit.previousSibling.getAttribute("aria-controls"), true);
                    // If not already important
                    if(! title.includes("imp__")){
                        // Remove not important item
                        NoteModel.delete(title);
                        title = 'an-imp__' + title.slice(3);
                    }
                    NotesForm.flushThenFill();
                }else{
                    NoteController.updateView(NotesForm.content.value, edit.previousSibling.getAttribute("aria-controls"), false);
                    if(title.includes("imp__")){
                        // Remove important item
                        NoteModel.delete(title);
                        title = 'an-' + title.slice(8);
                    }
                    NotesForm.flushThenFill();
                }
                if(NotesForm.content.value != item){ // Content Updated
                    NoteController.updateView(NotesForm.content.value, edit.previousSibling.getAttribute("aria-controls"));
                    NotesForm.flushThenFill();
                }
                NoteModel.add(title, NotesForm.content.value);
        }); 
    }

    /**
     * Fill the note to be updated into the form
     * 
     * @param {*} item 
     * @param {*} title 
     * @param {*} rendered_title 
     */
    fillForm(item, title, rendered_title){
        if(item == title){
            item = null;
        }
        NotesForm.title.value = rendered_title;
        NotesForm.title.disabled = true;
        if(title.includes("imp__")){
            NotesForm.important.checked = true;
        }else{
            NotesForm.important.checked = false;
        }

        let content = document.getElementById("an-content");
        content.value = item;

        // Add Action Buttons
        const updateBtn = NotesForm.createUpdateBtn();
        

        const saveBtn = document.getElementById("an-save");
        if(saveBtn != null){
            saveBtn.after(updateBtn);
            saveBtn.remove();

            const cancel = NotesForm.createBtn("cancel");
            updateBtn.after(cancel);

            cancel.addEventListener("click", (e)=>{
                e.preventDefault();
                updateBtn.remove();
                NotesForm.flushThenFill();

                cancel.after(saveBtn);
                cancel.remove();
            });
        }else{
            document.getElementById("an-update").after(updateBtn);
            document.getElementById("an-update").remove();
        }
    }

    /**
     * Delete Note
     * 
     * @param {*} deleteb 
     */
    static delete(deleteb){
        NotesForm.flushErrors();
        if(deleteb.previousSibling.previousSibling.classList.contains("bg-danger")){
            NoteModel.delete(`an-imp__${deleteb.parentElement.innerText}`);
        }else{
            NoteModel.delete(`an-${deleteb.parentElement.innerText}`);
        }
        deleteb.parentElement.parentElement.remove();
        NotesForm.flushThenFill();
    }

    /**
     * Render a Single Note From the form & Create Actions Buttons (Update, Delete)
     * 
     * @param {*} note 
     */
    render(note){
        let parent = document.getElementById("an-accordion");

        let container = document.createElement("div");
        container.setAttribute("class", "accordion-item");


        let header = document.createElement("h2");
        header.setAttribute("id", `an-h-${note.id}`);
        header.setAttribute("class", "accordion-header position-relative d-flex align-items-center justify-content-around");

        

        let toggleButton = document.createElement("button");
        if(note.important){
            toggleButton.setAttribute("class", "accordion-button collapsed bg-danger text-light");
        }else{
            toggleButton.setAttribute("class", "accordion-button collapsed");
        }
        toggleButton.setAttribute("type", "button");
        toggleButton.setAttribute("data-bs-toggle", "collapse");
        toggleButton.setAttribute("data-bs-target", `#an-${note.id}`);
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-controls", `an-${note.id}`);
    
        toggleButton.innerHTML = note.title;
    
        header.appendChild(toggleButton);


        let noteContent = document.createElement("div");
        noteContent.setAttribute("id", `an-${note.id}`);
        noteContent.setAttribute("class", "accordion-collpase collapse");
        noteContent.setAttribute("aria-labelledby", `an-h-${note.id}`);
        noteContent.setAttribute("data-bs-parent", "an-accordion");
    
        
        let noteContentBody = document.createElement("div");
        noteContentBody.setAttribute("class", "accordion-body");
        noteContentBody.innerHTML = note.content;

        noteContent.appendChild(noteContentBody);


        container.appendChild(header);
        container.appendChild(noteContent);


        parent.append(container);

        this.createUDButtons(`an-h-${note.id}`);
    }

    /**
     * Render Notes From Local Storage
     * 
     * @param {*} title 
     * @param {*} content 
     * @param {*} important 
     */
    renderAll(title, content, important){
        let id = Math.round(Math.random() * 10_000 + 1);
        
        let parent = document.getElementById("an-accordion");

        let container = document.createElement("div");
        container.setAttribute("class", "accordion-item");

        let header = document.createElement("h2");
        header.setAttribute("id", `an-h-${id}`);
        header.setAttribute("class", "accordion-header position-relative d-flex align-items-center justify-content-around");

        let toggleButton = document.createElement("button");
        if(important){
            toggleButton.setAttribute("class", "accordion-button collapsed bg-danger text-light");
        }else{
            toggleButton.setAttribute("class", "accordion-button collapsed");
        }
        toggleButton.setAttribute("type", "button");
        toggleButton.setAttribute("data-bs-toggle", "collapse");
        toggleButton.setAttribute("data-bs-target", `#an-${id}`);
        toggleButton.setAttribute("aria-expanded", "false");
        toggleButton.setAttribute("aria-controls", `an-${id}`);
    
        toggleButton.innerHTML = title;
    
        header.appendChild(toggleButton);


        let noteContent = document.createElement("div");
        noteContent.setAttribute("id", `an-${id}`);
        noteContent.setAttribute("class", "accordion-collpase collapse");
        noteContent.setAttribute("aria-labelledby", `an-h-${id}`);
        noteContent.setAttribute("data-bs-parent", "an-accordion");
    
        
        let noteContentBody = document.createElement("div");
        noteContentBody.setAttribute("class", "accordion-body");
        noteContentBody.innerHTML = content;

        noteContent.appendChild(noteContentBody);


        container.appendChild(header);
        container.appendChild(noteContent);


        parent.append(container);

        this.createUDButtons(`an-h-${id}`);
        
    }


    /**
     * Create Update & Delete Buttons and attach Click Events to each
     * 
     * @param {*} id 
     */
    createUDButtons(id = null){
        const edit = document.createElement("i");
        edit.setAttribute("class", "bi bi-pencil-square an-btn an-edit an-icon btn btn-primary m-2");
        edit.setAttribute("id", `an-u-${id.slice(5)}`);

        const deleteb = document.createElement("i");
        deleteb.setAttribute("class", "bi bi-trash-fill an-btn an-delete an-icon btn btn-warning m-2");
        deleteb.setAttribute("id", `an-d-${id.slice(5)}`);

        document.getElementById(id).appendChild(edit);
        document.getElementById(id).appendChild(deleteb);
        setTimeout(function(){
            edit.addEventListener("click", function(e){
                e.preventDefault();
                NoteController.update(deleteb, edit);
            });

            deleteb.addEventListener("click", (e) => {
                e.preventDefault();
                NoteController.delete(deleteb);
            });
        }, 100);
    }


    /**
     * Display from errors
     * 
     * @param {Array} errors 
     */

    displayErrors(errors){
        this.removePreviousErrors();
        let title = document.getElementById("an-title");
        for(let i = 0; i < errors.title.length; i++){
            // Title Errors           
            let title_error = document.createElement("strong");
            title_error.setAttribute("class", "text-danger an-error");
            title_error.innerHTML = errors.title[i] + "<br>";

            title.after(title_error);
        }


        let content = document.getElementById("an-content");

        for(let j = 0; j < errors.content.length; j++){
            // Content Errors
            let content_error = document.createElement("strong");
            content_error.setAttribute("class", "text-danger an-error");
            content_error.innerHTML = errors.content[j] + "<br>";
    
            content.after(content_error);
        }
        
    }

    /**
     * Remove Previous Erros in the form
     * 
     */
    removePreviousErrors(){
        let errors = document.querySelectorAll(".an-error");
        if(errors != null){
            errors.forEach(error => {
                error.remove();
            });
        }
    }
}

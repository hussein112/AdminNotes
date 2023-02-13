import { Note } from './note.js';
import { NoteController } from './noteController.js';

export class NotesForm{
    static title = document.getElementById("an-title");
    static content = document.getElementById("an-content");
    static important = document.getElementById("an-important");

    static createForm(){
        const form = document.createElement("form");
        const title = document.createElement("input");
        const content = document.createElement("textarea");
        const checkBoxContainer = document.createElement("div");
        const checkBox = document.createElement("input");
        const checkBoxLabel = document.createElement("label");

        const container = document.getElementById("an-notes");
        container.classList.add("d-flex");
        container.classList.add("flex-wrap");

        this.prototype.setTitleAttributes(title);
        form.appendChild(title);

        this.prototype.setContentAttributes(content);
        form.appendChild(content);

        this.prototype.setCheckBoxAttributes(checkBoxContainer, checkBox, checkBoxLabel);
        form.appendChild(checkBoxContainer);

        this.prototype.setFormAttributes(form);
        container.appendChild(form);

        this.createSaveBtn();

        this.prototype.createAccordion(container);
        return true;
    }

    createAccordion(parent){
        const container = document.createElement("div");
        container.setAttribute("class", "an-pending mt-2 mx-5");

        const accordion = document.createElement("div");
        accordion.setAttribute("class", "accordion");
        accordion.setAttribute("id", "an-accordion");

        container.appendChild(accordion);

        parent.appendChild(container);
    }

    setCheckBoxAttributes(checkBoxContainer, checkBox, checkBoxLabel){
        // <div>
        checkBoxContainer.setAttribute("class", "form-check mt-2");
        checkBoxContainer.setAttribute("id", "an-check");
    
        // <input>
        checkBox.setAttribute("class", "form-check-input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("id", "an-important");

        checkBoxContainer.appendChild(checkBox);

        // <label>
        checkBoxLabel.setAttribute("class", "form-check-label");
        checkBoxLabel.setAttribute("for", "an-important");
        checkBoxLabel.innerText = "Important";

        checkBoxContainer.appendChild(checkBoxLabel);
    }

    setContentAttributes(content){
        content.setAttribute("id", "an-content");
        content.setAttribute("class", "form-control mt-2");
        content.setAttribute("placeholder", "What do you want to remember? ");
        content.setAttribute("cols", "30");
        content.setAttribute("rows", "6");
    }

    setTitleAttributes(title){
        title.setAttribute("id", "an-title");
        title.setAttribute("class", "form-control mt-2");
        title.setAttribute("placeholder", "Title");

    }

    setFormAttributes(form){
        form.setAttribute("class", "mx-5");
        form.setAttribute("id", "an-notes");
    }

    /**
     * Get a specified button
     * 
     * @param {*} btn 
     * @returns HTMLElement
     */
    static getBtn(btn){
        return document.getElementById(`an-${btn}`);
    }

    /**
     * Create a save button along with CLick event + listener
     * 
     */
    static createSaveBtn(){
        const button = document.createElement("button");
        button.setAttribute("id", `an-save`);
        button.setAttribute("class", "btn btn-primary mt-2");
        button.innerText = "Save";
        document.getElementById("an-check").after(button);
        
        setTimeout(function(){
            let s = document.getElementById("an-save");
            s.addEventListener("click", function(e){
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
        }, 100);
    }

    /**
     * Create a button
     * 
     * @param {String} btn 
     * @returns HtmlElement
     */
    static createBtn(btn){
        const button = document.createElement("button");
        button.setAttribute("id", `an-${btn}`);
        button.setAttribute("class", "btn btn-primary mt-2");
        button.innerText = btn;
        document.getElementById("an-check").after(button);
        return document.getElementById(`an-${btn}`);
    }

    /**
     * Creatre Update Buttons
     * 
     * @returns HtmlElement
     */
    static createUpdateBtn(){
        const updateBtn = document.createElement("button");
        updateBtn.setAttribute("id", "an-update");
        updateBtn.setAttribute("class", "btn btn-danger mt-2 mx-2");
        updateBtn.innerText = "Update";
        return updateBtn;
    }

    /**
     * Reset the form to its defaults
     */
    static flush(){
        this.title.value = "";
        this.content.value = "";
        this.important.checked = false;
        if(this.title.disabled = true){
            this.title.disabled = false;
        }

        let errors = document.querySelectorAll(".an-error");

        if(errors != null){
            errors.forEach(error => {
                error.remove();
            });
        }


        if(this.getBtn('cancel') != null){
            this.getBtn('cancel').remove();
        }

        if(this.getBtn('update') != null){
            this.getBtn("update").remove();
        }

    }

    /**
     * Remove Errors from the forms
     */
    static flushErrors(){
        let errors = document.querySelectorAll(".an-error");
        if(errors != null){
            errors.forEach(error => {
                error.remove();
            });
        }
    }


    /**
     * Fill The form with (SAVE BUTTON)
     */
    static fill(){
        if(document.getElementById("an-save") == null){
            this.createSaveBtn();
        }
    }

    /**
     * Reset the form to its defaults, then add save button
     */
    static flushThenFill(){
        this.flush();
        this.fill();
    }

    
}

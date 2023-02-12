import { Note } from './note.js';
import { NoteController } from './noteController.js';

export class NotesForm{

    static title = document.getElementById("an-title");
    static content = document.getElementById("an-content");
    static important = document.getElementById("an-important");

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

/**
 * Remove Previous Errors on each click
 * update bg-danger on update button
 */



class Notes{
    constructor(container){
        this.container = container;
    }
}

class Note{

    constructor(id, title, content, important){
        this.id = id;
        this.title = title;
        this.content = content;
        this.important = important;
    }
}


class NotesForm{

    static title = document.getElementById("an-title");
    static content = document.getElementById("an-content");
    static important = document.getElementById("an-important");


    static getBtn(btn){
        return document.getElementById(`an-${btn}`);
    }

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

    static createBtn(btn){
        const button = document.createElement("button");
        button.setAttribute("id", `an-${btn}`);
        button.setAttribute("class", "btn btn-primary mt-2");
        button.innerText = btn;
        document.getElementById("an-check").after(button);
        return document.getElementById(`an-${btn}`);
    }

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


    static flushErrors(){
        let errors = document.querySelectorAll(".an-error");
        if(errors != null){
            errors.forEach(error => {
                error.remove();
            });
        }
    }



    static fill(){
        this.createSaveBtn();
    }

    static flushThenFill(){
        this.flush();
        this.fill();
    }

    
}

class NoteController{

    constructor(note){
        this.note = note;
    }


    static index(){
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
            localStorage.setItem(title, this.note.content);
            this.render(this.note);
        }
    }


    static updateView(content, content_id, important = false){
        document.getElementById(content_id).children[0].innerText = content;
        if(important){
            document.getElementById(content_id).previousSibling.children[0].classList.add("bg-danger");
            document.getElementById(content_id).previousSibling.children[0].classList.add("text-light");
        }
    }


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
        const item = localStorage.getItem(title);
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
        const updateBtn = document.createElement("button");
        updateBtn.setAttribute("id", "an-update");
        updateBtn.setAttribute("class", "btn btn-danger mt-2 mx-2");
        updateBtn.innerText = "Update";

        const saveBtn = document.getElementById("an-save");
        if(saveBtn != null){
            saveBtn.after(updateBtn);
            saveBtn.remove();

            const cancel = document.createElement("button");
            cancel.setAttribute("id", "an-cancel");
            cancel.setAttribute("class", "btn btn-primary mt-2 mx-2");
            cancel.innerText = "Cancel";
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
        document.getElementById("an-update").addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if(NotesForm.important.checked){
                    NoteController.updateView(content.value, edit.previousSibling.getAttribute("aria-controls"), true);
                    // If not already important
                    if(! title.includes("imp__")){
                        // Remove not important item
                        localStorage.removeItem(title);
                        title = 'an-imp__' + title.slice(3);
                    }
                    NotesForm.flushThenFill();
                }
                if(content.value != item){ // Content Updated
                    NoteController.updateView(content.value, edit.previousSibling.getAttribute("aria-controls"));
                    NotesForm.flushThenFill();
                }
                localStorage.setItem(title, content.value);
                
                
        }); 
    }


    static delete(deleteb){
        NotesForm.flushErrors();
        if(deleteb.previousSibling.previousSibling.classList.contains("bg-danger")){
            localStorage.removeItem(`an-imp__${deleteb.parentElement.innerText}`);
        }else{
            localStorage.removeItem(`an-${deleteb.parentElement.innerText}`);
        }
        deleteb.parentElement.parentElement.remove();
        NotesForm.flush();
    }

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



    createUDButtons(id = null){
        const edit = document.createElement("i");
        edit.setAttribute("class", "bi bi-pencil-square an-btn an-update an-icon btn btn-primary m-2");
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


    removePreviousErrors(){
        let errors = document.querySelectorAll(".an-error");
        if(errors != null){
            errors.forEach(error => {
                error.remove();
            });
        }
    }
}

class Validator{


    errors = {
        title: [],
        content: []
    };

    validateContent(content){
        if(content == "" || content == null){
            this.errors.content.push("* Content Cannot be Empty");
        }

        return this.errors;
    }

    
    validate(note){
        this.errors.title = [];
        this.errors.content = [];
        if(! this.unique(`an-${note.title.trimEnd()}`) || ! this.unique(`an-imp__${note.title.trimEnd()}`)){
            this.errors.title.push(`* ${note.title} Already Exists`);
        }

        if(note.title == "" || note.title == null){
            this.errors.title.push(`* Title Cannot Be Empty`);
        }

        if(note.title.length > 100){
            this.errors.title.push("* Title Must Be Less Than 100 Characters");
        }

        if(note.content == "" || note.content == null){
            this.errors.content.push("* Content Cannot be Empty");
        }

        return this.errors;
    }


    unique(title){
        if(localStorage.getItem(title) == null){
            return true;
        }
        return false;
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
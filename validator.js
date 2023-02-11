import { NoteModel } from './noteModel.js';
export class Validator{
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
        if(NoteModel.get(title) == null){
            return true;
        }
        return false;
    }

}
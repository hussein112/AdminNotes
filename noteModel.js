export class NoteModel{

    static add(title, content){
        localStorage.setItem(title, content);
    }

    static get(title){
        return localStorage.getItem(title);
    }

    static delete(title){
        localStorage.removeItem(title);
    }
}
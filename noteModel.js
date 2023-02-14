export class NoteModel{

    /**
     * Add a Note Object to local storage
     * 
     * @param {Note} note 
     * @returns {void}
     */
    static add(title, content){
        localStorage.setItem(title.trimEnd(), content.trimEnd());
    }

    /**
     * Get a note object from local storage
     * 
     * @param {String} title
     * @returns {String} Content
     */
    static get(title){
        return localStorage.getItem(title);
    }

    /**
     * Delete a Note Object from local Storage
     * 
     * @param {String} title 
     */
    static delete(title){
        localStorage.removeItem(title);
    }
}
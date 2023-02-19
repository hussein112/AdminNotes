import { NoteController } from './noteController.js'; 

window.onload = function(){
    NoteController.index();
    loadCss();
}

function loadCss () {
    var ss = document.styleSheets;
    for (var i = 0, max = ss.length; i < max; i++) {
        if (ss[i].href.includes("https://cdn.jsdelivr.net/npm/bootstrap-icons"))
            return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css";

    document.getElementsByTagName("head")[0].appendChild(link);
}
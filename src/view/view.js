/*
 * Displays the Wodz objects in HTML format.
 */
export class WodzDisplayer {
    constructor() {
        /* The Wod HTML object list. */
        this.wodzHTML = [];
    }
    /* Get data from adapter. */
    prepareData(data) {
        for (let wod of data) {
            this.wodzHTML.push(new WodHTML(wod));
        }
    }
    /* Initialize events for html components. */
    initEvents() {
        for (let wodHTML of this.wodzHTML) {
            wodHTML.initEvents();
        }
    }
    /* Generate the HTML page for wodz data and publish in document. */
    generateHTML() {
        let html = "";
        /* even/odd boolean for Wod CSS class. */
        let even = false;
        for (let wodHTML of this.wodzHTML) {
            wodHTML.even = even;
            html += wodHTML.html();
            even = !even;
        }
        let wodDiv = document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        if (null != wodDiv) {
            wodDiv.innerHTML = html;
        }
    }
    /* Display the wod data in the HTML page. */
    display(data) {
        this.prepareData(data);
        this.generateHTML();
        this.initEvents();
    }
}
/* The wodz div id. */
WodzDisplayer.WODZ_DIV_ID = "wodz_page";
class BlockHTML {
    constructor(block) {
        this.block = block;
    }
    html() {
        let str = "";
        str += "<h3>" + this.block.name + "</h3>";
        str += "<ul class=\"ex_ul\">";
        this.block.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += new ExerciseHTML(ex).html();
            str += "</li>";
        });
        str += "</ul>";
        return str;
    }
}
class ExerciseHTML {
    constructor(exercise) {
        this.exercise = exercise;
    }
    html() {
        let str = "<span class=\"exercise\">";
        str += "<span class=\"ex_repeat\">" + this.exercise.repeat + "</span>";
        str += "<span class=\"ex_name\">" + this.exercise.name + "</span>";
        str += "</span>";
        return str;
    }
}
class StructureHTML {
    constructor(structure) {
        this.structure = structure;
    }
    html() {
        let str = "<div class=\"structure\">";
        str += "<h3>WOD</h3>";
        str += "<div class=\"structure_content\">";
        str += "<table>";
        this.structure.groups.forEach(group => {
            str += "<tr>";
            str += new GroupHTML(group).html();
            str += "</tr>";
        });
        str += "</table>";
        str += "</div></div>";
        return str;
    }
}
class GroupHTML {
    constructor(group) {
        this.group = group;
    }
    html() {
        let str = "";
        str += "<th>" + this.group.repeat + "</th>";
        str += "<td>";
        this.group.blocks.forEach(block => {
            str += "<p>";
            str += block.name;
            str += "</p>";
        });
        str += "</td>";
        return str;
    }
}
class WodHTML {
    constructor(wod) {
        this.even = true;
        this.display = false;
        this.htmlId = "wod_" + ++WodHTML.lastId;
        this.eventId = "wod_event_" + this.htmlId;
        this.wod = wod;
    }
    initEvents() {
        let evElem = document.getElementById(this.eventId);
        console.log(evElem);
        if (null != evElem) {
            evElem.addEventListener("click", (e) => this.switchDisplay());
        }
    }
    /* Switches the display boolean and refresh the html document. */
    switchDisplay() {
        this.display = !this.display;
        let elem = document.getElementById(this.htmlId);
        if (null != elem) {
            elem.innerHTML = this.displayWodContent();
        }
    }
    displayWodContent() {
        let str = "";
        if (this.display) {
            this.wod.blocks.forEach(block => {
                str += new BlockHTML(block).html();
            });
            if (null != this.wod.structure) {
                str += new StructureHTML(this.wod.structure).html();
            }
        }
        return str;
    }
    html() {
        let str = "<div class=\"wod\">";
        str += this.even ? "<h2 class=\"even\"" : "<h2 class=\"odd\"";
        str += " id=\"" + this.eventId + "\">" + this.wod.name + "</h2>";
        str += "<div class=\"wod_content\" id=\"" + this.htmlId + "\">";
        str += this.displayWodContent();
        str += "</div>";
        str += "</div>";
        return str;
    }
}
WodHTML.lastId = 0;

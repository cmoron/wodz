import { WodAdapter } from "../adapter/adapter.js";
export class WodzDisplayer {
    constructor() {
        this.wodzHTML = [];
    }
    prepareData(data) {
        let adapter = new WodAdapter(data);
        for (let wod of adapter.parseData()) {
            this.wodzHTML.push(new WodHTML(wod));
        }
    }
    /*
     * Display the wod data in the HTML page.
     */
    display() {
        let html = "";
        let even = false;
        for (let wodHTML of this.wodzHTML) {
            wodHTML.even = even;
            html += wodHTML.toString();
            even = !even;
        }
        let wodDiv = document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        if (null != wodDiv) {
            wodDiv.innerHTML = html;
        }
    }
    initEvents() {
        for (let wodHTML of this.wodzHTML) {
            wodHTML.initEvents();
        }
    }
}
WodzDisplayer.WODZ_DIV_ID = "wodz_page";
class BlockHTML {
    constructor(block) {
        this.block = block;
    }
    toString() {
        let str = "";
        str += "<h3>" + this.block.name + "</h3>";
        str += "<ul class=\"ex_ul\">";
        this.block.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += new ExerciseHTML(ex).toString();
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
    toString() {
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
    toString() {
        let str = "<div class=\"structure\">";
        str += "<h3>WOD</h3>";
        str += "<div class=\"structure_content\">";
        str += "<table>";
        this.structure.groups.forEach(group => {
            str += "<tr>";
            str += new GroupHTML(group).toString();
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
    toString() {
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
        this.display = false;
        this.even = true;
        this.id = "wod_" + ++WodHTML.lastId;
        this.eventId = "wod_event_" + this.id;
        this.wod = wod;
    }
    initEvents() {
        let evElem = document.getElementById(this.eventId);
        console.log(evElem);
        if (null != evElem) {
            evElem.addEventListener("click", (e) => this.switchDisplay());
        }
    }
    switchDisplay() {
        this.display = !this.display;
        let elem = document.getElementById(this.id);
        if (null != elem) {
            elem.innerHTML = this.displayWodContent();
        }
    }
    displayWodContent() {
        let str = "";
        if (this.display) {
            this.wod.blocks.forEach(block => {
                str += new BlockHTML(block).toString();
            });
            if (null != this.wod.structure) {
                str += new StructureHTML(this.wod.structure).toString();
            }
        }
        return str;
    }
    toString() {
        let str = "<div class=\"wod\">";
        str += this.even ? "<h2 class=\"even\"" : "<h2 class=\"odd\"";
        str += " id=\"" + this.eventId + "\">" + this.wod.name + "</h2>";
        str += "<div class=\"wod_content\" id=\"" + this.id + "\">";
        str += this.displayWodContent();
        str += "</div>";
        str += "</div>";
        return str;
    }
}
WodHTML.lastId = 0;

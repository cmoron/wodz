import {
    Db,
    Wod,
    Block,
    Exercise,
    Structure,
    Group
} from "../models/models.js";
import { WodAdapter } from "../adapter/adapter.js";

export class WodzDisplayer {

    private static readonly WODZ_DIV_ID = "wodz_page";
    wodzHTML: WodHTML[] = [];

    public prepareData(data: Db) {
        let adapter: WodAdapter = new WodAdapter(data);

        for (let wod of adapter.parseData()) {
            this.wodzHTML.push(new WodHTML(wod));
        }
    }

    /*
     * Display the wod data in the HTML page.
     */
    public display() {

        let html = "";
        let even: boolean = false;

        for (let wodHTML of this.wodzHTML) {
            wodHTML.even = even;
            html += wodHTML.toString();
            even = !even;
        }

        let wodDiv= document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        if (null != wodDiv) {
            wodDiv.innerHTML = html;
        }
    }

    public initEvents() {
        for (let wodHTML of this.wodzHTML) {
            wodHTML.initEvents();
        }
    }
}

class BlockHTML {
    block: Block;

    constructor(block: Block) {
        this.block = block;
    }

    toString(): string {
        let str = "";
        str += "<h3>" + this.block.name + "</h3>";

        str += "<ul class=\"ex_ul\">"
        this.block.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += new ExerciseHTML(ex).toString();
            str += "</li>"
        });
        str += "</ul>"

        return str;
    }
}

class ExerciseHTML {
    exercise: Exercise;

    constructor(exercise: Exercise) {
        this.exercise = exercise;
    }

    toString(): string {
        let str = "<span class=\"exercise\">";
        str += "<span class=\"ex_repeat\">" + this.exercise.repeat + "</span>";
        str += "<span class=\"ex_name\">" + this.exercise.name + "</span>";
        str += "</span>";
        return str;
    }
}

class StructureHTML {
    structure: Structure;

    constructor(structure: Structure) {
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
    group: Group;

    constructor(group: Group) {
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

    public static lastId: number = 0;
    id: string;
    eventId: string;
    wod: Wod;
    display: boolean = false;
    even: boolean = true;

    constructor(wod: Wod) {
        this.id = "wod_" + ++WodHTML.lastId;
        this.eventId = "wod_event_" + this.id;
        this.wod = wod;
    }

    initEvents() {
        let evElem = document.getElementById(this.eventId);
        console.log(evElem);
        if (null != evElem) {
            evElem.addEventListener("click", (e:Event) => this.switchDisplay());
        }
    }

    switchDisplay() {
        this.display = !this.display;

        let elem = document.getElementById(this.id);
        if (null != elem) {
            elem.innerHTML = this.displayWodContent();
        }
    }

    private displayWodContent(): string {
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

    toString(): string {
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

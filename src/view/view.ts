import {Db, Wod, Block, Exercise, Structure, Group} from "../models/models.js";

/*
 * Displays the Wodz objects in HTML format.
 */
export class WodzDisplayer {

    /* The wodz div id. */
    private static readonly WODZ_DIV_ID = "wodz_page";

    /* The Wod HTML object list. */
    private wodzHTML: WodHTML[] = [];

    /* Get data from adapter. */
    private prepareData(data: Wod[]) {
        for (let wod of data) {
            this.wodzHTML.push(new WodHTML(wod));
        }
    }

    /* Initialize events for html components. */
    private initEvents() {
        for (let wodHTML of this.wodzHTML) {
            wodHTML.initEvents();
        }
    }

    /* Generate the HTML page for wodz data and publish in document. */
    private generateHTML() {
        let html = "";

        /* even/odd boolean for Wod CSS class. */
        let even: boolean = false;

        for (let wodHTML of this.wodzHTML) {
            wodHTML.even = even;
            html += wodHTML.html();
            even = !even;
        }

        let wodDiv= document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        if (null != wodDiv) {
            wodDiv.innerHTML = html;
        }
    }

    /* Display the wod data in the HTML page. */
    public display(data: Wod[]) {
        this.prepareData(data);
        this.generateHTML();
        this.initEvents();
    }

}

class BlockHTML {
    private block: Block;

    constructor(block: Block) {
        this.block = block;
    }

    html(): string {
        let str = "";
        str += "<h3>" + this.block.name + "</h3>";

        str += "<ul class=\"ex_ul\">"
        this.block.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += new ExerciseHTML(ex).html();
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

    html(): string {
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

    public html(): string {
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
    group: Group;

    constructor(group: Group) {
        this.group = group;
    }

    public html(): string {
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

    public even: boolean = true;
    private wod: Wod;
    private static lastId: number = 0;
    private htmlId: string;
    private eventId: string;
    private display: boolean = false;

    constructor(wod: Wod) {
        this.htmlId = "wod_" + ++WodHTML.lastId;
        this.eventId = "wod_event_" + this.htmlId;
        this.wod = wod;
    }

    public initEvents() {
        let evElem = document.getElementById(this.eventId);
        console.log(evElem);
        if (null != evElem) {
            evElem.addEventListener("click", (e:Event) => this.switchDisplay());
        }
    }

    /* Switches the display boolean and refresh the html document. */
    private switchDisplay() {
        this.display = !this.display;

        let elem = document.getElementById(this.htmlId);
        if (null != elem) {
            elem.innerHTML = this.displayWodContent();
        }
    }

    private displayWodContent(): string {
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

    public html(): string {
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

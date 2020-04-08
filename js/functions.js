class JSONReader {
    constructor(fileName) {
        this.fileName = fileName;
    }
    read(callback) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(app.getWodzDisplayer(), xmlhttp.responseText);
            }
        };
        xmlhttp.send(null);
    }
}
class Wod {
    constructor(name, blocks, structure) {
        this.display = false;
        this.id = "wod_" + ++Wod.lastId;
        this.eventId = "wod_event_" + this.id;
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }
    initEvents() {
        let evElem = document.getElementById(this.eventId);
        evElem.addEventListener("click", (e) => this.switchDisplay());
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
            this.blocks.forEach(block => {
                str += block.toString();
            });
            if (null != this.structure) {
                str += this.structure.toString();
            }
        }
        return str;
    }
    toString() {
        let str = "<div class=\"wod\">";
        str = "<h2 id=\"" + this.eventId + "\">" + this.name + "</h2>";
        str += "<div class=\"wod_content\" id=\"" + this.id + "\">";
        str += this.displayWodContent();
        str += "</div>";
        str += "</div>";
        return str;
    }
}
Wod.lastId = 0;
class Structure {
    constructor(groups) {
        this.groups = new Array();
        this.groups = groups;
    }
    toString() {
        let str = "<div class=\"structure\">";
        str += "<h3>WOD</h3>";
        str += "<div class=\"structure_content\">";
        str += "<table>";
        this.groups.forEach(group => {
            str += "<tr>";
            str += group.toString();
            str += "</tr>";
        });
        str += "</table>";
        str += "</div></div>";
        return str;
    }
}
class Group {
    constructor(repeat, blocks) {
        this.blocks = new Array();
        this.repeat = repeat;
        this.blocks = blocks;
    }
    toString() {
        let str = "";
        str += "<th>" + this.repeat + "</th>";
        str += "<td>";
        this.blocks.forEach(block => {
            str += "<p>";
            str += block.name;
            str += "</p>";
        });
        str += "</td>";
        return str;
    }
}
class Block {
    constructor(name, exercises) {
        this.name = name;
        this.exercises = exercises;
    }
    toString() {
        let str = "";
        str += "<h3>" + this.name + "</h3>";
        str += "<ul class=\"ex_ul\">";
        this.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += ex.toString();
            str += "</li>";
        });
        str += "</ul>";
        return str;
    }
}
class Exercise {
    constructor(name, repetition) {
        this.name = name;
        this.repetition = repetition;
    }
    toString() {
        let str = "<span class=\"exercise\">";
        str += "<span class=\"ex_repeat\">" + this.repetition + "</span>";
        str += "<span class=\"ex_name\">" + this.name + "</span>";
        str += "</span>";
        return str;
    }
}
class WodzDisplayer {
    constructor() {
        this.wodz = new Array();
        this.exercises = new Array();
    }
    prepareData(data) {
        data.wodz.forEach(wod => {
            this.wodz.push(this.parseWod(wod));
        });
    }
    parseWod(wod) {
        let wodName = wod.wod_name;
        let blocks = new Map();
        let groups = new Array();
        let structure;
        if (null != wod.wod_blocks) {
            wod.wod_blocks.forEach(block => {
                blocks.set(block.wod_block_id, this.parseBlock(block));
            });
        }
        if (null != wod.wod_structure) {
            wod.wod_structure.forEach(group => {
                let groupBlocks = new Array();
                group.section_blocks.forEach(groupId => {
                    groupBlocks.push(blocks.get(groupId));
                });
                groups.push(new Group(group.section_repeat, groupBlocks));
            });
            structure = new Structure(groups);
        }
        return new Wod(wodName, blocks, structure);
    }
    parseBlock(block) {
        let blockName = block.wod_block_name;
        let blockExercises = new Array();
        if (null != block.wod_block_ex) {
            block.wod_block_ex.forEach(exercise => {
                blockExercises.push(this.parseExercise(exercise));
            });
        }
        return new Block(blockName, blockExercises);
    }
    parseExercise(exercise) {
        return new Exercise(exercise.ex_name, exercise.ex_rep);
    }
    /*
     * Display the wod data in the HTML page.
     */
    display() {
        let wodDiv = document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        wodDiv.innerHTML = this.generateWodzListHTML();
    }
    /*
     * Generate the HTML structure for the wodz data.
     */
    generateWodzListHTML() {
        let wodzHTML = "";
        this.wodz.forEach(wod => {
            wodzHTML += wod.toString();
        });
        return wodzHTML;
    }
    initEvents() {
        this.wodz.forEach(wod => {
            wod.initEvents();
        });
    }
}
WodzDisplayer.WODZ_DIV_ID = "wodz_page";
class App {
    constructor() {
        this.wodzDisplayer = new WodzDisplayer();
    }
    main() {
        this.readData();
    }
    getWodzDisplayer() {
        return this.wodzDisplayer;
    }
    /*
     * Read wodz object from json file.
     */
    readData() {
        let reader = new JSONReader(App.DB_FILE_PATH);
        reader.read(function (wd, response) {
            let data = JSON.parse(response);
            wd.prepareData(data);
            wd.display();
            wd.initEvents();
        });
    }
}
App.DB_FILE_PATH = "db/wodz.json";
/*
 * Program entry point.
 */
let app = new App();
app.main();

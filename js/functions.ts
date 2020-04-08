class JSONReader {
    fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    read(callback: (wd: WodzDisplayer, response: string) => void) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(app.getWodzDisplayer(), xmlhttp.responseText);
            }
        }
        xmlhttp.send(null);
    }
}

class Wod {
    public static lastId: number = 0;
    id: string;
    name: string;
    structure : Structure;
    blocks : Map<number, Block>;
    display: boolean = false;

    constructor(name: string, blocks: Map<number, Block>, structure: Structure) {
        this.id = "wod_" + ++Wod.lastId;
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }

    initEvents() {
        let elem = document.getElementById(this.id);
        elem.addEventListener("click", (e:Event) => this.switchDisplay());
    }

    switchDisplay() {
        this.display = !this.display;

        let elem = document.getElementById(this.id);
        if (null != elem) {
            elem.innerHTML = this.displayWodContent();
        }
    }

    displayWodContent(): string {
        let str = "<h2>" + this.name + "</h2>";
        if (this.display) {
            str += "<div class=\"wod_content\">";
            this.blocks.forEach(block => {
                str += block.toString();
            });

            if (null != this.structure) {
                str += this.structure.toString();
            }
            str += "</div>";
        }

        return str;
    }

    toString(): string {
        let str = "<div class=\"wod\" id=\"" + this.id + "\">";
        str += this.displayWodContent();
        str += "</div>";
        return str;
    }
}

class Structure {
    groups: Array<Group> = new Array<Group>();

    constructor(groups: Array<Group>) {
        this.groups = groups;
    }

    toString(): string {
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
    repeat: number;
    blocks: Array<Block> = new Array<Block>();

    constructor(repeat: number, blocks: Array<Block>) {
        this.repeat = repeat;
        this.blocks = blocks;
    }

    toString(): string {
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
    name: string;
    exercises: Array<Exercise>;

    constructor(name: string, exercises: Array<Exercise>) {
        this.name = name;
        this.exercises = exercises;
    }

    toString() {
        let str = "";
        str += "<h3>" + this.name + "</h3>";

        str += "<ul class=\"ex_ul\">"
        this.exercises.forEach(ex => {
            str += "<li class=\"ex_li\">";
            str += ex.toString();
            str += "</li>"
        });
        str += "</ul>"

        return str;
    }
}

class Exercise {
    name: string;
    repetition: string;

    constructor(name: string, repetition: string) {
        this.name = name;
        this.repetition = repetition;
    }

    toString(): string {
        let str = "<span class=\"exercise\">";
        str += "<span class=\"ex_repeat\">" + this.repetition + "</span>";
        str += "<span class=\"ex_name\">" + this.name + "</span>";
        str += "</span>";
        return str;
    }
}

class WodzDisplayer {

    private static readonly WODZ_DIV_ID = "wodz_page";
    private wodz: Array<Wod> = new Array<Wod>();
    private exercises: Array<Exercise> = new Array<Exercise>();

    public prepareData(data) {
        data.wodz.forEach(wod => {
            this.wodz.push(this.parseWod(wod));
        });
    }

    private parseWod(wod): Wod {
        let wodName: string = wod.wod_name;
        let blocks: Map<number, Block> = new Map<number, Block>();
        let groups: Array<Group> = new Array<Group>();
        let structure: Structure;

        if (null != wod.wod_blocks) {
            wod.wod_blocks.forEach(block => {
                blocks.set(block.wod_block_id, this.parseBlock(block));
            });
        }

        if (null != wod.wod_structure) {
            wod.wod_structure.forEach(group => {
                let groupBlocks: Array<Block> = new Array<Block>();
                group.section_blocks.forEach(groupId => {
                    groupBlocks.push(blocks.get(groupId));
                });

                groups.push(new Group(group.section_repeat, groupBlocks));
            });
            structure = new Structure(groups);
        }

        return new Wod(wodName, blocks, structure);
    }

    private parseBlock(block): Block {
        let blockName: string = block.wod_block_name;
        let blockExercises: Array<Exercise> = new Array<Exercise>();

        if (null != block.wod_block_ex) {
            block.wod_block_ex.forEach(exercise => {
                blockExercises.push(this.parseExercise(exercise));
            });
        }

        return new Block(blockName, blockExercises);
    }

    private parseExercise(exercise): Exercise {
        return new Exercise(exercise.ex_name, exercise.ex_rep);
    }

    /*
     * Display the wod data in the HTML page.
     */
    public display() {
        let wodDiv: Element = document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        wodDiv.innerHTML = this.generateWodzListHTML();
    }

    /*
     * Generate the HTML structure for the wodz data.
     */
    private generateWodzListHTML(): string {
        let wodzHTML: string = "";
        this.wodz.forEach(wod => {
            wodzHTML += wod.toString();
        });

        return wodzHTML;
    }

    public initEvents() {
        this.wodz.forEach(wod => {
            wod.initEvents();
        });
    }
}

class App {

    private static readonly DB_FILE_PATH = "db/wodz.json";
    private wodzDisplayer: WodzDisplayer = new WodzDisplayer();

    public main() {
        this.readData();
    }

    public getWodzDisplayer(): WodzDisplayer {
        return this.wodzDisplayer;
    }

    /*
     * Read wodz object from json file.
     */
    private readData() {
        let reader: JSONReader = new JSONReader(App.DB_FILE_PATH);

        reader.read(function(wd: WodzDisplayer, response: string) {
            let data = JSON.parse(response);
            wd.prepareData(data);
            wd.display();
            wd.initEvents();
        });
    }
}

/*
 * Program entry point.
 */
let app: App = new App();
app.main();

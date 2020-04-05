var JSONReader = /** @class */ (function () {
    function JSONReader(fileName) {
        this.fileName = fileName;
    }
    JSONReader.prototype.read = function (callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(app.getWodzDisplayer(), xmlhttp.responseText);
            }
        };
        xmlhttp.send(null);
    };
    return JSONReader;
}());
var Wod = /** @class */ (function () {
    function Wod(name, blocks) {
        this.name = name;
        this.blocks = blocks;
    }
    Wod.prototype.toString = function () {
        var str = "<span class=\"wod\">";
        str += "<h2>" + this.name + "</h2>";
        this.blocks.forEach(function (block) {
            str += block.toString();
        });
        str += "</span>";
        return str;
    };
    return Wod;
}());
var Structure = /** @class */ (function () {
    function Structure() {
        this.groups = new Array();
    }
    return Structure;
}());
var Group = /** @class */ (function () {
    function Group() {
        this.blocks = new Array();
    }
    return Group;
}());
var Block = /** @class */ (function () {
    function Block(name, exercises) {
        this.name = name;
        this.exercises = exercises;
    }
    Block.prototype.toString = function () {
        var str = "<span class=\"block\">";
        str += "<h3>" + this.name + "</h3>";
        str += "<ul>";
        this.exercises.forEach(function (ex) {
            str += "<li>";
            str += ex.toString();
            str += "</li>";
        });
        str += "</ul>";
        str += "</span>";
        return str;
    };
    return Block;
}());
var Exercise = /** @class */ (function () {
    function Exercise(name, repetition) {
        this.name = name;
        this.repetition = repetition;
    }
    Exercise.prototype.toString = function () {
        var str = "<span class=\"exercise\">";
        str += this.name;
        str += " (" + this.repetition + ")";
        str += "</span>";
        return str;
    };
    return Exercise;
}());
var WodzDisplayer = /** @class */ (function () {
    function WodzDisplayer() {
        this.wodz = new Array();
        this.exercises = new Array();
    }
    WodzDisplayer.prototype.prepareData = function (data) {
        var _this = this;
        data.wodz.forEach(function (wod) {
            _this.wodz.push(_this.parseWod(wod));
        });
    };
    WodzDisplayer.prototype.parseWod = function (wod) {
        var _this = this;
        var wodName = wod.wod_name;
        var blocks = new Array();
        console.log(wod.wod_blocks);
        if (null != wod.wod_blocks) {
            wod.wod_blocks.forEach(function (block) {
                blocks.push(_this.parseBlock(block));
            });
        }
        return new Wod(wodName, blocks);
    };
    WodzDisplayer.prototype.parseBlock = function (block) {
        var _this = this;
        var blockName = block.wod_block_name;
        var blockExercises = new Array();
        if (null != block.wod_block_ex) {
            block.wod_block_ex.forEach(function (exercise) {
                blockExercises.push(_this.parseExercise(exercise));
            });
        }
        return new Block(blockName, blockExercises);
    };
    WodzDisplayer.prototype.parseExercise = function (exercise) {
        return new Exercise(exercise.ex_name, exercise.ex_rep);
    };
    /*
     * Display the wod data in the HTML page.
     */
    WodzDisplayer.prototype.display = function () {
        var wodDiv = document.getElementById(WodzDisplayer.WODZ_DIV_ID);
        wodDiv.innerHTML = this.generateWodzListHTML();
    };
    /*
     * Generate the HTML structure for the wodz data.
     */
    WodzDisplayer.prototype.generateWodzListHTML = function () {
        var wodzHTML = "";
        this.wodz.forEach(function (wod) {
            wodzHTML += wod.toString();
        });
        return wodzHTML;
    };
    WodzDisplayer.WODZ_DIV_ID = "wodz_page";
    return WodzDisplayer;
}());
var App = /** @class */ (function () {
    function App() {
        this.wodzDisplayer = new WodzDisplayer();
    }
    App.prototype.main = function () {
        this.readData();
    };
    App.prototype.getWodzDisplayer = function () {
        return this.wodzDisplayer;
    };
    /*
     * Read wodz object from json file.
     */
    App.prototype.readData = function () {
        var reader = new JSONReader(App.DB_FILE_PATH);
        reader.read(function (wd, response) {
            var data = JSON.parse(response);
            wd.prepareData(data);
            wd.display();
        });
    };
    App.DB_FILE_PATH = "db/wodz.json";
    return App;
}());
/*
 * Program entry point.
 */
var app = new App();
app.main();

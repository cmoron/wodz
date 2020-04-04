wodz = function() {
    import * as data from 'db/wodz.json';

    const WODZ_DIV_ID = "wodz_page";
    //var data = null;
    var blockMaps = null;

    /*
     * Read wodz object from json file.
     */
    function readData() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                prepareData();
                display();
            }
        };
        xmlhttp.open("GET", "db/wodz.json", true);
        xmlhttp.send();
    }

    function prepareData() {
        // We need objects and classes !!!!
    }

    /*
     * Display the wod data in the HTML page.
     */
    function display() {

        var wodDiv = document.getElementById(WODZ_DIV_ID);
        wodDiv.innerHTML = generateWodzListHTML();
    }

    /*
     * Generate the HTML structure for the wodz data.
     */
    function generateWodzListHTML() {
        var wodzHTML = "";
        data.wodz.forEach(wod => {
            wodzHTML += generateWodHTML(wod);
        });

        return wodzHTML;
    }

    /*
     * Generate the HTML structure for a WOD instance.
     */
    function generateWodHTML(wod) {
        wodHTML = "";
        wodHTML += "<h2>";
        wodHTML += wod.wod_name;
        wodHTML += "</h2>";

        if (null != wod.wod_structure) {
            wodHTML += generateWodStructure(wod.wod_structure);
        }

        if (null != wod.wod_blocks) {
            wod.wod_blocks.forEach(block => {
                wodHTML += generateBlockHTML(block);
            });
        }

        return wodHTML;
    }

    function generateWodStructure(structure) {
        structureHTML = "";

        structureHTML += "<ul>";
        structure.forEach(section => {
            structureHTML += "<li>";
            structureHTML += section.section_repeat + " * [";
            structureHTML += "]";
            structureHTML += "</li>";
        });
        structureHTML += "</ul>";

        return structureHTML;
    }

    function generateBlockHTML(block) {
        blockHTML = "";

        blockHTML += "<h3>";
        blockHTML += block.wod_block_name;
        blockHTML += "</h3>";
        blockHTML += "<ul>";
        if (null != block.wod_block_ex) {
            block.wod_block_ex.forEach(exercise => {
                blockHTML += "<li>";
                blockHTML += generateExerciseHTML(exercise);
                blockHTML += "</li>";
            });
        }
        blockHTML += "</ul>";

        return blockHTML;
    }

    function generateExerciseHTML(exercise) {
        exerciseHTML = "";
        exerciseHTML +=  exercise.ex_name + " (" + exercise.ex_rep + ")";
        return exerciseHTML;
    }

    function main() {
        readData();
    }

    main();
}();

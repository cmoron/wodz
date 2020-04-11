import { WodAdapter } from "./models/models.js";
class JSONReader {
    constructor(fileName, app) {
        this.fileName = fileName;
        this.app = app;
    }
    read(callback) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = () => {
            console.log(this.fileName);
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(this.app.getWodzDisplayer(), xmlhttp.responseText);
            }
        };
        xmlhttp.send(null);
    }
}
class WodzDisplayer {
    prepareData(data) {
        let adapter = new WodAdapter(data);
        let wodz = adapter.parseData();
        console.log(wodz);
        for (let wod of wodz) {
            console.log(wod.toString());
        }
    }
    /*
     * Display the wod data in the HTML page.
     */
    display() {
    }
    initEvents() {
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
        let reader = new JSONReader(App.DB_FILE_PATH, this);
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

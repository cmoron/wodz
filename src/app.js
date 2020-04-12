import { WodzDisplayer } from "./view/view.js";
class JSONReader {
    constructor(fileName) {
        this.fileName = fileName;
    }
    read(callback) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = () => {
            console.log(this.fileName);
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.send(null);
    }
}
class App {
    constructor() {
        this.wodzDisplayer = new WodzDisplayer();
    }
    init() {
        this.readData();
    }
    run(data) {
        this.wodzDisplayer.prepareData(data);
        this.wodzDisplayer.display();
        this.wodzDisplayer.initEvents();
    }
    /*
     * Read wodz object from json file.
     */
    readData() {
        let reader = new JSONReader(App.DB_FILE_PATH);
        reader.read((response) => {
            this.run(JSON.parse(response));
        });
    }
}
App.DB_FILE_PATH = "db/wodz.json";
/*
 * Program entry point.
 */
let app = new App();
app.init();

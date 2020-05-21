import { WodzAdapter } from "./adapter/adapter.js";
import { WodzDisplayer } from "./view/view.js";
/*
 * JSonReader class.
 * Creates the xmlhttp request to read json file data.
 * Send results to callback function.
 */
class JSONReader {
    constructor(fileName) {
        this.fileName = fileName;
    }
    read(callback) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.overrideMimeType("application/json");
        xmlhttp.open("GET", this.fileName, true);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4 && xmlhttp.status == 200) {
                // Reference to app instance.
                callback(xmlhttp.responseText);
            }
        };
        xmlhttp.send(null);
    }
}
/* The Wodz App. */
class App {
    constructor() {
        /* The displayer instance. */
        this.wodzDisplayer = new WodzDisplayer();
        /* The data adapter instance. */
        this.wodzAdapter = new WodzAdapter();
    }
    /* App entry point.
     * Reads wod data from server side json file.
     * Runs App on data response.
     */
    init() {
        let reader = new JSONReader(App.DB_FILE_PATH);
        reader.read((response) => {
            this.run(JSON.parse(response));
        });
    }
    /* Runs the app when data are loaded (see readData). */
    run(data) {
        this.wodzDisplayer.display(this.wodzAdapter.parseData(data));
    }
}
/* The server side json data path. */
App.DB_FILE_PATH = "db/wodz.json";
/* Program entry point. */
let app = new App();
app.init();

import { Db } from "./models/models.js";
import { WodzAdapter } from "./adapter/adapter.js";
import { WodzDisplayer } from "./view/view.js";

/*
 * JSonReader class.
 * Creates the xmlhttp request to read json file data from server.
 * Send results to callback function.
 */
class JSONReader {
    fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    read(callback: (response: string) => void) {
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

    /* The server side json data path. */
    private static readonly DB_FILE_PATH = "db/wodz.json";

    /* The displayer instance. */
    private wodzDisplayer: WodzDisplayer = new WodzDisplayer();

    /* The data adapter instance. */
    private wodzAdapter: WodzAdapter = new WodzAdapter();

    /* App entry point.
     * Reads wod data from server side json file.
     * Runs App on data response.
     */
    public init() {
        let reader: JSONReader = new JSONReader(App.DB_FILE_PATH);

        reader.read((response: string) => {
            this.run(JSON.parse(response));
        });
    }

    /* Runs the app when data are loaded (see readData). */
    private run(data: Db) {
        this.wodzDisplayer.display(this.wodzAdapter.parseData(data));
    }
}

/* Program entry point. */
let app: App = new App();
app.init();

import { Db } from "./models/models.js";
import { WodzDisplayer } from "./view/view.js";

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

    private static readonly DB_FILE_PATH = "db/wodz.json";
    private wodzDisplayer: WodzDisplayer = new WodzDisplayer();

    public init() {
        this.readData();
    }

    private run(data: Db) {
        this.wodzDisplayer.prepareData(data);
        this.wodzDisplayer.display();
        this.wodzDisplayer.initEvents();
    }

    /*
     * Read wodz object from json file.
     */
    private readData() {
        let reader: JSONReader = new JSONReader(App.DB_FILE_PATH);

        reader.read((response: string) => {
            this.run(JSON.parse(response));
        });
    }
}

/*
 * Program entry point.
 */
let app: App = new App();
app.init();

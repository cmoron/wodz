import { Db } from "./models/models.js";
import { WodAdapter } from "./models/models.js";
import { Wod } from "./models/models.js";

class JSONReader {
    fileName: string;
    app: App;

    constructor(fileName: string, app: App) {
        this.fileName = fileName;
        this.app = app;
    }

    read(callback: (wd: WodzDisplayer, response: string) => void) {
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

    private static readonly WODZ_DIV_ID = "wodz_page";

    public prepareData(data: Db) {
        let adapter: WodAdapter = new WodAdapter(data);
        let wodz: Wod[] = adapter.parseData();
        console.log(wodz);

        for(let wod of wodz) {
            console.log(wod.toString());
        }
    }

    /*
     * Display the wod data in the HTML page.
     */
    public display() {
    }

    public initEvents() {
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
        let reader: JSONReader = new JSONReader(App.DB_FILE_PATH, this);

        reader.read(function(wd: WodzDisplayer, response: string) {
            let data: Db = JSON.parse(response);
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

/*
 * Db interface.
 * Represents the database structure of the wodz app.
 */
export interface Db {

    /* The wodz list. */
    wodz: DbWod[];
}

/*
 * DbWod interface.
 * Represents the database structure of the Wod object.
 */
export interface DbWod {

    /* The wod name. */
    name: string;

    /* The wod blocks list. */
    blocks: DbBlock[];

    /* The wod structure. */
    structure: DbStructure;
}

/*
 * DbBlock interface.
 * Represents the database structure of the Block object.
 */
export interface DbBlock {

    /* The block id. */
    id: number;

    /* The block name. */
    name: string;

    /* The block exercises list. */
    exercises: DbExercise[];
}

/*
 * DbExercise interface.
 * Represents the database structure of the Exercise object.
 */
export interface DbExercise {

    /* The exercise name. */
    name: string;

    /* The exercise repeat. */
    repeat: string;
}

/*
 * DbStructure interface.
 * Represents the database structure of the Structure object.
 */
export interface DbStructure {

    /* The structure group list. */
    groups: DbGroup[];
}

/*
 * DbGroup interface.
 * Represents the database structure of the Group object.
 */
export interface DbGroup {

    /* The group repeat. */
    repeat: number;

    /* The group block list. */
    blocks: number[];
}

export class WodAdapter {

    data: Db;

    constructor(data: Db) {
        this.data = data;
    }

    public parseData(): Wod[] {
        let wodz: Wod[] = [];

        for(let dbWod of this.data.wodz) {
            wodz.push(this.parseWod(dbWod));
        }

        return wodz;
    }

    private parseWod(dbWod: DbWod): Wod {
        return new Wod(dbWod.name, this.parseBlocks(dbWod.blocks), this.parseStructure(dbWod.structure));
    }

    private parseBlocks(dbBlocks: DbBlock[]): Block[] {
        let blocks: Block[] = [];

        for(let dbBlock of dbBlocks) {
            blocks.push(new Block(dbBlock.id, dbBlock.name, this.parseExercises(dbBlock.exercises)));
        }

        return blocks;
    }

    private parseExercises(dbExercises: DbExercise[]): Exercise[] {
        let exercises: Exercise[] = [];

        for(let dbExercise of dbExercises) {
            exercises.push(new Exercise(dbExercise.name, dbExercise.repeat));
        }

        return exercises;
    }

    private parseStructure(dbStructure: DbStructure): Structure {
        return new Structure(this.parseGroups(dbStructure));
    }

    private parseGroups(dbStructure: DbStructure): Group[] {
        let groups: Group[] = [];

        for(let dbGroup of dbStructure.groups) {
            groups.push(new Group(dbGroup.repeat, dbGroup.blocks));
        }

        return groups;
    }
}

export class Exercise implements DbExercise {
    name: string;
    repeat: string;

    constructor(name: string, repeat: string) {
        this.name = name;
        this.repeat = repeat;
    }
}

export class Block implements DbBlock {
    id: number;
    name: string;
    exercises: Exercise[];

    constructor(id: number, name: string, exercises: Exercise[]) {
        this.id = id;
        this.name = name;
        this.exercises = exercises;
    }
}

export class Group implements DbGroup {
    repeat: number;
    blocks: number[];

    constructor(repeat: number, blocks: number[]) {
        this.repeat = repeat;
        this.blocks = blocks;
    }
}

export class Structure implements DbStructure {

    /* The structure group list. */
    groups: Group[];

    constructor(groups: Group[]) {
        this.groups = groups;
    }

    toString(): string {
        let str = "Structure object tostring : ";

        return str;
    }
}

export class Wod implements DbWod {

    /* The wod name. */
    name: string;

    /* The wod blocks list. */
    blocks: Block[];

    /* The wod structure. */
    structure: Structure;

    constructor(name: string, blocks: Block[], structure: Structure) {
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }

    toString(): string {
        let str = "Wod object tostring : ";

        str += this.name;
        str += this.structure.toString();

        return str;
    }
}

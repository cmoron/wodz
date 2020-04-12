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

export class Group {
    repeat: number;
    blocks: Block[];

    constructor(repeat: number, blocks: Block[]) {
        this.repeat = repeat;
        this.blocks = blocks;
    }
}

export class Structure {

    /* The structure group list. */
    groups: Group[];

    constructor(groups: Group[]) {
        this.groups = groups;
    }
}

export class Wod {

    /* The wod name. */
    name: string;

    /* The wod blocks list. */
    blocks: Map<number, Block>;

    /* The wod structure. */
    structure: Structure;

    constructor(name: string, blocks: Map<number, Block>, structure: Structure) {
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }
}

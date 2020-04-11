export class WodAdapter {
    constructor(data) {
        this.data = data;
    }
    parseData() {
        let wodz = [];
        for (let dbWod of this.data.wodz) {
            wodz.push(this.parseWod(dbWod));
        }
        return wodz;
    }
    parseWod(dbWod) {
        return new Wod(dbWod.name, this.parseBlocks(dbWod.blocks), this.parseStructure(dbWod.structure));
    }
    parseBlocks(dbBlocks) {
        let blocks = [];
        for (let dbBlock of dbBlocks) {
            blocks.push(new Block(dbBlock.id, dbBlock.name, this.parseExercises(dbBlock.exercises)));
        }
        return blocks;
    }
    parseExercises(dbExercises) {
        let exercises = [];
        for (let dbExercise of dbExercises) {
            exercises.push(new Exercise(dbExercise.name, dbExercise.repeat));
        }
        return exercises;
    }
    parseStructure(dbStructure) {
        return new Structure(this.parseGroups(dbStructure));
    }
    parseGroups(dbStructure) {
        let groups = [];
        for (let dbGroup of dbStructure.groups) {
            groups.push(new Group(dbGroup.repeat, dbGroup.blocks));
        }
        return groups;
    }
}
export class Exercise {
    constructor(name, repeat) {
        this.name = name;
        this.repeat = repeat;
    }
}
export class Block {
    constructor(id, name, exercises) {
        this.id = id;
        this.name = name;
        this.exercises = exercises;
    }
}
export class Group {
    constructor(repeat, blocks) {
        this.repeat = repeat;
        this.blocks = blocks;
    }
}
export class Structure {
    constructor(groups) {
        this.groups = groups;
    }
    toString() {
        let str = "Structure object tostring : ";
        return str;
    }
}
export class Wod {
    constructor(name, blocks, structure) {
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }
    toString() {
        let str = "Wod object tostring : ";
        str += this.name;
        str += this.structure.toString();
        return str;
    }
}

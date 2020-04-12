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
}
export class Wod {
    constructor(name, blocks, structure) {
        this.name = name;
        this.blocks = blocks;
        this.structure = structure;
    }
}

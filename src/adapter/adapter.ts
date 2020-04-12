import {
    Db,
    DbWod,
    DbBlock,
    DbExercise,
    DbStructure,
    DbGroup,
    Wod,
    Block,
    Exercise,
    Structure,
    Group
} from "../models/models.js";

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
        let blocks: Map<number, Block> = this.parseBlocks(dbWod.blocks);
        let structure: Structure = this.parseStructure(dbWod.structure, blocks);
        return new Wod(dbWod.name, blocks, structure);
    }

    private parseBlocks(dbBlocks: DbBlock[]): Map<number, Block> {
        let blocks: Map<number, Block> = new Map<number, Block>();

        for(let dbBlock of dbBlocks) {
            blocks.set(dbBlock.id, new Block(dbBlock.id, dbBlock.name, this.parseExercises(dbBlock.exercises)));
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

    private parseStructure(dbStructure: DbStructure, blocks: Map<number, Block>): Structure {
        return new Structure(this.parseGroups(dbStructure, blocks));
    }

    private parseGroups(dbStructure: DbStructure, blocks: Map<number, Block>): Group[] {
        let groups: Group[] = [];

        for(let dbGroup of dbStructure.groups) {
            let groupBlocks: Block[] = [];
            for (let blockId of dbGroup.blocks) {
                let b = blocks.get(blockId);
                if (null != b) {
                    groupBlocks.push(b);
                }
            }
            groups.push(new Group(dbGroup.repeat, groupBlocks));
        }

        return groups;
    }
}

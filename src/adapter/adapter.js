import { Wod, Block, Exercise, Structure, Group } from "../models/models.js";
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
        let blocks = this.parseBlocks(dbWod.blocks);
        let structure = this.parseStructure(dbWod.structure, blocks);
        return new Wod(dbWod.name, blocks, structure);
    }
    parseBlocks(dbBlocks) {
        let blocks = new Map();
        for (let dbBlock of dbBlocks) {
            blocks.set(dbBlock.id, new Block(dbBlock.id, dbBlock.name, this.parseExercises(dbBlock.exercises)));
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
    parseStructure(dbStructure, blocks) {
        return new Structure(this.parseGroups(dbStructure, blocks));
    }
    parseGroups(dbStructure, blocks) {
        let groups = [];
        for (let dbGroup of dbStructure.groups) {
            let groupBlocks = [];
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

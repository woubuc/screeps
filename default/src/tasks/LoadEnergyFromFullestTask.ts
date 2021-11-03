import { isOneOf } from '../utils';
import { LoadEnergyTask } from './LoadEnergyTask';

export class LoadEnergyFromFullestTask extends LoadEnergyTask {
	protected findEnergyStorage(): StructureStorage | null {
		let extensions: StructureStorage[] = this.creep.room
			.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_EXTENSION });

		let fullest = extensions.reduce((fullest, current) => {
			if (fullest == undefined) {
				return current;
			}

			if (current.store[RESOURCE_ENERGY] > fullest.store[RESOURCE_ENERGY]) {
				return current;
			} else if (current.store[RESOURCE_ENERGY] === fullest.store[RESOURCE_ENERGY] && current.pos.getRangeTo(this.creep) < fullest.pos.getRangeTo(this.creep)) {
				return current;
			} else {
				return fullest;
			}
		});

		if (fullest == undefined) {
			return null;
		}

		return fullest;
	}
}

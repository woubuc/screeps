import { Task } from './Task';
import { isOneOf } from '../utils';

export class LoadEnergyTask extends Task {
	public shouldStart(): boolean {
		return this.findEnergyStorage() != undefined;
	}

	public onStart(): void {
		this.creep.say('🔋 Load');
	}

	public run(): void {
		let target = this.findEnergyStorage();
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(target, { visualizePathStyle: { stroke: '#FDE68A' } });
		}

		if (this.creep.store.getFreeCapacity() === 0 || target.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}

	protected findEnergyStorage(): StructureStorage | null {
		return this.creep
			.pos
			.findClosestByPath(FIND_MY_STRUCTURES, {
				filter: (s) =>
					isOneOf(s.structureType, STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
					&& (s as StructureSpawn | StructureExtension).store[RESOURCE_ENERGY] > 5,
			});
	}
}

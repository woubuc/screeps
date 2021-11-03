import { Task } from './Task';
import { isOneOf } from './utils';

export class StoreEnergyTask extends Task {
	public shouldStart(): boolean {
		return this.creep.store[RESOURCE_ENERGY] > 0;
	}

	public onStart(): void {
		this.creep.say('🔋 Store');
	}

	public run(): void {
		let target = this.findStorageStructure();
		if (target == null) {
			return this.nextTask();
		}

		if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(target, { visualizePathStyle: { stroke: '#FEF08A' } });
		}

		if (this.creep.store[RESOURCE_ENERGY] === 0) {
			this.nextTask();
		}
	}

	private findStorageStructure(): Structure | null {
		return this.creep
			.pos
			.findClosestByPath(FIND_MY_STRUCTURES, {
				filter: (s) =>
					isOneOf(s.structureType, STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
					&& (s as StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY)! > 0,
			});
	}
}

import Task from './Task';
import { isOneOf } from '../utils';

export default class StoreEnergyTask extends Task {
	public override shouldStart(): boolean {
		return this.worker.creep.store[RESOURCE_ENERGY] > 0 && this.findStorageStructure() != null;
	}

	public override onStart(): void {
		this.worker.creep.say('🔋 Store');
	}

	public override run(): void {
		let target = this.findStorageStructure();
		if (target == null) {
			return this.nextTask();
		}

		if (this.worker.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		if (this.worker.creep.store[RESOURCE_ENERGY] === 0) {
			this.nextTask();
		}
	}

	protected findStorageStructure(): Structure | null {
		return this.worker.creep
			.pos
			.findClosestByPath(FIND_MY_STRUCTURES, {
				filter: (s) => {
					let isStorage = isOneOf(s.structureType, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER);
					if (!isStorage) {
						return false;
					}

					let capacity = (s as StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY) ?? 0;
					return capacity > 5;
				}
			});
	}
}

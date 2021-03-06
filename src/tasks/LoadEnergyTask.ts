import Task from './Task';
import { isOneOf } from '../utils';

export default class LoadEnergyTask extends Task {
	public override readonly say = '🔋 Load';

	public override shouldStart(): boolean {
		return this.findEnergyStorage() != undefined;
	}

	public override run(): void {
		let target = this.findEnergyStorage();
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.worker.creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		if (this.worker.creep.store.getFreeCapacity() === 0 || target.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}

	protected findEnergyStorage(): StructureStorage | null {
		return this.worker.findNearby(FIND_STRUCTURES, {
			filter: (s) =>
				isOneOf(s.structureType, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER)
				&& (s as StructureSpawn | StructureExtension).store[RESOURCE_ENERGY] > 5,
		});
	}
}

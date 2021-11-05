import { isOneOf } from '../utils';
import TargetingTask from './TargetingTask';

type Target = StructureSpawn | StructureExtension | StructureContainer | StructureTower;

export default class StoreEnergyTask extends TargetingTask<Target> {
	public override readonly say = '🔋 Store';

	public override shouldStart(): boolean {
		if (!super.shouldStart()) {
			return false;
		}

		if (this.worker.store[RESOURCE_ENERGY] === 0) {
			return false;
		}

		let target = this.findTarget();
		if (target === null) {
			return false;
		}

		return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
	}

	public override tryRun(target: Target): ScreepsReturnCode {
		return this.worker.creep.transfer(target, RESOURCE_ENERGY);
	}

	protected override shouldStop(target: Target): boolean {
		return this.worker.store[RESOURCE_ENERGY] === 0
			|| target.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
	}

	protected override findTarget(): Target | null {
		return this.worker.findNearby(FIND_MY_STRUCTURES, {
			filter: s =>
				isOneOf(s.structureType, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER)
				&& (s as StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY) > 5,
		}) as Target;
	}
}

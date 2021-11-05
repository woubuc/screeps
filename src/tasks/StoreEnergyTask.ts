import { isOneOf } from '../utils';
import TargetingTask from './TargetingTask';

type Target = StructureSpawn | StructureExtension | StructureContainer | StructureTower;

export default class StoreEnergyTask extends TargetingTask<Target> {
	public override readonly say = '🔋 Store';

	public override shouldStart(): boolean {
		return this.worker.store[RESOURCE_ENERGY] > 0 && super.shouldStart();
	}

	protected override shouldStartWithTarget(target: Target): boolean {
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
		return this.worker.findNearby(FIND_STRUCTURES, {
			filter: s =>
				isOneOf(s.structureType, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER, STRUCTURE_STORAGE)
				&& (s as StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY) > 5,
		}) as Target;
	}
}

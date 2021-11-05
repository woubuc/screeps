import TargetingTask from './TargetingTask';

export default class RepairTask extends TargetingTask<OwnedStructure> {
	public override readonly say = '🚧 repair';

	public override shouldStart(): boolean {
		return super.shouldStart() && this.worker.store.getFreeCapacity() === 0;
	}

	protected tryRun(target: OwnedStructure): ScreepsReturnCode {
		return this.worker.creep.repair(target);
	}

	protected shouldStop(target: OwnedStructure): boolean {
		return this.worker.creep.store[RESOURCE_ENERGY] === 0;
	}

	protected findTarget(): OwnedStructure | null {
		return this.worker.findNearby(FIND_MY_STRUCTURES, {
			filter: s => s.hits < s.hitsMax,
		});
	}
}

import TargetingTask from './TargetingTask';

export default class RepairTask extends TargetingTask<Structure> {
	public override readonly say = '🚧 repair';

	public override shouldStart(): boolean {
		return super.shouldStart() && this.worker.store.getFreeCapacity() === 0;
	}

	protected tryRun(target: Structure): ScreepsReturnCode {
		return this.worker.creep.repair(target);
	}

	protected shouldStop(target: Structure): boolean {
		return this.worker.creep.store[RESOURCE_ENERGY] === 0;
	}

	protected findTarget(): Structure | null {
		return this.worker.findNearby(FIND_MY_STRUCTURES, {
			filter: s => s.hits < s.hitsMax,
		});
	}
}

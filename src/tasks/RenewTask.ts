import TargetingTask from './TargetingTask';

export default class RenewTask extends TargetingTask<StructureSpawn> {
	public override readonly say = '⚡ Renew';

	public override shouldStart(): boolean {
		if (this.worker.creep.ticksToLive == undefined) {
			return false;
		}

		if (this.worker.hasDeprecatedBody) {
			return false;
		}


		if (this.state.workers.count(this.worker.role) > this.state.spawns.requiredFor(this.worker.role)) {
			return false;
		}

		return super.shouldStart() && this.worker.creep.ticksToLive < 250;
	}

	protected tryRun(target: StructureSpawn): ScreepsReturnCode {
		return target.renewCreep(this.worker.creep);
	}

	protected shouldStop(target: StructureSpawn, result: ScreepsReturnCode): boolean {
		return result === ERR_FULL;
	}


	protected findTarget(): StructureSpawn | null {
		return this.worker.findNearby(FIND_MY_SPAWNS, {
			filter: s => s.spawning == null,
		});
	}

}

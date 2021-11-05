import Task from './Task';

export default class RenewTask extends Task {
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

		return this.worker.creep.ticksToLive < 200;
	}

	public override run(): void {
		let spawn = this.worker.findNearby(FIND_MY_SPAWNS);
		if (spawn == null) {
			spawn = Game.spawns['Spawn1'];
		}

		if (spawn.renewCreep(this.worker.creep) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(spawn);
		} else {
			this.nextTask();
		}
	}
}

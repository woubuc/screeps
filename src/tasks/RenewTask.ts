import Task from './Task';

export default class RenewTask extends Task {
	public shouldStart(): boolean {
		if (this.worker.creep.ticksToLive == undefined) {
			return false;
		}

		if (!this.worker.hasRoleBody) {
			return false;
		}

		return this.worker.creep.ticksToLive < 200;
	}

	public onStart(): void {
		this.worker.creep.say('🪫 Renew');
	}

	public run(): void {
		let spawn = this.worker.pos.findClosestByPath(FIND_MY_SPAWNS);
		if (spawn == null) {
			spawn = Game.spawns['Spawn1'];
		}

		if (spawn.renewCreep(this.worker.creep) === ERR_NOT_IN_RANGE) {
			this.worker.creep.moveTo(spawn);
		} else {
			this.nextTask();
		}
	}
}

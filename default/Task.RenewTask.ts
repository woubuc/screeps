import { Task } from './Task';

export class RenewTask extends Task {
	public shouldStart(): boolean {
		if (this.creep.ticksToLive == undefined) {
			return false;
		}

		return this.creep.ticksToLive < 200;
	}

	public onStart(): void {
		this.creep.say('🪫 Renew');
	}

	public run(): void {
		let spawn = this.creep.room.find(FIND_MY_SPAWNS)[0];

		let result = spawn.renewCreep(this.creep);
		if (result === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(spawn);
		} else {
			this.nextTask();
		}
	}
}

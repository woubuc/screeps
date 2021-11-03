import { Task } from './Task';

export class DefendTask extends Task {
	public shouldStart(): boolean {
		return this.creep.room.find(FIND_HOSTILE_CREEPS).length > 0;
	}

	public onStart(): void {
		this.creep.say('🛡️ Defend');
	}

	public run(): void {
		let enemy = this.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (enemy == null) {
			return this.nextTask();
		}

		if (this.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(enemy, { visualizePathStyle: { stroke: '#E11D48' } });
		}
	}
}

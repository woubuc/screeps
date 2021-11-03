import Task from './Task';

export default class DefendTask extends Task {
	public shouldStart(): boolean {
		return this.worker.creep.room.find(FIND_HOSTILE_CREEPS).length > 0;
	}

	public onStart(): void {
		this.worker.creep.say('🛡️ Defend');
	}

	public run(): void {
		let enemy = this.worker.creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (enemy == null) {
			return this.nextTask();
		}

		if (this.worker.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
			this.worker.creep.moveTo(enemy, { visualizePathStyle: { stroke: '#E11D48' } });
		}
	}
}

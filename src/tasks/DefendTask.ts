import Task from './Task';

export default class DefendTask extends Task {
	public override readonly say = '🛡️ Defend';

	public override shouldStart(): boolean {
		return this.worker.room.find(FIND_HOSTILE_CREEPS).length > 0;
	}

	public override run(): void {
		let enemy = this.worker.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
		if (enemy == null) {
			return this.nextTask();
		}

		if (this.worker.creep.attack(enemy) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(enemy, false);
		}
	}
}

import Task from './Task';

export default class RepairTask extends Task {
	public override shouldStart(): boolean {
		return this.worker.creep.store.getFreeCapacity() === 0
			&& this.worker.creep.room.find(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax }).length > 0;
	}

	public override onStart(): void {
		this.worker.creep.say('🚧 build');
	}

	public override run(): void {
		let target = this.worker.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax });
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.worker.creep.repair(target) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		if (this.worker.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

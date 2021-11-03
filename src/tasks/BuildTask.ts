import Task from './Task';

export default class BuildTask extends Task {
	public shouldStart(): boolean {
		return this.worker.creep.store.getFreeCapacity() === 0
			&& this.worker.creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
	}

	public onStart(): void {
		this.worker.creep.say('🚧 build');
	}

	public run(): void {
		let target = this.worker.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.worker.creep.build(target) === ERR_NOT_IN_RANGE) {
			this.worker.creep.moveTo(target, {
				visualizePathStyle: { stroke: '#854D0E' },
				reusePath: 20,
			});
		}

		if (this.worker.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

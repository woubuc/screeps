import { Task } from './Task';

export class BuildTask extends Task {
	public shouldStart(): boolean {
		return this.creep.store.getFreeCapacity() === 0
			&& this.creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
	}

	public onStart(): void {
		this.creep.say('🚧 build');
	}

	public run(): void {
		let target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(target, {
				visualizePathStyle: { stroke: '#854D0E' },
				reusePath: 20,
			});
		}

		if (this.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

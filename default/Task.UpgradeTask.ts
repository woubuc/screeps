import { Task } from './Task';

export class UpgradeTask extends Task {
	public shouldStart(): boolean {
		return this.creep.store.getFreeCapacity() === 0;
	}

	public onStart(): void {
		this.creep.say('⚡ Upgrade');
	}

	public run(): void {
		let controller = this.creep.room.controller;
		if (controller == undefined) {
			return this.nextTask();
		}

		if (this.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(controller, {
				visualizePathStyle: { stroke: '#E879F9' },
				reusePath: 20,
			});
		}

		if (this.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

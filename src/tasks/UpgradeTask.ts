import Task from './Task';

export default class UpgradeTask extends Task {
	public shouldStart(): boolean {
		return this.worker.contains(RESOURCE_ENERGY);
	}

	public onStart(): void {
		this.worker.creep.say('⚡ Upgrade');
	}

	public run(): void {
		let controller = this.worker.creep.room.controller;
		if (controller == undefined) {
			return this.nextTask();
		}

		if (this.worker.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
			this.worker.creep.moveTo(controller, {
				visualizePathStyle: { stroke: '#E879F9' },
				reusePath: 20,
			});
		}

		if (this.worker.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

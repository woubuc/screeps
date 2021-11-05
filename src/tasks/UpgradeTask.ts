import Task from './Task';

export default class UpgradeTask extends Task {
	public override readonly say = '⏫ Upgrade';
	public override shouldStart(): boolean {
		return this.worker.contains(RESOURCE_ENERGY);
	}

	public override run(): void {
		let controller = this.worker.creep.room.controller;
		if (controller == undefined) {
			return this.nextTask();
		}

		if (this.worker.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(controller);
		}

		if (this.worker.creep.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}
}

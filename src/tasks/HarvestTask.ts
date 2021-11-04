import Task from './Task';

const TASK_MIN_DURATION: number = 50;

export default class HarvestTask extends Task {

	public override shouldStart(): boolean {
		return this.worker.creep.store[RESOURCE_ENERGY] === 0
			&& (this.state.harvestables.hasHarvestable(this.worker) || this.state.harvestables.canGetHarvestable());
	}

	public override onStart(): void {
		this.worker.memory.taskCountdown = TASK_MIN_DURATION;
		this.worker.creep.say('🔋 Harvest');
	}

	public override onEnd(): void {
		delete this.worker.memory.taskCountdown;
	}

	public override run(): void {
		let target = this.state.harvestables.getHarvestable(this.worker);
		console.log('target', target);
		if (target == null) {
			return this.nextTask();
		}

		let result = this.worker.creep.harvest(target);
		console.log(result);
		if (result === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		this.worker.memory.taskCountdown!--;
		if (this.worker.memory.taskCountdown! <= 0) {
			this.nextTask();
		}
	}
}

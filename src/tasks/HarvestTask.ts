import Task from './Task';

const TASK_MIN_DURATION: number = 50;

export default class HarvestTask extends Task {
	public override readonly say = '⛏️ Harvest';

	public override shouldStart(): boolean {
		return this.state.harvestables.hasHarvestable(this.worker) || this.state.harvestables.canGetHarvestable();
	}

	public override onStart(): void {
		this.worker.memory.taskCountdown = TASK_MIN_DURATION;
	}

	public override onEnd(): void {
		delete this.worker.creep.memory.taskCountdown;
		this.state.harvestables.clearHarvestable(this.worker);
	}

	public override run(): void {
		let target = this.state.harvestables.getHarvestable(this.worker);
		if (target == null) {
			return this.nextTask();
		}

		let result = this.worker.creep.harvest(target);
		if (result === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		this.worker.memory.taskCountdown!--;
		if (this.worker.memory.taskCountdown! <= 0) {
			this.nextTask();
		}
	}
}

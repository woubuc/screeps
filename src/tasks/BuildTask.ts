import { isOneOf } from '../utils';
import Task from './Task';

export default class BuildTask extends Task {
	public override shouldStart(): boolean {
		return this.worker.store.getFreeCapacity() === 0
			&& this.findConstruction() != null;
	}

	public override onStart(): void {
		this.worker.creep.say('🚧 build');
	}

	public override run(): void {
		let target = this.findConstruction();
		if (target == null) {
			return this.nextTask();
		}

		if (this.worker.creep.build(target) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		if (this.worker.store[RESOURCE_ENERGY] === 0) {
			return this.nextTask();
		}
	}

	protected findConstruction(): ConstructionSite | null {
		return this.worker.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) ?? null;
	}
}

import Task from './Task';

export default class PickupEnergyTask extends Task {
	public shouldStart(): boolean {
		return this.worker.canStore(RESOURCE_ENERGY)
			&& this.findEnergyResource() != null;
	}

	public onStart(): void {
		this.worker.creep.say('🔋 Pickup');
	}

	public run(): void {
		let target = this.findEnergyResource();
		if (target == null) {
			return this.nextTask();
		}

		let result = this.worker.creep.pickup(target);
		console.log('pickup', result);
		if (result === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		}

		if (this.worker.creep.store.getFreeCapacity() === 0 || target.amount <= 0) {
			return this.nextTask();
		}
	}

	protected findEnergyResource(): Resource | null {
		let fullTarget = this.worker.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
			filter: (r) => r.resourceType === RESOURCE_ENERGY && r.amount >= this.worker.store.getFreeCapacity(RESOURCE_ENERGY),
		});
		if (fullTarget != null) {
			return fullTarget;
		}

		let semiTarget = this.worker.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
			filter: (r) => r.resourceType === RESOURCE_ENERGY && r.amount >= 50,
		});
		if (semiTarget != null) {
			return semiTarget;
		}

		return this.worker.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
			filter: (r) => r.resourceType === RESOURCE_ENERGY && r.amount >= 20,
		});
	}
}

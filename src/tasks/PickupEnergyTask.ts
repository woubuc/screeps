import TargetingTask from './TargetingTask';

export default class PickupEnergyTask extends TargetingTask<Resource> {
	public override readonly say = '🔋 Pickup';

	public override shouldStart(): boolean {
		return this.worker.canStore(RESOURCE_ENERGY) && super.shouldStart();
	}

	protected override afterStart(target: Resource): void {
		this.state.resources.reserve(target, this.worker,this.worker.store.getFreeCapacity(RESOURCE_ENERGY));
		this.worker.memory.storeCapacityCache = this.worker.store.getUsedCapacity(RESOURCE_ENERGY);
	}

	protected override beforeEnd(): void {
		let previous = this.worker.memory.storeCapacityCache ?? 0;
		let current = this.worker.store.getUsedCapacity(RESOURCE_ENERGY);

		let diff = current - previous;
		if (diff > 0) {
			this.state.resources.unreserve(this.targetId!, this.worker, diff);
		}
	}

	protected tryRun(target: Resource): ScreepsReturnCode {
		return this.worker.creep.pickup(target);
	}

	protected shouldStop(target: Resource): boolean {
		return this.worker.store.getFreeCapacity() === 0 || target.amount <= 0;
	}

	protected findTarget(): Resource | null {
		return this.worker.findNearby(FIND_DROPPED_RESOURCES, {
			filter: (r) =>
				r.resourceType === RESOURCE_ENERGY
				&& this.state.resources.unreservedAmount(r) >= this.worker.store.getFreeCapacity(RESOURCE_ENERGY)
				&& this.state.resources.canReserve(r),
		});
	}
}

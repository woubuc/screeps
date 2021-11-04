import Service from './Service';

export interface ResourceServiceData {
	reservedAmounts: Record<Id<Resource>, number>;
}

/**
 * Don't make creeps run for amounts less than this
 */
const CUTOFF = 20;

export default class ResourceService extends Service {

	private data: ResourceServiceData = Memory.resourceService ?? {
		reservedAmounts: {},
	};

	public canReserve(resource: Resource): boolean {
		let alreadyReserved = this.data.reservedAmounts[resource.id] ?? 0;
		return alreadyReserved < resource.amount - CUTOFF;
	}

	public reserve(resource: Resource, amount: number): boolean {
		if (!this.canReserve(resource)) {
			return false;
		}

		if (this.data.reservedAmounts[resource.id] == undefined) {
			this.data.reservedAmounts[resource.id] = amount;
		} else {
			this.data.reservedAmounts[resource.id] += amount;
		}
		return true;
	}

	public unreserve(resource: Resource, amount: number): void {
		let alreadyReserved = this.data.reservedAmounts[resource.id] ?? 0;
		if (alreadyReserved <= amount) {
			delete this.data.reservedAmounts[resource.id];
		} else {
			this.data.reservedAmounts[resource.id] -= amount;
		}
	}

	public override afterTick(): void {
		Memory.resourceService = this.data;
	}
}

import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

/**
 * Manages the available dropped resources to help prevent creeps wasting running for the same item
 *
 * When a creep reserves a resource, its entire carry capacity is reserved. This means that the reservation will still cover any additional resources added while the creep is still on its way (e.g. from a harvester) as long as the total amount does not exceed the total reserved carry capacity.
 *
 * Only resources with an amount that exceeds the already reserved capacity can be reserved.
 */
export default class ResourceService extends Service {

	private reserved = new CountMap<Id<Resource>>();

	/**
	 * True if the given resource can be reserved by a worker
	 */
	public canReserve(resource: Resource): boolean {
		return this.reserved.get(resource.id) < resource.amount;
	}

	/**
	 * Reserves a resource
	 *
	 * Should be called as soon as a creep starts moving towards a resource.
	 */
	public reserve(resource: Resource, worker: Worker, amount: number): boolean {
		if (!this.canReserve(resource)) {
			return false;
		}

		this.reserved.increment(resource.id, amount);
		worker.memory.resource = { res: resource.id, amount };
		return true;
	}

	/**
	 * Unreserve a resource
	 *
	 * Should be called after a creep has picked up (some of) the resource.
	 */
	public unreserve(resourceId: Id<Resource>, worker: Worker, amount: number): void {
		if (this.reserved.get(resourceId) <= amount) {
			this.reserved.delete(resourceId);
		} else {
			this.reserved.decrement(resourceId, amount);
		}
		delete worker.creep.memory.resource;
	}

	/**
	 * Gets the unreserved amount of a resource
	 */
	public unreservedAmount(resource: Resource): number {
		let reserved = this.reserved.get(resource.id);
		return resource.amount - reserved;
	}

	/**
	 * Gets the energy resource with the highest unclaimed amount in any visible room
	 */
	public getLargestEnergyResource(): Resource<RESOURCE_ENERGY> | null {
		let options: Resource<RESOURCE_ENERGY>[] = [];
		for (let room of this.state.rooms.visible) {
			let energyResources = room.find(FIND_DROPPED_RESOURCES, {
				filter: r => r.resourceType === RESOURCE_ENERGY,
			}) as Resource<RESOURCE_ENERGY>[];

			options.push(...energyResources);
		}

		options.sort((a, b) => this.unreservedAmount(a) - this.unreservedAmount(b));
		return options[0];
	}


	public override onInit(): void {
		for (let worker of this.state.workers.all()) {
			let reserved = worker.memory.resource;
			if (reserved != undefined) {
				this.reserved.increment(reserved.res, reserved.amount);
			}
		}
	}

	public override afterTick(): void {
		for (let [id, reserved] of this.reserved.entries()) {
			let resource = Game.getObjectById(id);
			if (resource == null || resource.room == undefined) {
				continue;
			}

			resource.room.visual.text(
				`🛑 ${ reserved }/${ resource.amount }`,
				resource.pos.x,
				resource.pos.y - 0.5,
				{ align: 'center', font: 0.25 },
			);
		}
	}
}

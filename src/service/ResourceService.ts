import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

/**
 * Don't make creeps run for amounts less than this
 */
const CUTOFF = 20;

export default class ResourceService extends Service {

	private reserved = new CountMap<Id<Resource>>();

	public override onInit(): void {
		for (let worker of this.state.workers.all()) {
			let reserved = worker.memory.resource;
			if (reserved != undefined) {
				this.reserved.increment(reserved.res, reserved.amount);
			}
		}
	}

	public canReserve(resource: Resource): boolean {
		return this.reserved.get(resource.id) < resource.amount - CUTOFF;
	}

	public reserve(resource: Resource, worker: Worker, amount: number): boolean {
		if (!this.canReserve(resource)) {
			return false;
		}

		this.reserved.increment(resource.id, amount);
		worker.memory.resource = { res: resource.id, amount };
		return true;
	}

	public unreserve(resourceId: Id<Resource>, worker: Worker, amount: number): void {
		if (this.reserved.get(resourceId) <= amount) {
			this.reserved.delete(resourceId);
		} else {
			this.reserved.decrement(resourceId, amount);
		}
		delete worker.creep.memory.resource;
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

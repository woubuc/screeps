import { SetMap } from '@woubuc/multimap';
import Role from '../roles/Role';
import Worker from '../Worker';
import Service from './Service';

export default class WorkerService extends Service {

	public workersByRole = new SetMap<Role | null, Worker>();
	public workers = new Map<Id<Creep>, Worker>();

	public override onInit(): void {
		for (let creep of Object.values(Game.creeps)) {
			let worker = new Worker(creep);

			this.workers.set(creep.id, worker);
			this.workersByRole.add(worker.role, worker);
		}
	}

	public all(): IterableIterator<Worker> {
		return this.workers.values();
	}

	public get(id: Id<Creep>): Worker | null {
		return this.workers.get(id) ?? null;
	}

	public count(role: Role): number {
		return this.workersByRole.get(role).size;
	}
}

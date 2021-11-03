import { SetMap } from '@woubuc/multimap';
import Role from '../roles/Role';
import Worker from '../Worker';

export default class WorkerService {

	public workersByRole = new SetMap<Role | null, Worker>();
	public workers = new Set<Worker>();

	public constructor() {
		for (let creep of Object.values(Game.creeps)) {
			let worker = new Worker(creep);

			this.workers.add(worker);
			this.workersByRole.add(worker.role, worker);
		}
	}
}

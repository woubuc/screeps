import HarvesterRole from '../roles/HarvesterRole';
import LocalEnergyHaulerRole from '../roles/EnergyHaulerRole';
import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

export type Harvestable = Source | Mineral | Deposit;

export const MAX_WORKERS_PER_HARVESTABLE: number = 2;

export default class HarvestableService extends Service {

	private reserved = new CountMap<Id<Harvestable>>();

	public override onInit(): void {
		let totalHarvestables = 0;

		for (let room of Object.values(Game.rooms)) {
			for (let source of room.find(FIND_SOURCES)) {
				this.reserved.set(source.id, 0);
				totalHarvestables++;
			}

			// for (let mineral of room.find(FIND_MINERALS)) {
			// 	this.reserved.set(mineral.id, 0);
			// 	totalHarvestables++;
			// }

			// for (let deposit of room.find(FIND_DEPOSITS)) {
			// 	this.reserved.set(deposit.id, 0);
			// 	totalHarvestables++;
			// }
		}

		this.state.spawns.requireRole(HarvesterRole, totalHarvestables * MAX_WORKERS_PER_HARVESTABLE);
		this.state.spawns.requireRole(LocalEnergyHaulerRole, totalHarvestables);

		for (let worker of this.state.workers.all()) {
			let id = worker.memory.harvestable;
			if (id == undefined) {
				continue;
			}

			this.reserved.increment(id);
		}


	}

	public override afterTick() {
		for (let [id, count] of this.reserved.entries()) {
			let harvestable = Game.getObjectById(id)!;
			if (harvestable?.room == undefined) {
				continue;
			}

			harvestable.room.visual.text(
				`⛏️ ${ count }/${ MAX_WORKERS_PER_HARVESTABLE }`,
				harvestable.pos.x + 0.25,
				harvestable.pos.y,
				{ align: 'left', opacity: 0.75, font: 0.5 },
			);
		}
	}

	public hasHarvestable(worker: Worker): boolean {
		return worker.memory.harvestable != undefined;
	}

	public canGetHarvestable(): boolean {
		for (let count of this.reserved.values()) {
			if (count < MAX_WORKERS_PER_HARVESTABLE) {
				return true;
			}
		}

		return false;
	}

	public getHarvestable(worker: Worker): Source | Mineral | Deposit | null {
		let harvestable = this.getAssignedHarvestable(worker);
		if (harvestable != null) {
			return harvestable;
		}

		return this.assignNextAvailableHarvestable(worker);
	}

	public clearHarvestable(worker: Worker): void {
		delete worker.creep.memory.harvestable;
	}

	private getAssignedHarvestable(worker: Worker): Source | Mineral | Deposit | null {
		let id = worker.memory.harvestable;
		if (id == undefined) {
			return null;
		}

		return Game.getObjectById(id);
	}

	private assignNextAvailableHarvestable(worker: Worker): Source | Mineral | Deposit | null {
		let harvestable = worker.findNearby(FIND_SOURCES, {
			filter: s => this.reserved.get(s.id) < MAX_WORKERS_PER_HARVESTABLE,
		});

		if (harvestable == null) {
			return null;
		}

		worker.memory.harvestable = harvestable.id;
		this.reserved.increment(harvestable.id);
		return harvestable;
	}
}

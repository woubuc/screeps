import HarvesterRole from '../roles/HarvesterRole';
import LocalEnergyHaulerRole from '../roles/EnergyHaulerRole';
import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

/**
 * A harvestable item in the world
 */
export type Harvestable = Source | Mineral | Deposit;

/**
 * Maximum number of creeps assigned to mine each harvestable
 */
const MINERS_PER_HARVESTABLE: number = 2;

/**
 * Number of haulers spawned for each harvestable
 */
const HAULERS_PER_HARVESTABLE: number = 3;

/**
 * Manages assigning creeps to harvestable items in the game
 */
export default class HarvestableService extends Service {

	private reserved = new CountMap<Id<Harvestable>>();

	public override onInit(): void {
		let totalHarvestables = 0;
		for (let room of this.state.rooms.rooms) {
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

		this.state.spawns.requireRole(HarvesterRole, totalHarvestables * MINERS_PER_HARVESTABLE);
		this.state.spawns.requireRole(LocalEnergyHaulerRole, totalHarvestables * HAULERS_PER_HARVESTABLE);

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

			// Draw the number of assigned creeps next to each harvestable
			harvestable.room.visual.text(
				`⛏️ ${ count }/${ MINERS_PER_HARVESTABLE }`,
				harvestable.pos.x + 0.25,
				harvestable.pos.y,
				{ align: 'left', opacity: 0.75, font: 0.5 },
			);
		}
	}

	/**
	 * True if the given worker has an assigned harvestable
	 */
	public hasHarvestable(worker: Worker): boolean {
		return worker.memory.harvestable != undefined;
	}

	/**
	 * True if unassigned harvestables are still available to be assigned
	 */
	public canGetHarvestable(): boolean {
		for (let count of this.reserved.values()) {
			if (count < MINERS_PER_HARVESTABLE) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Gets the assigned harvestable for the given worker
	 *
	 * If the worker has no harvestable, a new one will be assigned if there are any left
	 */
	public getHarvestable(worker: Worker): Source | Mineral | Deposit | null {
		let harvestable = this.getAssignedHarvestable(worker);
		if (harvestable != null) {
			return harvestable;
		}

		return this.assignNextAvailableHarvestable(worker);
	}

	/**
	 * Clears the assigned harvestable from the given worker
	 */
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
			filter: s => this.reserved.get(s.id) < MINERS_PER_HARVESTABLE,
		});

		if (harvestable == null) {
			return null;
		}

		worker.memory.harvestable = harvestable.id;
		this.reserved.increment(harvestable.id);
		return harvestable;
	}
}

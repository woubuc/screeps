import GuardRole from '../roles/GuardRole';
import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

/**
 * Maximum number of guards stationed in each room
 */
const GUARDS_PER_ROOM: number = 2;

/**
 * Manages the accessible & adjacent rooms to help spread guard creeps across multiple rooms.
 */
export default class RoomsService extends Service {

	private stationed = new CountMap<string>();

	/**
	 * An iterable list of the accessible rooms
	 */
	public get rooms(): Room[] {
		return Object.values(Game.rooms);
	}

	/**
	 * Gets the target room of a stationed worker
	 *
	 * If the worker is not stationed, assigns a room.
	 */
	public getTargetRoom(worker: Worker): string {
		if (worker.memory.targetRoom != undefined) {
			return worker.memory.targetRoom;
		} else {
			let room = this.findNextRoom();
			worker.memory.targetRoom = room;
			return room;
		}
	}

	private findNextRoom(): string {
		let lowest: { name: string, count: number } | null = null;
		for (let [name, count] of this.stationed.entries()) {
			if (lowest == null) {
				lowest = { name, count };
				continue;
			}

			if (count < lowest.count) {
				lowest = { name, count };
			}
		}

		return lowest!.name;
	}

	public override onInit(): void {
		for (let room of Object.values(Game.rooms)) {
			this.stationed.set(room.name, 0);

			if (room.controller?.my) {
				for (let adjacent of Object.values(Game.map.describeExits(room.name))) {
					this.stationed.set(adjacent, 0);
				}
			}
		}

		for (let worker of this.state.workers.all()) {
			if (worker.memory.targetRoom != undefined) {
				this.stationed.increment(worker.memory.targetRoom);
			}
		}

		this.state.spawns.requireRole(GuardRole, this.stationed.size * GUARDS_PER_ROOM);
	}
}

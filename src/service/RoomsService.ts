import GuardRole from '../roles/GuardRole';
import { shuffle } from '../utils';
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
	 * A list of the accessible rooms
	 *
	 * This list is shuffled to randomise the order in which visible rooms are accessed
	 */
	public readonly visible: Room[] = Object.values(Game.rooms);

	public get owned(): Room[] {
		return this.visible.filter(r => r.controller?.my);
	}

	public get reserved(): Room[] {
		return this.visible.filter(r => !r.controller?.my && r.controller?.reservation?.username === this.state.username);
	}

	public get neutral(): Room[] {
		return this.visible.filter(r => !r.controller?.my && !r.controller?.reservation)
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
		for (let room of this.visible) {
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

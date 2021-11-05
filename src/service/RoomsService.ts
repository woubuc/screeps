import GuardRole from '../roles/GuardRole';
import { CountMap } from '../utils/CountMap';
import Worker from '../Worker';
import Service from './Service';

export default class RoomsService extends Service {

	private stationed = new CountMap<string>();

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

		this.state.spawns.requireRole(GuardRole, this.stationed.size);
	}

	public get rooms(): Room[] {
		return Object.values(Game.rooms);
	}

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
}

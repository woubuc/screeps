import { isInsideRoom } from '../utils';
import Task from './Task';

export default class StationInRoomTask extends Task {
	public override readonly say = '➡️ Station';

	public override shouldStart(): boolean {
		return this.worker.pos.roomName !== this.state.rooms.getTargetRoom(this.worker);
	}

	public run(): void {
		let targetRoom = this.state.rooms.getTargetRoom(this.worker);
		this.worker.moveTo(new RoomPosition(25, 25, targetRoom));

		if (this.worker.pos.roomName === targetRoom && isInsideRoom(this.worker.pos)) {
			this.nextTask();
		}
	}
}

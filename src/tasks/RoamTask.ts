import { randomSelect } from '../utils';
import Task from './Task';

export default class RoamTask extends Task {
	public override readonly say = '🔀 Roam';

	public override shouldStart(): boolean {
		return true;
	}

	public override onStart(): void {
		this.worker.memory.roamTarget = this.getRandomPosition();
	}

	public override onEnd(): void {
		this.worker.memory.roamTarget = undefined;
	}

	private getTarget(): RoomPosition | null {
		let target = this.worker.memory.roamTarget;
		if (target == undefined) {
			return null;
		}
		return new RoomPosition(target.x, target.y, target.roomName);
	}

	public override run(): void {
		let target = this.getTarget();
		if (target == null) {
			return this.nextTask();
		}

		let result = this.worker.moveTo(target, true, { ignoreRoads: true, maxOps: 10 });

		if (result !== OK || this.worker.pos.isNearTo(target)) {
			return this.nextTask();
		}
	}

	private getRandomPosition(): RoomPosition {
		while (true) {
			let pos = this.tryGetRandomPosition();
			// This shouldn't be null but whatever, we'll just try again
			if (pos == null) {
				continue;
			}

			// Only move to open spaces, not walls
			if (this.worker.room.getTerrain().get(pos.x, pos.y) !== 0) {
				continue;
			}

			let objects = this.worker.room.lookAt(pos);

			// Don't target roads cause they're busy with other creeps
			if (objects.some(o => o.structure?.structureType === STRUCTURE_ROAD)) {
				continue;
			}

			// Otherwise we're good to go
			return pos;
		}
	}

	private tryGetRandomPosition(): RoomPosition | null {
		return this.worker.room.getPositionAt(
			5 + Math.floor(Math.random() * 40),
			5 + Math.floor(Math.random() * 40),
		);
	}
}

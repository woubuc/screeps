import Task from './Task';

export default class ReturnToSpawnTask extends Task {
	public shouldStart(): boolean {
		return true;
	}

	public run(): void {
		let spawn = this.worker.pos.findClosestByPath(FIND_MY_SPAWNS);
		if (spawn == null) {
			spawn = Game.spawns['Spawn1'];
		}

		this.worker.moveTo(spawn);
	}
}

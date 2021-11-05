import Task from './Task';

export default class ReturnToSpawnTask extends Task {
	public override readonly say = 'return';

	public override shouldStart(): boolean {
		return true;
	}

	public override run(): void {
		let spawn = this.worker.findNearby(FIND_MY_SPAWNS);
		if (spawn == null) {
			spawn = Game.spawns['Spawn1'];
		}

		this.worker.moveTo(spawn);
	}
}

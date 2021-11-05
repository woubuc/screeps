import Task from './Task';

export default class RecycleTask extends Task {
	public override readonly say = '♻️ Recycle';

	public shouldStart(): boolean {
		return true;
	}

	public run(): void {
		if (Game.spawns['Spawn1'].recycleCreep(this.worker.creep) === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(Game.spawns['Spawn1']);
		}
	}

}

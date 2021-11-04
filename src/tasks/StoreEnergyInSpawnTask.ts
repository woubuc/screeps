import StoreEnergyTask from './StoreEnergyTask';

export default class StoreEnergyInSpawnTask extends StoreEnergyTask {
	public override shouldStart(): boolean {
		if (!super.shouldStart()) {
			return false;
		}

		let spawn = this.findStorageStructure();
		if (spawn == undefined) {
			console.log('WARN cannot find spawn');
			return false;
		}

		return spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
	}

	protected override findStorageStructure(): StructureSpawn | null {
		return Game.spawns['Spawn1'];//this.worker.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
	}
}

import StoreEnergyTask from './StoreEnergyTask';

export default class StoreEnergyInSpawnTask extends StoreEnergyTask {
	protected override findTarget(): StructureSpawn | null {
		return this.worker.findNearby(FIND_MY_SPAWNS);
	}
}

import StoreEnergyTask from './StoreEnergyTask';

export default class StoreEnergyInSpawnTask extends StoreEnergyTask {
	protected override findTarget(): StructureSpawn | null {
		return this.worker.findNearby(FIND_MY_SPAWNS, {
			filter: s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 20,
		});
	}
}

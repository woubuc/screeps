import StoreEnergyTask from './StoreEnergyTask';

export default class StoreEnergyInTowerTask extends StoreEnergyTask {
	protected override findTarget(): StructureTower | null {
		return this.worker.findNearby(FIND_MY_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_TOWER
				&& (s as StructureTower).store.getFreeCapacity(RESOURCE_ENERGY) > 0,
		});
	}
}

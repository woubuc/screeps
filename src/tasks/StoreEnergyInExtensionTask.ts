import StoreEnergyTask from './StoreEnergyTask';

export default class StoreEnergyInExtensionTask extends StoreEnergyTask {
	protected override findTarget(): StructureTower | null {
		return this.worker.findNearby(FIND_MY_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_EXTENSION
				&& (s as StructureExtension).store.getFreeCapacity(RESOURCE_ENERGY) > 0,
		});
	}
}

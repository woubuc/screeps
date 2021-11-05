import LoadEnergyTask from './LoadEnergyTask';

export default class LoadEnergyFromContainerTask extends LoadEnergyTask {
	protected override findEnergyStorage(): StructureStorage | null {
		return this.worker.findNearby(FIND_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_CONTAINER
				&& s.store.getUsedCapacity(RESOURCE_ENERGY) >= this.worker.store.getFreeCapacity(RESOURCE_ENERGY),
		});
	}
}

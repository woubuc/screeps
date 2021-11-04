import LoadEnergyTask from './LoadEnergyTask';

export default class LoadEnergyFromFullExtensionsTask extends LoadEnergyTask {
	protected override findEnergyStorage(): StructureStorage | null {
		return this.worker.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_EXTENSION
				&& s.store.getFreeCapacity(RESOURCE_ENERGY) === 0
		});
	}
}

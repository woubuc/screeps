import { StoreEnergyTask } from './StoreEnergyTask';

export class StoreEnergyInTowerTask extends StoreEnergyTask {
	public shouldStart(): boolean {
		return super.shouldStart()
			&& this.findStorageStructure() != null;
	}

	protected findStorageStructure(): StructureTower | null {
		return this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_TOWER
				&& (s as StructureTower).store.getFreeCapacity(RESOURCE_ENERGY) > 0,
		});
	}
}

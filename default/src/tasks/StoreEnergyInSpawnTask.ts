import { StoreEnergyTask } from './StoreEnergyTask';

export class StoreEnergyInSpawnTask extends StoreEnergyTask {
	public shouldStart(): boolean {
		return super.shouldStart()
			&& this.findStorageStructure()?.store.getFreeCapacity(RESOURCE_ENERGY)! > 0;
	}

	protected findStorageStructure(): StructureSpawn | null {
		return this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
	}
}

import RepairTask from './RepairTask';

export default class RepairRoadTask extends RepairTask {
	protected override findTarget(): StructureRoad | null {
		return this.worker.findNearby(FIND_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax,
		});
	}
}

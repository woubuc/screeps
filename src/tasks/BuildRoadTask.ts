import { isOneOf } from '../utils';
import BuildTask from './BuildTask';

export default class BuildRoadTask extends BuildTask {
	protected override findConstruction(): ConstructionSite | null {
		return this.worker.findNearby(FIND_CONSTRUCTION_SITES, {
			filter: s => s.structureType === STRUCTURE_ROAD,
		});
	}
}

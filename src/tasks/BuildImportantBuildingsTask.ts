import { isOneOf } from '../utils';
import BuildTask from './BuildTask';

export default class BuildImportantBuildingsTask extends BuildTask {
	protected override findConstruction(): ConstructionSite | null {
		return this.worker.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
			filter: s => isOneOf(s.structureType,
				STRUCTURE_TOWER,
				STRUCTURE_EXTENSION,
				STRUCTURE_STORAGE,
			),
		}) ?? null;
	}
}

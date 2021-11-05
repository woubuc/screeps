import { RoleId } from '../roles/Role';
import { Harvestable } from '../service/HarvestableService';

declare global {
	interface CreepMemory {
		role: RoleId;
		currentTask?: string;

		taskTarget?: Id<any>;
		taskCountdown?: number;

		targetRoom?: string;

		harvestable?: Id<Harvestable>;
		resource?: { res: Id<Resource>, amount: number };
		storeCapacityCache?: number;
	}
}

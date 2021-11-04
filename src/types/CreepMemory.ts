import { RoleId } from '../roles/Role';
import { Harvestable } from '../service/HarvestableService';

declare global {
	interface CreepMemory {
		role: RoleId;
		currentTask?: string;

		reservedSourceId?: Id<Source>;
		targetRoom?: string;
		taskTarget?: RoomPosition;
		taskCountdown?: number;

		harvestable?: Id<Harvestable>;
	}
}

import { RoleId } from '../roles/Role';

declare global {
	interface CreepMemory {
		role: RoleId;
		currentTask?: string;

		reservedSourceId?: Id<Source>;
		targetRoom?: string;
	}
}

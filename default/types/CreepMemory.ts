import { RoleId } from '../Role';

declare global {
	interface CreepMemory {
		role: RoleId;
		currentTask?: string;

		reservedSourceId?: Id<Source>;
		roamTo?: RoomPosition;
	}
}

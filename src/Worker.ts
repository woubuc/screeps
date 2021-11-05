import BuilderRole from './roles/BuilderRole';
import EnergyHaulerRole from './roles/EnergyResupplierRole';
import GuardRole from './roles/GuardRole';
import HarvesterRole from './roles/HarvesterRole';
import LocalEnergyHaulerRole from './roles/EnergyHaulerRole';
import Role, { RoleId } from './roles/Role';
import UnknownRole from './roles/UnknownRole';
import UpgraderRole from './roles/UpgraderRole';

export default class Worker {

	public readonly role: Role;

	public constructor(public readonly creep: Creep) {
		this.role = getRole(creep.memory.role);
	}

	public get memory(): CreepMemory { return this.creep.memory; }

	public get store(): StoreDefinition { return this.creep.store; }

	public get pos(): RoomPosition { return this.creep.pos; }

	public get room(): Room { return this.creep.room; }

	public get hasDeprecatedBody(): boolean {
		return this.creep.body.length < this.role.body.length;
	}

	public canStore(resource: ResourceConstant): boolean {
		return this.store.getFreeCapacity(resource) > 0;
	}

	public contains(resource: ResourceConstant): boolean {
		return this.store[resource] > 0;
	}

	public moveTo(target: RoomPosition | { pos: RoomPosition }, cache: boolean = true, options: Partial<MoveToOpts> = {}): ScreepsReturnCode {
		return this.creep.moveTo(target, {
			reusePath: cache ? 25 : 5,
			visualizePathStyle: {
				lineStyle: 'dotted',
				stroke: '#A5F3FC',
				strokeWidth: 0.1,
				opacity: 0.35,
			},
			...options,
		});
	}

	public findNearby<K extends FindConstant, S extends FindTypes[K]>(
		target: K,
		options?: FindPathOpts & Partial<FilterOptions<K, S>> & { algorithm?: FindClosestByPathAlgorithm },
	): S | null {
		if (options == undefined) {
			options = {};
		}
		options.ignoreCreeps = true;

		let found = this.pos.findClosestByPath(target, options);
		if (found != null) {
			return found;
		}

		let tryRooms: string[] = [this.pos.roomName];
		let visitedRooms: string[] = [];

		while (tryRooms.length > 0) {
			let name = tryRooms.shift()!;
			visitedRooms.push(name);

			let room = Game.rooms[name];
			if (room == undefined) {
				continue;
			}

			let found = room.find(target, options.filter ? { filter: options.filter } : undefined);
			if (found.length > 0) {
				return found[0];
			}

			let adjacentRooms = Game.map.describeExits(name);
			for (let name of Object.values(adjacentRooms)) {
				if (!visitedRooms.includes(name)) {
					tryRooms.push(name);
				}
			}
		}

		return null;
	}
}

function getRole(id: RoleId): Role {
	switch (id) {
		case BuilderRole.id:
			return BuilderRole;
		case GuardRole.id:
			return GuardRole;
		case HarvesterRole.id:
			return HarvesterRole;
		case EnergyHaulerRole.id:
			return EnergyHaulerRole;
		case UpgraderRole.id:
			return UpgraderRole;
		case LocalEnergyHaulerRole.id:
			return LocalEnergyHaulerRole;
	}

	console.log('WARN [Worker] Unknown role:', id);
	return UnknownRole;
}

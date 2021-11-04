import BuilderRole from './roles/BuilderRole';
import GuardRole from './roles/GuardRole';
import HarvesterRole from './roles/HarvesterRole';
import EnergyHaulerRole from './roles/EnergyHaulerRole';
import LocalEnergyHaulerRole from './roles/LocalEnergyHaulerRole';
import Role, { RoleId } from './roles/Role';
import UnknownRole from './roles/UnknownRole';
import UpgraderRole from './roles/UpgraderRole';

export default class Worker {

	public readonly role: Role;

	public constructor(public readonly creep: Creep) {
		this.role = getRole(creep.memory.role);
	}

	public get memory(): CreepMemory { return this.creep.memory }
	public get store(): StoreDefinition { return this.creep.store }
	public get pos(): RoomPosition { return this.creep.pos }
	public get room(): Room { return this.creep.room }

	public get hasRoleBody(): boolean {
		return this.creep.body.length === this.role.body.length
			&& this.creep.body.every((part, i) => this.role.body[i] === part.type);
	}

	public canStore(resource: ResourceConstant): boolean {
		return this.store.getFreeCapacity(resource) > 0;
	}

	public contains(resource: ResourceConstant): boolean {
		return this.store[resource] > 0;
	}

	public moveTo(target: RoomPosition | { pos: RoomPosition }, cache: boolean = true) {
		this.creep.moveTo(target, {
			reusePath: cache ? 25 : 5,
			visualizePathStyle: {
				lineStyle: 'dotted',
				stroke: '#A5F3FC',
				strokeWidth: 0.1,
				opacity: 0.35,
			},
		});
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

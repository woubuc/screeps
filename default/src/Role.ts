import { Opaque } from 'type-fest';
import { BuildTask } from './tasks/BuildTask';
import { DefendTask } from './tasks/DefendTask';
import { HarvestEnergyTask } from './tasks/HarvestEnergyTask';
import { LoadEnergyFromFullestTask } from './tasks/LoadEnergyFromFullestTask';
import { LoadEnergyTask } from './tasks/LoadEnergyTask';
import { RenewTask } from './tasks/RenewTask';
import { RepairTask } from './tasks/RepairTask';
import { RoamTask } from './tasks/RoamTask';
import { StoreEnergyInSpawnTask } from './tasks/StoreEnergyInSpawnTask';
import { StoreEnergyInTowerTask } from './tasks/StoreEnergyInTowerTask';
import { StoreEnergyTask } from './tasks/StoreEnergyTask';
import { TaskConstructor } from './tasks/Task';
import { UpgradeTask } from './tasks/UpgradeTask';

export type RoleId = Opaque<'role'>;

let roles = new Map<RoleId, Role>();

export class Role {
	public static get(id: RoleId): Role {
		return roles.get(id)!;
	}

	public readonly id: RoleId;

	public constructor(
		id: string,
		public readonly icon: string,
		public readonly tasks: TaskConstructor[],
		public readonly parts: BodyPartConstant[],
		public readonly desiredCount: number,
	) {
		this.id = id as RoleId;
		roles.set(this.id, this);
	}
}

export const Builder = new Role(
	'builder',
	'👷',
	[RenewTask, RepairTask, BuildTask, LoadEnergyTask, HarvestEnergyTask],
	[WORK, CARRY, MOVE, MOVE],
	2,
);

export const Harvester = new Role(
	'harvester',
	'⛏️',
	[RenewTask, HarvestEnergyTask, StoreEnergyTask],
	[WORK, WORK, WORK, CARRY, MOVE],
	4,
);

export const Upgrader = new Role(
	'upgrader',
	'⏫',
	[RenewTask, UpgradeTask, LoadEnergyTask, HarvestEnergyTask],
	[WORK, WORK, CARRY, CARRY, MOVE, MOVE],
	3,
);

export const Guard = new Role(
	'guard',
	'🛡️',
	[DefendTask, RenewTask, RoamTask],
	[ATTACK, ATTACK, MOVE, MOVE],
	2,
);

export const Hauler = new Role(
	'hauler',
	'📦',
	[RenewTask, StoreEnergyInSpawnTask, StoreEnergyInTowerTask, LoadEnergyFromFullestTask],
	[CARRY, CARRY, MOVE, MOVE, MOVE],
	2,
);

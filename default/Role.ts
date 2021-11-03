import { Opaque } from 'type-fest';
import { TaskConstructor } from './Task';
import { BuildTask } from './Task.BuildTask';
import { DefendTask } from './Task.DefendTask';
import { HarvestEnergyTask } from './Task.HarvestEnergyTask';
import { LoadEnergyTask } from './Task.LoadEnergyTask';
import { RenewTask } from './Task.RenewTask';
import { RoamTask } from './Task.RoamTask';
import { StoreEnergyTask } from './Task.StoreEnergyTask';
import { UpgradeTask } from './Task.UpgradeTask';

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
	[RenewTask, BuildTask, LoadEnergyTask, HarvestEnergyTask],
	[WORK, CARRY, MOVE],
	1,
);

export const Harvester = new Role(
	'harvester',
	'⛏️',
	[RenewTask, HarvestEnergyTask, StoreEnergyTask],
	[WORK, CARRY, MOVE],
	5,
);

export const Upgrader = new Role(
	'upgrader',
	'⏫',
	[RenewTask, UpgradeTask, LoadEnergyTask, HarvestEnergyTask],
	[WORK, CARRY, MOVE],
	2,
);

export const Guard = new Role(
	'guard',
	'🛡️',
	[DefendTask, RenewTask, RoamTask],
	[ATTACK, MOVE, MOVE],
	2,
);

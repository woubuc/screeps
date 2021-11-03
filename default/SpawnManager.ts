import { Role, RoleId } from './Role';
import { ucFirst } from './utils';

export class SpawnManager {

	private readonly roleCounts: Map<RoleId, number>;

	public constructor() {
		this.roleCounts = new Map();

		for (let creep of Object.values(Game.creeps)) {
			let count = this.roleCounts.get(creep.memory.role) ?? 0;
			this.roleCounts.set(creep.memory.role, count + 1);
		}
	}

	public trySpawnRoles(...roles: Role[]) {
		for (let role of roles) {
			if (!this.trySpawnRole(role)) {
				break;
			}
		}

		for (let spawn of Object.values(Game.spawns)) {
			if (spawn.spawning != null) {
				let spawningCreep = Game.creeps[spawn.spawning.name];
				spawn.room.visual.text(
					`🛠️ ${ ucFirst(spawningCreep.memory.role) }`,
					spawn.pos.x + 1,
					spawn.pos.y,
					{ align: 'left', opacity: 0.5 },
				);
			}

			let offset = 2;
			for (let [role, count] of this.roleCounts.entries()) {
				spawn.room.visual.text(
					`${ count } ${ Role.get(role).icon } `,
					spawn.pos.x,
					spawn.pos.y - offset,
					{ align: 'right', opacity: 0.5 },
				);
				spawn.room.visual.text(
					ucFirst(role),
					spawn.pos.x,
					spawn.pos.y - offset,
					{ align: 'left', opacity: 0.4 },
				);
				offset++;
			}
		}
	}

	private trySpawnRole(role: Role): boolean {
		let count = this.roleCounts.get(role.id) ?? 0;
		let needToSpawn = role.desiredCount - count;
		if (needToSpawn <= 0) {
			return true;
		}

		for (let i = 0; i < needToSpawn; i++) {
			if (!this.trySpawnCreep(role)) {
				return false;
			}
		}

		return false;
	}

	private trySpawnCreep(role: Role): boolean {
		for (let spawn of Object.values(Game.spawns)) {
			if (!spawn.isActive()) {
				continue;
			}

			if (spawn.spawning != null) {
				continue;
			}

			let name = `${ ucFirst(role.id) } #${ Game.time }`;
			let result = spawn.spawnCreep(role.parts, name, {
				memory: { role: role.id },
			});

			if (result === OK) {
				return true;
			}
		}

		return false;
	}
}

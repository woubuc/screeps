import Role, { RoleId } from './roles/Role';
import WorkerService from './service/WorkerService';
import { ucFirst } from './utils';

export class SpawnManager {

	public constructor(private readonly workerService: WorkerService) {}

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
					`🛠️ ${ spawningCreep.memory.role }`,
					spawn.pos.x + 1,
					spawn.pos.y,
					{ align: 'left', opacity: 0.5 },
				);
			}

			let offset = 2;
			for (let [role, workers] of this.workerService.workersByRole.entries()) {
				spawn.room.visual.text(
					`${ workers.size } ${ role?.icon } `,
					spawn.pos.x,
					spawn.pos.y - offset,
					{ align: 'right', opacity: 0.5 },
				);
				spawn.room.visual.text(
					role?.id ?? '',
					spawn.pos.x,
					spawn.pos.y - offset,
					{ align: 'left', opacity: 0.4 },
				);
				offset++;
			}
		}
	}

	private trySpawnRole(role: Role): boolean {
		let count = this.workerService.workersByRole.get(role).size;
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

			let name = `${ role.id } #${ Game.time }`;
			let result = spawn.spawnCreep(role.body, name, {
				memory: { role: role.id },
			});

			if (result === OK) {
				return true;
			}
		}

		return false;
	}
}

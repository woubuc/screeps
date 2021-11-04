import Role from '../roles/Role';
import State from '../State';
import { CountMap } from '../utils/CountMap';
import Service from './Service';

export default class SpawnService extends Service {

	private requiredPerRole = new CountMap<Role>();

	private spawns: StructureSpawn[] = [];

	public requireRole(role: Role, amount: number): void {
		this.requiredPerRole.increment(role, amount);
	}

	public requiredFor(role: Role): number {
		return this.requiredPerRole.get(role);
	}

	public override onInit(): void {
		this.spawns = Object.values(Game.spawns);
	}

	public override afterTick(): void {
		for (let [role, amountNeeded] of this.requiredPerRole.entries()) {
			amountNeeded -= this.state.workers.count(role);
			if (amountNeeded <= 0) {
				continue;
			}

			for (let i = 0; i < amountNeeded; i++) {
				if (!this.trySpawnCreep(role)) {
					break;
				}
			}
		}

		for (let spawn of this.spawns) {
			if (spawn.spawning != null) {
				let spawningCreep = Game.creeps[spawn.spawning.name];
				spawn.room.visual.text(
					`🛠️ ${ spawningCreep.memory.role }`,
					spawn.pos.x + 1,
					spawn.pos.y,
					{ align: 'left' },
				);
			}
		}
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

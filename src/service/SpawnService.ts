import BuilderRole from '../roles/BuilderRole';
import EnergyHaulerRole from '../roles/EnergyHaulerRole';
import EnergyResupplierRole from '../roles/EnergyResupplierRole';
import GuardRole from '../roles/GuardRole';
import HarvesterRole from '../roles/HarvesterRole';
import Role from '../roles/Role';
import UpgraderRole from '../roles/UpgraderRole';
import State from '../State';
import { CountMap } from '../utils/CountMap';
import Service from './Service';

const SPAWN_ORDER: Role[] = [
	HarvesterRole,
	UpgraderRole,
	EnergyHaulerRole,
	BuilderRole,
	EnergyResupplierRole,
	GuardRole,
]

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
		this.trySpawn();

		for (let spawn of this.spawns) {
			if (spawn.spawning != null) {
				let spawningCreep = Game.creeps[spawn.spawning.name];
				spawn.room.visual.text(
					`🛠️   ${ spawningCreep.memory.role }`,
					spawn.pos.x + 0.5,
					spawn.pos.y,
					{ align: 'left', font: 0.5, opacity: 0.75 },
				);
			}
		}

		let roles = Array.from(this.requiredPerRole.keys()).sort((a, b) => b.name.localeCompare(a.name));
		for (let room of this.state.rooms.rooms) {
			let y = 48.8;
			for (let role of roles) {
				if (role == null) {
					continue;
				}

				let current = this.state.workers.count(role);
				let max = this.requiredPerRole.get(role);

				room.visual.text(`${ current }/${ max }    `, 1.5, y, { align: 'right', opacity: 0.75, font: 0.5 });
				room.visual.text(role.icon, 1.5, y, { align: 'center', opacity: 0.75, font: 0.5 });
				room.visual.text(`   ${ role.name }`, 1.5, y, { align: 'left', opacity: 0.25, font: 0.5 });
				y -= 0.8;
			}
		}
	}

	private trySpawn() {
		for (let role of SPAWN_ORDER) {
			let amountNeeded = this.requiredFor(role) - this.state.workers.count(role);
			if (amountNeeded <= 0) {
				continue;
			}

			console.log('[Spawn] Trying to spawn', role.name);

			for (let i = 0; i < amountNeeded; i++) {
				if (!this.trySpawnCreep(role)) {
					return;
				}
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

			let name = `${ role.name } #${ Game.time }`;
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

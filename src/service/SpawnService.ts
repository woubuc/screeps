import BuilderRole from '../roles/BuilderRole';
import EnergyHaulerRole from '../roles/EnergyHaulerRole';
import EnergyResupplierRole from '../roles/EnergyResupplierRole';
import GuardRole from '../roles/GuardRole';
import HarvesterRole from '../roles/HarvesterRole';
import Role from '../roles/Role';
import UpgraderRole from '../roles/UpgraderRole';
import { CountMap } from '../utils/CountMap';
import Service from './Service';

export default class SpawnService extends Service {

	private static readonly SPAWN_ORDER: Role[] = [
		HarvesterRole,
		EnergyHaulerRole,
		UpgraderRole,
		BuilderRole,
		EnergyResupplierRole,
		GuardRole,
	];

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
					`🏭 ${ spawningCreep.name }`,
					spawn.pos.x + 0.6,
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
		if (Game.spawns['Spawn1'].spawning != null) {
			return;
		}

		// First, try to spawn 1 of each required role to try and ensure a minimum activity for each role
		for (let role of SpawnService.SPAWN_ORDER) {
			// Don't spawn yet if there are already workers with this role out there
			if (this.state.workers.count(role) > 0) {
				continue;
			}

			if (!this.trySpawnCreep(role)) {
				console.log('[Spawn] Cannot spawn minimum', role.name);
				return;
			}
		}

		// Then spawn the actual required numbers
		for (let role of SpawnService.SPAWN_ORDER) {
			let amountNeeded = this.requiredFor(role) - this.state.workers.count(role);
			if (amountNeeded <= 0) {
				continue;
			}

			for (let i = 0; i < amountNeeded; i++) {
				if (!this.trySpawnCreep(role)) {
					console.log('[Spawn] Cannot spawn', role.name);
					return;
				}
			}
		}
	}

	private trySpawnCreep(role: Role): boolean {
		let spawn = Game.spawns['Spawn1'];
		if (!spawn.isActive()) {
			return false;
		}

		if (spawn.spawning != null) {
			return false;
		}

		let name = `${ role.name } #${ Game.time }`;
		let result = spawn.spawnCreep(role.body, name, {
			memory: { role: role.id },
		});

		return result === OK;
	}
}

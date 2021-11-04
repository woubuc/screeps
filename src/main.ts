import BuilderRole from './roles/BuilderRole';
import EnergyHaulerRole from './roles/EnergyHaulerRole';
import UpgraderRole from './roles/UpgraderRole';
import State from './State';

module.exports.loop = function () {

	let state = new State();

	state.beforeTick();
	state.taskRunner.run();

	state.spawns.requireRole(UpgraderRole, 3);
	state.spawns.requireRole(BuilderRole, 2);
	state.spawns.requireRole(EnergyHaulerRole, Object.keys(Game.rooms).length);

	// TODO figure out what to do about tower
	for (let room of Object.values(Game.rooms)) {
		let towers: StructureTower[] = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
		for (let tower of towers) {
			let target = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax });
			if (target != null) {
				tower.repair(target);
				continue;
			}

			let enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (enemy != null) {
				tower.attack(enemy);
			}
		}
	}

	state.afterTick();

	cleanupMemory();
};

function cleanupMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name] == undefined) {
			delete Memory.creeps[name];
			console.log('[Memory] Deleted remnant memory of', name);
		}
	}
}

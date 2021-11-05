import BuilderRole from './roles/BuilderRole';
import EnergyResupplierRole from './roles/EnergyResupplierRole';
import UpgraderRole from './roles/UpgraderRole';
import State from './State';

module.exports.loop = function () {
	// Cleanup memory of creeps that were deleted in the last tick
	cleanupMemory();

	// Initialise the global state, which contains & initialises all services
	let state = new State();

	// Run any service logic that should happen *before* the game tick
	state.beforeTick();

	// Run the creep tasks
	state.taskRunner.run();

	// Hardcoded spawn limits
	state.spawns.requireRole(UpgraderRole, 3);
	state.spawns.requireRole(BuilderRole, 2);
	state.spawns.requireRole(EnergyResupplierRole, state.rooms.rooms.length + 1);

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

	// Run any logic that should happen *after* the game tick (cleanup, display,...)
	state.afterTick();
};

function cleanupMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name] == undefined) {
			delete Memory.creeps[name];
			console.log('[Memory] Deleted remnant memory of', name);
		}
	}
}

import { Builder, Guard, Harvester, Upgrader } from './Role';
import { SpawnManager } from './SpawnManager';
import { TaskRunner } from './TaskRunner';

module.exports.loop = function () {

	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('[Memory] Deleted creep (%s)', name);
		}
	}

	// cleanupReservations();

	let spawn = new SpawnManager();

	spawn.trySpawnRoles(Harvester, Upgrader, Builder, Guard);

	for (let creep of Object.values(Game.creeps)) {
		TaskRunner.runFor(creep);
	}
};

function cleanupReservations() {
	let reservations = Memory.sourceReservations ?? {};

	let foundIds: string[] = [];
	let toRemove: string[] = [];

	for (let ids of Object.values(reservations)) {
		for (let id of ids) {
			if (foundIds.indexOf(id) > -1) {
				toRemove.push(id);
			} else {
				foundIds.push(id);
			}
		}
	}

	for (let ids of Object.values(reservations)) {
		for (let id of toRemove) {
			ids.splice(ids.indexOf(id), 1);
		}
	}
}

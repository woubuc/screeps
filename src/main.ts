import BuilderRole from './roles/BuilderRole';
import GuardRole from './roles/GuardRole';
import HarvesterRole from './roles/HarvesterRole';
import HaulerRole from './roles/HaulerRole';
import UpgraderRole from './roles/UpgraderRole';
import WorkerService from './service/WorkerService';
import { SpawnManager } from './SpawnManager';
import { TaskRunner } from './TaskRunner';

module.exports.loop = function () {

	let workerService = new WorkerService();
	let spawnManager = new SpawnManager(workerService);

	spawnManager.trySpawnRoles(HarvesterRole, HaulerRole, UpgraderRole, BuilderRole, GuardRole);

	for (let worker of workerService.workers) {
		TaskRunner.runFor(worker);
	}

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

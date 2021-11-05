import HarvestableService from './service/HarvestableService';
import ResourceService from './service/ResourceService';
import RoomsService from './service/RoomsService';
import SpawnService from './service/SpawnService';
import WorkerService from './service/WorkerService';
import { TaskRunner } from './TaskRunner';

export default class State {

	public readonly harvestables = new HarvestableService(this);
	public readonly resources = new ResourceService(this);
	public readonly rooms = new RoomsService(this);
	public readonly spawns = new SpawnService(this);
	public readonly workers = new WorkerService(this);

	public readonly taskRunner = new TaskRunner(this);

	public constructor() {
		this.workers.onInit();
		this.rooms.onInit();
		this.spawns.onInit();
		this.harvestables.onInit();
		this.resources.onInit();
	}

	public beforeTick(): void {
		this.workers.beforeTick();
		this.rooms.beforeTick();
		this.spawns.beforeTick();
		this.harvestables.beforeTick();
		this.resources.beforeTick();
	}

	public afterTick(): void {
		this.workers.afterTick();
		this.rooms.afterTick();
		this.spawns.afterTick();
		this.harvestables.afterTick();
		this.resources.afterTick();
	}
}

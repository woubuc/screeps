import HarvestableService from './service/HarvestableService';
import ResourceService from './service/ResourceService';
import SpawnService from './service/SpawnService';
import WorkerService from './service/WorkerService';
import { TaskRunner } from './TaskRunner';

export default class State {

	public readonly harvestables = new HarvestableService(this);
	public readonly resources = new ResourceService(this);
	public readonly spawns = new SpawnService(this);
	public readonly workers = new WorkerService(this);

	public readonly taskRunner = new TaskRunner(this);

	public constructor() {
		this.spawns.onInit();
		this.workers.onInit();
		this.harvestables.onInit();
		this.resources.onInit();
	}

	public beforeTick(): void {
		this.spawns.beforeTick();
		this.workers.beforeTick();
		this.harvestables.beforeTick();
		this.resources.beforeTick();
	}

	public afterTick(): void {
		this.spawns.afterTick();
		this.workers.afterTick();
		this.harvestables.afterTick();
		this.resources.afterTick();
	}

}

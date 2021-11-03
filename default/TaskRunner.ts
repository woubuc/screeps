import { Role } from './Role';
import type { Task, TaskConstructor } from './Task';

export class TaskRunner {
	public static runFor(creep: Creep): void {
		this.get().runFor(creep);
	}

	private static instance?: TaskRunner;

	private static get(): TaskRunner {
		if (this.instance == undefined) {
			this.instance = new TaskRunner();
		}
		return this.instance;
	}

	public runFor(creep: Creep): void {
		let CurrentTask = this.getCurrentTaskFor(creep);

		let instance: Task;
		if (CurrentTask == undefined) {
			CurrentTask = this.nextTaskFor(creep);

			if (CurrentTask == undefined) {
				console.log(`WARN [Task] ${ creep.memory.role }: No task`);
				creep.say('⏳ No Job');
				return;
			}

			instance = new CurrentTask(this, creep);
			instance.onStart();
			console.log(`[Task] ${ creep.memory.role }: start ${ CurrentTask.name }`);
		} else {
			instance = new CurrentTask(this, creep);
			// console.log(`[Task] ${ creep.memory.role }: run ${ CurrentTask.name }`);
		}


		instance.run();
	}

	public getTasksFor(creep: Creep): TaskConstructor[] {
		return Role.get(creep.memory.role).tasks;
	}

	public getCurrentTaskFor(creep: Creep): TaskConstructor | undefined {
		let taskName = creep.memory.currentTask;
		if (taskName != undefined) {
			return this.getTasksFor(creep).find(t => t.name === taskName);
		} else {
			return undefined;
		}
	}

	public clearTaskFor(creep: Creep): void {
		creep.memory.currentTask = undefined;
	}

	public setTaskFor(creep: Creep, task: TaskConstructor): void {
		creep.memory.currentTask = task.name;
	}

	public nextTaskFor(creep: Creep): TaskConstructor | undefined {
		for (let TaskClass of this.getTasksFor(creep)) {
			let instance = new TaskClass(this, creep);
			if (instance.shouldStart()) {
				this.setTaskFor(creep, TaskClass);
				return TaskClass;
			}
		}

		this.clearTaskFor(creep);
		return undefined;
	}
}

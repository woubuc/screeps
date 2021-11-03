import Task, { TaskConstructor } from './tasks/Task';
import Worker from './Worker';

export class TaskRunner {
	public static runFor(worker: Worker): void {
		this.get().runFor(worker);
	}

	private static instance?: TaskRunner;

	private static get(): TaskRunner {
		if (this.instance == undefined) {
			this.instance = new TaskRunner();
		}
		return this.instance;
	}

	public runFor(worker: Worker): void {
		let CurrentTask = this.getCurrentTaskFor(worker);

		let instance: Task;
		if (CurrentTask == undefined) {
			CurrentTask = this.nextTaskFor(worker);

			if (CurrentTask == undefined) {
				console.log(`WARN [Task] ${ worker.creep.memory.role }: No task`);
				worker.creep.say('⏳ No Job');
				return;
			}

			instance = new CurrentTask(this, worker);
			instance.onStart();
			console.log(`[Task] ${ worker.creep.memory.role }: start ${ CurrentTask.name }`);
		} else {
			instance = new CurrentTask(this, worker);
			// console.log(`[Task] ${ worker.creep.memory.role }: run ${ CurrentTask.name }`);
		}


		instance.run();
	}

	public getCurrentTaskFor(worker: Worker): TaskConstructor | undefined {
		let taskName = worker.creep.memory.currentTask;
		if (taskName != undefined) {
			return worker.role.tasks.find(t => t.name === taskName);
		} else {
			return undefined;
		}
	}

	public clearTaskFor(worker: Worker): void {
		let Task = this.getCurrentTaskFor(worker);
		if (Task != undefined) {
			new Task(this, worker).onEnd();
		}

		delete worker.creep.memory.currentTask;
	}

	public setTaskFor(worker: Worker, task: TaskConstructor): void {
		worker.creep.memory.currentTask = task.name;
	}

	public nextTaskFor(worker: Worker): TaskConstructor | undefined {
		this.clearTaskFor(worker);

		for (let TaskClass of worker.role.tasks) {
			let instance = new TaskClass(this, worker);
			if (instance.shouldStart()) {
				this.setTaskFor(worker, TaskClass);
				return TaskClass;
			}
		}

		this.clearTaskFor(worker);
		return undefined;
	}
}

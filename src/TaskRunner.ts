import State from './State';
import RecycleTask from './tasks/RecycleTask';
import Task, { TaskConstructor } from './tasks/Task';
import Worker from './Worker';

export class TaskRunner {
	public constructor(private readonly state: State) {}

	public run(): void {
		for (let worker of this.state.workers.all()) {
			if (worker.creep.spawning) {
				continue;
			}

			this.runFor(worker);
		}
	}

	public runFor(worker: Worker): void {
		let CurrentTask = this.getCurrentTaskFor(worker);

		let instance: Task;
		if (CurrentTask == undefined) {
			CurrentTask = this.startNextTaskFor(worker);

			if (CurrentTask == undefined) {
				console.log(`WARN [Task] ${ worker.creep.memory.role }: No task`);
				worker.creep.say('⏳ No Job');
				return;
			}

			instance = new CurrentTask(this.state, worker);
			this.onTaskStart(instance);
			console.log(`[Task] ${ worker.creep.memory.role }: start ${ CurrentTask.name }`);
		} else {
			instance = new CurrentTask(this.state, worker);
			// console.log(`[Task] ${ worker.creep.memory.role }: run ${ CurrentTask.name }`);
		}

		instance.invoke();
	}

	public getCurrentTaskFor(worker: Worker): TaskConstructor | undefined {
		let taskName = worker.creep.memory.currentTask;
		if (taskName === 'RecycleTask') {
			return RecycleTask;
		}

		if (taskName != undefined && taskName.length > 0) {
			return worker.role.tasks.find(t => t.name === taskName);
		} else {
			return undefined;
		}
	}

	public clearTaskFor(worker: Worker): void {
		let Task = this.getCurrentTaskFor(worker);
		if (Task != undefined) {
			new Task(this.state, worker).onEnd();
		}

		delete worker.creep.memory.currentTask;
	}

	public startNextTaskFor(worker: Worker): TaskConstructor | undefined {
		this.clearTaskFor(worker);

		for (let TaskClass of worker.role.tasks) {
			let instance = new TaskClass(this.state, worker);
			if (instance.shouldStart()) {
				this.onTaskStart(instance);
				return TaskClass;
			}
		}

		this.clearTaskFor(worker);
		return undefined;
	}

	private onTaskStart(task: Task): void {
		task.worker.memory.currentTask = task.constructor.name;
		if (task.say.length > 0) {
			task.worker.creep.say(task.say);
		}
		task.onStart();
	}
}

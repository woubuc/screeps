import type { Constructor } from 'type-fest';
import type { TaskRunner } from '../TaskRunner';
import Worker from '../Worker';

export type TaskConstructor = Constructor<Task, [TaskRunner, Worker]>;

export default abstract class Task {
	public constructor(
		protected readonly taskRunner: TaskRunner,
		protected readonly worker: Worker,
	) {}

	/**
	 * Called before running the task or setting it as the current task for the
	 * worker. If false, the task runner will skip the task this time and
	 * continue down the chain to the next task.
	 */
	public abstract shouldStart(): boolean;

	/**
	 * Called once when the worker starts this task
	 */
	public onStart(): void {}

	/**
	 * Called once when the worker changes to a different task
	 */
	public onEnd(): void {}

	/**
	 * Runs the task
	 */
	public abstract run(): void;


	protected nextTask() {
		this.taskRunner.nextTaskFor(this.worker);
	}
}

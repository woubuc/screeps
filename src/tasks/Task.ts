import type { Constructor } from 'type-fest';
import State from '../State';
import type { TaskRunner } from '../TaskRunner';
import Worker from '../Worker';

export type TaskConstructor = Constructor<Task, [State, Worker]>;

export default abstract class Task {
	public constructor(
		public readonly state: State,
		public readonly worker: Worker,
	) {}

	/**
	 * Called before running the task or setting it as the current task for the
	 * worker. If false, the task runner will skip the task this time and
	 * continue down the chain to the next task.
	 */
	public abstract shouldStart(): boolean;

	public abstract readonly say: string;

	/**
	 * Called once when the worker starts this task
	 */
	public onStart(): void {}

	/**
	 * Called once when the worker changes to a different task
	 */
	public onEnd(): void {}

	/**
	 * Called when the task runs
	 */
	public abstract run(): void;


	/** @final */
	public invoke(): void {
		this.run();
	}

	protected nextTask() {
		this.state.taskRunner.startNextTaskFor(this.worker);
	}
}

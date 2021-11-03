import type { Constructor } from 'type-fest';
import type { TaskRunner } from './TaskRunner';

export type TaskConstructor = Constructor<Task, [TaskRunner, Creep]>;

export abstract class Task {
	public constructor(protected readonly taskRunner: TaskRunner, protected readonly creep: Creep) {}

	public abstract shouldStart(): boolean;

	public abstract run(): void;

	public onStart(): void {}

	protected nextTask() {
		this.taskRunner.nextTaskFor(this.creep);
	}
}

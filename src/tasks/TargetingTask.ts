import Task from './Task';

export default abstract class TargetingTask<T extends RoomObject & { id: Id<T> }> extends Task {
	public override shouldStart(): boolean {
		let target = this.findTarget();
		return target != null && this.shouldStartWithTarget(target);
	}

	protected shouldStartWithTarget(target: T): boolean { return true; }

	public override onStart(): void {
		let target = this.findTarget();
		if (target == null) {
			return this.nextTask();
		}

		this.worker.memory.taskTarget = target.id;
		this.afterStart(target);
	}

	public override onEnd(): void {
		this.beforeEnd();
		this.worker.memory.taskTarget = undefined;
	}

	protected get targetId(): Id<T> | null {
		return this.worker.memory.taskTarget ?? null;
	}

	public override run(): void {
		if (this.targetId == null) {
			return this.nextTask();
		}

		let target = Game.getObjectById(this.targetId) as T;
		if (target == null) {
			return this.nextTask();
		}

		let result = this.tryRun(target);
		if (result === ERR_NOT_IN_RANGE) {
			this.worker.moveTo(target);
		} else {
			this.afterRun(target, result);
		}

		if (result === ERR_NO_PATH) {
			return this.nextTask();
		}

		if (this.shouldStop(target, result)) {
			return this.nextTask();
		}
	}

	protected afterStart(target: T): void {}

	protected beforeEnd(): void {}

	protected abstract tryRun(target: T): ScreepsReturnCode;

	protected afterRun(target: T, result: ScreepsReturnCode): void {}

	protected abstract shouldStop(target: T, result: ScreepsReturnCode): boolean;

	protected abstract findTarget(): T | null;
}

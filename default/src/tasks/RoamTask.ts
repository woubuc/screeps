import { Task } from './Task';

export class RoamTask extends Task {
	public shouldStart(): boolean {
		return true;
	}

	public run(): void {
		this.creep.move(this.getRandomDirection());
		this.nextTask();
	}

	private getRandomDirection(): DirectionConstant {
		switch (Math.floor(Math.random() * 8)) {
			case 0: return TOP;
			case 1: return TOP_RIGHT;
			case 2: return RIGHT;
			case 3: return BOTTOM_RIGHT;
			case 4: return BOTTOM;
			case 5: return BOTTOM_LEFT;
			case 6: return LEFT;
			default: return TOP_LEFT;
		}
	}
}

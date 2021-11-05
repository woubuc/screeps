import { randomSelect } from '../utils';
import Task from './Task';

export default class RoamTask extends Task {
	public override readonly say = '🔀 Roam';

	public override shouldStart(): boolean {
		return true;
	}

	public override run(): void {
		this.worker.creep.move(this.getRandomDirection());
		this.nextTask();
	}

	private getRandomDirection(): DirectionConstant {
		let options: DirectionConstant[] = [];

		if (this.worker.pos.x > 2) {
			options.push(TOP);
			if (this.worker.pos.y > 2) {
				options.push(TOP_LEFT);
			}
			if (this.worker.pos.y < 48) {
				options.push(TOP_RIGHT);
			}
		}
		if (this.worker.pos.x < 48) {
			options.push(BOTTOM);
			if (this.worker.pos.y > 2) {
				options.push(BOTTOM_LEFT);
			}
			if (this.worker.pos.y < 48) {
				options.push(BOTTOM_RIGHT);
			}
		}

		if (this.worker.pos.y > 2) {
			options.push(LEFT);
		}
		if (this.worker.pos.y < 48) {
			options.push(RIGHT);
		}

		return randomSelect(options);
	}
}

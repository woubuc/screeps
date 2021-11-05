import BuildRoadTask from '../tasks/BuildRoadTask';
import LoadEnergyTask from '../tasks/LoadEnergyTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RepairRoadTask from '../tasks/RepairRoadTask';
import RepairTask from '../tasks/RepairTask';
import RoamTask from '../tasks/RoamTask';
import Role from './Role';

/**
 * Builders construct and repair buildings
 */
class RoadBuilderRole extends Role {
	public readonly icon = '🛣️';
	public readonly colour = '#7DD3FC';

	public readonly body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
	public readonly tasks = [
		RenewTask,
		BuildRoadTask, RepairRoadTask, RepairTask,
		PickupEnergyTask, LoadEnergyTask,
		RoamTask,
	];

	public override readonly optional = true;
}

export default new RoadBuilderRole();

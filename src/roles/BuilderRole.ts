import BuildImportantBuildingsTask from '../tasks/BuildImportantBuildingsTask';
import BuildTask from '../tasks/BuildTask';
import LoadEnergyTask from '../tasks/LoadEnergyTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RepairTask from '../tasks/RepairTask';
import RoamTask from '../tasks/RoamTask';
import Role from './Role';

/**
 * Builders construct and repair buildings
 */
class BuilderRole extends Role {
	public readonly icon = '👷';
	public readonly colour = '#FDBA74';

	public readonly body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
	public readonly tasks = [
		RenewTask,
		BuildImportantBuildingsTask, BuildTask, RepairTask,
		PickupEnergyTask, LoadEnergyTask,
		RoamTask,
	];
}

export default new BuilderRole();

import BuildTask from '../tasks/BuildTask';
import LoadEnergyTask from '../tasks/LoadEnergyTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RepairTask from '../tasks/RepairTask';
import ReturnToSpawnTask from '../tasks/ReturnToSpawnTask';
import Role from './Role';

class BuilderRole extends Role {
	public readonly icon = '👷';

	public readonly body = [WORK, WORK, CARRY, MOVE, MOVE];
	public readonly tasks = [RenewTask, RepairTask, BuildTask, PickupEnergyTask, LoadEnergyTask];

	public readonly desiredCount = 1;
}

export default new BuilderRole();

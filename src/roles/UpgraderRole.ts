import HarvestEnergyTask from '../tasks/HarvestEnergyTask';
import LoadEnergyTask from '../tasks/LoadEnergyTask';
import RenewTask from '../tasks/RenewTask';
import UpgradeTask from '../tasks/UpgradeTask';
import Role from './Role';

class UpgraderRole extends Role {
	public readonly icon = '⏫';

	public readonly body = [WORK, WORK, CARRY, CARRY, MOVE];
	public readonly tasks = [RenewTask, UpgradeTask, LoadEnergyTask, HarvestEnergyTask];

	public readonly desiredCount = 3;
}

export default new UpgraderRole();

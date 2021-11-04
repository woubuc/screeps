import HarvestTask from '../tasks/HarvestTask';
import LoadEnergyTask from '../tasks/LoadEnergyTask';
import RenewTask from '../tasks/RenewTask';
import UpgradeTask from '../tasks/UpgradeTask';
import Role from './Role';

class UpgraderRole extends Role {
	public readonly icon = '⏫';

	public readonly body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
	public readonly tasks = [RenewTask, UpgradeTask, LoadEnergyTask, HarvestTask];
}

export default new UpgraderRole();

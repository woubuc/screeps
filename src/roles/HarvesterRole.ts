import HarvestTask from '../tasks/HarvestTask';
import RenewTask from '../tasks/RenewTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

class HarvesterRole extends Role {
	public readonly icon = '⛏️';

	public readonly body = [WORK, WORK, MOVE];
	public readonly tasks = [RenewTask, HarvestTask, StoreEnergyTask];
}

export default new HarvesterRole();

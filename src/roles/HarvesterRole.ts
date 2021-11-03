import HarvestEnergyTask from '../tasks/HarvestEnergyTask';
import RenewTask from '../tasks/RenewTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

class HarvesterRole extends Role {
	public readonly icon = '⛏️';

	public readonly body = [WORK, WORK, WORK, MOVE];
	public readonly tasks = [RenewTask, HarvestEnergyTask, StoreEnergyTask];

	public get desiredCount(): number {
		return 4;
	}
}

export default new HarvesterRole();

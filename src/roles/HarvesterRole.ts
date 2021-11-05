import HarvestTask from '../tasks/HarvestTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

/**
 * Harvesters extract harvestables and drop the resources on the ground, for haulers to pick up
 */
class HarvesterRole extends Role {
	public readonly icon = '⛏️';
	public readonly colour = '#6EE7B7';

	public readonly body = [WORK, WORK, WORK, MOVE];
	public readonly tasks = [HarvestTask, StoreEnergyTask];
}

export default new HarvesterRole();

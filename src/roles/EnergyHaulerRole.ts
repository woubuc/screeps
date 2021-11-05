import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

/**
 * Energy haulers carry energy from dropped resources to the nearest store building (spawn, extension, container, storage).
 */
class EnergyHaulerRole extends Role {
	public readonly icon = '📦';

	public readonly body = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
	public readonly tasks = [RenewTask, StoreEnergyTask, PickupEnergyTask, RoamTask];
}

export default new EnergyHaulerRole();

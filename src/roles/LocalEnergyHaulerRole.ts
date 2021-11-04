import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

class LocalEnergyHaulerRole extends Role {
	public readonly icon = '📦';

	public readonly body = [CARRY, CARRY, MOVE, MOVE];
	public readonly tasks = [RenewTask, StoreEnergyTask, PickupEnergyTask, RoamTask];
}

export default new LocalEnergyHaulerRole();
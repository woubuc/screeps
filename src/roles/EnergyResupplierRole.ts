import LoadEnergyFromContainerTask from '../tasks/LoadEnergyFromContainerTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StoreEnergyInExtensionTask from '../tasks/StoreEnergyInExtensionTask';
import StoreEnergyInSpawnTask from '../tasks/StoreEnergyInSpawnTask';
import StoreEnergyInTowerTask from '../tasks/StoreEnergyInTowerTask';
import Role from './Role';

/**
 * Energy resuppliers take energy from containers and storage to keep spawns, extensions and towers fully stocked.
 */
class EnergyResupplierRole extends Role {
	public readonly icon = '📦';
	public readonly colour = '#BEF264';

	public readonly body = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	public readonly tasks = [
		RenewTask,
		StoreEnergyInSpawnTask, StoreEnergyInTowerTask, StoreEnergyInExtensionTask,
		LoadEnergyFromContainerTask, PickupEnergyTask,
		RoamTask,
	];
}

export default new EnergyResupplierRole();

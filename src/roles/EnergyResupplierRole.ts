import LoadEnergyFromContainerTask from '../tasks/LoadEnergyFromContainerTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StoreEnergyInExtensionTask from '../tasks/StoreEnergyInExtensionTask';
import StoreEnergyInSpawnTask from '../tasks/StoreEnergyInSpawnTask';
import StoreEnergyInTowerTask from '../tasks/StoreEnergyInTowerTask';
import Role from './Role';

class EnergyResupplierRole extends Role {
	public readonly icon = '📦';

	public readonly body = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	public readonly tasks = [
		RenewTask,
		StoreEnergyInSpawnTask, StoreEnergyInTowerTask, StoreEnergyInExtensionTask,
		LoadEnergyFromContainerTask, PickupEnergyTask,
		RoamTask,
	];
}

export default new EnergyResupplierRole();

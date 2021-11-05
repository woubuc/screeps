import LoadEnergyFromContainerTask from '../tasks/LoadEnergyFromContainerTask';
import LoadEnergyFromFullExtensionsTask from '../tasks/LoadEnergyFromFullExtensionsTask';
import PickupEnergyTask from '../tasks/PickupEnergyTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StoreEnergyInSpawnTask from '../tasks/StoreEnergyInSpawnTask';
import StoreEnergyInTowerTask from '../tasks/StoreEnergyInTowerTask';
import StoreEnergyTask from '../tasks/StoreEnergyTask';
import Role from './Role';

class EnergyResupplierRole extends Role {
	public readonly icon = '📦';

	public readonly body = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
	public readonly tasks = [
		RenewTask,
		StoreEnergyInTowerTask, StoreEnergyInSpawnTask, StoreEnergyTask,
		LoadEnergyFromContainerTask, LoadEnergyFromFullExtensionsTask, PickupEnergyTask,
		RoamTask,
	];
}

export default new EnergyResupplierRole();

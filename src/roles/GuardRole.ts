import DefendTask from '../tasks/DefendTask';
import RecycleTask from '../tasks/RecycleTask';
import RenewTask from '../tasks/RenewTask';
import ReturnToSpawnTask from '../tasks/ReturnToSpawnTask';
import RoamTask from '../tasks/RoamTask';
import StationInRoomTask from '../tasks/StationInRoomTask';
import Role from './Role';

class GuardRole extends Role {
	public readonly icon = '🛡️';

	public readonly body = [ATTACK, ATTACK, MOVE, MOVE];
	public readonly tasks = [DefendTask, RenewTask, StationInRoomTask, RoamTask];
}

export default new GuardRole();

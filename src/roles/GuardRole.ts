import DefendTask from '../tasks/DefendTask';
import RenewTask from '../tasks/RenewTask';
import RoamTask from '../tasks/RoamTask';
import StationInRoomTask from '../tasks/StationInRoomTask';
import Role from './Role';

/**
 * Guards defend a room against hostile creeps
 */
class GuardRole extends Role {
	public readonly icon = '🛡️';
	public readonly colour = '#FCA5A5';

	public readonly body = [ATTACK, ATTACK, MOVE, MOVE];
	public readonly tasks = [DefendTask, RenewTask, StationInRoomTask, RoamTask];
}

export default new GuardRole();

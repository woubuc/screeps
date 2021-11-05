import Role from './Role';

/**
 * Placeholder used for invalid roles
 */
class UnknownRole extends Role {
	public readonly icon = '❓';

	public readonly body = [];
	public readonly tasks = [];
}

export default new UnknownRole();

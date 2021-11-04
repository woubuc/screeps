import Role from './Role';

class UnknownRole extends Role {
	public readonly icon = '❓';

	public readonly body = [];
	public readonly tasks = [];
}

export default new UnknownRole();

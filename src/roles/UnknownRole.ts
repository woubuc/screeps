import Role from './Role';

class UnknownRole extends Role {
	public readonly icon = '❓';

	public readonly body = [];
	public readonly tasks = [];

	public readonly desiredCount = 0;
}

export default new UnknownRole();

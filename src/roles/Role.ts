import { Opaque } from 'type-fest';
import { TaskConstructor } from '../tasks/Task';

export type RoleId = Opaque<'role'>;

export default abstract class Role {
	public get id(): RoleId {
		return this.constructor.name as RoleId;
	}

	public abstract readonly icon: string;

	public abstract readonly tasks: TaskConstructor[];
	public abstract readonly body: BodyPartConstant[];
}

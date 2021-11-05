import { Opaque } from 'type-fest';
import { TaskConstructor } from '../tasks/Task';

export type RoleId = Opaque<'role'>;

export default abstract class Role {
	public get id(): RoleId {
		return this.constructor.name as RoleId;
	}

	public get name(): string {
		return this.id.replace('Role', '');
	}

	public abstract readonly icon: string;
	public abstract readonly colour: string;

	public abstract readonly tasks: TaskConstructor[];
	public abstract readonly body: BodyPartConstant[];

	public readonly optional: boolean = false;
}

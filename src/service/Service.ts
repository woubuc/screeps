import State from '../State';

export default abstract class Service {

	/** @final */
	public constructor(protected readonly state: State) {}

	public onInit(): void {}

	public beforeTick(): void {}
	public afterTick(): void {}
}

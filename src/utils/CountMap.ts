export class CountMap<T> extends Map<T, number> {
	public override get(id: T): number {
		return super.get(id) ?? 0;
	}

	public increment(id: T, amount: number = 1): void {
		this.set(id, this.get(id) + amount);
	}

	public decrement(id: T, amount: number = 1): void {
		this.set(id, this.get(id) - amount);
	}
}

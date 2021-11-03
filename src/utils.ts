export function isOneOf<T>(value: T, ...matchers: T[]): boolean {
	for (let tryMatch of matchers){
		if (value === tryMatch) {
			return true;
		}
	}

	return false;
}

export function ucFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

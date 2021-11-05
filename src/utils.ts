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

export function randomSelect<T>(options: T[]): T {
	return options[Math.floor(Math.random() * options.length)];
}

export function isInsideRoom(pos: RoomPosition) {
	return pos.x > 2 && pos.x < 48 && pos.y > 2 && pos.y < 48;
}

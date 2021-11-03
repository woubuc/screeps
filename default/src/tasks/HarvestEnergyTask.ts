import { Task } from './Task';

let reservations: Map<Id<Source>, Id<Creep>[]> | null = null;

function getReservations(): Map<Id<Source>, Id<Creep>[]> {
	if (reservations == null) {
		reservations = new Map();

		for (let creep of Object.values(Game.creeps)) {
			if (creep.memory.reservedSourceId != undefined) {
				let res = reservations.get(creep.memory.reservedSourceId) ?? [];
				res.push(creep.id);
				reservations.set(creep.memory.reservedSourceId, res);
			}
		}
	}

	return reservations;
}

function updateReservationLabels() {
	for (let [sourceId, creeps] of getReservations().entries()) {
		if (creeps.length === 0) {
			continue;
		}

		let source = Game.getObjectById<Source>(sourceId)!;
		source.room.visual.text(
			`⛏️ ${ creeps.length }`,
			source.pos.x,
			source.pos.y - 1,
			{ align: 'center', opacity: 0.5 },
		);
	}
}

export class HarvestEnergyTask extends Task {

	public shouldStart(): boolean {
		return this.creep.store[RESOURCE_ENERGY] === 0
			&& this.creep.room.find(FIND_SOURCES_ACTIVE).length > 0;
	}

	public onStart(): void {
		this.creep.say('🔋 Harvest');
	}

	public run(): void {
		let target = this.getReservedSource();
		if (target == undefined) {
			return this.nextTask();
		}

		if (this.creep.harvest(target) === ERR_NOT_IN_RANGE) {
			this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
		}

		if (this.creep.store.getFreeCapacity() === 0) {
			this.unreserveSource(target);
			return this.nextTask();
		}
	}

	private getReservedSource(): Source | undefined {
		let reservedId = this.creep.memory.reservedSourceId;

		if (reservedId == undefined) {
			let source = this.findSource();
			if (source == null) {
				return undefined;
			}

			this.reserveSource(source);
			return source;
		} else {
			let source = Game.getObjectById<Source>(reservedId)!;
			this.reserveSource(source);
			return source;
		}
	}

	private findSource(): Source | null {
		return this.creep
			.pos
			.findClosestByPath(FIND_SOURCES_ACTIVE, {
				filter: (s) => !this.isReserved(s),
			});
	}

	private isReserved(source: Source): boolean {
		let res = getReservations().get(source.id) ?? [];
		return res.length >= this.maxReserved(source);
	}

	private maxReserved(source: Source): number {
		let max = 2;
		let spawn = source.room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType === STRUCTURE_SPAWN,
		})[0];
		if (spawn == null) {
			return max;
		}

		let distance = source.pos.getRangeTo(spawn.pos);
		max += Math.floor(distance / 10);
		return max;
	}

	private reserveSource(source: Source) {
		this.creep.memory.reservedSourceId = source.id;

		let reservations = getReservations();
		let res = reservations.get(source.id) ?? [];
		if (res.indexOf(this.creep.id) === -1) {
			res.push(this.creep.id);
			reservations.set(source.id, res);
		}
		updateReservationLabels();
	}

	private unreserveSource(source: Source) {
		this.creep.memory.reservedSourceId = undefined;

		let reservations = getReservations();
		let res = reservations.get(source.id) ?? [];
		let index = res.indexOf(this.creep.id);
		if (index > -1) {
			res.splice(index, 1);
			reservations.set(source.id, res);
		}
		updateReservationLabels();
	}
}

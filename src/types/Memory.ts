import { ResourceServiceData } from '../service/ResourceService';

declare global {
	interface Memory {
		sourceReservations: Record<string, string[]>;

		resourceService: ResourceServiceData;
	}
}

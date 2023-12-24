import type { Place } from '$lib/types';

export function set_full_address(place: Place) {
	place.full_address = `${place.street_address}, ${place.locality}, ${place.administrative_area}, ${place.country_code}`;
	return place;
}

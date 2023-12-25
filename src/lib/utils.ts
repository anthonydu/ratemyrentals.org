export function full_address(place: {
	street_address: string;
	locality: string;
	administrative_area: string;
	country_code: string;
}) {
	return `${place.street_address}, ${place.locality}, ${place.administrative_area}, ${place.country_code}`;
}

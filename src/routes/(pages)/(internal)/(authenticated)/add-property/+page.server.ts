import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

export async function load({ url }) {
	const searchParams = url.searchParams;

	const placeId = searchParams.get('place_id');

	let suggestedPlace = null;
	if (placeId) {
		const res = await fetch(
			`https://places.googleapis.com/v1/places/${placeId}?fields=addressComponents&key=${PUBLIC_GOOGLE_MAPS_API_KEY}&languageCode=en`
		);

		suggestedPlace = await res.json();
	}

	console.log(suggestedPlace);

	return { suggestedPlace };
}

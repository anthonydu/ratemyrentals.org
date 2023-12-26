import type { Place, Review } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const placeId = url.searchParams.get('place_id');
	const reviewId = url.searchParams.get('review_id');

	const { data: place }: { data: Place[] | null } = await locals.supabase
		.from('places')
		.select()
		.eq('id', placeId);

	if (!placeId || !place?.[0]) throw redirect(302, '/');

	let review: Review | null = null;
	if (reviewId)
		review = (await locals.supabase.from('reviews').select().eq('id', reviewId)).data?.[0];

	return { place: place[0], review: review };
};

import type { Place, Review } from '$lib/types.js';
import type { Session } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals: { supabase }, parent }) => {
	const { session }: { session: Session } = await parent();

	const { data: reviews }: { data: Review[] | null } = await supabase
		.from('reviews')
		.select()
		.eq('user_id', session.user.id)
		.eq('deleted', false)
		.order('created_at', { ascending: false });

	const { data: places }: { data: Place[] | null } = await supabase.from('places').select();

	if (!reviews || !places)
		throw error(500, 'Internal server error: failed to fetch places and reviews');

	const joined = reviews.map((review) => {
		const place = places.find((place) => place.id === review.place_id);
		if (!place)
			throw error(500, `Internal server error: place with id ${review.place_id} not found`);
		return { review, place };
	});

	return { reviews: joined };
};

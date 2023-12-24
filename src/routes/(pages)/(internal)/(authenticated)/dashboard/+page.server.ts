import type { Place, Review } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		throw redirect(302, '/');
	}

	const { data: reviews }: { data: Review[] | null } = await locals.supabase
		.from('reviews')
		.select()
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	const { data: places }: { data: Place[] | null } = await locals.supabase.from('places').select();

	if (!reviews || !places) throw error(500, 'Internal server error');

	const joined = reviews.map((review) => {
		const place = places.find((place) => place.id === review.place_id);
		if (!place) throw error(500, 'Internal server error');
		return { ...review, place };
	});

	return { reviews: joined };
};

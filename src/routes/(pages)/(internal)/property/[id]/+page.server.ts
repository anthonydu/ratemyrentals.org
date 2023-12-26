import type { Place, Review } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

export async function load({ params, locals: { supabase }, parent }) {
	const { session }: { session: Session | null } = await parent();

	const { data: places }: { data: Place[] | null } = await supabase
		.from('places')
		.select()
		.eq('id', params.id);

	if (!places) error(404, 'Property not found');

	if (!places[0].verified && session?.user.id !== places[0].created_by)
		error(
        			401,
        			'Unauthorized: property not verified. if you created this property, please log in to view it'
        		);

	const { data: reviews }: { data: Review[] | null } = await supabase
		.from('reviews')
		.select()
		.eq('place_id', params.id)
		.order('created_at', { ascending: false });

	let avgRating = 0;
	if (reviews) avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

	return {
		place: { ...places[0], numRatings: reviews?.length || 0, avgRating },
		reviews: reviews || []
	};
}

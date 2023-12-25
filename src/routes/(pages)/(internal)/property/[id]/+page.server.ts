import type { Place, Review } from '$lib/types';
import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const { data: places }: { data: Place[] | null } = await supabase
		.from('places')
		.select()
		.eq('id', params.id);

	if (!places) throw error(404, 'Property not found');

	const { data: reviews }: { data: Review[] | null } = await supabase
		.from('reviews')
		.select()
		.eq('place_id', params.id)
		.order('created_at', { ascending: false });

	return { place: places[0], reviews: reviews || [] };
}

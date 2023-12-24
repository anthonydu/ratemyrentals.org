import type { Place } from '$lib/types';
import { error } from '@sveltejs/kit';
import { set_full_address } from '$lib/utils.js';
import { supabase } from '$lib/supabase.js';

export async function load({ params }) {
	const { data }: { data: Place[] | null } = await supabase
		.from('places')
		.select()
		.eq('id', params.id);

	if (!data) throw error(404, 'Property not found');

	data.forEach(set_full_address);

	return { place: data[0] };
}

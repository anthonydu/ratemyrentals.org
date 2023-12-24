import { set_full_address } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals: { supabase } }) {
	const searchParams = url.searchParams;

	const query = searchParams.get('q');
	const filter = searchParams.get('filter') || '%';

	if (!query) throw redirect(302, '/');

	const { data } = await supabase
		.from('places')
		.select()
		.ilike('country_code', filter)
		.textSearch('searchable', query.split(' ').join(':* & ') + ':*')
		.limit(5);

	const places = data || [];

	places.forEach(set_full_address);

	return { places: places, query };
}

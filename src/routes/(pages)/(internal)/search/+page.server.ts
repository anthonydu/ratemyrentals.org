import type { Place } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals: { supabase } }) {
	const searchParams = url.searchParams;

	const query = searchParams.get('q');
	const filter = searchParams.get('filter') || '%';

	if (!query) throw redirect(302, '/');

	const {
		data: { user }
	} = await supabase.auth.getUser();

	let data: Place[] | null;
	if (user) {
		data = (
			await supabase
				.from('places')
				.select()
				.ilike('country_code', filter)
				.or(`verified.eq.true,created_by.eq.${user.id}`)
				.textSearch('searchable', query.split(' ').join(':* & ') + ':*')
				.limit(5)
		).data;
	} else {
		data = (
			await supabase
				.from('places')
				.select()
				.ilike('country_code', filter)
				.eq('verified', true)
				.textSearch('searchable', query.split(' ').join(':* & ') + ':*')
				.limit(5)
		).data;
	}

	const places: (Place & { numRatings: number; avgRating: number })[] = await Promise.all(
		(data || []).map(async (place) => {
			const { data } = await supabase.from('reviews').select('rating').eq('place_id', place.id);
			let avgRating = 0;
			if (data) avgRating = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
			return { ...place, numRatings: data?.length || 0, avgRating };
		})
	);

	return { places: places || [], query };
}

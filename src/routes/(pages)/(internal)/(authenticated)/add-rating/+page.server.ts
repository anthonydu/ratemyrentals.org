import type { Place } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
	const id = url.searchParams.get('id');

	const { data: place }: { data: Place[] | null } = await locals.supabase
		.from('places')
		.select()
		.eq('id', id);

	if (!id || !place?.[0]) throw redirect(302, '/');

	return { id, place: place[0] };
};

import { supabase } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export async function GET() {
	const { data } = await supabase.from('places').select('id');

	if (!data) throw error(502, 'Failed to fetch data from Supabase');

	let urls = '';

	data.forEach(({ id }) => {
		urls += /* xml */ `<url><loc>https://www.ratemyrentals.org/${id}</loc></url>`;
	});

	return new Response(
		/* xml */ `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
		>
			<url><loc>https://www.ratemyrentals.org/</loc></url>
			${urls}
		</urlset>`.trim(),
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}

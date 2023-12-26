import { error } from '@sveltejs/kit';

export async function GET({ locals }) {
	const { data } = await locals.supabase.from('places').select('id').eq('verified', true);

	if (!data) error(500, 'Internal server error: failed to fetch places');

	let urls = '';

	data.forEach(({ id }: { id: string }) => {
		urls += /* xml */ `
		<url>
			<loc>https://www.ratemyrentals.org/property/${id}</loc>
		</url>`;
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

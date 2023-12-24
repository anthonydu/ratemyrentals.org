<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.place.name} | Rate My Rentals</title>
</svelte:head>

<h1 class="text-4xl">{$page.data.place.name}</h1>
<h2>{$page.data.place.full_address}</h2>
<p>Alternative names: {$page.data.place.alt_names.join(', ') || 'none'}</p>
<p>Owned and managed by: {$page.data.place.landlords.join(', ') || 'unknown'}</p>
<p>Apartments, suites, or units: {$page.data.place.units.join(', ') || 'none'}</p>

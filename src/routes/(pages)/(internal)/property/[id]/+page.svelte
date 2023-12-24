<script>
	export let data;
</script>

<svelte:head>
	<title>{data.place.name} | Rate My Rentals</title>
</svelte:head>

<h1 class="text-4xl">{data.place.name}</h1>
<h2>{data.place.full_address}</h2>
<p>Alternative names: {data.place.alt_names.join(', ') || 'none'}</p>
<p>Owned and managed by: {data.place.landlords.join(', ') || 'unknown'}</p>
<p>Apartments, suites, or units: {data.place.units.join(', ') || 'none'}</p>

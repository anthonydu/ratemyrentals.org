<script lang="ts">
	import AddProperty from '$lib/components/AddProperty.svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.query} | Rate My Rentals</title>
</svelte:head>

<div class="flex">
	<div class="flex flex-[2] flex-col gap-5">
		<h1>
			Results for "{$page.data.query}"
		</h1>
		{#each $page.data.places as place}
			<button
				type="button"
				class="cursor-pointer bg-slate-100 p-5 text-left"
				on:click={() => goto(encodeURI(`/property/${place.id}`))}
			>
				<h2 class="text-2xl font-black">{place.name}</h2>
				<h3>{place.full_address}</h3>
				<p>Alternative names: {place.alt_names.join(', ') || 'none'}</p>
				<p>Owned and managed by: {place.landlords.join(', ') || 'unknown'}</p>
				<p>Apartments, suites, or units: {place.units.join(', ') || 'none'}</p>
			</button>
		{/each}
		<div class="flex w-full flex-col items-center gap-3 bg-slate-100 px-5 py-10">
			<p class="text-center text-lg">Can't find your rental?</p>
			<AddProperty classes={{ button: 'rounded-full bg-blue-700 px-8 py-3 text-white' }}
			></AddProperty>
		</div>
	</div>
	<div class="hidden flex-1 md:block"></div>
</div>

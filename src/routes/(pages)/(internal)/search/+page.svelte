<script lang="ts">
	import { goto } from '$app/navigation';
	import { full_address } from '$lib/utils.js';
	import House from '$lib/img/House.svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.query} | Rate My Rentals</title>
</svelte:head>

<h1>
	Results for "{data.query}"
</h1>
{#each data.places as place}
	<button
		type="button"
		class="space-y-3 bg-slate-100 p-5 text-left"
		on:click={() => goto(encodeURI(`/property/${place.id}`))}
	>
		<h2 class="text-2xl font-black">{place.name || place.street_address}</h2>
		<h3>{full_address(place)}</h3>
		<div class="flex flex-row gap-1">
			{#each { length: 5 } as _, i}
				<House
					className={`h-5 w-5 ${i < place.avgRating ? 'text-yellow-500' : 'text-slate-300'}`}
				/>
			{/each}
		</div>
	</button>
{/each}
<div class="flex w-full flex-col items-center gap-3 bg-slate-100 px-5 py-10">
	<p class="text-center text-lg">Can't find your rental?</p>
	<AuthButton
		classes={{ button: 'rounded-full bg-blue-700 px-8 py-3 text-white' }}
		href="/add-property"
	>
		Add a property
	</AuthButton>
</div>

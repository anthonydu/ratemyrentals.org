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
	{data.places.length} results for "{data.query}"
</h1>
{#each { length: data.places.length } as _, i}
	<button
		type="button"
		class="space-y-3 bg-slate-100 p-5 text-left"
		on:click={() => goto(encodeURI(`/property/${data.places[i].id}`))}
	>
		<h2 class="text-2xl font-bold">{data.places[i].name || data.places[i].street_address}</h2>
		<h3>{full_address(data.places[i])}</h3>
		<div class="flex flex-row items-center gap-1">
			{#each { length: 5 } as _, j}
				<House
					class={`h-5 w-5 ${j < data.places[i].avgRating ? 'text-yellow-500' : 'text-slate-300'}`}
				/>
			{/each}
			<p class="ml-2">{data.places[i].numRatings} ratings</p>
		</div>
	</button>
	{#if (i + 1) % 3 === 0}
		<ins
			class="adsbygoogle"
			style="display:block"
			data-ad-format="fluid"
			data-ad-layout-key="-fx-15+47-76+6v"
			data-ad-client="ca-pub-7450570197815362"
			data-ad-slot="4441530623"
		></ins>
	{/if}
{/each}
{#if data.suggestedPlace && data.places.length === 0}
	<div class="flex w-full flex-col items-center gap-3 bg-slate-100 py-8">
		<p class="text-center text-lg">Are you looking for:</p>
		<p class="rounded-lg bg-white p-3">{data.suggestedPlace.formattedAddress}</p>
		<AuthButton
			classes={{ button: 'rounded-full bg-blue-700 px-8 py-3 text-white' }}
			href={`/add-property?place_id=${data.suggestedPlace.id}`}
		>
			Add this property
		</AuthButton>
	</div>
{/if}
<div class="flex w-full flex-col items-center gap-3 bg-slate-100 py-8">
	<p class="text-center text-lg">Can't find your rental?</p>
	<AuthButton
		classes={{ button: 'rounded-full bg-blue-700 px-8 py-3 text-white' }}
		href="/add-property"
	>
		Add a property
	</AuthButton>
</div>

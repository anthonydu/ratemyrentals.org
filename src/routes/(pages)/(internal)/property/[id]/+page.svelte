<script lang="ts">
	import House from '$lib/img/House.svelte';
	import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

	export let data;
</script>

<svelte:head>
	<title>{data.place.name} | Rate My Rentals</title>
</svelte:head>

<h1 class="text-3xl">{data.place.name}</h1>
<div class="space-y-2">
	<h2>{data.place.full_address}</h2>
	<p>Alternative names: {data.place.alt_names.join(', ') || 'none'}</p>
	<p>Owned and managed by: {data.place.landlords.join(', ') || 'unknown'}</p>
	<p>Apartments, suites, or units: {data.place.units.join(', ') || 'none'}</p>
</div>

{#if !data.reviews}
	<p>No reviews yet.</p>
{/if}

{#each data.reviews as review}
	<div class="space-y-3 bg-slate-100 p-5 text-left" id={review.id}>
		<p class="font-bold">
			{uniqueNamesGenerator({
				dictionaries: [adjectives, colors, animals],
				seed: review.user_id
			})}
		</p>
		<div class="flex flex-row items-center gap-1">
			{#each { length: 5 } as _, i}
				<House className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`} />
			{/each}
			<p class="mx-0.5 text-slate-500">&centerdot;</p>
			<p>
				{new Date(review.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}
			</p>
		</div>
		<p>{review.body}</p>
	</div>
{/each}

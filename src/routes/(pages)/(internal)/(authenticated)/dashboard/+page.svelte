<script lang="ts">
	import { goto } from '$app/navigation';
	import House from '$lib/img/House.svelte';
	import type { Place, Review } from '$lib/types.js';

	export let data;

	const handleClick = (review: Review & { place: Place }) => {
		goto(encodeURI(`/property/${review.place.id}#${review.id}`));
	};
</script>

<h1 class="text-3xl">Dashboard</h1>

<h2 class="text-2xl">Your Ratings</h2>

<div class="flex flex-col gap-5">
	{#each data.reviews as review}
		<button
			type="button"
			class="space-y-3 bg-slate-100 p-5 text-left"
			on:click={() => handleClick(review)}
		>
			<div class="flex flex-col justify-between sm:flex-row">
				<p class="font-bold">{review.place.name || review.place.street_address}</p>
				<p>
					{new Date(review.created_at).toLocaleString('default', {
						month: 'long',
						year: 'numeric'
					})}
				</p>
			</div>
			<div class="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
				<div class="flex flex-row gap-1">
					{#each { length: 5 } as _, i}
						<House class={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`} />
					{/each}
				</div>
				<div class="flex flex-row flex-wrap gap-3">
					{#if review.unit}
						<p class="w-max">Unit: <b>{review.unit}&#9;</b></p>
					{/if}
					{#if review.landlord}
						<p class="w-max">Owner: <b>{review.landlord}</b></p>
					{/if}
					{#if review.rent}
						<p class="w-max">Rent: <b>{review.rent}</b></p>
					{/if}
				</div>
			</div>
			<p>{review.body}</p>
		</button>
	{/each}
</div>

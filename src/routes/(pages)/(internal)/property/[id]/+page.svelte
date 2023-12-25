<script lang="ts">
	import AuthButton from '$lib/components/AuthButton.svelte';
	import House from '$lib/img/House.svelte';
	import { full_address } from '$lib/utils.js';
	import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

	export let data;
</script>

<svelte:head>
	<title>{data.place.name || data.place.street_address} | Rate My Rentals</title>
</svelte:head>

<div class="flex flex-col gap-2">
	<h1 class="text-3xl">{data.place.name || data.place.street_address}</h1>
	<h2>{full_address(data.place)}</h2>
	<div class="flex flex-row items-center gap-1">
		{#each { length: 5 } as _, i}
			<House
				className={`h-5 w-5 ${i < data.place.avgRating ? 'text-yellow-500' : 'text-slate-300'}`}
			/>
		{/each}
		<p class="ml-2">{data.place.numRatings}</p>
	</div>
</div>

{#if !data.place.verified}
	<p class="text-red-500">
		This property is currently not showing up in search results because it was recently created and
		had not been verified by the administrator of the website. You can still rate this property
		while it is awaiting verification, but if you'd like to add a rating later, please save this
		page's URL before you close the tab, otherwise you'll not be able find your way back to this
		page before the property is verified.
	</p>
{/if}

<AuthButton
	classes={{ button: 'w-max rounded-full bg-blue-600 px-6 py-3 text-white' }}
	href="/add-rating"
>
	Add a rating
</AuthButton>

{#if data.reviews.length === 0}
	<p>No ratings yet.</p>
{/if}

{#each data.reviews as review}
	<div class="space-y-3 bg-slate-100 p-5 text-left" id={review.id}>
		<div class="flex flex-col justify-between sm:flex-row">
			<p class="break-all font-bold">
				{uniqueNamesGenerator({
					dictionaries: [adjectives, colors, animals],
					seed: review.user_id
				})}
			</p>
			<p>
				{new Date(review.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}
			</p>
		</div>
		<div class="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
			<div class="flex flex-row gap-1">
				{#each { length: 5 } as _, i}
					<House
						className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`}
					/>
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
	</div>
{/each}

<script lang="ts">
	import { goto } from '$app/navigation';
	import House from '$lib/img/House.svelte';
	import type { Place, Review } from '$lib/types.js';
	import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

	export let data;

	const handleClick = (review: Review, place: Place) => {
		goto(encodeURI(`/property/${place.id}#${review.id}`));
	};

	const handleEdit = (review: Review) => {
		goto(encodeURI(`/add-rating?place_id=${review.place_id}&review_id=${review.id}`));
	};

	const handleDelete = async (review: Review) => {
		if (confirm('Are you sure you want to delete this rating?')) {
			const { status, error } = await data.supabase
				.from('reviews')
				.update({
					...review,
					deleted: true,
					deleted_at: new Date()
				})
				.eq('id', review.id);
			if (status < 300) {
				alert('Rating deleted.');
				window.location.reload();
			} else alert(error?.message);
		}
	};
</script>

<svelte:head>
	<title>Account Dashboard | Rate My Rentals</title>
</svelte:head>

<h1 class="text-3xl">Account Dashboard</h1>

<p>
	Display name:
	<b>
		{uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			seed: data.session.user.id
		})}
	</b>
</p>

<h2 class="text-2xl">Your Ratings</h2>

{#if data.reviews.length === 0}
	<p>No ratings yet.</p>
{/if}

<div class="flex flex-col gap-5">
	{#each data.reviews as { review, place }}
		<button
			type="button"
			class="space-y-3 bg-slate-100 p-5 text-left"
			on:click={() => handleClick(review, place)}
		>
			<div class="flex flex-col justify-between sm:flex-row">
				<p class="font-bold">{place.name || place.street_address}</p>
				<div class="flex flex-row gap-3">
					<p>
						{new Date(review.created_at).toLocaleString()}
					</p>
					<button
						class="hover:underline"
						type="button"
						on:click|stopPropagation={() => handleEdit(review)}
					>
						Edit
					</button>
					<button
						class="hover:underline"
						type="button"
						on:click|stopPropagation={() => handleDelete(review)}
					>
						Delete
					</button>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<div class="flex flex-row gap-1">
					{#each { length: 5 } as _, i}
						<House class={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`} />
					{/each}
				</div>
				<div class="flex flex-row flex-wrap gap-3">
					{#if review.term?.[0] && review.term?.[1]}
						<p class="w-max">From <b>{review.term?.[0]}</b> to <b>{review.term?.[1]}</b></p>
					{/if}
					{#if review.unit}
						<p class="w-max">Unit: <b>{review.unit}</b></p>
					{/if}
					{#if review.landlord}
						<p class="w-max">Owner: <b>{review.landlord}</b></p>
					{/if}
					{#if review.beds}
						<p class="w-max">Beds: <b>{review.beds}</b></p>
					{/if}
					{#if review.baths}
						<p class="w-max">Baths: <b>{review.baths}</b></p>
					{/if}
					{#if review.rent}
						<p class="w-max">Rent: <b>{review.rent}</b></p>
					{/if}
				</div>
			</div>
			<p class="whitespace-pre-wrap">{review.body}</p>
		</button>
	{/each}
</div>

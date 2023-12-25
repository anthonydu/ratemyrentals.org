<script lang="ts">
	import { goto } from '$app/navigation';
	import House from '$lib/img/House.svelte';
	import type { ReviewSubmission } from '$lib/types.js';
	import { full_address } from '$lib/utils.js';

	export let data;

	let body = '';
	let rating = 0;
	let unit = '';
	let landlord = '';
	let rent = '';

	const handleSubmit = async () => {
		const review: ReviewSubmission = {
			place_id: data.id,
			body,
			rating,
			unit,
			landlord,
			rent: parseInt(rent) || undefined
		};
		const { status, error } = await data.supabase.from('reviews').insert(review);
		if (status !== 201) {
			alert('Submission failed: ' + error?.message);
		} else {
			alert('Review submitted!');
			goto(`/property/${data.id}`);
		}
	};

	let tempRating = 0;
	let hoveringHouse = false;
</script>

<svelte:head>
	<title>Rate {data.place.name || data.place.street_address} | Rate My Rentals</title>
</svelte:head>

<div>
	<h1 class="text-3xl">Rate <b>{data.place.name || data.place.street_address}</b></h1>
	<h2>{full_address(data.place)}</h2>
</div>

<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col gap-1">
		<p>Rating</p>
		<div class="flex flex-row gap-1" id="rating">
			{#each { length: 5 } as _, i}
				<button
					class="cursor-pointer"
					type="button"
					on:mouseenter={() => {
						hoveringHouse = true;
						tempRating = i + 1;
					}}
					on:mouseleave={() => {
						hoveringHouse = false;
						tempRating = 0;
					}}
					on:click={() => (rating = i + 1)}
				>
					<House
						class={`h-8 w-8 ${
							i < (hoveringHouse ? tempRating : rating) ? 'text-yellow-500' : 'text-slate-300'
						}`}
					/>
				</button>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<label for="unit">Apt, suite, or unit <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="unit"
			type="text"
			id="unit"
			bind:value={unit}
			placeholder="e.g. Apt 101"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="landlord">Owner <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="landlord"
			type="text"
			id="landlord"
			bind:value={landlord}
			placeholder="e.g. John Doe"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="rent">Rent <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent [&::-webkit-inner-spin-button]:appearance-none"
			name="rent"
			type="number"
			id="rent"
			bind:value={rent}
			placeholder="e.g. 1000"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="body">Body</label>
		<textarea
			class="min-h-[150px] rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="body"
			id="body"
			bind:value={body}
			placeholder="How did you feel about living at this place?"
			required
		/>
	</div>
	<button class="mt-1 rounded-lg bg-blue-600 py-2.5 text-white" type="submit">Submit</button>
</form>

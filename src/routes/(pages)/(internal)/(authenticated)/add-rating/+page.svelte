<script lang="ts">
	import { goto } from '$app/navigation';
	import House from '$lib/img/House.svelte';
	import type { ReviewSubmission } from '$lib/types.js';
	import { full_address } from '$lib/utils.js';

	export let data;

	let body = data.review?.body || '';
	let rating = data.review?.rating || 0;
	let unit = data.review?.unit || '';
	let landlord = data.review?.landlord || '';
	let rent = data.review?.rent?.toString() || '';
	let termStart = data.review?.term?.[0] || '';
	let termEnd = data.review?.term?.[1] || '';
	let beds = data.review?.beds?.toString() || '';
	let baths = data.review?.baths?.toString() || '';

	const handleSubmit = async () => {
		const review: ReviewSubmission = {
			place_id: data.place.id,
			body,
			rating,
			unit,
			landlord,
			rent: parseInt(rent) || undefined,
			term: termStart && termEnd ? [termStart, termEnd] : undefined,
			beds: parseFloat(beds) || undefined,
			baths: parseFloat(baths) || undefined,
			edit_history: data.review
				? [
						...data.review.edit_history,
						{
							updated_at: new Date().toISOString(),
							previous: {
								body: data.review.body,
								place_id: data.review.place_id,
								rating: data.review.rating,
								unit: data.review.unit,
								landlord: data.review.landlord,
								rent: data.review.rent,
								term: data.review.term,
								beds: data.review.beds,
								baths: data.review.baths
							}
						}
					]
				: []
		};
		if (review.term?.[0] && review.term?.[1]) {
			if (new Date(review.term[0]).getTime() > new Date(review.term[1]).getTime()) {
				alert('Lease term start date must not be before lease term end date.');
				return;
			}
		} else if (review.term?.[0] || review.term?.[1]) {
			alert('Both lease term start and end dates must be specified.');
			return;
		}
		if (data.review) {
			const { status, error } = await data.supabase
				.from('reviews')
				.update({
					...review
				})
				.eq('id', data.review.id);
			if (status < 300) {
				alert('Review updated!');
				window.history.back();
			} else {
				alert('Edit failed: ' + error?.message);
			}
		} else {
			const { status, error } = await data.supabase.from('reviews').insert(review);
			if (status < 300) {
				alert('Review submitted!');
				goto(`/property/${data.place.id}`);
			} else {
				alert('Submission failed: ' + error?.message);
			}
		}
	};

	let tempRating = 0;
	let hoveringHouse = false;
</script>

<svelte:head>
	<title
		>{data.review ? 'Edit Rating of' : 'Rate'}
		{data.place.name || data.place.street_address} | Rate My Rentals</title
	>
</svelte:head>

<div>
	<h1 class="text-3xl">
		{data.review ? 'Edit Rating of' : 'Rate'} <b>{data.place.name || data.place.street_address}</b>
	</h1>
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
		<label for="term-start">From <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent [&::-webkit-inner-spin-button]:appearance-none"
			name="term-start"
			type="date"
			id="term-start"
			bind:value={termStart}
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="term-end">To <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent [&::-webkit-inner-spin-button]:appearance-none"
			name="term-end"
			type="date"
			id="term-end"
			bind:value={termEnd}
		/>
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
		<label for="beds">Number of Bedrooms <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent [&::-webkit-inner-spin-button]:appearance-none"
			name="beds"
			type="number"
			step=".5"
			id="beds"
			bind:value={beds}
			placeholder="e.g. 3"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="baths">Number of Bathrooms <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent [&::-webkit-inner-spin-button]:appearance-none"
			name="baths"
			step=".5"
			type="number"
			id="baths"
			bind:value={baths}
			placeholder="e.g. 2"
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
	<div class="flex flex-row gap-1">
		<button
			type="button"
			class="flex-1 rounded-lg bg-slate-600 py-2.5 text-white"
			on:click={() => window.history.back()}
		>
			Cancel
		</button>
		<button class="flex-1 rounded-lg bg-blue-600 py-2.5 text-white" type="submit">Submit</button>
	</div>
</form>

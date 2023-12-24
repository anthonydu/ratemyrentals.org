<script lang="ts">
	import House from '$lib/img/House.svelte';

	export let data;
</script>

<h1 class="text-3xl">Dashboard</h1>

<h2 class="text-2xl">Your Reviews</h2>

<div class="flex flex-col gap-5">
	{#each data.reviews as review}
		<button type="button" class="space-y-3 bg-slate-100 p-5 text-left">
			<p class="font-bold">{review.place.name}</p>
			<div class="flex flex-row items-center gap-1">
				{#each { length: 5 } as _, i}
					<House
						className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`}
					/>
				{/each}
				<p class="mx-0.5 text-slate-500">&centerdot;</p>
				<p>
					{new Date(review.created_at).toLocaleString('default', {
						month: 'long',
						year: 'numeric'
					})}
				</p>
			</div>
			<p>{review.body}</p>
		</button>
	{/each}
</div>

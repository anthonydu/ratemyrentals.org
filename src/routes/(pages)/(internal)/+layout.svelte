<script>
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<meta name="theme-color" content="#1d4ed8" />
</svelte:head>

<Header />

<main class="mx-auto mt-16 flex max-w-6xl flex-row p-8">
	<div class="flex flex-[2] flex-col gap-5">
		<slot />
	</div>
	<div class="hidden flex-1 md:block"></div>
</main>

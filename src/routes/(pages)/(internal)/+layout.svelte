<script>
	import { afterNavigate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';

	afterNavigate(() => {
		document
			.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])')
			.forEach(() => {
				// @ts-ignore
				(window.adsbygoogle = window.adsbygoogle || []).push({});
			});
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#1d4ed8" />
</svelte:head>

<Header />

<main class="mx-auto mt-16 flex max-w-6xl flex-col p-8 md:flex-row">
	<div class="flex flex-col gap-5 md:flex-[2]">
		<slot />
	</div>
	<div class="md:flex-1">
		<!-- Side Bar -->
		<ins
			class="adsbygoogle"
			style="display:block"
			data-ad-format="autorelaxed"
			data-ad-client="ca-pub-7450570197815362"
			data-ad-slot="5127355511"
		></ins>
	</div>
</main>

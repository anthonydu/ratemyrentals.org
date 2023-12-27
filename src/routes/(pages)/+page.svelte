<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import backgroundImage from '$lib/img/background-image.webp';
	import SignLog from '$lib/components/SignLog.svelte';
	import { page } from '$app/stores';
	import Hamburger from '$lib/img/Hamburger.svelte';

	let menuOpen = false;
</script>

<svelte:head>
	<title>Rate My Rentals</title>
	<meta name="description" content="Rate your rentals, landlords or tenants." />
	<meta name="theme-color" content="#6b6b6b" />
</svelte:head>

<header class="fixed top-0 z-50 h-16 w-full text-white">
	<nav class="mx-auto flex h-full max-w-6xl flex-row-reverse items-center justify-between px-8">
		<div class="hidden gap-3 sm:flex">
			<SignLog />
		</div>
		{#if $page.data.session}
			<p class="hidden sm:block">{$page.data.session.user.email}</p>
		{/if}
		<button
			class="flex h-10 w-10 items-center justify-center sm:hidden"
			type="button"
			on:click={() => (menuOpen = !menuOpen)}
		>
			<Hamburger class="h-5 w-5" />
		</button>
		<div
			class={`${
				(menuOpen ? 'translate-y-full opacity-100' : 'translate-y-3/4 opacity-0') +
				(!$page.data.session ? ' md:hidden' : '')
			} absolute bottom-0 right-8 -z-10 flex flex-col gap-5 rounded-lg bg-blue-600 p-5 transition-all duration-500`}
		>
			{#if $page.data.session}
				<p class="md:hidden">{$page.data.session.user.email}</p>
				<hr class="md:hidden" />
			{/if}
			<SignLog />
		</div>
	</nav>
</header>

<main
	style={`background-image: url("${backgroundImage}"); background-size: cover; background-position: center;`}
>
	<div
		class="flex h-screen flex-col items-center justify-center space-y-5 overflow-hidden px-8 text-white backdrop-brightness-50"
	>
		<h1 class="text-center text-5xl font-bold drop-shadow-md">Rate My Rentals</h1>
		<h2 class="text-center text-xl drop-shadow-md">Enter an address to get started!</h2>
		<Search
			classes={{
				form: 'max-w-sm flex-wrap text-black shadow-lg sm:max-w-max sm:text-white',
				select:
					'h-14 w-full rounded-[0.375rem_0.375rem_0_0] bg-gray-200 px-5 sm:w-44 sm:rounded-[0.375rem_0_0_0.375rem] sm:bg-blue-600',
				input:
					'h-14 w-full rounded-[0_0_0_0.375rem] bg-white px-5 text-black sm:w-80 sm:rounded-none',
				button:
					'h-14 w-14 rounded-[0_0_0.375rem_0] bg-blue-600 text-white sm:rounded-[0_0.375rem_0.375rem_0]'
			}}
			autofocus
		/>
	</div>
</main>

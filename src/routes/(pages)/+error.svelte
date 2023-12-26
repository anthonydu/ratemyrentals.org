<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<meta name="theme-color" content="#1d4ed8" />
</svelte:head>

<Header />

<main class="flex h-screen w-screen flex-col items-center justify-center gap-3 p-8">
	<h1 class="text-5xl font-bold">{$page.status}</h1>
	<h2 class="max-w-sm text-center [text-wrap:balance]">{$page.error?.message}</h2>
</main>

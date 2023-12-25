<script lang="ts">
	import SignLog from '$lib/components/SignLog.svelte';
	import Search from '$lib/components/Search.svelte';
	import Hamburger from '$lib/img/Hamburger.svelte';
	import SearchIcon from '$lib/img/SearchIcon.svelte';
	import { page } from '$app/stores';

	enum State {
		Closed = 0,
		Burger = 1,
		Search = 2
	}

	let state = State.Closed;

	$: $page.url, (state = State.Closed);
</script>

<header class="fixed top-0 z-50 h-16 w-full bg-blue-700 text-white">
	<nav class="relative mx-auto flex h-full max-w-6xl items-center justify-between bg-inherit px-8">
		<div class="flex flex-row items-center gap-5">
			<a class="whitespace-nowrap font-semibold" href="/">Rate My Rentals</a>
			<Search
				classes={{
					form: 'group hidden gap-1 focus-within:text-black hover:text-black sm:flex',
					input:
						'h-10 w-52 rounded border border-white bg-transparent px-3 transition-colors focus:outline-none group-focus-within:bg-white group-hover:bg-white',
					select:
						'h-10 w-40 rounded border border-white bg-transparent px-3 transition-colors focus:outline-none group-focus-within:bg-white group-hover:bg-white'
				}}
				type="nav"
			/>
		</div>
		<div class="flex flex-row">
			<button
				class="flex h-10 w-10 items-center justify-center sm:hidden"
				type="button"
				on:click={() => {
					if (state === State.Search) state = State.Closed;
					else state = State.Search;
				}}
			>
				<SearchIcon class="h-5 w-5" />
			</button>
			<button
				class="flex h-10 w-10 items-center justify-center md:hidden"
				type="button"
				on:click={() => {
					if (state === State.Burger) state = State.Closed;
					else state = State.Burger;
				}}
			>
				<Hamburger class="h-5 w-5" />
			</button>
			<div
				class={`${
					(state === State.Burger ? 'translate-y-full' : 'translate-y-0') +
					(!$page.data.session ? ' md:hidden' : '')
				} absolute bottom-0 right-8 -z-10 flex flex-col gap-5 rounded-b bg-blue-600 p-5 transition-all duration-500`}
			>
				{#if $page.data.session}
					<p class="md:hidden">{$page.data.session.user.email}</p>
					<hr class="md:hidden" />
				{/if}
				<SignLog />
			</div>
			<div
				class={`${
					state === State.Search ? 'translate-y-full' : 'translate-y-0'
				} absolute bottom-0 right-8 -z-10 flex w-[calc(100%_-_4rem)] rounded-b bg-blue-600 p-4 transition-all duration-500 sm:hidden`}
			>
				<Search
					classes={{
						form: 'group w-full flex-col gap-1 focus-within:text-black hover:text-black',
						input:
							'h-10 w-full rounded border border-white bg-transparent px-3 transition-colors focus:outline-none group-focus-within:bg-white group-hover:bg-white',
						select:
							'h-10 w-full rounded border border-white bg-transparent px-3 transition-colors focus:outline-none group-focus-within:bg-white group-hover:bg-white group-focus-within:[&+svg]:text-black'
					}}
					type="nav"
				/>
			</div>
		</div>
		{#if !$page.data.session}
			<div class="hidden flex-row gap-5 md:flex">
				<SignLog />
			</div>
		{:else}
			<button
				class="hidden items-center justify-center md:flex"
				type="button"
				on:click={() => {
					if (state === State.Burger) state = State.Closed;
					else state = State.Burger;
				}}
			>
				<p>{$page.data.session.user.email}</p>
			</button>
		{/if}
	</nav>
</header>

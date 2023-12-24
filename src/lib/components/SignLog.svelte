<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/store';
	import { dev } from '$app/environment';
	import type { DialogState } from '$lib/types';
	import LoadingSpinner from '$lib/img/LoadingSpinner.svelte';

	export let showButtons = true;

	export let state: DialogState = 'Closed';

	let dialog: HTMLDialogElement;

	$: if (dialog) {
		if (state !== 'Closed') {
			dialog.showModal();
		} else dialog.close();
	}

	let email: string;

	const handleSubmit = () => {
		supabase.auth
			.signInWithOtp({
				email: email,
				options: { emailRedirectTo: dev ? 'http://localhost:5173' : undefined }
			})
			.then(() => (state = 'Check Your Inbox'));
		state = 'Loading';
	};

	const handleSignOut = () => {
		supabase.auth.signOut();
		state = 'Closed';
		$user = null;
	};
</script>

{#if showButtons}
	{#if !$user}
		<button
			class="whitespace-nowrap text-left"
			type="button"
			on:click={() => (state = 'Log In or Sign Up')}
		>
			Log in
		</button>
	{:else}
		<a class="whitespace-nowrap text-left" href="/dashboard">Dashboard</a>
		<button
			class="whitespace-nowrap text-left"
			type="button"
			on:click={() => (state = 'Signing Out')}
		>
			Sign out
		</button>
	{/if}
{/if}

<dialog class="w-full max-w-sm rounded-lg bg-white p-10" bind:this={dialog}>
	<button
		type="button"
		class="absolute right-5 top-5 leading-none"
		on:click={() => (state = 'Closed')}
	>
		&cross;
	</button>
	<div class="flex w-full flex-col gap-3">
		{#if state !== 'Loading'}
			<p class="text-xl">{state}</p>
		{/if}
		{#if state === 'Log In or Sign Up'}
			<form class="contents" on:submit|preventDefault={handleSubmit}>
				<label for="email">Email Address</label>
				<input
					class="rounded-lg border-2 border-slate-300 p-3 text-black"
					name="email"
					type="email"
					id="email"
					autocomplete="email"
					bind:value={email}
				/>
				<button class="rounded-lg bg-blue-600 py-3 text-white" type="submit">
					Log In or Sign Up with Email
				</button>
			</form>
		{/if}

		{#if state === 'Loading'}
			<div class="flex h-40 items-center justify-center self-center justify-self-center">
				<LoadingSpinner className="w-16 h-16" />
			</div>
		{/if}
		{#if state === 'Check Your Inbox'}
			<p>An email has been sent to {email}. Follow the instructions to finish logging in.</p>
		{/if}
		{#if state === 'Signing Out'}
			<p>Are you sure you would like to sign out?</p>
			<button type="button" class="rounded-lg bg-blue-600 py-3 text-white" on:click={handleSignOut}>
				Confirm Sign Out
			</button>
		{/if}
	</div>
</dialog>

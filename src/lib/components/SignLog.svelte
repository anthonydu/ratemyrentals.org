<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/store';
	import { dev } from '$app/environment';

	enum State {
		Closed = '',
		Login = 'Log In or Sign Up',
		Verify = 'Check Your Inbox',
		SignOut = 'Signing Out'
	}

	let state = State.Closed;

	let dialog: HTMLDialogElement;

	$: if (dialog) {
		if (state) {
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
			.then(() => (state = State.Verify));
	};

	const handleSignOut = () => {
		supabase.auth.signOut();
		state = State.Closed;
		$user = null;
	};
</script>

{#if !$user}
	<button
		class="whitespace-nowrap text-left"
		type="button"
		on:click={() => {
			state = State.Login;
		}}
	>
		Log in
	</button>
{:else}
	<a class="whitespace-nowrap text-left" href="/dashboard">Dashboard</a>
	<button
		class="whitespace-nowrap text-left"
		type="button"
		on:click={() => (state = State.SignOut)}
	>
		Sign out
	</button>
{/if}

<dialog class="w-full max-w-sm rounded-lg bg-white p-10" bind:this={dialog}>
	<button
		type="button"
		class="absolute right-5 top-5 leading-none"
		on:click={() => (state = State.Closed)}
	>
		&cross;
	</button>
	<form class="flex w-full flex-col gap-3" on:submit|preventDefault={handleSubmit}>
		<p class="text-xl">{state}</p>
		{#if state === State.Login}
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
		{/if}
		{#if state === State.Verify}
			<p>An email has been sent to {email}. Follow the instructions to finish logging in.</p>
		{/if}
		{#if state === State.SignOut}
			<p>Are you sure you would like to sign out?</p>
			<button type="button" class="rounded-lg bg-blue-600 py-3 text-white" on:click={handleSignOut}>
				Confirm Sign Out
			</button>
		{/if}
	</form>
</dialog>

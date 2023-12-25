<script lang="ts">
	import { goto } from '$app/navigation';
	import SignLog from './SignLog.svelte';
	import type { DialogState } from '../types';
	import { page } from '$app/stores';

	export let classes: {
		button: string;
	};

	let state: DialogState = 'Closed';

	export let href: string;

	const handleClick = () => {
		if ($page.data.session) {
			goto(encodeURI(href));
		} else {
			state = 'Log In or Sign Up';
		}
	};
</script>

<button class={classes.button} type="button" on:click={handleClick}><slot /></button>

<SignLog showButtons={false} bind:state></SignLog>

<script lang="ts">
	import { goto } from '$app/navigation';
	import SignLog from './SignLog.svelte';
	import type { DialogState } from '../types';
	import { page } from '$app/stores';

	export let classes: {
		button: string;
	};

	let state: DialogState = 'Closed';

	const handleClick = () => {
		if ($page.data.session) {
			goto(encodeURI('/add-property'));
		} else {
			state = 'Log In or Sign Up';
		}
	};
</script>

<button class={classes.button} type="button" on:click={handleClick}>Add a property</button>

<SignLog showButtons={false} bind:state></SignLog>

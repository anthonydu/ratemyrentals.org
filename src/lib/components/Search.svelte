<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchFilter, searchQuery } from '$lib/store';
	import SearchIcon from '$lib/img/SearchIcon.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';

	export let classes: {
		form: string;
		input: string;
		select: string;
		button?: string;
	};
	export let type = 'primary';
	export let autofocus = false;

	let input: HTMLInputElement;

	let autocomplete: any;
	onMount(async () => {
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
			version: 'weekly',
			libraries: ['places']
		});
		const places = await loader.importLibrary('places');
		autocomplete = new places.Autocomplete(input, {
			types: ['premise', 'street_address'],
			// "address_components" is not used here but causes a shorter "name"
			fields: ['address_components', 'name'],
			componentRestrictions: { country: $searchFilter.toLowerCase() }
		});
		autocomplete.addListener('place_changed', () => {
			$searchQuery = autocomplete.getPlace().name;
			console.log(JSON.stringify(autocomplete.getPlace(), null, 2));
			goto(encodeURI(`/search?q=${autocomplete.getPlace().name}&filter=${$searchFilter}`));
		});
	});

	const handleSubmit = () => {
		goto(encodeURI(`/search?q=${$searchQuery}&filter=${$searchFilter}`));
	};

	const handleChange = () => {
		autocomplete.setComponentRestrictions({ country: $searchFilter.toLowerCase() });
		if ($page.url.pathname.startsWith('/search')) {
			goto(encodeURI(`/search?q=${$searchQuery}&filter=${$searchFilter}`));
		}
	};
</script>

<form class={`${classes.form} flex flex-row items-center`} on:submit|preventDefault={handleSubmit}>
	<div class="relative w-full sm:w-auto">
		<select
			class={`${classes.select} relative appearance-none focus:outline-none`}
			bind:value={$searchFilter}
			on:change={() => handleChange()}
			on:mouseleave={(e) => {
				e.currentTarget.blur();
			}}
			name="filter"
		>
			<optgroup label="Select a Region">
				<option value="%">Worldwide</option>
				<option value="US">United States</option>
				<option value="GB">United Kingdom</option>
				<option value="CA">Canada</option>
				<option value="AU">Australia</option>
				<option value="SG">Singapore</option>
				<option value="NZ">New Zealand</option>
				<option value="IE">Ireland</option>
				<option value="divider" disabled>-----------</option>
				<option value="AR">Argentina</option>
				<option value="AU">Australia</option>
				<option value="AT">Austria</option>
				<option value="BE">Belgium</option>
				<option value="BR">Brazil</option>
				<option value="CA">Canada</option>
				<option value="CL">Chile</option>
				<option value="CO">Colombia</option>
				<option value="HR">Croatia</option>
				<option value="CZ">Czechia</option>
				<option value="DK">Denmark</option>
				<option value="EE">Estonia</option>
				<option value="FI">Finland</option>
				<option value="FR">France</option>
				<option value="DE">Germany</option>
				<option value="HU">Hungary</option>
				<option value="IE">Ireland</option>
				<option value="IT">Italy</option>
				<option value="LV">Latvia</option>
				<option value="LT">Lithuania</option>
				<option value="LU">Luxembourg</option>
				<option value="MY">Malaysia</option>
				<option value="MX">Mexico</option>
				<option value="NL">Netherlands</option>
				<option value="NO">Norway</option>
				<option value="NZ">New Zealand</option>
				<option value="PL">Poland</option>
				<option value="PT">Portugal</option>
				<option value="PR">Puerto Rico</option>
				<option value="SG">Singapore</option>
				<option value="SK">Slovakia</option>
				<option value="SI">Slovenia</option>
				<option value="ES">Spain</option>
				<option value="SE">Sweden</option>
				<option value="CH">Switzerland</option>
				<option value="GB">United Kingdom</option>
				<option value="US">United States</option>
			</optgroup>
		</select>
		<p class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">&blacktriangledown;</p>
	</div>
	<div class="relative flex w-full sm:w-auto">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class={`${classes.input} peer focus:outline-none`}
			type="search"
			name="search"
			enterkeyhint="search"
			placeholder="Enter an address"
			bind:value={$searchQuery}
			bind:this={input}
			{autofocus}
		/>
		{#if type === 'primary'}
			<button type="submit" class={`${classes.button}`}>
				<div class="flex items-center justify-center">
					<SearchIcon class="h-2/5 w-2/5" />
				</div>
			</button>
		{/if}
	</div>
</form>

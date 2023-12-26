<script lang="ts">
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import type { Place, PlaceSubmission } from '$lib/types';
	import { goto } from '$app/navigation';
	import { full_address } from '$lib/utils.js';
	import type { protos } from '@googlemaps/addressvalidation';
	import { searchFilter } from '$lib/store.js';
	import { onMount } from 'svelte';
	import { Loader } from '@googlemaps/js-api-loader';

	export let data;

	let streetAddress = '';
	let locality = '';
	let administrativeArea = '';
	let regionCode = $searchFilter;
	let complexName = '';
	let validatedPlace: PlaceSubmission | null = null;

	let dialog: HTMLDialogElement;
	let addressInput: HTMLInputElement;

	$: if (dialog) {
		if (validatedPlace) dialog.showModal();
		else dialog.close();
	}

	let autocomplete: any;
	onMount(async () => {
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
			version: 'weekly',
			libraries: ['places']
		});
		const places = await loader.importLibrary('places');
		autocomplete = new places.Autocomplete(addressInput, {
			types: ['premise', 'street_address'],
			fields: ['address_components'],
			componentRestrictions: { country: regionCode ? regionCode.toLowerCase() : undefined }
		});
		autocomplete.addListener('place_changed', () => {
			for (const component of autocomplete.getPlace().address_components) {
				const componentType = component.types[0];

				switch (componentType) {
					case 'premise': {
						complexName = component.long_name;
						break;
					}

					case 'street_number': {
						streetAddress = component.long_name + ' ';
						break;
					}

					case 'route': {
						streetAddress += component.long_name;
						break;
					}

					case 'locality': {
						locality = component.long_name;
						break;
					}

					case 'administrative_area_level_1': {
						administrativeArea = component.short_name;
						break;
					}
				}
			}
		});
	});

	const handleSubmit = async () => {
		const res = await fetch(
			`https://addressvalidation.googleapis.com/v1:validateAddress?key=${PUBLIC_GOOGLE_MAPS_API_KEY}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					address: {
						regionCode,
						addressLines: [streetAddress, locality, administrativeArea]
					}
				})
			}
		);

		const validationResult: protos.google.maps.addressvalidation.v1.IValidationResult = (
			await res.json()
		).result;

		if (
			!validationResult.verdict ||
			validationResult.verdict.hasUnconfirmedComponents === true ||
			validationResult.verdict.addressComplete === false ||
			validationResult.verdict.inputGranularity !== 'PREMISE'
		) {
			alert(
				'Invalid address. Please provide a valid street address without apartment, suite, or PO Box numbers and try again.'
			);
			return;
		}

		validatedPlace = {
			street_address: validationResult.address?.postalAddress?.addressLines?.[0] || '',
			locality: validationResult.address?.postalAddress?.locality || '',
			administrative_area: validationResult.address?.postalAddress?.administrativeArea || '',
			country_code: validationResult.address?.postalAddress?.regionCode || '',
			name: complexName
		};

		if (
			!validatedPlace.street_address ||
			!validatedPlace.locality ||
			!validatedPlace.administrative_area ||
			!validatedPlace.country_code
		) {
			validatedPlace = null;
			alert('Something went wrong. Please try again.');
			return;
		}
	};

	const handleConfirm = async () => {
		if (!validatedPlace) {
			alert('Something went wrong. Please try again.');
			return;
		}

		const { data: matchingPlaces } = await data.supabase
			.from('places')
			.select()
			.eq('street_address', validatedPlace.street_address)
			.eq('administrative_area', validatedPlace.administrative_area)
			.eq('country_code', validatedPlace.country_code);

		console.log(matchingPlaces);

		if (matchingPlaces?.length) {
			alert('This property already exists.');
			validatedPlace = null;
			return;
		}

		const { status, error } = await data.supabase.from('places').insert(validatedPlace);

		if (status < 300) {
			alert('Property added successfully.');
			const { data: newPlace }: { data: Place[] | null } = await data.supabase
				.from('places')
				.select()
				.eq('street_address', validatedPlace.street_address)
				.eq('locality', validatedPlace.locality)
				.eq('administrative_area', validatedPlace.administrative_area)
				.eq('country_code', validatedPlace.country_code);
			if (newPlace?.[0]) goto(`/property/${newPlace[0].id}`);
		} else {
			alert('Submission failed: ' + error?.details);
		}
	};
</script>

<svelte:head>
	<title>Add a Property | Rate My Rentals</title>
</svelte:head>

<h1 class="text-3xl">Add a Rental Property</h1>

<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
	<div class="flex flex-col gap-1">
		<label for="filter">Country</label>
		<div class="relative">
			<select
				class="w-full appearance-none rounded-lg border-2 border-slate-300 px-2.5 py-1.5"
				name="filter"
				id="filter"
				bind:value={regionCode}
				on:change={() =>
					autocomplete.setComponentRestrictions({
						country: regionCode ? regionCode.toLowerCase() : undefined
					})}
				autocomplete="country-name"
				required
			>
				<optgroup label="Select a Country">
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
			<p class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
				&blacktriangledown;
			</p>
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<label for="street-address">Address</label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="street-address"
			type="text"
			id="street-address"
			bind:value={streetAddress}
			bind:this={addressInput}
			autocomplete="street-address"
			placeholder="e.g. 225 West 57th Street"
			required
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="city">City</label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="city"
			type="text"
			id="city"
			bind:value={locality}
			autocomplete="address-level2"
			placeholder="e.g. New York"
			required
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="administrative-area">Province/State</label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="administrative-area"
			type="text"
			id="administrative-area"
			bind:value={administrativeArea}
			autocomplete="address-level1"
			placeholder="e.g. New York"
			required
		/>
	</div>
	<div class="flex flex-col gap-1">
		<label for="complex-name">Complex Name <span class="text-slate-400">(optional)</span></label>
		<input
			class="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 focus:placeholder:text-transparent"
			name="complex-name"
			type="text"
			id="complex-name"
			bind:value={complexName}
			placeholder="e.g. Central Park Tower"
		/>
	</div>
	<div class="flex flex-row gap-1">
		<button
			type="button"
			class="flex-1 rounded-lg bg-slate-600 py-2.5 text-white"
			on:click={() => window.history.back()}
		>
			Cancel
		</button>
		<button class="flex-1 rounded-lg bg-blue-600 py-2.5 text-white" type="submit">Submit</button>
	</div>
</form>

<dialog class="w-full max-w-sm rounded-lg bg-white p-10" bind:this={dialog}>
	<div class="flex flex-col gap-3">
		<button
			type="button"
			class="absolute right-5 top-5 leading-none"
			on:click={() => (validatedPlace = null)}
		>
			&cross;
		</button>
		<p class="text-xl">Confirm Address</p>
		<p>
			Your address has been validated and standardized. Please confirm if this is the address you'd
			like to add:
		</p>
		{#if validatedPlace}
			<p class="rounded-lg border-2 border-slate-300 p-3">{full_address(validatedPlace)}</p>
		{/if}
		<button type="button" class="rounded-lg bg-blue-600 py-3 text-white" on:click={handleConfirm}>
			Confirm
		</button>
	</div>
</dialog>

export type Place = {
	id: string;
	name: string;
	alt_names: string[];
	street_address: string;
	units: string[];
	country_code: string;
	administrative_area: string;
	locality: string;
	landlords: string[];
	full_address?: string;
};

export type Review = {
	id: string;
	created_at: string;
	body: string;
	place_id: string;
	user_id: string;
	rating: number;
};

export type DialogState =
	| 'Closed'
	| 'Log In or Sign Up'
	| 'Loading'
	| 'Check Your Inbox'
	| 'Signing Out';

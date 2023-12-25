export type Place = {
	id: string;
	name?: string;
	street_address: string;
	country_code: string;
	administrative_area: string;
	locality: string;
	created_by: string;
	verified: boolean;
};

export type Review = {
	id: string;
	created_at: string;
	body: string;
	place_id: string;
	user_id: string;
	rating: number;
	landlord?: string;
	unit?: string;
	rent?: number;
};

export type DialogState =
	| 'Closed'
	| 'Log In or Sign Up'
	| 'Loading'
	| 'Check Your Inbox'
	| 'Signing Out';

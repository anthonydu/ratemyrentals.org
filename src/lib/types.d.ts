export type PlaceSubmission = {
	name: string;
	street_address: string;
	locality: string;
	administrative_area: string;
	country_code: string;
};

export type Place = PlaceSubmission & {
	id: string;
	created_by: string;
	verified: boolean;
};

export type ReviewBody = {
	body: string;
	place_id: string;
	rating: number;
	unit: string;
	landlord: string;
	rent?: number;
	term?: [string, string];
	beds?: number;
	baths?: number;
};

export type ReviewSubmission = ReviewBody & {
	edit_history: { updated_at: string; previous: ReviewBody }[];
};

export type Review = ReviewSubmission & {
	id: string;
	created_at: string;
	user_id: string;
};

export type DialogState =
	| 'Closed'
	| 'Log In or Sign Up'
	| 'Loading'
	| 'Check Your Inbox'
	| 'Signing Out';

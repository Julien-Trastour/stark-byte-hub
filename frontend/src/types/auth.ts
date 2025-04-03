export type RegisterPayload = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	address?: string;
	address2?: string;
	zipCode?: string;
	city?: string;
	country?: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

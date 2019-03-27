export interface User
{
	name: string;
	username: string;
	password: string;

	comparePassword(password: string): boolean;
}

import { User } from './user';

class MockedUser implements User
{

	public isInvalid = false;
	
	constructor(
		public name: string,
		public username: string,
		public password: string
	)
	{
	}

	comparePassword(password: string): boolean
	{
		return this.password == password;
	}

}


export const USER_MOCK: User[] = [
	new MockedUser('Mateus Sarmento', 'mateusmento', '123'),
]

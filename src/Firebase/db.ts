import { Roles } from '../State';
import { db } from './firebase';

// User API
export const doCreateUser = (id: string, username: string, email: string, roles: Roles): Promise<any> => {
	console.log("Hello?");
	return db.ref(`users/${id}`).set({
		email,
		username,
		roles
	});
};

export const getUsers = () => db.ref('users').once('value');
export const getUserById = (uid: string) => db.ref(`users/${uid}`).once('value');

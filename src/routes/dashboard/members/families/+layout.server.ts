import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// Not authenticated, redirect to login
		throw redirect(303, '/');
	}

	// You can expose user info to child pages if needed
	return {
		user: {
			id: locals.user.id,
			email: locals.user.email,
			username: locals.user.username
		}
	};
};

import { redirect } from "@sveltejs/kit";

export async function load( {locals}){
    if (!locals.user) {
        throw redirect(303, '/');
    }
    const profile = locals.profile

    return {
        accountName: profile.accountName,
        role: profile.role,
        password: profile.password,
        email: profile.email
	};
}
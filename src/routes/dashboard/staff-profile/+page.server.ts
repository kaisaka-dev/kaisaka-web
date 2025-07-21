import { redirect } from "@sveltejs/kit";
import type { staff } from '$lib/types/staff.js'

export async function load( {locals}){
    if (!locals.user) {
        throw redirect(303, '/');
    }
    const profile = locals.profile

    return {
        accountName: profile.accountName,
        email: profile.email
	};
}
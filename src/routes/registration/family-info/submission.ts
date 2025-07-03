import type { ChildFormData } from '$lib/stores/childForm.js';

async function safeFetch<T = any>(url: string, payload: any): Promise<T> {
	const res = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Failed to POST ${url}: ${error}`);
	}
	return await res.json();
}

export async function submitChildRegData(childRegData: Partial<ChildFormData>): Promise<{ success: boolean; childId?: string }>{
	try {
		// Insert address
		const addressData = await safeFetch('/api/addresses', childRegData.address);
		console.log(addressData.message)
		childRegData.member!.address_id = addressData.data.id;

		// Insert member
		const memberData = await safeFetch('/api/members', childRegData.member);
		console.log(memberData.message)
		const memberId = memberData.data.id;

		var pwdId = null;

		//insert PWD ID
		if(childRegData.pwd_id !== undefined){
			const pwdIdData = await safeFetch('/api/pwd_ids', childRegData.pwd_id);
			console.log(pwdIdData.message)
			pwdId = pwdIdData.data.id;
		}

		// Insert child info
		childRegData.child!.member_id = memberId;
		childRegData.child!.pwd_id = pwdId;
		const childData = await safeFetch('/api/children', childRegData.child);
		console.log(childData.message)
		const childId = childData.data.id;

		// Insert education status
		childRegData.education_status!.child_id = childId;
		const eduStatusData = await safeFetch('/api/education_status', childRegData.education_status);
		console.log(eduStatusData.message)

		// Insert social protection status
		childRegData.social_protection_status!.child_id = childId;
		const socProtStatusData = await safeFetch('/api/social_protection_status', childRegData.social_protection_status);
		console.log(socProtStatusData.message)

		// Insert employment status
		childRegData.employment_status!.member_id = memberId;
		const empStatusData = await safeFetch('/api/employment_status', childRegData.employment_status);
		console.log(empStatusData.message)
		
		console.log('All data successfully inserted!');

		return { success: true, childId };
	}
	catch (err){
		console.log("failed to submit data.");
		throw err;
	}
}
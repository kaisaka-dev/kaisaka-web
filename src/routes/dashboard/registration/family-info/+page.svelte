<script lang="ts">

	import Header from '../../../components/Header.svelte';
	import CaregiverForm from './CaregiverForm.svelte';
	import { childFormData } from '$lib/stores/childForm.js';
	import { get } from 'svelte/store';

	const childRegData = get(childFormData)
	console.log(childRegData);

	/**
	 * object type used to store information about a new caregiver.
	 */
	type NewCaregiver = {
		type: 'new';
		firstName: string;
		lastName: string;
		bday: string;
		sex: string;
		contactNo: string;
		fbLink?: string;
		email?: string;
		address: string;
		brgy: string;
		occupation: string;
		relationship: string;
		communityGrp_id: number;
	};

	/**
	 * object type used to store information about a linked caregiver
	 */
	type LinkedCaregiver = {
		// info about the search
		type: 'linked';
		firstName: string;
		lastName: string;
		contactNo: string;

		// info of a list of family members which are linked to the searched family member
		infoLinked: InfoLinked[];

	};

	/**
	 * object type used to store information about the searched caregiver
	 */
	type InfoLinked = {
		caregiver_id: string;
		firstName: string;
		lastName: string;
		contactNo: string;
		relationship: string;
	}

	type Caregiver =
		| NewCaregiver
		| LinkedCaregiver;

	type CaregiverError =
		| {			// for new caregivers
		firstName: string;
		lastName: string;
		sex: string;
		contactNo: string;
		address: string;
		brgy: string;
	}				// for existing caregivers
		| { msg: string };

	let caregivers = $state<Caregiver[]>([
		{
			type: 'new', // explicit discriminator
			firstName: '',
			lastName: '',
			bday: '',
			sex: '',
			contactNo: '',
			fbLink: '',
			email: '',
			address: '',
			brgy: '',
			occupation: '',
			relationship: '',
			communityGrp_id: -1
		}
	]); // initialize variable so that the page will have at least one caregiver

	let caregiverErrors = $state<CaregiverError[]>(
		caregivers.map((caregiver) => {
			return caregiver.type === 'new'
				? {
					firstName: '',
					lastName: '',
					sex: '',
					contactNo: '',
					address: '',
					brgy: ''
				}
				: { msg: '' };
		})
	);

	function addNewCaregiver() {
		caregivers = [
			...caregivers,
			{
				type: 'new',
				firstName: '',
				lastName: '',
				bday: '',
				sex: '',
				contactNo: '',
				fbLink: '',
				email: '',
				address: '',
				brgy: '',
				occupation: '',
				relationship: '',
				communityGrp_id: -1
			}
		];

		caregiverErrors = [
			...caregiverErrors,
			{
				firstName: '',
				lastName: '',
				sex: '',
				contactNo: '',
				brgy: '',
				address: ''
			}
		];
	}

	/**
	 * deletes item from the array (reflected on the ui too)
	 * @param index
	 */
	function deleteCaregiver(index: number) {
		caregivers = caregivers.filter((_, i) => i !== index);
		caregiverErrors = caregiverErrors.filter((_, i) => i !== index);
	}

	/**
	 * checks if a linked caregiver exists
	 * returns the index if a family is linked
	 * returns -1 if not
	 */
	let linkedIndex = $derived(caregivers.findIndex(g => g.type === 'linked'));

	// // will re-run whenever `caregivers` is changed
	// $effect(() =>
	// {
	// 	console.log("linkedindex variable: ", linkedIndex)
	// 	console.log(caregivers)
	// })

	function validateForm(): boolean {
		let isValid = true;

		caregiverErrors = caregivers.map((caregiver, index) => {
			if (caregiver.type === 'linked') {
				if (!caregiver.infoLinked || caregiver.infoLinked.length === 0) {
					isValid = false;
					return { msg: "Please have at least one family member" };
				}
				return { msg: '' };
			} else {
				const errors = {
					firstName: !caregiver.firstName.trim() ? 'Required' : '',
					lastName: !caregiver.lastName.trim() ? 'Required' : '',
					sex: !caregiver.sex ? 'Required' : '',
					contactNo: !caregiver.contactNo.trim() ? 'Required' : '',
					address: !caregiver.address.trim() ? 'Required' : '',
					brgy: !caregiver.brgy ? 'Required' : ''
				};
				if (Object.values(errors).some(msg => msg)) isValid = false;
				return errors;
			}
		});

		return isValid;
	}

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

	async function handleSubmit() {
		try {
			if (!validateForm()) return;
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
		} catch (err) {
			console.error('Submission failed:', err);
		}

    }
</script>

<Header category="members" page="children" />

<section>
	<h1>Family Information</h1>

	{#each caregivers as caregiver, index (index + caregiver.firstName + caregiver.lastName + caregiver.contactNo + caregiver.type)}
		<CaregiverForm
			bind:formData={caregivers[index]}
			errors={caregiverErrors[index]}
			{index}
			{linkedIndex}
			deleteCaregiver={deleteCaregiver}
		/>
	{/each}

	<br>
	<button id="caregiver-1" onclick={addNewCaregiver}>Add another caregiver</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = '/registration/child'}>Back</button>

	<button class="green" onclick="{handleSubmit}">Submit</button>
</section>
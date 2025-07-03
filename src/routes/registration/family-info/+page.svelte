<script lang="ts">

	import Header from '../../../components/Header.svelte';
	import CaregiverForm from './CaregiverForm.svelte';
	import type { Caregiver, CaregiverError } from './caregiverFormTypes.js';
	import { submitCaregivers, addToFamily } from '../submission.js';

	import { browser } from '$app/environment';

	let childId: string | null = null;

	if (browser) {
		const url = new URL(window.location.href);
		childId = url.searchParams.get('childId');
	}

	console.log(childId)


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
			brgy: -1,
			occupation: '',
			relationship: '',
			communityGrp_id: -1,
			income: -1
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
				brgy: -1,
				occupation: '',
				relationship: '',
				communityGrp_id: -1,
				income: -1
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
					brgy: caregiver.brgy === -1 ? 'Required' : ''
				};
				if (Object.values(errors).some(msg => msg)) isValid = false;
				return errors;
			}
		});

		return isValid;
	}

	async function handleSubmit() {
		try {
			if (!validateForm()) return;
			if (!childId) throw "childId not found!";
			const caregiverRes = await submitCaregivers(caregivers, childId)
			const familyRes = await addToFamily(caregiverRes.newCaregiverMemberIds, childId, caregiverRes.family_id)
			
			if (familyRes) console.log('successfully added caregivers and family.')
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
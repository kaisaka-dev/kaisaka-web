<script lang="ts">

	import Header from '../../../components/Header.svelte';
	import GuardianForm from './GuardianForm.svelte';


	/**
	 * object type used to store information about a new guardian.
	 */
	type NewGuardian = {
		type: 'new';
		firstName: string;
		lastName: string;
		sex: string;
		contactNo: string;
		fbLink?: string;
		email?: string;
		address: string;
		brgy: string;
		occupation: string;
		relationship: string;
	};

	/**
	 * object type used to store information about a linked guardian
	 */
	type LinkedGuardian = {
		// info about the search
		type: 'linked';
		firstName: string;
		lastName: string;
		contactNo: string;

		// info of a list of family members which are linked to the searched family member
		infoLinked: InfoLinked[];

	};

	/**
	 * object type used to store information about the searched guardian
	 */
	type InfoLinked = {
		guardian_id: number;
		firstName: string;
		lastName: string;
		contactNo: string;
		relationship: string;
	}

	type Guardian =
		| NewGuardian
		| LinkedGuardian;

	type GuardianError =
		| {			// for new guardians
		firstName: string;
		lastName: string;
		sex: string;
		contactNo: string;
		address: string;
		brgy: string;
	}				// for existing guardians
		| { msg: string };

	let guardians = $state<Guardian[]>([
		{
			type: 'new', // explicit discriminator
			firstName: '',
			lastName: '',
			sex: '',
			contactNo: '',
			fbLink: '',
			email: '',
			address: '',
			brgy: '',
			occupation: '',
			relationship: ''
		}
	]); // initialize variable so that the page will have at least one guardian

	let guardianErrors = $state<GuardianError[]>(
		guardians.map((guardian) => {
			return guardian.type === 'new'
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

	function addNewGuardian() {
		guardians = [
			...guardians,
			{
				type: 'new',
				firstName: '',
				lastName: '',
				sex: '',
				contactNo: '',
				fbLink: '',
				email: '',
				address: '',
				brgy: '',
				occupation: '',
				relationship: ''
			}
		];

		guardianErrors = [
			...guardianErrors,
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
	function deleteGuardian(index: number) {
		guardians = guardians.filter((_, i) => i !== index);
		guardianErrors = guardianErrors.filter((_, i) => i !== index);
	}

	/**
	 * checks if a linked guardian exists
	 * returns the index if a family is linked
	 * returns -1 if not
	 */
	let linkedIndex = $derived(guardians.findIndex(g => g.type === 'linked'));

	// // will re-run whenever `guardians` is changed
	// $effect(() =>
	// {
	// 	console.log("linkedindex variable: ", linkedIndex)
	// 	console.log(guardians)
	// })

	function validateForm(): boolean {
		let isValid = true;

		guardianErrors = guardians.map((guardian, index) => {
			if (guardian.type === 'linked') {
				if (!guardian.infoLinked || guardian.infoLinked.length === 0) {
					isValid = false;
					return { msg: "Please have at least one family member" };
				}
				return { msg: '' };
			} else {
				const errors = {
					firstName: !guardian.firstName.trim() ? 'Required' : '',
					lastName: !guardian.lastName.trim() ? 'Required' : '',
					sex: !guardian.sex ? 'Required' : '',
					contactNo: !guardian.contactNo.trim() ? 'Required' : '',
					address: !guardian.address.trim() ? 'Required' : '',
					brgy: !guardian.brgy ? 'Required' : ''
				};
				if (Object.values(errors).some(msg => msg)) isValid = false;
				return errors;
			}
		});

		return isValid;
	}


</script>

<Header category="members" page="children" />

<section>
	<h1>Family Information</h1>

	{#each guardians as guardian, index (index + guardian.firstName + guardian.lastName + guardian.contactNo + guardian.type)}
		<GuardianForm
			bind:formData={guardians[index]}
			errors={guardianErrors[index]}
			{index}
			{linkedIndex}
			deleteGuardian={deleteGuardian}
		/>
	{/each}

	<br>
	<button id="guardian-1" onclick={addNewGuardian}>Add another guardian</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = '/registration/child'}>Back</button>
	<button class="green" onclick="{validateForm}">Submit</button>
</section>
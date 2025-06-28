<script lang="ts">

	import Header from '../../../components/Header.svelte';
	import GuardianForm from './GuardianForm.svelte';


	/**
	 * object type used to store information about a new guardian.
	 */
	type NewGuardian = {
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
		| (NewGuardian & { type: 'new' })
		| (LinkedGuardian & { type: 'linked' });

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

	let guardianErrors = $state(guardians.map(() => ({
		firstName: '',
		lastName: '',
		sex: '',
		contactNo: '',
		fbLink: '',
		address: ''
	})));

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
				fbLink: '',
				address: ''
			}
		];
	}

	// function linkOldGuardian() {
	// 	guardians = [
	// 		...guardians,
	// 		{
	// 			guardian_id: -100,
	// 			relationship: ''
	// 		}
	// 	]
	//
	// 	guardianErrors = [
	// 		...guardianErrors,
	// 		{
	// 			guardian_id: ''
	// 		}
	// 	]
	// }

	/**
	 * deletes item from the array (reflected on the ui too)
	 * @param index
	 */
	function deleteGuardian(index: number) {
		guardians = guardians.filter((_, i) => i !== index);
		guardianErrors = guardianErrors.filter((_, i) => i !== index);
	}
</script>

<Header category="members" page="children" />

<section>
	<h1>Family Information</h1>

	{#each guardians as _, index}
		<GuardianForm
			bind:formData={guardians[index]}
			errors={guardianErrors[index]}
			{index}
			deleteGuardian={deleteGuardian}
		/>
	{/each}

	<br>
	<button id="guardian-1" onclick={addNewGuardian}>Add another guardian</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = '/registration/child'}>Back</button>
	<button class="green">Submit</button>
</section>
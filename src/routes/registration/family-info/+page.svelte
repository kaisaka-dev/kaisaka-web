<script lang="ts">

	import Checkbox from '../../../components/input/Checkbox.svelte';
	import Header from '../../../components/Header.svelte';
	import GuardianForm from './GuardianForm.svelte';
	type NewGuardian = {
		firstName: string;
		lastName: string;
		sex: string;
		contactNo: string;
		fbLink: string;
		email: string;
		address: string;
		brgy: string;
		occupation: string;
		relationship: string;
	};

	type LinkedGuardian = {
		guardian_id: number;
		relationship: string;
	};

	type Guardian = NewGuardian | LinkedGuardian;

	let guardians = $state<Guardian[]>([
		{
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
	]);

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

	function linkOldGuardian() {
		guardians = [
			...guardians,
			{
				guardian_id: -100,
				relationship: ''
			}
		]

		guardianErrors = [
			...guardianErrors,
			{
				guardian_id: ''
			}
		]
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
		/>
	{/each}

	<br>
	<button id="guardian-1" onclick={addNewGuardian}>Add another guardian</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = '/registration/child'}>Back</button>
	<button class="green">Submit</button>
</section>
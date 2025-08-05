<script lang="ts">
	import InputText from '$components/input/InputText.svelte';
	import Select from '$components/input/Select.svelte';
	import type {  NewCaregiver, CaregiverError } from '$lib/types/registrationForm.js';


	export let formData: NewCaregiver;
	export let errors: CaregiverError;
	export let index: number;
	export let deleteCaregiver: (index: number) => void;
	export let options;



</script>

<div class="collapse collapse-arrow" style="box-shadow: 0 4px 0 var(--border); border-radius:0px">
	<input type="checkbox" checked/>
	<h2 class="collapse-title font-semibold">Caregiver {index + 1}</h2>
	<div class="collapse-content text-sm">

			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} required msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} required msg={errors.lastName} />
			<InputText label="Birthday" id="bday" bind:value={formData.bday} type="date" />
			<Select label="Sex" id={`sex-${index}`} options={options.sex} required bind:value={formData.sex} msg={errors.sex} />
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} required msg={errors.contactNo} />
			<InputText label="Facebook Link" id={`fb-link-${index}`} bind:value={formData.fbLink} />
			<InputText label="Email" id={`email-${index}`} bind:value={formData.email} msg={errors.email}/>
			<InputText label="Address" id={`address-${index}`} bind:value={formData.address} required msg={errors.address} />
			<InputText label="Barangay" id={`brgy-${index}`} required bind:value={formData.brgy} msg={errors.brgy} />
			<InputText label="Occupation" id={`occupation-${index}`} bind:value={formData.occupation} />
			<InputText label="Relationship" id={`relationship-${index}`} bind:value={formData.relationship} />
			<Select label="Community Group" id={`community-grp-${index}`} options={options.comGroupType} bind:value={formData.communityGrp_id} />
			<Select label="Income Generation" id={`income-${index}`} options={options.incomeType} bind:value={formData.income} />
			{#if formData.communityGrp_id != null }
				<InputText label="Year Joined (Community Group)" id={`community-grp-yr-${index}`} bind:value={formData.communityYr} required msg={errors.communityYr} />
			{/if}





		<div class="input-container">
			<button on:click={() => deleteCaregiver(index)}>Delete</button>
		</div>



	</div>
</div>
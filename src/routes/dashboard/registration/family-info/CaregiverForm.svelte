<script lang="ts">
	import InputText from '$components/input/InputText.svelte';
	import Select from '$components/input/Select.svelte';
	import type {  NewCaregiver, CaregiverError } from '$lib/types/registrationForm.js';
	import HistoryCommunityGroup from '../../members/caregivers/profile/components/HistoryCommunityGroup.svelte';
	import HistoryIncomeType from '../../members/caregivers/profile/components/HistoryIncomeType.svelte';


	export let formData: NewCaregiver;
	export let errors: CaregiverError;
	export let index: number;
	export let deleteCaregiver: (index: number) => void;
	export let options;
	export let disabled: boolean = false;

	// Transform NewCaregiver communityGrp to Community format for HistoryCommunityGroup component
	let communityData;
	$: communityData = formData.communityGrp.map((comm, idx) => ({
		id: idx,
		community_group_id: comm.id,
		date_joined: comm.yrFrom || new Date().toISOString().split('T')[0],
		date_left: comm.yrTo || null,
		name: '',
		isDeleted: false,
		isNew: true
	}));

	// Transform NewCaregiver income to Income format for HistoryIncomeType component
	let incomeData;
	$: incomeData = formData.income.map((inc, idx) => ({
		id: idx,
		income_category: inc.type,
		date_start: inc.yrFrom || new Date().toISOString().split('T')[0],
		date_end: inc.yrTo || null,
		isDeleted: false,
		isNew: true
	}));

	// Sync changes back to formData
	$: {
		if (communityData) {
			const activeCommunities = communityData.filter(c => !c.isDeleted);
			formData.communityGrp = activeCommunities.map(c => ({
				id: c.community_group_id,
				yrFrom: c.date_joined,
				yrTo: c.date_left
			}));
		}
	}

	$: {
		if (incomeData) {
			const activeIncomes = incomeData.filter(i => !i.isDeleted);
			formData.income = activeIncomes.map(i => ({
				type: i.income_category,
				yrFrom: i.date_start,
				yrTo: i.date_end
			}));
		}
	}

</script>

<section>
	<h1 class="flex justify-between items-center">
		Caregiver Information
		<button class="green" onclick={() => deleteCaregiver(index)}>
			<i class="fa-solid fa-trash"></i>
		</button>
	</h1>

			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} required msg={errors.firstName} {disabled}/>
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} required msg={errors.lastName} {disabled}/>
			<InputText label="Birthday" id="bday" bind:value={formData.bday} type="date" msg={errors.bday} {disabled}/>
			<Select label="Sex" id={`sex-${index}`} options={options.sex} required bind:value={formData.sex} msg={errors.sex} {disabled}/>
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} required msg={errors.contactNo} {disabled}/>
			<InputText label="Facebook Link" id={`fb-link-${index}`} bind:value={formData.fbLink} {disabled}/>
			<InputText label="Email" id={`email-${index}`} bind:value={formData.email} msg={errors.email} {disabled}/>
			<InputText label="Address" id={`address-${index}`} bind:value={formData.address} required msg={errors.address} {disabled}/>
			<InputText label="Barangay" id={`brgy-${index}`} required bind:value={formData.brgy} msg={errors.brgy} {disabled}/>
			<InputText label="Occupation" id={`occupation-${index}`} bind:value={formData.occupation} {disabled}/>
			<InputText label="Family role" id={`relationship-${index}`} bind:value={formData.relationship} {disabled}/>
			<InputText type="month" label="Admission Date" id={`admission-${index}`} bind:value={formData.admission_date} msg={errors.admissionDate} required {disabled}/>

</section>

<section class="ml-[2rem]">
	<HistoryCommunityGroup
		id={`community-${index}`}
		bind:data={communityData}
		editing={!disabled}
		error=""
	/>
</section>

<section class="ml-[2rem]">
	<HistoryIncomeType
		id={`income-${index}`}
		bind:data={incomeData}
		editing={!disabled}
		error=""
	/>
</section>



<style>
    i {
        color: var(--error-color);
    }
    i:hover {
        cursor: pointer;
        transition-duration: 0.2s;
        color: var(--background);
    }
    h1 button:hover {
        background-color: transparent;
    }
</style>



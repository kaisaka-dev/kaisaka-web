<script lang="ts">
	import InputText from '$components/input/InputText.svelte';
	import Select from '$components/input/Select.svelte';
	import type {  NewCaregiver, CaregiverError } from '$lib/types/registrationForm.js';
	import InputRange from '$components/input/InputRange.svelte';
	import HistoryCommunityGroup from '../../members/caregivers/profile/components/HistoryCommunityGroup.svelte';
	import HistoryIncomeType from '../../members/caregivers/profile/components/HistoryIncomeType.svelte';


	export let formData: NewCaregiver;
	export let errors: CaregiverError;
	export let index: number;
	export let deleteCaregiver: (index: number) => void;
	export let options;

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



			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} required msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} required msg={errors.lastName} />
			<InputText label="Birthday" id="bday" bind:value={formData.bday} type="date" msg={errors.bday} />
			<Select label="Sex" id={`sex-${index}`} options={options.sex} required bind:value={formData.sex} msg={errors.sex} />
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} required msg={errors.contactNo} />
			<InputText label="Facebook Link" id={`fb-link-${index}`} bind:value={formData.fbLink} />
			<InputText label="Email" id={`email-${index}`} bind:value={formData.email} msg={errors.email}/>
			<InputText label="Address" id={`address-${index}`} bind:value={formData.address} required msg={errors.address} />
			<InputText label="Barangay" id={`brgy-${index}`} required bind:value={formData.brgy} msg={errors.brgy} />
			<InputText label="Occupation" id={`occupation-${index}`} bind:value={formData.occupation} />
			<InputText label="Family role" id={`relationship-${index}`} bind:value={formData.relationship} />
			


<section class="ml-[2rem]">
	<HistoryCommunityGroup
		id={`community-${index}`}
		bind:data={communityData}
		editing={true}
		error=""
	/>
</section>

<section class="ml-[2rem]">
	<HistoryIncomeType
		id={`income-${index}`}
		bind:data={incomeData}
		editing={true}
		error=""
	/>
</section>




		<div class="input-container">
			<button on:click={() => deleteCaregiver(index)}>Delete</button>
		</div>




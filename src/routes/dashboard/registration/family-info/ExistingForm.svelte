<script lang="ts">
	import InputText from '$components/input/InputText.svelte';
	import SearchBtn from '$components/styled-buttons/SearchBtn.svelte';
	import Validation from '$components/text/Validation.svelte';
	import type { FamilyMembers, MemberListFamily } from '$lib/types/registrationForm.js';
	import Checkbox from '$components/input/Checkbox.svelte';
	import Select from '$components/input/Select.svelte';

	export let formData: FamilyMembers;
	export let error_msg: string = "";
	export let members: MemberListFamily[];
	export let showtable: false;
	export let isChildView: true;
	let showMultipleResults = false;
	let foundMembers: { family_id: string, label: string, member: MemberListFamily }[] = [];
	let selectedFamilyId: string = '';
	let CWD = "CWD";		// for the disabled text field display
	let Caregiver = "Caregiver"; // for the disabled text field display

/**
 * function passed to SearchBtn, shows table if the search is valid. else, error messages are shown
 */
function handleSearch() {
	showtable = false;
	showMultipleResults = false;
	foundMembers = [];
	selectedFamilyId = '';

	const hasName = Boolean(formData.linkedFamily.firstName.trim()) && Boolean(formData.linkedFamily.lastName.trim());
	const hasContact = Boolean(formData.linkedFamily.contactNo.trim());
	const incompleteFields = !hasName && !hasContact
	error_msg = incompleteFields ? "Fill both Names or Contact No." : ""

	// if fields are complete, proceed to search
	if (!incompleteFields) {
		// 1. find all matching members
		const matchingMembers = members.filter(member =>
			(hasName &&
				member.firstName.toLowerCase().trim().includes(formData.linkedFamily.firstName.toLowerCase().trim()) &&
				member.lastName.toLowerCase().trim().includes(formData.linkedFamily.lastName.toLowerCase().trim())) ||
			(hasContact && member.contactNo.replace(/\s/g, '') === formData.linkedFamily.contactNo.replace(/\s/g, ''))
		);

		console.log('Found members:', matchingMembers);

		if (matchingMembers.length === 0) {
			error_msg = "No matching family members found";
		} else if (matchingMembers.length === 1) {
			// single result - automatically selects that one
			const foundMember = matchingMembers[0];
			selectFamily(foundMember);
		} else {
			// multiple results - show selection dropdown
			foundMembers = matchingMembers.map(member => ({
				family_id: member.family_id,
				label: `${member.firstName} ${member.lastName} - ${member.contactNo}`,
				member: member
			}));
			showMultipleResults = true;
			error_msg = "Multiple matches found. Please select one:";
		}
	}
}

	function selectFamily(foundMember: MemberListFamily) {
		// 2. set the family ID
		formData.linkedFamily.family_id = foundMember.family_id;

		// 3. find all members with same family ID
		formData.linkedFamily.infoLinked = members
			.filter(m => m.family_id === foundMember.family_id)
			.map(member => ({
				member_id: member.member_id,
				caregiver_id: null,			// TODO: caregiver id
				firstName: member.firstName,
				lastName: member.lastName,
				contactNo: member.contactNo,
				relationship: member.relationship || ''
			}));

		showtable = true;
		showMultipleResults = false;
	}

	function onFamilySelect(selectedFamilyId: string) {
		if (selectedFamilyId) {
			const selectedMember = foundMembers.find(fm => fm.family_id === selectedFamilyId)?.member;
			if (selectedMember) {
				selectFamily(selectedMember);
				error_msg = '';
			}
		}
	}

	// Create options for the Select component
	$: selectOptions = foundMembers.map(fm => ({
		id: fm.family_id,
		name: fm.label
	}));

$: onFamilySelect(selectedFamilyId)

</script>



	<h2>Do you have family members who are already registered to Kaisaka?</h2>
	<Checkbox label="existing" id="existing" bind:checked={formData.hasExisting}/>
	{#if formData.hasExisting}
		<div class="!m-[35px]">Search your family member:</div>

		<InputText label="First name" id='first-name-exist' bind:value={formData.linkedFamily.firstName} />
		<InputText label="Last name" id='last-name-exist' bind:value={formData.linkedFamily.lastName} />
		<div style="width:720px; text-align:center;" class="flex gap-4 items-center ml-6 mb-1">
			<div class="flex-grow border-t border-gray-400"></div>
			<span class="text-sm">or</span>
			<div class="flex-grow border-t border-gray-400"></div>
		</div>
		<InputText label="Contact No." id='contact-no-exist' bind:value={formData.linkedFamily.contactNo} />

		<div style="display: flex; flex-direction: row; width:740px; margin-top: 2rem">
			<Validation msg="{error_msg}"style="width: 300px; margin-left: 2rem; font-size: var(--medium-text)"/>

			<div style="margin-left: auto">
				<SearchBtn onSearch={handleSearch} /></div></div>

			{#if showMultipleResults}
				<br>
				<Select
					label="Select Family Member"
					id="family-select"
					options={selectOptions}
					bind:value={selectedFamilyId}
				/>
			{/if}


			{#if showtable}
				<br>
				<div class="input-container">
					<table>
						<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Contact No.</th>
							<th>Relationship</th>
						</tr>
						</thead>
						<tbody>
						{#each formData.linkedFamily.infoLinked as _, linked_i}
							<tr>
								<td>{formData.linkedFamily.infoLinked[linked_i].firstName}</td>
								<td>{formData.linkedFamily.infoLinked[linked_i].lastName}</td>
								<td>{formData.linkedFamily.infoLinked[linked_i].contactNo}</td>
								{#if  isChildView }
									{#if formData.linkedFamily.infoLinked[linked_i].caregiver_id != null}
									<td><InputText id="relationship-{linked_i}" bind:value={formData.linkedFamily.infoLinked[linked_i].relationship}/></td>
									{:else}
									<td><InputText id="relationship-{linked_i}" bind:value={CWD} disabled/></td>
									{/if}
								{:else}
									{#if formData.linkedFamily.infoLinked[linked_i].caregiver_id != null}
										<td><InputText id="relationship-{linked_i}" bind:value={formData.linkedFamily.infoLinked[linked_i].relationship} /></td>
									{:else}
										<td><InputText id="relationship-{linked_i}" bind:value={formData.linkedFamily.infoLinked[linked_i].relationship} disabled /></td>
									{/if}
								{/if}
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			{/if}


		<div style="box-shadow: 0 4px 0 var(--border); width: 100%">
			<br>
		</div>
	{:else}
		<div style="box-shadow: 0 4px 0 var(--border); width: 100%">
			<br>
		</div>
		<div class="!m-[35px]">If not, add a new caregiver with the button below!</div>

	{/if}





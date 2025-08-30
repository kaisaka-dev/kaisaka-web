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
	export let showTable: false;
	export let disabled: false;
	export let isChildView: boolean = true;
	export let memberName: string = "";
	export let memberId: string = "";
	export let onFamilyRemoval: (() => void) | undefined = undefined;

	let showMultipleResults = false;
	let foundMembers: { family_id: string, label: string, member: MemberListFamily }[] = [];
	let selectedFamilyId: string = '';
	let showFamilyOptions = false;
	let selectedMember: MemberListFamily | null = null;

	/**
	 * function passed to SearchBtn, shows table if the search is valid. else, error messages are shown
	 */
	function handleSearch() {
		showTable = false;
		showMultipleResults = false;
		showFamilyOptions = false;
		foundMembers = [];
		selectedFamilyId = '';
		selectedMember = null;

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
				// single result - show family options
				selectedMember = matchingMembers[0];
				showFamilyChoiceOptions(selectedMember);
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

	function showFamilyChoiceOptions(foundMember: MemberListFamily) {
		selectedMember = foundMember;
		showFamilyOptions = true;
		showMultipleResults = false;
		error_msg = "";
	}

	function selectJustPerson(foundMember: MemberListFamily) {
		// Store the member info but mark as creating new family
		formData.linkedFamily.type = 'create_new_with_person';
		// 2. set family ID as empty (will create new family)
		formData.linkedFamily.family_id = ''; // Will create new family

		// 3. add searched person only
		formData.linkedFamily.infoLinked = [{
			member_id: foundMember.member_id,
			caregiver_id: foundMember.caregiver_id,
			firstName: foundMember.firstName,
			lastName: foundMember.lastName,
			contactNo: foundMember.contactNo,
			relationship: foundMember.relationship || ''
		}];

		showTable = true;
		showFamilyOptions = false;
	}

	function selectEntireFamily(foundMember: MemberListFamily) {
		// Mark as joining existing family
		formData.linkedFamily.type = 'join_existing';
		// 2. set the family ID
		formData.linkedFamily.family_id = foundMember.family_id;

		// 3. find all members with same family ID
		formData.linkedFamily.infoLinked = members
			.filter(m => m.family_id === foundMember.family_id)
			.map(member => ({
				member_id: member.member_id,
				caregiver_id: member.caregiver_id,
				firstName: member.firstName,
				lastName: member.lastName,
				contactNo: member.contactNo,
				relationship: member.relationship || ''
			}));

		showTable = true;
		showFamilyOptions = false;
	}

	function onFamilySelect(selectedFamilyId: string) {
		if (selectedFamilyId) {
			const foundMember = foundMembers.find(fm => fm.family_id === selectedFamilyId)?.member;
			if (foundMember) {
				showFamilyChoiceOptions(foundMember);
			}
		}
	}

	// Create options for the Select component
	$: selectOptions = foundMembers.map(fm => ({
		id: fm.family_id,
		name: fm.label
	}));

	$: onFamilySelect(selectedFamilyId)

	function removeFromFamily() {
		// Clear all linked family data when removing the current member
		if (formData.hasExisting) {
			formData.hasExisting = false;
			formData.linkedFamily = {
				type: 'linked',
				family_id: "",
				firstName: "",
				lastName: "",
				contactNo: "",
				infoLinked: []
			};
			showTable = false;
			
			// Notify parent component that a family removal occurred
			if (onFamilyRemoval) {
				onFamilyRemoval();
			}
		}
	}

</script>



<h2>Do you have family members who are already registered to Kaisaka?</h2>
<Checkbox label="existing" id="existing" bind:checked={formData.hasExisting}/>

<div style="box-shadow: 0 4px 0 var(--border); width: 100%">
	<br>
</div>
{#if formData.hasExisting}
	<div class="!my-[35px]">
		Search your family member:
	</div>

	<InputText label="First name" id='first-name-exist' bind:value={formData.linkedFamily.firstName} />
	<InputText label="Last name" id='last-name-exist' bind:value={formData.linkedFamily.lastName} />
	<div style="width:720px; text-align:center;" class="flex gap-4 items-center mb-1">
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

	{#if showFamilyOptions && selectedMember}
		<br>
		<div class="bg-gray-50 border border-gray-300 rounded-lg p-5 my-3">
			<h3 class="!text-[var(--green)] m-0 mb-3">Found: {selectedMember.firstName} {selectedMember.lastName}</h3>
			<p class="m-0 mb-4">Would you like to add:</p>
			
			<div class="choice-buttons">
				<button class="choice-btn" onclick={() => selectJustPerson(selectedMember)}>
					<i class="bi bi-person-fill"></i>
					Just this person
				</button>
				
				<button class="choice-btn" onclick={() => selectEntireFamily(selectedMember)}>
					<i class="bi bi-people-fill"></i>
					Entire family ({members.filter(m => m.family_id === selectedMember.family_id).length} members)
				</button>
			</div>
		</div>
	{/if}


	{#if showTable}
		<br>
		<div class="input-container">
			<table>
				<thead>
				<tr>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Contact No.</th>
					<th class="w-[410px]">Relationship</th>
				</tr>
				</thead>
				<tbody>
				{#each formData.linkedFamily.infoLinked as _, linked_i}
					<tr>
						<td>{formData.linkedFamily.infoLinked[linked_i].firstName}</td>
						<td>{formData.linkedFamily.infoLinked[linked_i].lastName}</td>
						{#if  formData.linkedFamily.infoLinked[linked_i].caregiver_id != null }
							<td>{formData.linkedFamily.infoLinked[linked_i].contactNo}</td>
						{:else}
							<td>-</td>
						{/if}
						<td class="w-[410px]"><InputText id="relationship-{linked_i}" bind:value={formData.linkedFamily.infoLinked[linked_i].relationship} {disabled}/></td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
		
		<!-- Remove from family button - only show if member is already in this family -->
		{#if memberName && memberId && formData.hasExisting && formData.linkedFamily.infoLinked.some(member => member.member_id === memberId)}
			<div class="mt-4 text-center">
				<button class="red" onclick={() => removeFromFamily()}>
					<i class="bi bi-person-x"></i>
					Remove {memberName} from this family
				</button>
			</div>
		{/if}
	{/if}



{:else}

	<div class="!my-[35px]">Checking this will allow you to link family members</div>

{/if}

<style>
	i {
			color: inherit;
			margin-right: 4px;
	}
</style>


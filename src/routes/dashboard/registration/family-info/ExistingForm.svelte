<script lang="ts">
	import InputText from '$components/input/InputText.svelte';
	import SearchBtn from '$components/styled-buttons/SearchBtn.svelte';
	import Validation from '$components/text/Validation.svelte';
	import type { FamilyMembers, MemberListFamily } from '$lib/types/registrationForm.js';
	import Checkbox from '$components/input/Checkbox.svelte';

	export let formData: FamilyMembers;
	export let error_msg: string = "";
	export let members: MemberListFamily[];
	let showtable = false;

/**
 * function passed to SearchBtn, shows table if the search is valid. else, error messages are shown
 */
function handleSearch() {
	showtable = false;
	const hasName = Boolean(formData.linkedFamily.firstName.trim()) && Boolean(formData.linkedFamily.lastName.trim());
	const hasContact = Boolean(formData.linkedFamily.contactNo.trim());
	const incompleteFields = !hasName && !hasContact
	error_msg = incompleteFields ? "Fill both Names or Contact No." : ""

	// if fields are complete, proceed to search
	if (!incompleteFields) {
		// 1. find matching member
		const foundMember = members.find(member =>
			(hasName &&
				member.firstName.toLowerCase().includes(formData.linkedFamily.firstName.toLowerCase()) &&
				member.lastName.toLowerCase().includes(formData.linkedFamily.lastName.toLowerCase())) ||
			(hasContact && member.contactNo === formData.linkedFamily.contactNo)
		);

		if (foundMember) {
			// 2. set the family ID
			formData.linkedFamily.family_id = foundMember.family_id;

			// 3. find all members with same family ID
			formData.linkedFamily.infoLinked = members
				.filter(m => m.family_id === foundMember.family_id)
				.map(member => ({
					member_id: member.member_id,
					firstName: member.firstName,
					lastName: member.lastName,
					contactNo: member.contactNo,
					relationship: member.relationship || ''
				}));

			showtable = true;
		}
	}
}

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
								<td><InputText id="relationship-{linked_i}" /></td>
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





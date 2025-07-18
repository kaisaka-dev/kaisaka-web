<script lang="ts">
	import Radio from '$components/input/Radio.svelte';
	import InputText from '$components/input/InputText.svelte';
	import Select from '$components/input/Select.svelte';
	import SearchBtn from '$components/styled-buttons/SearchBtn.svelte';
	import Validation from '$components/text/Validation.svelte';

	export let formData;
	export let errors;
	export let index: number;
	export let deleteCaregiver: (index: number) => void;
	export let linkedIndex: number;

	let caregivertype = formData.type;
	let showtable = false;
	let disabled = false;


	const linkedCaregivers = [
		{
			caregiver_id: '0',
			firstName: 'Gideon',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		},
		{
			caregiver_id: '1',
			firstName: 'Gabrielle',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		},
		{
			caregiver_id: '2',
			firstName: 'Graciella',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		},
		{
			caregiver_id: '3',
			firstName: 'Gian',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		}
	]

	/**
	 * function passed to SearchBtn, shows table if the search is valid. else, error messages are shown
	 */
	function handleSearch() {
		if (formData.type === 'linked') {
			const hasName = formData.firstName.trim() && formData.lastName.trim();
			const hasContact = formData.contactNo.trim();
			const incompleteFields = !hasName && !hasContact
			const found = true;

			errors.msg = incompleteFields ? "Imcomplete fields" : ""

			if (!incompleteFields && found) {
				showtable = hasName || hasContact;
				formData.infoLinked = [...linkedCaregivers];

				// console.log(linkedCaregivers.length)
				// console.log(formData.infoLinked.length)
				// console.log(formData.infoLinked)
			}
			else if (!incompleteFields) {
				showtable = false;
				errors.msg = "Record not found";
			}
		} else {
			showtable = false;
		}
	}
	//
	// /**
	//  * watching for radio button changes, update the parent array's data type into the updated caregiver type
	//  */
	// $: formData.type = caregivertype;

	/**
	 * one member can only join one family, this will disable all the buttons so that they will be unable
	 * to join another family
	 */
	$: disabled = (linkedIndex !== -1 && linkedIndex !== index);

	$:
	if (caregivertype != formData.type) {	// change only if there's a change in the form type selected
		if (caregivertype === 'linked') {
			// change formData into NewCaregiver instead of LinkedCaregiver data type
			formData = {
				type: 'linked',
				firstName: formData.firstName,
				lastName: formData.lastName,
				contactNo: formData.contactNo,
				infoLinked: []
			};
			errors = {
				msg: ''
			};
		} else if (caregivertype === 'new') {
			// change formData into LinkedCaregiver instead of NewCaregiver
			formData = {
				type: 'new',
				firstName: formData.firstName,
				lastName: formData.lastName,
				bday: '',
				sex: '',
				contactNo: formData.contactNo,
				fbLink: '',
				email: '',
				address: '',
				brgy: '',
				occupation: '',
				relationship: '',
				communityYr: new Date().getFullYear()
			};
			errors = {
				firstName: '',
				lastName: '',
				sex: '',
				contactNo: '',
				brgy: '',
				address: ''
			};
		}
	}

</script>

<div class="collapse collapse-arrow" style="box-shadow: 0 4px 0 var(--border); border-radius:0px">
	<input type="checkbox" checked/>
	<h2 class="collapse-title font-semibold">Caregiver {index + 1}</h2>
	<div class="collapse-content text-sm">
		<div style="display: flex; flex-direction: row; margin-bottom: 1.5rem" >
			<Radio label="First time" id={`firsttime-${index}`} value="new" name={`caregiver-type-${index}`} bind:group={caregivertype} />
			<Radio label="Existing family" id={`existing-${index}`} value="linked" name={`caregiver-type-${index}`} bind:group={caregivertype} {disabled} />
		</div>


		{#if caregivertype === "new" }
			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} required msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} required msg={errors.lastName} />
			<InputText label="Birthday" id="bday" bind:value={formData.bday} type="date" />
			<Select label="Sex" id={`sex-${index}`} options={["Male", "Female"]} required bind:value={formData.sex} msg={errors.sex} />
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} required msg={errors.contactNo} />
			<InputText label="Facebook Link" id={`fb-link-${index}`} bind:value={formData.fbLink} />
			<InputText label="Email" id={`email-${index}`} bind:value={formData.email} />
			<InputText label="Address" id={`address-${index}`} bind:value={formData.address} required msg={errors.address} />
			<InputText label="Barangay" id={`brgy-${index}`} required bind:value={formData.brgy} msg={errors.brgy} />
			<InputText label="Occupation" id={`occupation-${index}`} bind:value={formData.occupation} />
			<InputText label="Relationship" id={`relationship-${index}`} bind:value={formData.relationship} />
			<Select label="Community Group" id={`community-grp-${index}`} options={[
								{ label: "Parent organization", value: 1 },
								{ label: "School", value: 2 },
								{ label: "PTA", value: 3 },
								{ label: "Others", value: 4 }
							]} bind:value={formData.communityGrp_id} />
			<Select label="Income Generation" id={`income-${index}`} options={["Home-based", "Self-employed"]} bind:value={formData.income} />
			{#if formData.communityGrp_id !== -1 && formData.communityGrp_id !== null && formData.communityGrp_id !== ""}
				<InputText label="Year Joined (Community Group)" id={`community-grp-yr-${index}`} bind:value={formData.communityYr} required msg={errors.communityYr} />
			{/if}


		{:else if caregivertype === "linked" }
			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} msg={errors.lastName} />
			<div style="width:720px; text-align:center;" class="flex gap-4 items-center ml-6 mb-1">
				<div class="flex-grow border-t border-gray-400"></div>
				<span class="text-sm">or</span>
				<div class="flex-grow border-t border-gray-400"></div>
			</div>
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} msg={errors.contactNo} />

			<div style="display: flex; flex-direction: row; width:740px; margin-top: 2rem">
				<Validation msg="{errors.msg}"style="width: 300px; margin-left: 2rem; font-size: var(--medium-text)"/>

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
							{#if formData.type === 'linked'}
								{#each formData.infoLinked as _, linked_i}
									<tr>
										<td>{formData.infoLinked[linked_i].firstName}</td>
										<td>{formData.infoLinked[linked_i].lastName}</td>
										<td>{formData.infoLinked[linked_i].contactNo}</td>
										<td><InputText id="relationship-{linked_i}" /></td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			{/if}


		{/if}


		<div class="input-container">
		{#if index !== 0}
			<button on:click={() => deleteCaregiver(index)}>Delete</button>
		{/if}</div>



	</div>
</div>
<script lang="ts">
	import Radio from '../../../components/input/Radio.svelte'
	import InputText from '../../../components/input/InputText.svelte';
	import Select from '../../../components/input/Select.svelte';
	import SearchBtn from '../../../components/styled-buttons/SearchBtn.svelte';

	export let formData;
	export let errors;
	export let index: number;
	export let deleteGuardian: (index: number) => void;
	export let updateGuardianType: (index: number, type: 'new' | 'linked') => void;

	let guardiantype = formData.type;
	let showtable = false;

	let linkedGuardians = [
		{
			guardian_id: '',
			firstName: 'Gideon',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		},
		{
			guardianId: '',
			firstName: 'Gabrielle',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		},
		{
			guardianId: '',
			firstName: 'Graciella',
			lastName: 'Chua',
			contactNo: '0912 123 1234',
			relationship: ''
		}
	]

	/**
	 * function passed to SearchBtn
	 */
	function handleSearch() {
		showtable = true;
	}

	/**
	 * watching for radio button changes
	 */
	$: if (guardiantype !== formData.type) {
		updateGuardianType(index, guardiantype);
	}


</script>

<div class="collapse collapse-arrow" style="box-shadow: 0 4px 0 rgb(68,55,50); border-radius:0px">
	<input type="checkbox" checked/>
	<h2 class="collapse-title font-semibold">Guardian {index + 1}</h2>
	<div class="collapse-content text-sm">
		<div style="display: flex; flex-direction: row; margin-bottom: 1.5rem" >
			<Radio label="First time" id={`firsttime-${index}`} value="new" name={`guardian-type-${index}`} bind:group={guardiantype} />
			<Radio label="Existing family" id={`existing-${index}`} value="linked" name={`guardian-type-${index}`} bind:group={guardiantype} />
		</div>


		{#if guardiantype === "new" }
			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} required msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} required msg={errors.lastName} />
			<Select label="Sex" id={`sex-${index}`} options={["Male", "Female"]} required bind:value={formData.sex} msg={errors.sex} />
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} required msg={errors.contactNo} />
			<InputText label="Facebook Link" id={`fb-link-${index}`} bind:value={formData.fbLink} />
			<InputText label="Email" id={`email-${index}`} bind:value={formData.email} />
			<InputText label="Address" id={`address-${index}`} bind:value={formData.address} required msg={errors.address} />
			<Select label="Barangay" id={`brgy-${index}`} options={["Barangay 1", "Barangay 2"]} required bind:value={formData.brgy} msg={errors.brgy} />
			<InputText label="Occupation" id={`occupation-${index}`} bind:value={formData.occupation} />
			<InputText label="Relationship" id={`relationship-${index}`} bind:value={formData.relationship} />

		{:else if guardiantype === "linked" }
			<InputText label="First name" id={`first-name-${index}`} bind:value={formData.firstName} msg={errors.firstName} />
			<InputText label="Last name" id={`last-name-${index}`} bind:value={formData.lastName} msg={errors.lastName} />
			<div style="width:720px; text-align:center;" class="flex gap-4 items-center ml-6 mb-1">
				<div class="flex-grow border-t border-gray-400"></div>
				<span class="text-sm">or</span>
				<div class="flex-grow border-t border-gray-400"></div>
			</div>
			<InputText label="Contact No." id={`contact-no-${index}`} bind:value={formData.contactNo} msg={errors.contactNo} />

			<div style="text-align: right; width:740px; margin-top: 2rem">
				<SearchBtn onSearch={handleSearch} /></div>




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
						{#each linkedGuardians as _, linked_i}
							<tr>
								<td>{linkedGuardians[linked_i].firstName}</td>
								<td>{linkedGuardians[linked_i].lastName}</td>
								<td>{linkedGuardians[linked_i].contactNo}</td>
								<td><InputText id="relationship-{linked_i}" /></td>
							</tr>
						{/each}
						</tbody>
					</table>
				</div>
			{/if}


		{/if}


		<div class="input-container">
		{#if index !== 0}
			<button on:click={() => deleteGuardian(index)}>Delete</button>
		{/if}</div>



	</div>
</div>
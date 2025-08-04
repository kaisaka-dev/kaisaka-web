<script lang="ts">
import Select from '$components/input/Select.svelte';
import InputText from '$components/input/InputText.svelte';
import type { Caregiver} from '../+page.server.js';
import { dropdownOptions } from '$lib/types/options.js';

export let id: string;
export let data: Caregiver;
export let editing = true;
let disabled = !editing;        // for the input component (restricts from editing if true)
let required = editing;        	// false since this is view, but placing it here for easier copy pasting to the EDIT counterpart of this module

</script>
<div id={id} class = "w-240 min-w-240">
	<h2> Information	</h2>
	<div class = "border-[var(--border)] border-4 py-4">
		<InputText {disabled} {required} label="First Name" id="first-name" value={data?.first_name} />
		<InputText  {disabled} {required} label="Middle Name" id="last-name" value={data?.middle_name} />
		<InputText  {disabled} {required} label="Last Name" id="last-name" value={data?.last_name} />
		<InputText  {disabled} label="Birthday" id="birthday" value={data?.birthday} />
		<Select     {disabled} {required} label="Sex" id="sex" value={data?.sex} options={dropdownOptions.sex}/>
		<InputText  {disabled} {required} label="Contact No." id="contact-no" value={data?.contact_no} />
		<InputText  {disabled} label="Facebook Link" id="fb-link" value={data?.fb_link}/>
		<InputText  {disabled} label="Email" id="email" value={data?.email}/>
		<InputText  {disabled} {required} label="Address" id="address" value={data?.address ?? '-'} />
		<InputText  {disabled} {required} label="Barangay" id="barangay" value={data?.barangay ?? '-'} />
		<InputText  {disabled} label="Occupation" id="occupation" value={data?.occupation ?? '-'} />

		<br>
		<InputText {disabled} label="Date of Admission" type="date" id="admission" value={data.date_admission} />
		{#if data.date_termination || editing}
			<InputText {disabled} label="Date of Termination" type="date" id="termination"
								 value={data.date_termination ? new Date(data.date_termination).toISOString().split('T')[0] : ''} />
		{/if}
	</div>
</div>
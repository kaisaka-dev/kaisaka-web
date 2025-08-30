<script lang="ts">
import Select from '$components/input/Select.svelte';
import InputText from '$components/input/InputText.svelte';
import type { Caregiver} from '../+page.server.js';

export let id: string;
export let data: Caregiver;
export let editing = true;

// Error messages for validation
export let errors = {
    first_name: "",
    last_name: "",
    birthday: "",
    sex: "",
    contact_no: "",
    address: "",
    barangay: "",
    date_admission: "",
    date_termination: ""
};

let disabled = !editing;
let required = editing;
let age = "";

// Age calculation reactive statement
$: if (data.birthday) {
    const birthDate = new Date(data.birthday);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
        calculatedAge -= 1;
    }

    age = calculatedAge.toString();
} else {
    age = "";
}

console.log(data)

</script>
<div id={id} class = "w-240 min-w-240">
	<h2> Information	</h2>
	<div class = "border-[var(--border)] border-3 py-4 p-4">
		<InputText {disabled} {required} msg={errors.first_name} label="First Name" id="first-name" bind:value={data.first_name} />
		<InputText {disabled} label="Middle Name" id="middle-name" bind:value={data.middle_name} />
		<InputText {disabled} {required} msg={errors.last_name} label="Last Name" id="last-name" bind:value={data.last_name} />
		<InputText {disabled} msg={errors.birthday} type="date" label="Birthday" id="birthday" bind:value={data.birthday} />
		<InputText  disabled  label="Age" id="age" bind:value={age} />
		<Select 	 {disabled} {required} msg={errors.sex} label="Sex" id="sex" bind:value={data.sex} options={['Male', 'Female', 'Other']}/>
		<InputText {disabled} {required} msg={errors.contact_no} label="Contact No." id="contact-no" bind:value={data.contact_no} />
		<InputText {disabled} label="Facebook Link" id="fb-link" bind:value={data.fb_link}/>
		<InputText {disabled} label="Email" id="email" bind:value={data.email}/>
		<InputText {disabled} {required} msg={errors.address} label="Address" id="address" bind:value={data.address} />
		<InputText {disabled} {required} msg={errors.barangay} label="Barangay" id="barangay" bind:value={data.barangay} />
		<InputText {disabled} label="Occupation" id="occupation" bind:value={data.occupation} />

		<br>
		<InputText {disabled} {required} msg={errors.date_admission} label="Date of Admission" type="date" id="admission" bind:value={data.date_admission} />
		{#if data.date_termination || editing}
			<InputText {disabled} msg={errors.date_termination} label="Date of Termination" type="date" id="termination" bind:value={data.date_termination} />
		{/if}
	</div>
</div>